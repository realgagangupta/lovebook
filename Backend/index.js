const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const User = require('./models/User');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',  // Allow the frontend URL to be configurable
    credentials: true,  // Allow cookies to be sent with cross-origin requests
};
app.use(cors(corsOptions));

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('Hello, Node.js!');
});

// Signup Route
app.post('/signup', async (req, res) => {
    const { name, email, password, loverName } = req.body;

    try {
        if (!name || !email || !password || !loverName) {
            return res.status(400).json({ error: 'All fields are required!' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, loverName });
        await user.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error registering user: ' + err.message });
    }
});

// Login Route (with JWT in Cookies)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required!' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found!' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );

            const isProduction = process.env.NODE_ENV === 'production';

            res.cookie('token', token, {
                httpOnly: true,
                secure: isProduction,  // Will be true only if in production environment with HTTPS
                maxAge: 3600000,  // Token expiration time (1 hour)
                sameSite: 'Lax',
            });

            res.status(200).json({ message: 'Login successful!' });
        } else {
            return res.status(400).json({ error: 'Incorrect password!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error logging in user: ' + err.message });
    }
});

// Middleware to authenticate JWT token from cookies
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
        return res.status(403).json({ error: 'Access Denied: Token missing in cookies' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid Token' });
        }
        req.userId = decoded.userId; // Attach userId from decoded token
        next();
    });
};

// Protected Route
app.get('/protected', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        res.json({
            message: `Hello, ${user.loverName}!`,
            lovelyMessage: `I love you, ${user.loverName}! 💖`,
            Yours: user.name
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching user from database: ' + err.message });
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

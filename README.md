# LoveBook - MERN Stack Application

LoveBook is a simple web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to:

- Sign up by entering their name, email, password, and lover's name.
- Log in with their credentials.
- Access a protected route to see their lover's name.

## Features

- **User Authentication**: Secure signup and login using JWT stored in HTTP-only cookies.
- **Protected Route**: Access "See Lover Name" only after login.
- **MongoDB Atlas**: Cloud database for user data storage.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/realgagangupta/lovebook.git
   cd lovebook
   ```
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file with:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET_KEY=your_jwt_secret
   NODE_ENV=development or production
   FRONTEND_URL=http://localhost:3000
   PORT=4000
   ```
   Start the backend:
   ```bash
   npm start
   ```
3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

## API Endpoints

- **Signup**: `POST /api/auth/signup`
- **Login**: `POST /api/auth/login`
- **See Lover Name**: `GET /api/auth/lover` (Protected)

## Future Enhancements

- Add logout functionality.
- Improve styling with a CSS framework.
- Add password reset.

## Contact
- **GitHub**: [realgagangupta](https://github.com/realgagangupta)

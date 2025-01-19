import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

const Login = ({ setIsAuthenticated }) => {  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");  // Stores error or success message
  const [token, setToken] = useState("");      // Stores the JWT token if login is successful

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make the login request to the backend
      const response = await axios.post("http://localhost:4000/login", formData, {
        withCredentials: true,  // Ensure cookies are sent with the request
      });

      // On success, display the success message and store the JWT token
      setMessage(response.data.message || 'Login successful!');
      setToken(response.data.token);

      // Store the JWT token in a cookie
      Cookies.set("token", response.data.token, { expires: 1, secure: false, sameSite: "Strict" });

      // After successful login, update isAuthenticated state in parent (App.js)
      setIsAuthenticated(true);  // Mark the user as authenticated

    } catch (error) {
      // Handle the error, extracting just the error message from the response
      const errorMessage = error.response?.data?.error || "Error logging in.";
      setMessage(errorMessage);  // Display the error message
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* Display success or error message */}
      {message && <p>{message}</p>}

      {/* Optionally display the token (for debugging, can be removed later) */}
      {token && <p>Token: {token}</p>}
    </div>
  );
};

export default Login;

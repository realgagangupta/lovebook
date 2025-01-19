import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    loverName: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation: Check if all fields are filled
    if (!formData.name || !formData.email || !formData.password || !formData.loverName) {
      setMessage("All fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/signup", formData, {
        withCredentials: true,  // Ensure cookies are sent with the request
      });

      // Assuming response.data is an object like { message: 'User registered successfully!' }
      setMessage(response.data.message || 'Signup successful!');
    } catch (error) {
      // Check if the error response has a message and set it
      setMessage(error.response?.data?.error || "Error signing up.");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          name="loverName"
          placeholder="Lover's Name"
          value={formData.loverName}
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
      </form>

      {/* Render the message */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;

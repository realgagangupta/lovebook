import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

const Protected = () => {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/protected", {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        setData(response.data); // Set the response data in the state
      } catch (error) {
        setMessage(error.response?.data || "Error accessing protected route.");
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Protected Page</h2>
      {message && <p>{message}</p>}
      {data && (
        <div>
          <p>{data.message}</p> {/* Displays Hello + loverName */}
          <p>{data.lovelyMessage}</p> {/* Displays I love you + loverName */}
          <p>{data.Yours}</p> {/* Displays user's name */}
        </div>
      )}
    </div>
  );
};

export default Protected;

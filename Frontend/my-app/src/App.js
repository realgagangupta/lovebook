import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Protected from "./components/Protected";
import Cookies from "js-cookie"; // To check if user is logged in
import { useNavigate } from "react-router-dom"; // This will be used inside functional component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = Cookies.get("token"); // Check if token is stored in cookies

  useEffect(() => {
    // Check if the token exists on mount to set authentication state
    if (token) {
      setIsAuthenticated(true);
    }
  }, [token]);

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
            {isAuthenticated && <li><Link to="/protected">Protected</Link></li>}
            {isAuthenticated && <LogoutButton setIsAuthenticated={setIsAuthenticated} />} {/* Pass setIsAuthenticated */}
          </ul>
        </nav>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} /> {/* Pass down setIsAuthenticated */}
          <Route path="/protected" element={isAuthenticated ? <Protected /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
}

// Logout Button Component
const LogoutButton = ({ setIsAuthenticated }) => {  // Receive setIsAuthenticated as prop
  const navigate = useNavigate(); // Correctly using useNavigate inside a component inside Router
  const handleLogout = () => {
    // Remove token from cookies and update state
    Cookies.remove("token");
    setIsAuthenticated(false);  // Now we can use setIsAuthenticated here
    navigate("/login"); // Redirect to login after logout
  };

  return <li><button onClick={handleLogout}>Logout</button></li>;
};

export default App;

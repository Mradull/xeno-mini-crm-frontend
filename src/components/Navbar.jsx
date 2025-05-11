import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      const res = await fetch("https://xeno-mini-crm-backend-ml6e.onrender.com/api/auth/logout", {
        method: "GET",
        credentials: "include", // important!
      });

      if (res.ok) {
        navigate("/"); // ✅ Redirect to login page here
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };


  return (
    <nav className="navbar">
      <div className="navbar-left">Xeno CRM</div>
      <div className="navbar-right">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/campaigns/new">New Campaign</Link>
        <Link to="/campaigns/history">History</Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

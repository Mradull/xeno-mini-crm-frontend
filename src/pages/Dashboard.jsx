import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [campaigns, setCampaigns] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  // Check if the query parameter 'loginSuccess' is present in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const loginSuccess = params.get('loginSuccess');

    if (loginSuccess === 'true') {
      // Show an alert when the login is successful
      alert("Login successful!");
    }
    
    // Get current date in a nice format
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
    
    // Load existing campaigns if any
    const storedCampaigns = localStorage.getItem("campaigns");
    if (storedCampaigns) {
      setCampaigns(JSON.parse(storedCampaigns));
    }
  }, [location]);

  const handleSendCampaign = () => {
    const newCampaign = {
      id: campaigns.length + 1,  // or any other unique identifier
      name: "New Campaign",
      date: new Date().toLocaleDateString(),
      status: "Sent",
    };
    setCampaigns((prevCampaigns) => {
      const updatedCampaigns = [...prevCampaigns, newCampaign];
      localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns));  // Persist to localStorage
      return updatedCampaigns;
    });

    navigate("/campaigns/history");
  };

  // Calculate stats
  const sentCampaigns = campaigns.filter(campaign => campaign.status === "Sent").length;
  const draftCampaigns = campaigns.filter(campaign => campaign.status === "Draft").length;
  
  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        {/* Sidebar */}
        <div className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="#" className="active"><i>📊</i> Dashboard</a></li>
            <li><a href="#"><i>📧</i> Campaigns</a></li>
            <li><a href="#"><i>👥</i> Contacts</a></li>
            <li><a href="#"><i>📈</i> Analytics</a></li>
            <li><a href="#"><i>⚙️</i> Settings</a></li>
          </ul>
        </div>
        
        {/* Main content */}
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2>Welcome to Xeno Mini CRM</h2>
            <div className="date-display">{currentDate}</div>
          </div>
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-label">Total Campaigns</div>
              <div className="stat-number">{campaigns.length}</div>
              <div className="stat-trend trend-up">↑ 12% from last month</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-label">Sent Campaigns</div>
              <div className="stat-number">{sentCampaigns}</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-label">Draft Campaigns</div>
              <div className="stat-number">{draftCampaigns}</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-label">Open Rate</div>
              <div className="stat-number">42%</div>
              <div className="stat-trend trend-up">↑ 5% from last month</div>
            </div>
          </div>
          
          <div className="dashboard-links">
            <Link to="/campaigns/new" className="card new-campaign" onClick={handleSendCampaign}>
              <div className="card-content">
                <div className="card-title">
                  <div className="card-icon">➕</div>
                  <span>Create New Campaign</span>
                </div>
                <div className="card-desc">
                  Create and send a new email campaign to your contacts
                </div>
              </div>
            </Link>
            
            <Link to="/campaigns/history" className="card view-history">
              <div className="card-content">
                <div className="card-title">
                  <div className="card-icon">📜</div>
                  <span>View Campaign History</span>
                </div>
                <div className="card-desc">
                  Check the performance of your previous campaigns
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
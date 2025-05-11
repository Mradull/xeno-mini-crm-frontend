import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./CampaignHistory.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";


export default function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch campaigns
  useEffect(() => {
    setLoading(true);
    axios.get("https://xeno-mini-crm-backend-ml6e.onrender.com/api/campaigns")
      .then((res) => {
        setCampaigns(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching campaigns:", error);
        setLoading(false);
        // Fallback to localStorage if API fails
        const storedCampaigns = localStorage.getItem("campaigns");
        if (storedCampaigns) {
          setCampaigns(JSON.parse(storedCampaigns));
        }
      });
  }, []);

  // Filter and search campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesFilter = filter === "all" || campaign.status.toLowerCase() === filter;
    const matchesSearch = searchTerm === "" || 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCampaigns = filteredCampaigns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

  // Navigate between pages
  const goToPage = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  // Handle campaign delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      const updatedCampaigns = campaigns.filter(campaign => campaign.id !== id);
      setCampaigns(updatedCampaigns);
      localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns));
    }
  };

  return (
    <>
      <Navbar />
      <div className="campaign-wrapper">
        {/* Sidebar */}
        <div className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard"><i>📊</i> Dashboard</a></li>
            <li>
                <NavLink 
                    to="/campaigns/history" 
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    <i>📧</i> Campaigns
                </NavLink>
            </li>

            <li><a href="#"><i>👥</i> Contacts</a></li>
            <li><a href="#"><i>📈</i> Analytics</a></li>
            <li><a href="#"><i>⚙️</i> Settings</a></li>
          </ul>
        </div>
        
        <div className="campaign-history-container">
          <div className="campaign-header">
            <h2>Campaign History</h2>
            <div className="campaign-actions">
              <Link to="/campaigns/new" className="action-button primary">
                <i>➕</i> Create Campaign
              </Link>
              <button className="action-button">
                <i>⬇️</i> Export
              </button>
            </div>
          </div>
          
          <div className="campaign-filters">
            <div className="filter-group">
              <span className="filter-label">Filter by:</span>
              <select 
                className="filter-select" 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Campaigns</option>
                <option value="sent">Sent</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search campaigns..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div className="loading-state">Loading campaigns...</div>
          ) : currentCampaigns.length > 0 ? (
            <>
              <table className="campaign-table">
                <thead className="campaign-table-header">
                  <tr>
                    <th>Campaign Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Open Rate</th>
                    <th>Click Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCampaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="campaign-name">{campaign.name}</td>
                      <td className="campaign-date">{campaign.date}</td>
                      <td>
                        <span className={`status-pill status-${campaign.status.toLowerCase()}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td>{campaign.openRate || "N/A"}</td>
                      <td>{campaign.clickRate || "N/A"}</td>
                      <td className="campaign-actions-cell">
                        <button className="campaign-action" title="View Details">
                          👁️
                        </button>
                        <button className="campaign-action" title="Duplicate">
                          📋
                        </button>
                        <button 
                          className="campaign-action" 
                          title="Delete"
                          onClick={() => handleDelete(campaign.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {totalPages > 1 && (
                <div className="campaign-pagination">
                  <span>
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCampaigns.length)} of {filteredCampaigns.length} campaigns
                  </span>
                  <div className="page-buttons">
                    <button 
                      className={`page-button ${currentPage === 1 ? 'disabled' : ''}`}
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ←
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i + 1}
                        className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => goToPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button 
                      className={`page-button ${currentPage === totalPages ? 'disabled' : ''}`}
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📨</div>
              <p className="empty-text">
                No campaigns found. Create your first campaign to get started!
              </p>
              <Link to="/campaigns/new" className="create-campaign-btn">
                Create Campaign
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
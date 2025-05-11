import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/LoginPage";
import NewCampaign from "./pages/NewCampaign";
import CampaignHistory from "./pages/CampaignHistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/campaigns/new" element={<NewCampaign />} />
        <Route path="/campaigns/history" element={<CampaignHistory />} />
        
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState } from "react";
import "./NewCampaign.css";

export default function NewCampaign() {
  const [rules, setRules] = useState([
    { field: "spend", operator: ">", value: "", logic: "AND" },
  ]);
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");
const [isGenerating, setIsGenerating] = useState(false);



  const handleAddRule = () => {
    setRules([...rules, { field: "", operator: "", value: "", logic: "AND" }]);
  };

  const handleChange = (index, key, value) => {
    const newRules = [...rules];
    newRules[index][key] = value;
    setRules(newRules);
  };

  const handleRemoveRule = (index) => {
    if (rules.length > 1) {
      const newRules = [...rules];
      newRules.splice(index, 1);
      setRules(newRules);
    }
  };

  const handleGenerateMessage = async () => {
  setIsGenerating(true);
  try {
    const res = await fetch("https://xeno-mini-crm-backend-ml6e.onrender.com/api/ai/message-suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal: "create a promotional message using {name}" }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Request failed: ${res.status}\n${text}`);
    }

    const data = await res.json();
    setMessage(data.suggestions[0]);
    alert("AI suggestion applied!");
  } catch (error) {
    console.error("AI suggestion failed:", error);
    alert("Failed to get AI message.");
  } finally {
    setIsGenerating(false);
  }
};




  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://xeno-mini-crm-backend-ml6e.onrender.com/api/campaigns/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules }),
      });

      if (!response.ok) {
  const text = await response.text();
  throw new Error(`Preview failed: ${response.status}\n${text}`);
}

      const data = await response.json();
      setPreviewData(data);
    } catch (error) {
      console.error("Error fetching preview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCampaign = async () => {

    if (!name || !message) {
      alert("Campaign name and message are required.");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("https://xeno-mini-crm-backend-ml6e.onrender.com/api/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, rules }),
      });

      if (!response.ok) {
  throw new Error(`Status ${response.status}`);
}
const data = await response.json(); // Safe to call after checking


      alert(`Campaign sent to ${data.count} users.`);
    } catch (error) {
      console.error("Error sending campaign:", error);
      alert("Something went wrong while sending the campaign.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="campaign-page">
      <div className="campaign-container">
        <div className="campaign-header">
          <div className="header-content">
            <h2>Create New Campaign</h2>
            <p>Define your audience with rules and logic</p>
          </div>
          <div className="filter-icon">🔍</div>
        </div>

        <div className="rules-container">
          {rules.map((rule, index) => (
            <div key={index}>
              {index > 0 && (
                <div className="logic-operator">
                  <select
                    className="logic-select"
                    value={rule.logic}
                    onChange={(e) =>
                      handleChange(index, "logic", e.target.value)
                    }
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </div>
              )}

              <div className="rule-item">
                <div className="rule-number">{index + 1}</div>
                <div className="rule-controls">
                  <select
                    className="field-select"
                    value={rule.field}
                    onChange={(e) =>
                      handleChange(index, "field", e.target.value)
                    }
                  >
                    <option value="">Select Field</option>
                    <option value="spend">Spend</option>
                    <option value="clicks">Clicks</option>
                    <option value="conversions">Conversions</option>
                    <option value="impressions">Impressions</option>
                  </select>

                  <select
                    className="operator-select"
                    value={rule.operator}
                    onChange={(e) =>
                      handleChange(index, "operator", e.target.value)
                    }
                  >
                    <option value="">Operator</option>
                    <option value=">">&gt; Greater than</option>
                    <option value="<">&lt; Less than</option>
                    <option value="=">= Equal to</option>
                    <option value=">=">≥ Greater or equal</option>
                    <option value="<=">≤ Less or equal</option>
                  </select>

                  <input
                    className="value-input"
                    placeholder="Value"
                    value={rule.value}
                    onChange={(e) =>
                      handleChange(index, "value", e.target.value)
                    }
                  />
                </div>
                <button
                  onClick={() => handleRemoveRule(index)}
                  className="remove-rule-btn"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="input-group">
  <label htmlFor="campaignName">Campaign Name</label>
  <input
    id="campaignName"
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Enter Campaign Name"
    className="value-input full-width"
  />
</div>


<div className="input-group">
  <label htmlFor="campaignMessage">Message (use {`{name}`} to personalize)</label>
  <textarea
    id="campaignMessage"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Hi {name}, enjoy 20% off this week only!"
    rows={3}
    className="value-input full-width"
  />
</div>

<button
  className="add-rule-btn"
  onClick={handleGenerateMessage}
  disabled={isGenerating}
>
  {isGenerating ? "Generating..." : "Suggest with AI 💡"}
</button>



        <div className="action-buttons">
          <button onClick={handleAddRule} className="add-rule-btn">
            <span className="plus-icon">+</span>
            <span>Add Rule</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="preview-btn"
          >
            {isLoading ? "Loading..." : <>Preview Audience <span className="arrow-icon">→</span></>}
          </button>

          <button
            onClick={handleSendCampaign}
            disabled={isSending || !name || !message}
            className="preview-btn"
          >
            {isSending ? "Sending..." : "Send Campaign 🚀"}
          </button>
        </div>
        {previewData && (
  <div className="preview-container">
    <h3>Audience Preview</h3>
    <div className="preview-data">
      <p className="audience-size">{previewData.audienceSize || 0}</p>
      <p className="audience-label">Estimated reach</p>
    </div>

    <div className="user-list">
      <h4>Users</h4>
      {previewData.users && previewData.users.length > 0 ? (
        <ul>
          {previewData.users.map((user) => (
            <li key={user._id}>
              <p>{user.name}</p>
              <p>{user.email}</p>
              {/* Add other user details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found based on the given rules.</p>
      )}
    </div>
  </div>
)}

      </div>

      {previewData && (
        <div className="preview-container">
          <h3>Audience Preview</h3>
          <div className="preview-data">
            <p className="audience-size">{previewData.audienceSize || 0}</p>
            <p className="audience-label">Estimated reach</p>
          </div>
        </div>
      )}
    </div>
  );
}

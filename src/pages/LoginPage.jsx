import React from "react";
import "./LoginPage.css";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "https://xeno-mini-crm-backend-ml6e.onrender.com/api/auth/google";
  };

  return (
    <div className="login-page">
      {/* Left sidebar with branding and features */}
      <div className="login-sidebar">
        <div className="branding">
          <div className="logo">Xeno Mini CRM</div>
          <div className="tagline">A powerful, yet simple customer relationship management solution</div>
        </div>
        
        <div className="feature-list">
          <h3>Everything you need to succeed</h3>
          
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <div className="feature-text">Smart customer segmentation for targeted marketing</div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <div className="feature-text">Automated campaign workflows to save you time</div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <div className="feature-text">Detailed analytics to track performance metrics</div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <div className="feature-text">Seamless integration with your favorite tools</div>
          </div>
        </div>
      </div>
      
      {/* Right side login container */}
      <div className="login-container">
        <div className="login-card">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to access your campaigns and customer data</p>
          
          <button className="google-login-btn" onClick={handleGoogleLogin}>
            <img
              className="google-logo"
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
              alt="Google"
            />
            Continue with Google
          </button>
          
          <div className="alternative-login">
            <p>Don't have an account?</p>
            <div className="alternative-actions">
              <a href="#" className="alt-action">Create account</a>
              <a href="#" className="alt-action">Learn more</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
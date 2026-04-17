import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UtensilsCrossed, ChevronDown, Hand, CookingPot, ArrowRight, HandHeart, X, LogOut, LayoutDashboard } from "lucide-react";

export const Home = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("profile_token");
    if (!token) {
      navigate("/login");
      return;
    }
    setUserName(localStorage.getItem("user_name") || "User");
    setUserEmail(localStorage.getItem("user_email") || "");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("profile_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    navigate("/login");
  };

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="home-nav">
        <Link to="/home" className="home-brand">
          <div className="brand-icon" style={{ width: 36, height: 36, fontSize: "1.1rem", borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UtensilsCrossed size={20} />
          </div>
          <span>Food Share</span>
        </Link>
        <div className="nav-right">
          <div className="user-pill" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="user-avatar">{initials}</div>
            {userName}
            <ChevronDown size={14} style={{ opacity: 0.6, marginLeft: 4 }} />
          </div>
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div 
                style={{ position: 'fixed', inset: 0, zIndex: 199 }} 
                onClick={() => setDropdownOpen(false)} 
              />
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-name">{userName}</div>
                  <div className="dropdown-email">{userEmail}</div>
                </div>
                <div className="dropdown-links">
                  <Link to="/dashboard" className="dropdown-item">
                    <LayoutDashboard size={16} /> My Dashboard
                  </Link>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Main */}
      <main className="home-main">
        <div className="home-greeting">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{greeting}, {userName} <Hand size={24} style={{ color: '#eab308' }} /></h2>
          <p>What would you like to do today?</p>
        </div>

        {/* Two Action Cards */}
        <div className="home-options">
          {/* Seek Food */}
          <Link to="/seeker" className="option-card seek">
            <div className="option-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CookingPot size={28} /></div>
            <div className="option-title">Seek Food</div>
            <p className="option-desc">
              Browse available food donations near you. Find meals posted
              by generous donors in your community and place an order.
            </p>
            <div className="option-arrow">Browse available food <ArrowRight size={16} className="inline-icon" /></div>
          </Link>

          {/* Donate Food */}
          <Link to="/donor" className="option-card donate">
            <div className="option-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HandHeart size={28} /></div>
            <div className="option-title">Donate Food</div>
            <p className="option-desc">
              Share your surplus food with those in need. Post what you
              have, set an availability window, and confirm orders from seekers.
            </p>
            <div className="option-arrow">Share your food <ArrowRight size={16} className="inline-icon" /></div>
          </Link>
        </div>
      </main>

      {/* Remove old profile drawer */}
    </div>
  );
};

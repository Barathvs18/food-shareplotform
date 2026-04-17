import React from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Sprout, ArrowRight } from "lucide-react";

export const Index = () => {
  return (
    <div className="index-page">
      {/* Header */}
      <header className="index-header">
        <div className="index-brand">
          <div className="brand-icon"><UtensilsCrossed size={24} /></div>
          <span className="brand-name">Food Share</span>
        </div>
        <nav className="index-nav">
          <Link to="/login" className="nav-link">Log in</Link>
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="index-hero">
        <div className="hero-tag">
          <span></span>
          Community Food Sharing Platform
        </div>
        <h1 className="hero-title">
          Share surplus,<br />
          <em>spread smiles</em>
        </h1>
        <p className="hero-desc">
          Connect food donors with people in need. Reduce waste,
          build community, and make every meal count — all in one place.
        </p>
        <div className="hero-cta">
          <Link to="/signup" className="btn btn-primary" style={{ padding: "14px 36px", fontSize: "1rem" }}>
            <Sprout size={18} style={{ marginRight: 6 }} /> Join for Free
          </Link>
          <Link to="/login" className="btn btn-ghost" style={{ padding: "14px 28px", fontSize: "1rem" }}>
            Log in <ArrowRight size={18} style={{ marginLeft: 6 }} />
          </Link>
        </div>
      </main>

      {/* Stats */}
      <div className="index-stats">
        <div className="stat-item">
          <div className="stat-value">500+</div>
          <div className="stat-label">Meals Shared</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">120+</div>
          <div className="stat-label">Donors</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">80+</div>
          <div className="stat-label">Communities</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">0%</div>
          <div className="stat-label">Cost to Join</div>
        </div>
      </div>
    </div>
  );
};

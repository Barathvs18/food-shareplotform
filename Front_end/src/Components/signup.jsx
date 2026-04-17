import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UtensilsCrossed, AlertTriangle, Check, ArrowRight } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/user/register`, {
        name, email, password,
      });
      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><UtensilsCrossed size={32} /></div>
          <h1>Food Share</h1>
          <p>Community food sharing platform</p>
        </div>

        <h2 className="auth-heading">Create Account</h2>
        <p className="auth-sub">Join thousands sharing food in their community</p>

        {error && <div className="auth-error"><AlertTriangle size={18} style={{ marginRight: 6, verticalAlign: "middle" }} /> {error}</div>}
        {success && <div className="auth-success"><Check size={18} style={{ marginRight: 6, verticalAlign: "middle" }} /> {success}. Redirecting…</div>}

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              required
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="auth-btn" type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading ? "Creating account…" : <><span style={{ marginRight: 6 }}>Create Account</span> <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UtensilsCrossed, AlertTriangle, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/user/login", {
        email, password,
      });
      localStorage.setItem("profile_token", res.data.token);
      localStorage.setItem("user_name", res.data.user?.name || "");
      localStorage.setItem("user_email", res.data.user?.email || "");
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
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
          <p>Welcome back to the community</p>
        </div>

        <h2 className="auth-heading">Log In</h2>
        <p className="auth-sub">Sign in to your account to continue</p>

        {error && <div className="auth-error"><AlertTriangle size={18} style={{ marginRight: 6, verticalAlign: "middle" }} /> {error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
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
              placeholder="Your password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="auth-btn" type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading ? "Logging in…" : <><span style={{ marginRight: 6 }}>Log In</span> <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

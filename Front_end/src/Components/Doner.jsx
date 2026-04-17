import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  HandHeart, ArrowLeft, Camera, Salad, Drumstick, Sprout, 
  Utensils, AlertTriangle, Check, Inbox, Soup, Mail, MapPin, RefreshCw 
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export const Donor = () => {
  // Form state
  const [food_type, setFoodType] = useState("");
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [available_time, setAvailableTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });

  // Pending orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  const [toast, setToast] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("profile_token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchOrders();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axios.get(`${API}/api/food/pending-orders`, {
        headers: { token },
      });
      setOrders(res.data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };



  // Submit donation form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: "", text: "" });
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("food_type", food_type);
      formData.append("amount", amount);
      formData.append("location", location);
      formData.append("contact", contact);
      formData.append("available_time", available_time);

      await axios.post(`${API}/api/food/donate`, formData, {
        headers: { token, "Content-Type": "multipart/form-data" },
      });

      setFormMsg({ type: "success", text: "Food donation posted successfully!" });
      setFoodType(""); setAmount(""); setLocation("");
      setContact(""); setAvailableTime("");
    } catch (err) {
      setFormMsg({ type: "error", text: err.response?.data?.message || "Failed to post donation." });
    } finally {
      setSubmitting(false);
    }
  };

  // Donor confirms an order
  const handleConfirm = async (orderId) => {
    setConfirmingId(orderId);
    try {
      await axios.put(`${API}/api/food/confirm/${orderId}`, {}, {
        headers: { token },
      });
      showToast("✓ Order confirmed! The seeker has been notified.");
      fetchOrders();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to confirm order.");
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="donor-page">
      {/* Header */}
      <header className="donor-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><HandHeart size={24} /> Donate Food</h2>
        <button className="btn btn-ghost" style={{ fontSize: "0.85rem", padding: "8px 16px", display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={() => navigate("/home")}>
          <ArrowLeft size={16} /> Back
        </button>
      </header>

      <div className="donor-layout">
        {/* ── Left: Donation Form ── */}
        <div className="donate-form-section">
          <div>
            <div className="section-title">Share Your Food</div>
            <div className="section-desc">Fill in the details about the food you'd like to donate</div>
          </div>

          <form className="donate-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Food Type</label>
                <select value={food_type} onChange={(e) => setFoodType(e.target.value)} required>
                  <option value="">Select type…</option>
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="text"
                  placeholder="e.g. 10 plates"
                  value={amount}
                  required
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location / Address</label>
              <input
                type="text"
                placeholder="Where can seekers pick it up?"
                value={location}
                required
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  placeholder="Your phone number"
                  value={contact}
                  required
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Available Until</label>
                <input
                  type="datetime-local"
                  value={available_time}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => setAvailableTime(e.target.value)}
                />
              </div>
            </div>

            {formMsg.text && (
              <div className={formMsg.type === "success" ? "auth-success" : "auth-error"} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {formMsg.type === "success" ? <Check size={18} /> : <AlertTriangle size={18} />} {formMsg.text}
              </div>
            )}

            <button type="submit" className="donate-submit-btn" disabled={submitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {submitting ? "Posting…" : <><HandHeart size={20} /> Post Donation</>}
            </button>
          </form>
        </div>

        {/* ── Right: Pending Orders ── */}
        <div className="pending-orders-section">
          <div>
            <div className="section-title">Pending Orders</div>
            <div className="section-desc">
              Seekers who've requested your food — confirm to hand it over
            </div>
          </div>

          {loadingOrders ? (
            <div className="spinner" />
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <div className="no-orders-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Inbox size={32} /></div>
              <p>No pending orders right now.<br />Post a donation to start receiving requests.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div className="order-card" key={order._id}>
                  <div className="order-card-top">
                    <div>
                      <div className="order-food-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Soup size={18} /> {order.foodId?.food_type || "Food"}
                      </div>
                      <div className="order-seeker-info">
                        <strong>{order.seekerName || order.seekerId?.name}</strong>
                        {" "}wants this food
                      </div>
                      <div className="order-seeker-info" style={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={14} style={{ opacity: 0.7 }} /> {order.seekerEmail || order.seekerId?.email}
                      </div>
                      {order.foodId?.location && (
                        <div className="order-seeker-info" style={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} style={{ opacity: 0.7 }} /> {order.foodId.location} · {order.foodId.amount}
                        </div>
                      )}
                    </div>
                    <button
                      className="order-confirm-btn"
                      onClick={() => handleConfirm(order._id)}
                      disabled={confirmingId === order._id}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {confirmingId === order._id ? "…" : <><Check size={16} /> Confirm</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            className="btn btn-ghost"
            onClick={fetchOrders}
            style={{ fontSize: "0.82rem", alignSelf: "flex-start", display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RefreshCw size={14} /> Refresh orders
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: "#0d160d", border: "1px solid var(--border-green)", color: "var(--primary-light)",
          padding: "12px 24px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 9999, whiteSpace: "nowrap",
        }}>
          {toast}
        </div>
      )}
    </div>
  );
};

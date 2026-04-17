import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  CookingPot, ArrowLeft, RefreshCw, UtensilsCrossed, Soup, Salad, 
  Drumstick, Package, MapPin, User, Clock, Phone, Check 
} from "lucide-react";

// ── Time remaining helper ─────────────────────────────────────────────────
const getTimeLabel = (available_time) => {
  const diff = new Date(available_time) - new Date();
  if (diff <= 0) return { label: "Expired", expiring: true, expired: true };
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hrs > 24) return { label: `${Math.floor(hrs / 24)}d ${hrs % 24}h left`, expiring: false, expired: false };
  if (hrs > 1) return { label: `${hrs}h ${mins}m left`, expiring: false, expired: false };
  return { label: `${hrs}h ${mins}m left`, expiring: true, expired: false };
};

export const Seeker = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderModal, setOrderModal] = useState(null); // { food, contact }
  const [confirmModal, setConfirmModal] = useState(null); // food being confirmed
  const [ordering, setOrdering] = useState(false);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("profile_token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/food/seek", {
        headers: { token },
      });
      setFoods(res.data.food_info || []);
    } catch {
      showToast("Failed to load food listings.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  // Step 1: user clicks Order → show contact number + confirm button
  const handleOrder = (food) => {
    setOrderModal(food);
  };

  // Step 2: user clicks Confirm → place actual order
  const handleConfirmOrder = async () => {
    if (!orderModal) return;
    setOrdering(true);
    try {
      await axios.post(
        "http://localhost:3000/api/food/order",
        { foodId: orderModal._id },
        { headers: { token } }
      );
      showToast("✓ Order placed! The donor has been notified.");
      setOrderModal(null);
      fetchFoods(); // refresh
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to place order.");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="seeker-page">
      {/* Header */}
      <header className="seeker-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CookingPot size={24} /> Available Food</h2>
        <button className="btn btn-ghost" style={{ fontSize: "0.85rem", padding: "8px 16px", display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={() => navigate("/home")}>
          <ArrowLeft size={16} /> Back
        </button>
      </header>

      <main className="seeker-main">
        <div className="seeker-title-row">
          <div>
            <div className="seeker-title">Browse Food Donations</div>
            <div className="seeker-count">{foods.length} listings available</div>
          </div>
          <button className="btn btn-ghost" onClick={fetchFoods} style={{ fontSize: "0.85rem", display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : foods.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UtensilsCrossed size={48} /></div>
            <h3>No food available right now</h3>
            <p>Check back later — donors post new listings throughout the day.</p>
          </div>
        ) : (
          <div className="food-grid">
            {foods.map((food) => {
              const timeInfo = getTimeLabel(food.available_time);
              return (
                <div className="food-card" key={food._id}>
                  {/* Icon Placeholder */}
                  <div className="food-img-wrap">
                    <div className="food-no-img"><Soup size={40} /></div>
                  </div>

                  {/* Body */}
                  <div className="food-body">
                    <span className="food-type-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {food.food_type.toLowerCase().includes("veg") ? <Salad size={14} /> : <Drumstick size={14} />} {food.food_type}
                    </span>

                    <div className="food-meta">
                      <div className="food-meta-item">
                        <Package size={14} style={{ opacity: 0.7 }} />
                        <span>Quantity: {food.amount}</span>
                      </div>
                      <div className="food-meta-item">
                        <MapPin size={14} style={{ opacity: 0.7 }} />
                        <span>{food.location}</span>
                      </div>
                      {food.donorId && (
                        <div className="food-meta-item">
                          <User size={14} style={{ opacity: 0.7 }} />
                          <span>By {food.donorId.name}</span>
                        </div>
                      )}
                    </div>

                    {timeInfo && (
                      <div className={`food-timer ${timeInfo.expired ? "expiring" : timeInfo.expiring ? "expiring" : "active"}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {timeInfo.label}
                      </div>
                    )}

                    <button
                      className="food-order-btn"
                      onClick={() => handleOrder(food)}
                    >
                      Order Food
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

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

      {/* Order Modal — shows contact & confirm */}
      {orderModal && (
        <div className="modal-overlay" onClick={() => setOrderModal(null)}>
          <div className="modal-box order-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CookingPot size={22} /> {orderModal.food_type}</h3>
            <p>You're about to order this food donation. Here is the donor's contact number:</p>

            <div className="order-contact-box">
              <p>Donor Contact Number</p>
              <div className="order-contact-number" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Phone size={20} /> {orderModal.contact}</div>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
              Click <strong style={{ color: "var(--text-secondary)" }}>Confirm Order</strong> to notify the donor.
              They will confirm and the listing will be removed.
            </p>

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleConfirmOrder}
                disabled={ordering}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {ordering ? "Placing order…" : <><Check size={16} /> Confirm Order</>}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setOrderModal(null)}
                disabled={ordering}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

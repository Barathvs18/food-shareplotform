import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, ArrowLeft, RefreshCw, Inbox, Check, MapPin, Mail, Soup, Clock, Package } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export const UserDashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]); // Donor view
  const [myRequests, setMyRequests] = useState([]); // Seeker view
  const [loadingDonor, setLoadingDonor] = useState(true);
  const [loadingSeeker, setLoadingSeeker] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  
  const [activeTab, setActiveTab] = useState("donor"); // "donor" | "seeker"
  const [toast, setToast] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("profile_token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchPendingOrders();
    fetchMyRequests();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const fetchPendingOrders = async () => {
    setLoadingDonor(true);
    try {
      const res = await axios.get(`${API}/api/food/pending-orders`, { headers: { token } });
      setPendingOrders(res.data.orders || []);
    } catch {
      setPendingOrders([]);
    } finally {
      setLoadingDonor(false);
    }
  };

  const fetchMyRequests = async () => {
    setLoadingSeeker(true);
    try {
      const res = await axios.get(`${API}/api/food/my-requests`, { headers: { token } });
      setMyRequests(res.data.orders || []);
    } catch {
      setMyRequests([]);
    } finally {
      setLoadingSeeker(false);
    }
  };

  const handleConfirm = async (orderId) => {
    setConfirmingId(orderId);
    try {
      await axios.put(`${API}/api/food/confirm/${orderId}`, {}, { headers: { token } });
      showToast("✓ Order confirmed! The seeker has been notified.");
      fetchPendingOrders();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to confirm order.");
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LayoutDashboard size={24} /> User Dashboard
        </h2>
        <button className="btn btn-ghost" style={{ fontSize: "0.85rem", padding: "8px 16px", display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={() => navigate("/home")}>
          <ArrowLeft size={16} /> Back to Home
        </button>
      </header>

      <div className="dashboard-layout">
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === "donor" ? "active" : ""}`} 
            onClick={() => setActiveTab("donor")}
          >
            Approve Requests (As Donor) 
            {pendingOrders.length > 0 && <span className="badge">{pendingOrders.length}</span>}
          </button>
          <button 
            className={`tab-btn ${activeTab === "seeker" ? "active" : ""}`} 
            onClick={() => setActiveTab("seeker")}
          >
            My Orders (As Seeker)
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === "donor" && (
            <div className="dashboard-section">
              <div className="section-head">
                <div>
                  <h3 className="section-title">Pending Approvals</h3>
                  <p className="section-desc">Review and approve food requests from seekers.</p>
                </div>
                <button className="btn btn-ghost" onClick={fetchPendingOrders} style={{ fontSize: "0.82rem", display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>

              {loadingDonor ? (
                <div className="spinner" style={{ margin: "40px auto" }} />
              ) : pendingOrders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Inbox size={32} /></div>
                  <p>No pending orders right now.</p>
                </div>
              ) : (
                <div className="orders-grid">
                  {pendingOrders.map((order) => (
                    <div className="dash-card" key={order._id}>
                      <div className="dash-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                          <Soup size={18} /> {order.foodId?.food_type || "Food"}
                        </div>
                        <span className="status-badge pending">Pending</span>
                      </div>
                      <div className="dash-card-body">
                        <p><strong>{order.seekerName || order.seekerId?.name}</strong> requested your food.</p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                          <Mail size={14} style={{ opacity: 0.7 }} /> {order.seekerEmail || order.seekerId?.email}
                        </p>
                        {order.foodId?.location && (
                          <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <MapPin size={14} style={{ opacity: 0.7 }} /> {order.foodId.location} ({order.foodId.amount})
                          </p>
                        )}
                      </div>
                      <div className="dash-card-footer">
                        <button
                          className="btn btn-primary w-full"
                          onClick={() => handleConfirm(order._id)}
                          disabled={confirmingId === order._id}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          {confirmingId === order._id ? "Confirming…" : <><Check size={16} /> Approve Order</>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "seeker" && (
            <div className="dashboard-section">
              <div className="section-head">
                <div>
                  <h3 className="section-title">My Placed Orders</h3>
                  <p className="section-desc">Track status of food you have requested.</p>
                </div>
                <button className="btn btn-ghost" onClick={fetchMyRequests} style={{ fontSize: "0.82rem", display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>

              {loadingSeeker ? (
                <div className="spinner" style={{ margin: "40px auto" }} />
              ) : myRequests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={32} /></div>
                  <p>You haven't requested any food yet.</p>
                </div>
              ) : (
                <div className="orders-grid">
                  {myRequests.map((order) => {
                    const isConfirmed = order.status === "confirmed" || order.foodId?.isConfirmed;
                    return (
                      <div className="dash-card" key={order._id}>
                        <div className="dash-card-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                            <Soup size={18} /> {order.foodId?.food_type || "Food"}
                          </div>
                          <span className={`status-badge ${isConfirmed ? 'confirmed' : 'pending'}`}>
                            {isConfirmed ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <div className="dash-card-body">
                          <p><strong>Donor:</strong> {order.donorId?.name || "Unknown"}</p>
                          {isConfirmed && order.donorId?.contact && (
                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: 'var(--primary-light)' }}>
                              📞 {order.donorId.contact}
                            </p>
                          )}
                          {order.foodId?.location && (
                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                              <MapPin size={14} style={{ opacity: 0.7 }} /> {order.foodId.location}
                            </p>
                          )}
                        </div>
                        <div className="dash-card-footer">
                          {isConfirmed ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                              The donor has approved your request. Please contact them.
                            </p>
                          ) : (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                              Waiting for donor approval...
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  );
};

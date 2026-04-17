import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const Otp = () => {
  const [otp, setOtp] = useState("");
  const activation_token = localStorage.getItem("token")?.trim();

  const handelverify = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API}/api/user/verify`, {
        otp,
        activation_token 
      });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Verification failed. Try again.");
    }
  };

  return (
    <div className='container'>
      <h2>Enter OTP</h2>
      <input
        type="number"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handelverify}>Verify</button>
    </div>
  );
};

export default Otp;

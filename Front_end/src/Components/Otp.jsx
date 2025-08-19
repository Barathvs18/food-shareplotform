import React, { useState } from 'react';
import axios from 'axios';

const Otp = () => {
  const [otp, setOtp] = useState("");
  const activation_token = localStorage.getItem("token")?.trim();

  const handelverify = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/user/verify", {
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

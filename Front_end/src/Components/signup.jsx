import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import logo from "../img/food-donation.png"

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/user/register", {
        name,
        email,
        password,
      });

      alert(response.data.message);
      
      // setName("");
      // setEmail("");
      // setPassword("");
      // to store the token 
      localStorage.setItem("token", response.data.activation_token  );

      // redract to otp
      navigate("/otp");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to register user. Try again."
      );
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <img src={logo} alt="" />
                <hr />\
                <br />
        <h2>Sign Up</h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
      
          <button type="submit">Sign Up</button>
      
        </form>
      </div>
    </div>
  );
};

export default Signup;

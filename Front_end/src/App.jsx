// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./Components/signup";
import Login from "./Components/login";
import { Index } from "./Components/Index.jsx";

import { Donor } from "./Components/Doner";
import Seeker from "./Components/Seeker";
import Otp from "./Components/Otp.jsx";
import { Home } from "./Components/Home.jsx";

import "./Css/Auth.css";
import "./Css/Index.css";
import "./Css/Doner.css";
import "./Css/Seeker.css";
import "./Css/Home.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/donor" element={<Donor />} />
        <Route path="/seeker" element={<Seeker />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

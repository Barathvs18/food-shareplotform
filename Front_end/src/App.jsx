import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Index } from "./Components/Index.jsx";
import Login from "./Components/login.jsx";
import Signup from "./Components/signup.jsx";
import { Home } from "./Components/Home.jsx";
import { Donor } from "./Components/Doner.jsx";
import { Seeker } from "./Components/Seeker.jsx";
import { UserDashboard } from "./Components/Dashboard.jsx";

import "./Css/Global.css";
import "./Css/Auth.css";
import "./Css/Index.css";
import "./Css/Home.css";
import "./Css/Doner.css";
import "./Css/Seeker.css";
import "./Css/Dashboard.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/donor" element={<Donor />} />
        <Route path="/seeker" element={<Seeker />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

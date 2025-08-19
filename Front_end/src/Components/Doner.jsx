import axios from "axios";
import React, { useState } from "react";
import logo from "../img/food-donation.png"

export const Donor = () => {
  const [food_type, setfood] = useState("");
  const [amount, setamount] = useState("");
  const [location, setlocation] = useState("");
  const [contact, setcontact] = useState("");
  const [available_time, setavailable_time] = useState("");
  const [food_img ,setfood_img] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/Food_info/donte", {
        food_type,
        amount,
        location,
        contact,
        available_time
      });

      alert("Food donation shared successfully!");

      setfood("");
      setamount("");
      setlocation("");
      setcontact("");
      setavailable_time("");

    } catch (error) {
      alert(error.response?.data?.message || "Failed to donate food. Try again.");
    }
  };

  return (
    <div className="donor-container">

      <div className="logo">
      <img src={logo} alt="" />

      </div>
      <br />
      <hr />
      <br />
      <h2>Share Food</h2>
      <form onSubmit={handleSubmit}>
        <label>Food Type (Veg/Non-Veg):</label>
        <input
          type="text"
          placeholder="Food Type"
          value={food_type}
          required
          onChange={(e) => setfood(e.target.value)}
        />

        <label>Amount of Food:</label>
        <input
          type="text"
          placeholder="Food Quantity"
          value={amount}
          onChange={(e) => setamount(e.target.value)}
          required
        />

        <label>Location:</label>
        <input
          type="text"
          placeholder="Your Location"
          value={location}
          onChange={(e) => setlocation(e.target.value)}
          required
        />

        <label>Contact Number:</label>
        <input
          type="text"
          placeholder="Your Contact"
          value={contact}
          onChange={(e) => setcontact(e.target.value)}
          required
        />

        <label>Available Time:</label>
        <input
          type="text"
          placeholder="Available Timing"
          value={available_time}
          onChange={(e) => setavailable_time(e.target.value)}
          required
        />
                <label>Food Image:</label>
        <input
          type="image"
          placeholder="Upload Here"
          value={food_img}
          onChange={(e) => setavailable_img(e.target.value)}
          required
        />
      

        <button type="submit">Share</button>
      </form>
    </div>
  );
};

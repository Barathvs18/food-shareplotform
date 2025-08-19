import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import img from "../img/images.png";
import logo from "../img/food-donation.png"
import { Link } from 'react-router-dom';


export const Home = () => {
  const [foods, setFoods] = useState([]);
  const [profile_in, setprofile_in] = useState(false);
  const [profile, setprofile] = useState({});
  const navigate = useNavigate();
  // if not log in 
  useEffect(() => {
    const token = localStorage.getItem("profile_token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  //food data
  useEffect(() => {
    axios.get('http://localhost:3000/api/Food_info/seek')
      .then(response => {
        setFoods(response.data.food_info);
      })
      .catch(err => {
        console.error('Failed to load food data.', err);
      });
  }, []);

  // user data

  useEffect(() => {
    axios.get('http://localhost:3000/api/user/Myprofile',{
      headers:{
        token : localStorage.getItem("profile_token")
      }
    })
    .then(response=>{
      setprofile(response.data.user);
    })
    .catch(err =>{
      alert("failed to load");
    })
  }, []);
  

  // profile button

  const handleProfile = () => {
    setprofile_in(false);
  };
  const ViewProfile = () => {
    setprofile_in(true);
  };

  // log out

  const handleLogout = () => {
    localStorage.removeItem("profile_token");
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className='wrap-container'>
      {/* Header */}
      <header className="Home_header">
        <div className='logo'>
          <img src={logo} alt="logo" />
          <h1 className='logoh1'>🍴Food Share</h1>
        </div>
        <div className='header_icons' >
          <Link to="/donor">
          <button className='share_btn'>Share Food</button>
          </Link>
          <img className="profile-img" src={img} alt="profile" onClick={ViewProfile} />
        </div>
      </header>

      {/* Food list */}
      <h2>Available Foods</h2>
      <hr />
      <div className="container">
        {foods.map((food, index) => (
          <div className="food_card" key={index}>
            <div className='info'>
              <div className='food_info'>
                <p><strong>Food Type:</strong> {food.food_type}</p>
                <p><strong>Amount:</strong> {food.amount}</p>
                <p><strong>Location:</strong> {food.location}</p>
                <p><strong>Contact:</strong> {food.contact}</p>
                <p><strong>Available Time:</strong> {food.available_time}</p>
              </div>
            </div>
            <br />
            <hr />
          </div>
        ))}
      </div>

      {/* Profile */}
      <div className={`profile ${profile_in ? "slide_in" : "slide_out"}`}>
        <div>
          <button className='cancel_btn' onClick={handleProfile}>X</button>
          <div className='profile_info'>
            <img src={img} alt="" />
            <h3>{profile.name}</h3>
            <p>{profile.email}</p>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

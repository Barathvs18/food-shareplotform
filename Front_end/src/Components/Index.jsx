import React from "react";
import { Link } from "react-router-dom";
import logo from "../img/food-donation.png"

export const Index = () => {
  return (
    <div>
      {/* Header Section */}
      <header className="header">
        <div className="logo">
        <img src={logo} alt="" />
        <h1>Food Share</h1>

        </div>
        <Link to="/login">
        <div className="login">
           <a href="">Log in</a>
        </div>
        </Link>
      </header>

      {/* Hero Section */}
      <div className="mid-wrapper">
        <section className="mid">
          <h1>Share surplus, spread smiles — join the food sharing movement</h1>
          <p>
            Share your extra food with those in need and help reduce waste.
            Together, we can build a kinder, more sustainable community — one
            meal at a time.
          </p>
           <Link to="/signup">
          <div className="signup">
             <h3 className="text">Create Account</h3>
         </div>
           </Link>
        </section>
      </div>


    </div>
  );
};

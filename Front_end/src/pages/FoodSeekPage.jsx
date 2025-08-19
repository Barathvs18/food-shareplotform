import React, { useState, useEffect } from "react";
import axios from "axios";
import { FoodCard } from "../components/FoodCard";
import { FoodDetails } from "../components/FoodDetails";

export const FoodSeekPage = () => {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/foods").then((res) => {
      setFoods(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Available Foods</h1>
      <div className="food-grid">
        {foods.map((food) => (
          <FoodCard key={food._id} food={food} onClick={setSelectedFood} />
        ))}
      </div>

      {selectedFood && (
        <FoodDetails food={selectedFood} onClose={() => setSelectedFood(null)} />
      )}
    </div>
  );
};

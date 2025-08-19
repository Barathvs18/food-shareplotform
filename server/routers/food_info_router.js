import express from "express";
import { food_info,seek_food  } from "../contorllers/food_info.js";


// creating router

const foodRouters =express.Router();
foodRouters.post("/Food_info/donte" ,food_info),
foodRouters.get("/Food_info/seek" ,seek_food );

// exporting

export default foodRouters;
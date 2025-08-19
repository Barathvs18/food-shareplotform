import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// to connect dotenv

dotenv.config();
const app =express();
const prot =process.env.PORT;
// middleware
app.use(cors());
app.use(express.json());


// Importing routes
import userRoutes from "./routers/user_router.js"
import foodRouters from "./routers/food_info_router.js"


// using routes
app.use("/api", userRoutes);
app.use("/api",foodRouters);


app.listen(prot,()=> {
  console.log(`server is running on http://localhost:${prot}`)
  connectDB();
})
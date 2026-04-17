import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());


// Serve uploaded images statically
app.use("/uploads", express.static(uploadsDir));

// Routes
import userRoutes from "./routers/user_router.js";
import foodRouters from "./routers/food_info_router.js";

app.use("/api", userRoutes);
app.use("/api", foodRouters);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  connectDB();
});
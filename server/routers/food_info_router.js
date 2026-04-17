import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  food_info,
  seek_food,
  myDonations,
  placeOrder,
  confirmOrder,
  myPendingOrders,
  myRequests
} from "../contorllers/food_info.js";
import { isAuth } from "../middleware/is_auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config for food images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const foodRouters = express.Router();

// Donate food (auth required, optional image upload)
foodRouters.post("/food/donate", isAuth, upload.single("food_img"), food_info);

// Seek available food (auth required)
foodRouters.get("/food/seek", isAuth, seek_food);

// My donations (donor dashboard)
foodRouters.get("/food/my-donations", isAuth, myDonations);

// Place an order
foodRouters.post("/food/order", isAuth, placeOrder);

// Confirm an order (donor only)
foodRouters.put("/food/confirm/:orderId", isAuth, confirmOrder);

// Get pending orders for donor
foodRouters.get("/food/pending-orders", isAuth, myPendingOrders);

// Get my requests (seeker dashboard)
foodRouters.get("/food/my-requests", isAuth, myRequests);

export default foodRouters;
import { Food } from "../Model/Food.js";
import { Order } from "../Model/Order.js";
import path from "path";

// ── Donate food (with optional image upload via multer) ──────────────────────
export const food_info = async (req, res) => {
  try {
    const { food_type, amount, location, contact, available_time } = req.body;
    const donorId = req.user._id;

    // If image was uploaded via multer, store relative path
    const food_img = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const newFood = await Food.create({
      food_img,
      food_type,
      amount,
      location,
      contact,
      available_time: new Date(available_time),
      donorId,
    });

    return res.status(200).json({
      message: "Food donation posted successfully!",
      food: newFood,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Seek food (only non-confirmed listings) ─────────────────────────────────
export const seek_food = async (req, res) => {
  try {
    const food_info = await Food.find({
      isConfirmed: false,
    }).populate("donorId", "name email");

    return res.status(200).json({ food_info });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── My donations (for donor dashboard) ──────────────────────────────────────
export const myDonations = async (req, res) => {
  try {
    const donations = await Food.find({ donorId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ donations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Place an order ───────────────────────────────────────────────────────────
export const placeOrder = async (req, res) => {
  try {
    const { foodId } = req.body;
    const seeker = req.user;

    const food = await Food.findById(foodId).populate("donorId", "name email");
    if (!food) return res.status(404).json({ message: "Food not found." });
    if (food.isConfirmed) return res.status(400).json({ message: "This food has already been claimed." });
    if (new Date(food.available_time) < new Date())
      return res.status(400).json({ message: "This food listing has expired." });

    // Check if order already placed by this seeker
    const existing = await Order.findOne({ foodId, seekerId: seeker._id });
    if (existing) return res.status(400).json({ message: "You already placed an order for this food." });

    const order = await Order.create({
      foodId,
      seekerId: seeker._id,
      donorId: food.donorId._id,
      seekerName: seeker.name,
      seekerEmail: seeker.email,
    });



    return res.status(200).json({
      message: "Order placed! Donor has been notified.",
      donorContact: food.contact,
      order,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Donor confirms order → hides food from seekers ──────────────────────────
export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("foodId").populate("seekerId", "name email");
    if (!order) return res.status(404).json({ message: "Order not found." });

    // Only the donor can confirm
    if (String(order.donorId) !== String(req.user._id))
      return res.status(403).json({ message: "Not authorized." });

    // Mark order confirmed
    order.status = "confirmed";
    await order.save();

    // Mark food as confirmed → hidden from seekers
    await Food.findByIdAndUpdate(order.foodId._id, { isConfirmed: true });



    return res.status(200).json({ message: "Order confirmed. Food is now hidden from other seekers." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Get pending orders for donor dashboard ───────────────────────────────────
export const myPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ donorId: req.user._id, status: "pending" })
      .populate("foodId", "food_type amount location")
      .populate("seekerId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Get my requests (as seeker) ──────────────────────────────────────────────
export const myRequests = async (req, res) => {
  try {
    const orders = await Order.find({ seekerId: req.user._id })
      .populate("foodId", "food_type amount location isConfirmed")
      .populate("donorId", "name email contact")
      .sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


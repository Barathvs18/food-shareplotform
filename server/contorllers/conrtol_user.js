import { User } from "../Model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ── Register (no OTP, direct save) ──────────────────────────────────────────
export const UserRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash password
    const hash_pass = await bcrypt.hash(password, 10);

    // Save user directly
    const user = await User.create({ name, email, password: hash_pass });

    return res.status(200).json({ message: "Registration successful! Please log in." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Login ────────────────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN, {
      expiresIn: "20d",
    });

    return res.status(200).json({
      message: `Welcome ${user.name}`,
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── My Profile ───────────────────────────────────────────────────────────────
export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

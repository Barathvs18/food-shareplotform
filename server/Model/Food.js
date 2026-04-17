// schema
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    food_img: {
      type: String,
      default: "",
    },
    food_type: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    available_time: {
      // Store as ISO date string so we can compare
      type: Date,
      required: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isConfirmed: {
      // true once donor confirms an order — hides from others
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Food = mongoose.model("Food", schema);
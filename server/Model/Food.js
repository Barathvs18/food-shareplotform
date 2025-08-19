// schema
import mongoose, { Types } from "mongoose";

const schema = new mongoose.Schema(
  { 
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
      required:true
    },
    available_time:{
        type:String,
        required:true
    },
  },
  // for log
  { timestamps: true }
);

export const Food = mongoose.model("Food", schema);

  
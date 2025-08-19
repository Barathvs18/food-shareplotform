import { Food } from "../Model/Food.js";

// post  food info 
export const food_info = async (req, res) => {
  try {
    const { food_type, amount, location, contact, available_time } = req.body;

    const newFood_info = new Food({
      food_type,
      amount,
      location,
      contact,
      available_time,
    });

    await newFood_info.save();
    return res.status(200).json({
      message: 'Product registered successfully!',
      food: newFood_info,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get  food info
export const seek_food = async (req, res) => {
  try {
    const food_info = await Food.find();
    return res.status(200).json({ food_info });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

import { User } from "../Model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sender from "../middleware/auth_mail.js";

// user regisitor

export const UserRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // to check the email is already exists

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User Email is Already Exists",
      });
    }
    // hashing password
    const hash_pass = await bcrypt.hash(password, 10);

    // generate otp
    const otp = Math.floor(Math.random() * 10000);
    console.log(`otp ${otp}`)

    user = { name, email, password:hash_pass };

    // activation tokes
    const activation_token = jwt.sign(
      { user, otp },
      process.env.ACTIVATION_KEY,
      {
        expiresIn: "5m",
      }
    );

    // send mail

    const message = `Please Verify your account using otp is ${otp}`;
    await sender(email, "Welcome To The Food Share Community", message);

    return res.status(200).json({
      message: "OTP Sent to your mail",
      activation_token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//verify otp
export const verifyUser = async (req, res) => {
  
  try {
    const { otp, activation_token } = req.body;
    const verify = jwt.verify(activation_token, process.env.ACTIVATION_KEY);

    if (!verify) {
      return res.json({
        message: "OTP Expried",
      });
    }

    if (String(otp) !== String  (verify.otp)) {
      return res.json({
        message: "Worng OTP ",
      });
    }
    // to save in db
    await User.create({
      name: verify.user.name,
      email: verify.user.email,
      password: verify.user.password,

    });
    // responce
    return res.status(200).json({
      message: "User Registration Success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// user login
export const loginUser = async (req, res) => {    
  try {
    const {email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    };
    // password check
    const matchPassword = await bcrypt.compare(password,user.password);

    if (!matchPassword) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    };
    // generate token or session
    const token = jwt.sign({ _id: user.id }, process.env.TOKEN, {
      expiresIn: "20d",
    });

    // exclude the password
    const { password: userPassword, ...userDetails } = user.toObject();
    return res.status(200).json({
      message: `Welcome ${user.name}`,
      token,

    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// user profile
export const myProfile = async (req,res) => {
  try {
    const user=await User.findById(req.user._id).select("-password");
    return res.status(200).json({
        user,
    })
    
  } catch (error) {
    return res.status(500).json({
        message:error.message,
    });
    
  }  
};

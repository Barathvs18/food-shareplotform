import express from "express";
import {UserRegister,verifyUser ,loginUser,myProfile} from "../contorllers/conrtol_user.js";
import {isAuth} from "../middleware/is_auth.js";

const userRouters =express.Router();

userRouters.post("/user/register" ,UserRegister),
userRouters.post("/user/verify" ,verifyUser)
userRouters.post("/user/login" ,loginUser)
userRouters.get("/user/Myprofile" ,isAuth,myProfile)


export default userRouters;

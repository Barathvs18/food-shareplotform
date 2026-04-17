import express from "express";
import { UserRegister, loginUser, myProfile } from "../contorllers/conrtol_user.js";
import { isAuth } from "../middleware/is_auth.js";

const userRouters = express.Router();

userRouters.post("/user/register", UserRegister);
userRouters.post("/user/login", loginUser);
userRouters.get("/user/myprofile", isAuth, myProfile);

export default userRouters;

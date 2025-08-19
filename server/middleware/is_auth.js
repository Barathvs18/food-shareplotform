import jwt from "jsonwebtoken";
import {User} from "../Model/User.js";

export const isAuth =async (req ,res,next) => {
    try {
        const token =req.headers.token;
        if (!token) {
            return res.status(403).json({
                 Message:"Please Login To Access"
            });           
        };
        // decoding token
        const decodedData=jwt.verify(token,process.env.TOKEN);
        req.user = await User.findById(decodedData._id);
        next();
    } catch (error) {
        return res.status(403).json({
            Message:"Please Login To Access"
        })
        
    }
    
}
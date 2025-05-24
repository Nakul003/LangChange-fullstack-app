import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({success:false, message:"Unauthorized user - no token provided"})
        }

        const verifedToken =  jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(!verifedToken) {
            return res.status(401).json({success:false, message:"Unauthorized user - invalid token"})
        }

        const user = await User.findById(verifedToken.userId).select("-password");

        if (!user) {
            return res.status(401).json({success:false, message:"Unauthorized user - user not found"})
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute function", error);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}
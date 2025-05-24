import { Router } from "express";

import { signUp, logIn, logOut, onBoard } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/auth.protect.js";

const router = Router();

router.post("/signup",signUp);

router.post("/login",logIn);

router.post("/logout",logOut);

router.post("/onboarding", protectRoute, onBoard);

router.get("/checkAuth", protectRoute, (req, res) => {
    res.status(200).json({success:true, user: req.user})
});

export default router;
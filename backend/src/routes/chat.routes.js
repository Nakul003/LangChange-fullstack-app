import { Router } from "express";
import { protectRoute } from "../middlewares/auth.protect.js";
import { getStreamToken } from "../controllers/chat.controllers.js";

const router  = Router();

router.get("/token", protectRoute, getStreamToken);

export default router;
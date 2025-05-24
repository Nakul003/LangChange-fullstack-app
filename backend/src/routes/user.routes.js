import { Router } from "express";
import { protectRoute } from "../middlewares/auth.protect.js";
import { getRecommendedUsers, getUserFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendRequests } from "../controllers/user.controllers.js";

const router = Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getUserFriends);
router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);

export default router;
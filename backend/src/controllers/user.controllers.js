import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export const getRecommendedUsers = async(req, res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user

        const recommendedUsers = await User.find({
            $and:[
                { _id:{ $ne: currentUserId } },
                { _id:{ $nin: currentUser.friends } },
                { isOnboarded: true },
            ]
        });
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.log("Error in getRecommendedUsers controller", error);
        res.status(500).json({success:false, message:"Internal server error"})   
    }
}

export const getUserFriends = async(req, res) => {
    try {
        const user = await User.findById(req.user.id)
        .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getUserFriends controller", error);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}

export const sendFriendRequest = async(req, res) => {
    try {
       const myId = req.user._id;
       const { id:recipientId } = req.params;
       if (myId===recipientId) {
        return res.status(400).json({message:"You can not send friend request to yourself"});
       }

       const recipient = await User.findById(recipientId);

       if (!recipient) {
           return res.status(400).json({message:"User not found"});
       }

       if (recipient.friends.includes(myId)) {
       return res.status(400).json({message:"You are already friend with this user"});
       }

       const existingRequest = await FriendRequest.findOne({
        $or:[
            {sender:myId, recipient:recipientId},
            {sender:recipientId, recipient:myId}
        ]
       });

       if (existingRequest) {
       return res.status(400).json({message:"Friend request already exist"});
       }

       const friendRequest = await FriendRequest.create({
        sender: myId,
        recipient: recipientId
       });

       res.status(200).json(friendRequest)

    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({success:false, message:"Internal server Error"})
    }
}

export const acceptFriendRequest = async(req, res) => {
    try {
       const { id:requestId } = req.params;

       const friendRequest = await FriendRequest.findById(requestId);

       if (!friendRequest) {
            return res.status(400).json({ message:"Friend request not found" });
       }

       if (friendRequest.recipient.toString()!==req.user.id) {
        return res.status(403).json({message:"You are not Unauthorized to accept this request"});
       }

       friendRequest.status = "accepted";

       await friendRequest.save()

       await User.findByIdAndUpdate(friendRequest.sender,({
        $addToSet:{friends:friendRequest.recipient}
       }))

       await User.findByIdAndUpdate(friendRequest.recipient,({
        $addToSet:{friends:friendRequest.sender}
       }))

    } catch (error) {
        console.error("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({success:false, message:"Internal server Error"});
    }
}

export const getFriendRequests = async(req, res) => {
    try {
        const myId = req.user._id
        const incomingRequests = await FriendRequest.find({
            recipient:myId,
            status:"pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedRequests = await FriendRequest.find({
            sender:myId,
            status:"accepted"
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({incomingRequests, acceptedRequests})
    } catch (error) {
        console.log("Error in getFriendRequests controller", error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getOutgoingFriendRequests = async(req, res) => {
    try {
        const myId = req.user._id;

        const outgoingRequests = await FriendRequest.find({
            sender:myId,
            status:"pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingRequests)
    } catch (error) {
        console.log("Error in getOutgoingFriendRequests", error.message);
        res.status(500).json({message:"Internal server error"});
    }
}
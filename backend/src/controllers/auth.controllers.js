import User from "../models/User.js";
import { generateJwt } from "../lib/Jwt.js";
import bcrypt from "bcryptjs";
import { upsertStreamUser } from "../lib/Stream.js";

export const signUp = async (req, res) => {

    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) return res.status(400).json({ success: false, message: "All fields are required" })

        const emailReqex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailReqex.test(email)) return res.status(400).json({ success: false, message: "Email is invalid" })

        const user = await User.findOne({ email });

        if (user) return res.status(400).json({ success: false, message: "This email already exist" })

        if (password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`


        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            profilePic: randomAvatar,
        })

        await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || "",
        });

        if (newUser) {
            generateJwt(newUser._id, res);
            res.status(201).json({ success: true, newUser })
        }
    }

    catch (error) {
        console.log("Error in signUp controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const logIn = async (req, res) => {

    const { email, password } = req.body

    try {

        if (!email || !password) return res.status(400).json({ success: false, message: "All fields are required" })

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" })


        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return res.status(400).json({ success: false, message: "Invalid credentials" })

        generateJwt(user._id, res);
        res.status(200).json({ success: true, user });
    }

    catch (error) {
        console.log("Error in logIn controller", error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const logOut = async (req, res) => {

    try {
        res.clearCookie("jwt")
        res.status(200).json({ success: true, message: "Logout successfully" })
    }

    catch (error) {
        console.log("Error in logOut controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const onBoard = async (req, res) => {

    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    try {

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                success: false, message: "All fields are required", missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded:true
        },{new:true})

        if (!updatedUser) {
            return res.status(400).json({success:false, message:"User not found"});
        }

        await upsertStreamUser({
            id:updatedUser._id.toString(),
            name:updatedUser.fullName,
            image:updatedUser.profilePic || "",
        })

        res.status(200).json({success:true, updatedUser});
    } catch (error) {
        console.log("Error in onBoard controller",error);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}
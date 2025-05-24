import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import { connectDB } from "./lib/MongoDB.js";
import path from "path";

const app = express();
const port = process.env.PORT;
const __dirname = path.resolve();

app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res)=>{
        res.sendFile(path.join(__dirname,"..frontend/dist/index.html"))
    })
}

app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDB();
});
import  jwt from "jsonwebtoken"

export const generateJwt = (Id, res) => {
    const token = jwt.sign({userId:Id},process.env.JWT_SECRET_KEY,{
        expiresIn:"7d",
    });

    res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV==="production",
    });
}
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

const formatAuthResponse = (user) => ({
    _id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    token: generateToken(user.id),
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exist" });

    const user = await User.create({ name, email, password });
    res.status(201).json(formatAuthResponse(user));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json(formatAuthResponse(user));
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

export { registerUser, loginUser };

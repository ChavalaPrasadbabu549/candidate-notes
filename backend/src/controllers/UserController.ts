import { Request, Response } from "express";
import User from "../models/User";
import generateToken from "../utils/generateToken";


export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "Validation error",
                details: "Name, email, and password are required"
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                success: false,
                code: 409,
                message: "Conflict",
                details: "User already exists"
            });
        }

        const user = await User.create({ name, email, password });
        return res.status(201).json({
            success: true,
            code: 201,
            message: "Your account has been registered successfully",
            user
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            code: 500,
            message: "Server error",
            details: error.message || "Something went wrong"
        });
    }
};


export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "Validation error",
                details: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: "User not found",
                details: "No account exists with this email"
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                code: 401,
                message: "Unauthorized",
                details: "Invalid password"
            });
        }

        const token = generateToken(user.id.toString());

        return res.status(200).json({
            success: true,
            code: 200,
            message: "Login successful",
            data: {
                name: user.name,
                email: user.email,
                token
            }
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            code: 500,
            message: "Server error",
            details: error.message || "Something went wrong"
        });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).select("-password");

        return res.status(200).json({
            success: true,
            code: 200,
            message: "Users fetched successfully",
            data: users
        });
    } catch (error: any) {
        console.error("Error fetching users:", error);

        return res.status(500).json({
            success: false,
            code: 500,
            message: "Server error",
            details: error.message || "Failed to fetch users"
        });
    }
};



import { Request, Response } from "express";
import Candidate from "../models/Candidate";


export const createCandidate = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "Validation error",
                details: "Name and email are required"
            });
        }

        const candidateExists = await Candidate.findOne({ email });
        if (candidateExists) {
            return res.status(409).json({
                success: false,
                code: 409,
                message: "Conflict",
                details: "Candidate already exists"
            });
        }

        const candidate = await Candidate.create({ name, email });

        return res.status(201).json({
            success: true,
            code: 201,
            message: "Candidate added successfully",
            data: candidate
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            code: 500,
            message: "Server error",
            details: error.message || "Failed to create candidate"
        });
    }
};


export const getAllCandidates = async (req: Request, res: Response) => {
    try {
        const candidates = await Candidate.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            code: 200,
            message: "Candidates fetched successfully",
            data: candidates
        });

    } catch (error: any) {
        console.error("Error fetching candidates:", error);

        return res.status(500).json({
            success: false,
            code: 500,
            message: "Server error",
            details: error.message || "Failed to fetch candidates"
        });
    }
};

import { Request, Response } from "express";
import { Message } from "../models/Message";

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { candidateId } = req.params;
        if (!candidateId) {
            return res.status(400).json({ error: "Candidate ID is required" });
        }

        const messages = await Message.find({ candidateId })
            .populate("sendId", "name email")
            .populate("tags", "name email")
            .sort({ createdAt: 1 });

        res.json({
            success: true,
            data: messages,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Server error" });
    }
};

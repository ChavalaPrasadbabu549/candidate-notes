import { Request, Response } from "express";
import Notification from "../models/Notification";

export const getNotifications = async (req: any, res: Response) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .populate("candidateId", "name")
            .populate("messageId", "content")
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
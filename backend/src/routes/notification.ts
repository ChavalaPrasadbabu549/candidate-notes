import express from "express";
import { getNotifications } from "../controllers/NotificationController";

const router = express.Router();
router.post("/getAll", getNotifications);


export default router;

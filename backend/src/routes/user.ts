import express from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/UserController";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getall", getAllUsers);

export default router;

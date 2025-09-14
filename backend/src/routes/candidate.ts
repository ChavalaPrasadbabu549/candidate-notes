import express from "express";
import { createCandidate, getAllCandidates } from "../controllers/CandidateController";


const router = express.Router();
router.post("/signup", createCandidate);
router.get("/getall", getAllCandidates);

export default router;

import express from "express";
import {  getProfileById } from "../controllers/profileController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// router.get("/profile", protect, getProfile); // Authenticated profile
router.get("/profile/:id", getProfileById); // Public or admin usage

export default router;
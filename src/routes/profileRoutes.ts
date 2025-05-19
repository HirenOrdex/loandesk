import express from "express";
import {  getProfileById, updateProfileById } from "../controllers/profileController";
import upload from "../middlewares/upload";

const router = express.Router();

router.get("/profile/:id", getProfileById); 
router.patch("/profile/:id",upload.single("profileImage"), updateProfileById);

export default router;
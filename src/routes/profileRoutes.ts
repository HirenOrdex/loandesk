import express from "express";
import { getProfileById, updateProfileById } from "../controllers/profileController";
import multer from 'multer';

const router = express.Router();

const upload = multer();

router.get("/profile/:id", getProfileById);
router.patch("/profile/:id", upload.single("profileImage"), updateProfileById);

export default router;
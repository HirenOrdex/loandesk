// src/routes/authRoutes.ts
import { Router } from "express";
import BankerController from "../controllers/bankerController";
import { validateBankerRequest } from "../validators/bankerValidator";

const router = Router();


router.post('/bankers',validateBankerRequest, BankerController.createBanker);
router.patch('/bankers/:id', validateBankerRequest, BankerController.updateBanker);

export default router;

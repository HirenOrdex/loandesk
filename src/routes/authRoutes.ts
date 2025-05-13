// src/routes/authRoutes.ts
import { Router } from "express";
import authController from "../controllers/authController";
import { validateRegister, validateRequest } from "../validators/authValidator";

const router = Router();

// Public routes
router.post("/register", validateRegister, authController.register);
router.post("/login", authController.sendLoginOtp);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.post(
  "/forgot-password",
  validateRequest("forgotPassword"),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest("resetPassword"),
  authController.resetPassword
);
router.post("/verfiy-otp", authController.login);
router.get(
  "/verfiy-email/:token",
  // rateLimiter({ windowMs: 60 * 60 * 1000, max: 3 }), // 3 requests per hour
  authController.verifyEmail
);
router.post(
  "/resend-email",
  // rateLimiter({ windowMs: 60 * 60 * 1000, max: 3 }), // 3 requests per hour
  authController.resendVerificationEmail
);
router.post(
  "/change-password",
  validateRequest("changePassword"),
  authController.changePassword
);
router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleCallback);
export default router;

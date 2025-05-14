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
router.post("/resend-otp", authController.resendLoginOtp);
export default router;

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: login
 *     parameters:
 *       - name: Content-Type
 *         in: header
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 */
// POST /auth/login implementation

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: logout
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 */
// POST /auth/logout implementation

/**
 * @openapi
 * /auth/register/:
 *   post:
 *     summary: register Borrower
 *     parameters:
 *       - name: type
 *         in: query
 *         required: false
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: string
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 */
// POST /auth/register/ implementation

/**
 * @openapi
 * /auth/verfiy-email/{token}:
 *   get:
 *     summary: verfiy-email
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 */
// GET /auth/verfiy-email/{token} implementation

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: forget Password
 *     parameters:
 *       - name: Content-Type
 *         in: header
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 */
// POST /auth/forgot-password implementation

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: rest_password
 *     parameters:
 *       - name: Content-Type
 *         in: header
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 */
// POST /auth/reset-password implementation

/**
 * @openapi
 * /auth/resend-email:
 *   post:
 *     summary: resend - email
 *     parameters:
 *       - name: Content-Type
 *         in: header
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 */
// POST /auth/resend-email implementation

/**
 * @openapi
 * /auth/verfiy-otp:
 *   post:
 *     summary: verfiy-otp
 *     parameters:
 *       - name: Content-Type
 *         in: header
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 */
// POST /auth/verfiy-otp implementation

/**
 * @openapi
 * /auth/resend-otp:
 *   post:
 *     summary: resend-otp
 *     parameters:
 *       - name: Content-Type
 *         in: header
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 */
// POST /auth/resend-otp implementation

/**
 * @openapi
 * /auth/change-password:
 *   post:
 *     summary: change-password
 *     parameters:
 *       - name: refreshToken
 *         in: header
 *         required: true
 *       - name: Content-Type
 *         in: header
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 */
// POST /auth/change-password implementation

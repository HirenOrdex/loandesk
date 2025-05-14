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
 *         example: application/json
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *           example:
 *             email: hir3@abcbank.com
 *             password: StrongP@ssw0rd!
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *         example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjRhOTMwMzVjMTQ3Njg2NTNkZmM4ZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ0MDg3MzQ0LCJleHAiOjE3NDQxNzM3NDR9.kbOG2os4LYH0yt2CYYEihmBaaFjgOql9SZGSBwMdiuY
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *         example: borrower
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: string
 *           example:
 *             email: hir134@abcbank.com
 *             password: StrongP@ssw0rd!
 *             confirm_password: StrongP@ssw0rd!
 *             firstName: John
 *             middleInitial: D
 *             lastName: Doe
 *             phone: +1234567890
 *             position: xyz
 *             coname: abc
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *         example: a91c2a6a350c2508d2c52120e60052122888d1e61cebf74ae1162fa84481bdb9
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *         example: application/json
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *           example:
 *             email: hiren.lalani.ordex@gmail.com
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *         example: application/json
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - token
 *               - password
 *           example:
 *             password: Ordex@123
 *             token: 471179
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *         example: application/json
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *           example:
 *             email: hiren.lalani.ordex@gmail.com
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *         example: application/json
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               otp:
 *                 type: string
 *             required:
 *               - email
 *               - newPassword
 *               - otp
 *           example:
 *             email: hir3@abcbank.com
 *             otp: 1234
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *         example: application/json
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *           example:
 *             email: hir3@abcbank.com
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWRkY2VjOWNiOTIxNWJmMDAzMWU0NyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ3MDQ1NDQ3LCJleHAiOjE3NDc2NTAyNDd9.ZG1HprcgAMoLrBiL2pBXYKZXRXdjpeH0qMKzRofRLNM
 *         schema:
 *           type: string
 *       - name: Content-Type
 *         in: header
 *         required: true
 *         example: application/json
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - oldPassword
 *               - newPassword
 *           example:
 *             oldPassword: Ordex@123
 *             newPassword: Ordex@123
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 */
// POST /auth/change-password implementation

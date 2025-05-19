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
  "/verfiy-email/:userId/:token",
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
 *             confirmPassword: StrongP@ssw0rd!
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


/**
 * @swagger
 * /api/profile/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     description: Retrieves full profile data for a user by MongoDB ID
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     userAddressId:
 *                       type: string
 *                     userAddress:
 *                       $ref: '#/components/schemas/Address'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /api/profile/{id}:
 *   patch:
 *     summary: Update user profile by ID
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB User ID
 *         schema:
 *           type: string
 *           example: 682715d39bcaa7de2194bb15
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               personData:
 *                 type: string
 *                 description: JSON string containing person data fields
 *                 example: '{"firstName":"qwe","middleInitial":"BT","lastName":"sdfdsf","email":"test.133@abcbank.com","phone":"(874) 563-2100","workPhone":"123-456-7899","email2":"john.doe@altmail.com","linkedinUrl":"https://linkedin.com/in/john","webUrl":"https://johndoe.com","suiteNo":"ABC","address":[{"address1":null,"address2":null,"city":"Fresno","state":"CA","zip":null,"country":"United States","longitude":"-119.7871247","latitude":"36.7377981","fullAddress":"NewYork, CS","suiteNo":""}]}'
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file to upload
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request – missing or invalid fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


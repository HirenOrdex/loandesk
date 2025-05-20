import express from "express";
import { getProfileById, updateProfileById } from "../controllers/profileController";
import multer from 'multer';

const router = express.Router();

const upload = multer();

router.get("/profile/:id", getProfileById);
router.patch("/profile/:id", upload.single("profileImage"), updateProfileById);

export default router;



/**
 * @swagger
 * /user/profile/{id}:
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
 * /user/profile/{id}:
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


import express from 'express'
import { loginUser, registerUser, validateLoginUser, validateRegisterUser } from '../controller/userController.js'

const router = express.Router()

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The user's name
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 minLength: 5
 *               mobileNumber:
 *                 type: string
 *                 description: The user's mobile number
 *             required:
 *               - userName
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 users:
 *                   type: object
 *                   description: The registered user object
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.post("/register",validateRegisterUser,registerUser)


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 users:
 *                   type: object
 *                   description: The logged-in user object
 *                 accessToken:
 *                   type: string
 *                   description: Access token for authentication
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token for authentication
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */



router.post("/login", validateLoginUser,loginUser)

export default router
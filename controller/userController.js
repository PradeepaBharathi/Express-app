import { check, validationResult } from "express-validator";
import { db } from "../dbConnection.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const usersDetails = db.usersDetails;

export const validateRegisterUser = [
    check("userName").notEmpty().withMessage("Username is required"),
    check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid Email"),
    check("password").notEmpty().withMessage("Password is required").isLength({ min: 5 }).withMessage("Password should contain at least 5 characters"),
    check("mobileNumber").notEmpty().withMessage("Mobile Number is required").isLength({ min: 10 }).withMessage("Enter a valid Mobile Number")
];

export const validateLoginUser = [
   
    check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid Email"),
    check("password").notEmpty().withMessage("Password is required").isLength({ min: 5 }).withMessage("Password should contain at least 5 characters"),
    
];
export const registerUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).send({ error: errors.array() });
    }

    try {
        const existingUser = await usersDetails.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let data = {
            userName: req.body.userName, 
            email: req.body.email,
            password: hashedPassword,
            mobileNumber: req.body.mobileNumber,
        };
        
        const user = await usersDetails.create(data);
        return res.status(200).json({ message: "User registered", users: user });
    } catch (error) {
        console.log("Error in registerUser:", error.message);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).send({ error: errors.array() });
    }

    try {
        const { email, password } = req.body;

        const user = await usersDetails.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const accessToken = jwt.sign({ userId: user.id, email: user.email }, process.env.ACCESS_SECRET_KEY, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ userId: user.id, email: user.email }, process.env.REFRESH_SECRET_KEY, { expiresIn: '1hr' });

        res.cookie("accessToken", accessToken, { maxAge: 30*60*1000, httpOnly: true });
        res.cookie("refreshToken", refreshToken, { maxAge: 60*60*1000, httpOnly: true });
       
        return res.status(200).json({ message: "User logged in", users: user, accessToken, refreshToken });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
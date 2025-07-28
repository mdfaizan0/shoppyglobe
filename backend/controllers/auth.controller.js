import User from "../models/User.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export async function registerUser(req, res) {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" })
    }

    try {
        const userExists = await User.findOne({ email })
        if (userExists) return res.status(409).json({ message: "User is already registered, please login instead." })
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)
        // Create new user in DB
        const user = await User.create({
            name: name,
            password: hashedPassword,
            email: email
        })
        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET)
        // Send response with token and user info
        res.status(201).json({
            message: `User ${user.name} registered successfully.`,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error while registering the user.", error: error.message })
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body

    try {
        let user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(404).json({ message: "Unable to find the user, please check your credentials or consider signing up instead." })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Unable to verify the user, please check your password." })
        }

        const userObj = user.toObject()
        delete userObj.password

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET)
        return res.status(200).json({ isMatch: isMatch, message: "User authorized", token: token, user: userObj })
    } catch (error) {
        return res.status(500).json({ message: "Server error while logging in.", error: error.message })
    }
}
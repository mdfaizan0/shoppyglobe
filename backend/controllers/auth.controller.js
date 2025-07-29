// importing dependencies
import User from "../models/User.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

// configuring dotenv to import its contents
dotenv.config()

// controller func for handling registration of a new user
export async function registerUser(req, res) {
    // destructuring data from body
    const { name, email, password } = req.body

    // validating again (after frontend) if received all the values
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" })
    }

    try {
        // checking if any user exist with the received email address
        const userExists = await User.findOne({ email })
        // if it does, return appropriate message
        if (userExists) return res.status(409).json({ message: "User is already registered, please login instead." })
        // if not, Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 12)
        // Create a new user in DB
        const user = await User.create({
            name: name,
            password: hashedPassword,
            email: email
        })
        // Generate JWT with a day of expiry
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" })
        // Send response with message, token and user info without password
        res.status(201).json({
            message: `User ${user.name} registered successfully.`,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
        // if any error, send the same with appropriate message
    } catch (error) {
        return res.status(500).json({ message: "Server error while registering the user.", error: error.message })
    }
}

// controller func to handle logging in of an exisiting user
export async function loginUser(req, res) {
    const { email, password } = req.body

    try {
        // find user from DB, including their password
        let user = await User.findOne({ email }).select("+password")
        // if user not found, return app. message
        if (!user) {
            return res.status(404).json({ message: "Unable to find the user, please check your credentials or consider signing up instead." })
        }
        // if found, compare password received with the hashed stored password
        const isMatch = await bcrypt.compare(password, user.password)
        // if password didn't match, return app. message
        if (!isMatch) {
            return res.status(401).json({ message: "Unable to verify the user, please check your password." })
        }

        // making user response to object and removing hashed password
        const userObj = user.toObject()
        delete userObj.password

        // Generate JWT with a day of expiry
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" })
        // return status, message, token and user details without password
        return res.status(200).json({ isMatch: isMatch, message: "User authorized", token: token, user: userObj })
        // if any error, send the same with appropriate message
    } catch (error) {
        return res.status(500).json({ message: "Server error while logging in.", error: error.message })
    }
}
import jwt from "jsonwebtoken"
import User from "../models/User.model.js"
import dotenv from "dotenv"

dotenv.config()

// middleware to handle JWT authentication and protect routes like cart, user profile, order
export async function protect(req, res, next) {
    // getting the authorization header from request
    const authHeader = req.headers.authorization
    // if not found, return the same info with app. message
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" })
    }
    // if found, get the token out of the header
    const token = authHeader.split(" ")[1]
    try {
        // decode the JWT token and get the id and email out
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // find the user with id without getting their password
        const user = await User.findById(decoded.id).select("-password")
        // if not found, return the same with app. message
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        // attaching user details to req.user
        req.user = user
        // passing over to next middleware or operation
        next()
        // if any error, send the same with appropriate message
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token", error: error.message })
    }
}
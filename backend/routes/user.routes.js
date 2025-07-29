import { protect } from "../middleware/auth.middleware.js"


// func to handle route injection with middleware and controller to return user data
export function userRoutes(app) {
    app.get("/api/auth/profile", protect, (req, res) => {
        return res.status(200).json({message: "User authorized", user: req.user})
    })
}
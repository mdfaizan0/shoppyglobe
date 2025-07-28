import { protect } from "../middleware/auth.middleware.js"


export function userRoutes(app) {
    app.get("/api/auth/profile", protect, (req, res) => {
        return res.status(200).json({message: "User authorized", user: req.user})
    })
}
import { loginUser, registerUser } from "../controllers/auth.controller.js"

// handling func-based route injection with specified routes and their controller functions
export function authRoutes(app) {
    app.post("/api/auth/register", registerUser)
    app.post("/api/auth/login", loginUser)
}
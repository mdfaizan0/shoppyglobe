import { loginUser, registerUser } from "../controllers/auth.controller.js"


export function authRoutes(app) {
    app.post("/api/auth/register", registerUser)
    app.post("/api/auth/login", loginUser)
}
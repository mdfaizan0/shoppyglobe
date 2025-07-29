import { createOrder, latestOrder, orderHistory } from "../controllers/order.controller.js"
import { protect } from "../middleware/auth.middleware.js"


// handling func-based route injection with specified routes, middleware and their controller functions
export function orderRoutes(app) {
    app.post("/api/order", protect, createOrder)
    app.get("/api/order/latest", protect, latestOrder)
    app.get("/api/order/history", protect, orderHistory)
}
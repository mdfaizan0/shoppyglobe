import { protect } from "../middleware/auth.middleware.js"
import { addToCart, clearCart, getAllCartItems, removeCartItem, updateCartItem } from "../controllers/cart.controller.js"

// handling func-based route injection with specified routes, middleware and their controller functions
export function cartRoutes(app) {
    app.post("/api/cart", protect, addToCart)
    app.get("/api/cart", protect, getAllCartItems)
    app.put("/api/cart/:id", protect, updateCartItem)
    app.delete("/api/cart/:id", protect, removeCartItem)
    app.delete("/api/cartclear", protect, clearCart)
}
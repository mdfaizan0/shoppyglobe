import { getAllProducts, getProductbyId } from "../controllers/product.controller.js"


// handling func-based route injection with specified routes and their controller functions
export function productRoutes(app) {
    app.get("/api/products", getAllProducts)
    app.get("/api/products/:id", getProductbyId)
}
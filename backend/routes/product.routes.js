import { getAllProducts, getProductbyId } from "../controllers/product.controller.js"


export function productRoutes(app) {
    app.get("/api/products", getAllProducts)
    app.get("/api/product/:id", getProductbyId)
}
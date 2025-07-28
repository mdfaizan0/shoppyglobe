import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"
import { authRoutes } from "./routes/auth.routes.js"
import { cartRoutes } from "./routes/cart.routes.js"
import { orderRoutes } from "./routes/order.routes.js"
import { productRoutes } from "./routes/product.routes.js"
import { userRoutes } from "./routes/user.routes.js"

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true
}))

app.use(express.json())

app.get("/", (req, res) => {
    res.send("ShoppyGlobe backend is live!")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
})

productRoutes(app)
authRoutes(app)
userRoutes(app)
cartRoutes(app)
orderRoutes(app)
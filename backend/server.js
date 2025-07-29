// importing relevant utilities and dependencies
import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"
import { authRoutes } from "./routes/auth.routes.js"
import { cartRoutes } from "./routes/cart.routes.js"
import { orderRoutes } from "./routes/order.routes.js"
import { productRoutes } from "./routes/product.routes.js"
import { userRoutes } from "./routes/user.routes.js"

// configuring dotenv and calling connectDB to configure DB
dotenv.config()
connectDB()

// assigning express
const app = express()

// using CORS app-wide middleware to handle smooth transaction with backend and frontend with specified frontend origin, declared in .env
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true
}))

// applying Application-wide express' json parser middleware to interact with frontend seamlessly
app.use(express.json())

// adding basic route on "/" for testing
app.get("/", (req, res) => {
    res.send("ShoppyGlobe backend is live!")
})

// listing to PORT declared in .env or 5000
const PORT = process.env.PORT || 5000;

// making express listen to PORT with logging for confirmation
app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
})

// calling routing functions with app
productRoutes(app)
authRoutes(app)
userRoutes(app)
cartRoutes(app)
orderRoutes(app)
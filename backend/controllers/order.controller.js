import Cart from "../models/Cart.model.js";
import Order from "../models/Order.model.js";

// func to handle to create new order
export async function createOrder(req, res) {
    // get userId from req.user, attached by protect middleware
    // getting the orderNo, provided by frontend
    const userId = req.user._id
    const { orderNo } = req.body
    try {
        // find the cart items of that user, response turned to raw object
        const cartItems = await Cart.find({ userId }).lean()
        // sanitize each cart items to remove userId from each of them, to not hold the same info
        const newOrderItems = cartItems.map(item => {
            const newItem = { ...item }
            delete newItem.userId
            return newItem
        })
        // creating a new order with userId as one of the key-value, createdAt and new order object, also, returning app message
        await Order.create({
            userId, orderNo, createdAt: Date.now(), orderItems: newOrderItems
        })
        return res.status(200).json({ message: "Order confirmed" })
        // if any error, send the same with appropriate message
    } catch (error) {
        return res.status(500).json({ message: "Error while creating order", error: error.message })
    }
}

// func to get latest order
export async function latestOrder(req, res) {
    // get userId from req.user, attached by protect middleware
    const userId = req.user._id
    try {
        // find orders of the user based on their userId and returning latest order with app. message
        const orders = await Order.find({ userId }).sort({ createdAt: -1 })
        return res.status(200).json({ message: "Latest order fetched", latestItem: orders[0] })
        // if any error, send the same with appropriate message
    } catch (error) {
        return res.status(500).json({ message: "Error while fetching latest order", error: error.message })
    }
}

// func to get the order list, sorted by time of creation
export async function orderHistory(req, res) {
    // get userId from req.user, attached by protect middleware
    const userId = req.user._id
    try {
        // find all orders of the user based on the their userId and returning all of them with app. message
        const orders = await Order.find({ userId }).sort({ createdAt: -1 })
        return res.status(200).json({ message: "Order history fetched", orderHistory: orders })
        // if any error, send the same with appropriate message
    } catch (error) {
        return res.status(500).json({ message: "Error while fetching order history", error: error.message })
    }
}
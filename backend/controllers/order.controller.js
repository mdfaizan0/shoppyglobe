import Cart from "../models/Cart.model.js";
import Order from "../models/Order.model.js";

export async function createOrder(req, res) {
    const userId = req.user._id
    const { orderNo } = req.body
    try {
        const cartItems = await Cart.find({ userId }).lean()
        const newOrderItems = cartItems.map(item => {
            const newItem = { ...item }
            delete newItem.userId
            return newItem
        })
        await Order.create({
            userId, orderNo, createdAt: Date.now(), orderItems: newOrderItems
        })
        return res.status(200).json({ message: "Order confirmed" })
    } catch (error) {
        return res.status(500).json({ message: "Error while creating order", error: error.message })
    }
}

export async function latestOrder(req, res) {
    const userId = req.user._id
    try {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 })
        return res.status(200).json({ message: "Latest order fetched", latestItem: orders[0] })
    } catch (error) {
        return res.status(500).json({ message: "Error while fetching latest order", error: error.message })
    }
}

export async function orderHistory(req, res) {
    const userId = req.user._id
    try {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 })
        return res.status(200).json({ message: "Order history fetched", orderHistory: orders })
    } catch (error) {
        return res.status(500).json({ message: "Error while fetching order history", error: error.message })
    }
}
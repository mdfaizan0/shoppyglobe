import Cart from "../models/Cart.model.js"

// controller func to handle add to cart action
export async function addToCart(req, res) {
    // destructure received info from req.body
    const { productId, title, price, thumbnail, quantity } = req.body

    // validate if received all of them, if not, send app. message
    if (!productId || !title || !price || !thumbnail || !quantity) {
        return res.status(400).json({ message: "Missing required cart fields" })
    }

    // get userId from req.user, attached by protect middleware
    const userId = req.user._id
    try {
        // if item exists, update the quantity (fallback)
        const existingItem = await Cart.findOne({ productId, userId })
        if (existingItem) {
            if (Number(quantity) === 0) {
                await Cart.deleteOne({ _id: existingItem._id })
                return res.status(200).json({ message: "Item removed from cart" })
            } else {
                existingItem.quantity += Number(quantity)
                await existingItem.save()
                return res.status(200).json({ message: "Item quantity updated", updatedItem: existingItem })
            }
            // else check if incoming quantity is 0, if yes, return the message else create the cart item
        } else {
            if (Number(quantity) === 0) {
                return res.status(400).json({ message: "Cannot add item with quantity 0" })
            } else {
                const newItem = await Cart.create({ productId, title, price, thumbnail, quantity: Number(quantity), userId })
                return res.status(201).json({ message: "New item added to cart", newItem })
            }
        }
        // if any error, send the same with appropriate message
    } catch (error) {
        return res.status(500).json({ message: "Server error while adding item to cart.", error: error.message })
    }
}

// controller func to get all cart items
export async function getAllCartItems(req, res) {
    // get userId from req.user, attached by protect middleware
    const userId = req.user._id
    try {
        const cartItems = await Cart.find({ userId })
        res.json({
            cartLength: cartItems.length,
            cartItems
        })
        // if any error, send the same with appropriate message
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch cart items", error: error.message });
    }
}

// func to get update quantity of an cart item
export async function updateCartItem(req, res) {
    // getting cartitemid from params
    // get userId from req.user, attached by protect middleware
    // getting action to either increase or decrease the quantity
    const cartItemId = req.params.id
    const userId = req.user._id
    const { action } = req.body
    try {
        const cartItem = await Cart.findOne({ _id: cartItemId, userId })
        if (!cartItem) {
            return res.status(404).json({ message: "Cart Item not found" })
        }
        if (action === "increase") {
            cartItem.quantity += 1
            await cartItem.save()
            return res.status(200).json({ message: "Quantity increased", cartItem })
        } else if (action === "decrease") {
            if (cartItem.quantity === 1) {
                await cartItem.deleteOne()
                return res.status(200).json({ message: "Item removed from cart" })
            } else {
                cartItem.quantity -= 1
                await cartItem.save()
                return res.status(200).json({ message: "Quantity decreased", cartItem })
            }
        }
        // if any error, send the same with appropriate message
    } catch (error) {
        return res.status(500).json({ message: "Failed to update cart item", error: error.message });
    }
}

// func to remove a cart item
export async function removeCartItem(req, res) {
    // getting cartitemid from params
    // get userId from req.user, attached by protect middleware
    const cartItemId = req.params.id
    const userId = req.user._id

    try {
        // find cart item to remove
        const cartItem = await Cart.findOne({ _id: cartItemId, userId })
        // if ID didn't match, return app. message
        if (!cartItem) {
            return res.status(404).json({ message: "Cart Item not found" })
        }
        // if found, delete it and return app. message
        await cartItem.deleteOne()
        return res.status(200).json({ message: "Item removed from cart" })
        // if any error, send the same with appropriate message
    } catch (error) {
        return res.status(500).json({ message: "Failed to remove cart item", error: error.message });
    }
}

// func to clear cart
export async function clearCart(req, res) {
    // get userId from req.user, attached by protect middleware
    const userId = req.user._id

    try {
        // find all cart items based on userId, delete them and send app. message
        const clear = await Cart.deleteMany({ userId })
        return res.status(200).json({ message: `${clear.deletedCount} cart item${clear.deletedCount > 1 ? "s" : ""} removed` })
        // if any error, send the same with appropriate message
    } catch (error) {
        return res.status(500).json({ message: "Failed to clear cart items", error: error.message });
    }
}
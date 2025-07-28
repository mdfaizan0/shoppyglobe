import Cart from "../models/Cart.model.js"

export async function addToCart(req, res) {
    const { productId, title, price, thumbnail, quantity } = req.body

    if (!productId || !title || !price || !thumbnail || !quantity) {
        return res.status(400).json({ message: "Missing required cart fields" })
    }

    const userId = req.user._id
    try {
        const existingItem = await Cart.findOne({ productId, userId })
        if (existingItem) {
            if (Number(quantity) === 0) {
                await existingItem.remove()
                return res.status(200).json({ message: "Item removed from cart" })
            } else {
                existingItem.quantity += Number(quantity)
                await existingItem.save()
                return res.status(200).json({ message: "Item quantity updated", updatedItem: existingItem })
            }
        } else {
            if (Number(quantity) === 0) {
                return res.status(400).json({ message: "Cannot add item with quantity 0" })
            } else {
                const newItem = await Cart.create({ productId, title, price, thumbnail, quantity: Number(quantity), userId })
                return res.status(201).json({ message: "New item added to cart", newItem })
            }
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error while interating with cart.", error: error.message })
    }
}

export async function getAllCartItems(req, res) {
    const userId = req.user._id
    try {
        const cartItems = await Cart.find({ userId })
        res.json({
            cartLength: cartItems.length,
            cartItems
        })
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch cart items", error: error.message });
    }
}

export async function updateCartItem(req, res) {
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
    } catch (error) {
        return res.status(500).json({ message: "Failed to update cart item", error: error.message });
    }
}

export async function removeCartItem(req, res) {
    const cartItemId = req.params.id
    const userId = req.user._id

    try {
        const cartItem = await Cart.findOne({ _id: cartItemId, userId })
        if (!cartItem) {
            return res.status(404).json({ message: "Cart Item not found" })
        }
        await cartItem.deleteOne()
        return res.status(200).json({ message: "Item removed from cart" })
    } catch (error) {
        return res.status(500).json({ message: "Failed to remove cart item", error: error.message });
    }
}

export async function clearCart(req, res) {
    const userId = req.user._id

    try {
        const clear = await Cart.deleteMany({ userId })
        return res.status(200).json({ message: `${clear.deletedCount} cart items removed` })
    } catch (error) {
        return res.status(500).json({ message: "Failed to clear cart items", error: error.message });
    }
}
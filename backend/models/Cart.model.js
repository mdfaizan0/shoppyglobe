import mongoose from "mongoose"

// creating cartSchema with all the relevant properties needed
const cartSchema = mongoose.Schema({
    productId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})

// creating Cart model with cartSchema and exporting
const Cart = mongoose.model("Cart", cartSchema)

export default Cart


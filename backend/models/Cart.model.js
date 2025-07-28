import mongoose from "mongoose"

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

const Cart = mongoose.model("Cart", cartSchema)

export default Cart
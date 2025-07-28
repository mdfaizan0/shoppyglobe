import mongoose from "mongoose"

const orderChildSchema = ({
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
    }
})

const orderSchema = mongoose.Schema({
    createdAt: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderNo: {
        type: Number,
        required: true
    },
    orderItems: {
        type: Array,
        required: true,
        child: orderChildSchema
    }
})

const Order = mongoose.model("Order", orderSchema)

export default Order
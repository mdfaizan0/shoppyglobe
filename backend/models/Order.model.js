import mongoose from "mongoose"

// creating order child schema to hold main info
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

// creating orderSchema to hold meta info
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
    // adding child schema
    orderItems: {
        type: Array,
        required: true,
        child: orderChildSchema
    }
})

// creating Order model with orderSchema and exporting
const Order = mongoose.model("Order", orderSchema)

export default Order
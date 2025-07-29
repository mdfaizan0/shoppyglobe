import mongoose from "mongoose";

// creating productSchema with all the relevant properties needed
const productSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
    },
    thumbnail: {
        type: String,
        required: true
    },
    availabilityStatus: {
        type: String,
        required: true
    },
    warrantyInformation: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
})

// creating Product model with productSchema and exporting
const Product = mongoose.model("Product", productSchema)

export default Product
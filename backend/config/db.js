import mongoose from "mongoose";

/**
 * establishing connection with MongoDB using Mongoose
 * as returns promise, hence handling success and failure
 */
const connectDB = async () => {
    try {
        const connected = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${connected.connection.host}`)
    } catch (error) {
        console.log(`Error connecting DB: ${error.message}`)
    }
}

export default connectDB
import mongoose from "mongoose"

// creating userSchema with all the relevant properties needed
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // not selecting the password when fetching user data, unless used `.select("+password")`
    password: {
        type: String,
        required: true,
        select: false
    }
})

// creating User model with userSchema and exporting
const User = mongoose.model("User", userSchema)

export default User
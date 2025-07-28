import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice.js"
import searchReducer from "./searchSlice.js"
import userReducer from "./userSlice.js"

// configuring redux store
const appStore = configureStore({
    reducer: {
        cart: cartReducer,
        search: searchReducer,
        user: userReducer
    }
})

export default appStore
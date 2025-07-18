import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice.js"
import searchReducer from "./searchSlice.js"

// configuring redux store
const appStore = configureStore({
    reducer: {
        cart: cartReducer,
        search: searchReducer
    }
})

export default appStore
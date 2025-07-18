import { createSlice } from "@reduxjs/toolkit";

// creating cart slice with reducers:
// addItem - to add an item from items
// removeItem - to remove an item from items
// clearCart - to clear the cart
// increaseQuantity -  to increase the number of items purchasing
// decreaseQuantity -  to decrease the number of items purchasing
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: []
    },
    reducers: {
        addItem: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id)
            if (existingItem) {
                existingItem.quantity += 1
            } else {
                state.items.push({ ...action.payload, quantity: 1 })
            }
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.items.length = 0
        },
        increaseQuantity: (state, action) => {
            const item = state.items.find(item => item.id === action.payload)
            if (item) item.quantity += 1
        },
        decreaseQuantity: (state, action) => {
            const item = state.items.find(item => item.id === action.payload)
            if (item.quantity > 1) {
                item.quantity -= 1
            } else {
                state.items = state.items.filter(item => item.id !== action.payload)
            }
        }
    }
})

// creating and exporting actions
export const { addItem, removeItem, clearCart, increaseQuantity, decreaseQuantity } = cartSlice.actions

export default cartSlice.reducer
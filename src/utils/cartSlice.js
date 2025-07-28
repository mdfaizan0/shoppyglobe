import { createSlice } from "@reduxjs/toolkit";

// creating cart slice with reducers:
// addItem - to add an item from items
// removeItem - to remove an item from items
// clearCart - to clear the cart
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: []
    },
    reducers: {
        addItem: (state, action) => {
            const incomingItem = action.payload
            const existingItem = state.items.find(item => item._id === incomingItem._id)
            if (existingItem) {
                existingItem.quantity = incomingItem.quantity
            } else {
                state.items.push(incomingItem)
            }
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload);
        },
        clearCart: (state) => {
            state.items.length = 0
        },
        setCart: (state, action) => {
            state.items = action.payload
        },
        updateSingleItem: (state, action) => {
            const updatedItem = action.payload
            if (!updatedItem) return
            const index = state.items.findIndex(item => item._id === updatedItem._id)
            if (index !== -1) {
                state.items[index] = updatedItem
            }
        }
    }
})

// creating and exporting actions
export const { addItem, removeItem, clearCart, setCart, updateSingleItem } = cartSlice.actions

export default cartSlice.reducer
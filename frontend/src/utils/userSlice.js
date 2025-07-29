import { createSlice } from "@reduxjs/toolkit";

// creating user slice with reducers:
// setToken - to set token received from backend
// setUser - to set user details that can be accessed throughout the app
// logout - to setting token and user state as back to null and remove the token from localstorage
const userSlice = createSlice({
    name: "user",
    initialState: {
        token: localStorage.getItem("token") || null,
        user: null
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
            localStorage.setItem("token", action.payload)
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        logout: (state) => {
            state.token = null
            state.user = null
            localStorage.removeItem("token")
        }
    }
})

// creating and exporting actions
export const { setToken, setUser, logout } = userSlice.actions

export default userSlice.reducer
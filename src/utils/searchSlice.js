import { createSlice } from "@reduxjs/toolkit";

// configuring searchSlice for global search and setQuery reducer to set query
const searchSlice = createSlice({
    name: "search",
    initialState: {
        query: "",
    },
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload
        }
    }
})

// creating and exporting setQuery action
export const { setQuery } = searchSlice.actions

export default searchSlice.reducer
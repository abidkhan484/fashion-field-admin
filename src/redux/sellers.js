import { createSlice } from "@reduxjs/toolkit";

export const sellersSlice = createSlice({
    name: "sellers",
    initialState: {
        sellers: []
    },
    reducers: {
        setSellers: (state, action) => {
            state.sellers = action.payload
        }
    }
});

export const { setSellers } = sellersSlice.actions
export default sellersSlice.reducer
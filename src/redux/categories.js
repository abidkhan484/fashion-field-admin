import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        auth: false,
        token: '',
        user: {}
    },
    reducers: {
        getToken: (state) => {
            state.token = localStorage.getItem('token');
        },

        setUser: (state, action) => {
            state.user = action.payload
        },

        setAuth: (state, action) => {
            state.auth = action.payload
        }
    }
})

// export const { setUser, setAuth } = createSlice.actions;

export default createSlice.reducer;
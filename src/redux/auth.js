import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
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

export const { getToken, setUser, setAuth } = authSlice.actions;

export default authSlice.reducer;
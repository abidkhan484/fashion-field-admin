import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth'
import sellersReducer from './sellers'
import supplierReducer from "./supplier"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        sellers: sellersReducer,
        suppliers: supplierReducer,
    },
});
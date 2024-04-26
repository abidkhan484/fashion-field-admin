import { createSlice } from "@reduxjs/toolkit";

export const supplierSlice = createSlice({
    name: "supplier",
    initialState: {
        supplier: []
    },
    reducers: {
        setSupplier: (state, action) => {
            state.supplier = action.payload
        }
    }
})

export const { setSupplier } = supplierSlice.actions
export default supplierSlice.reducer
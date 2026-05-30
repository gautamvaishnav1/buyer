import { createSlice } from "@reduxjs/toolkit";
import supplierData from '../../core/storage/SupplierProfile.json'

const initialState={
    supplier:supplierData
}
const supplierSlice =createSlice({
    name:"supplier",
    initialState,
    reducers:{

    }
})


export default supplierSlice.reducer;
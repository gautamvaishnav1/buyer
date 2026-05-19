import { createSlice } from "@reduxjs/toolkit";

import DummyProduct from '../../../core/storage/DummyProduct_10.json'
const initialState={
    products:DummyProduct
}
const productSlice=createSlice({
        name:'products',
        initialState,
        reducers:{
            addProducts:(state,action)=>{
                state.products.push(action.payload)
            },
            deleteProducts:(state,action)=>{
                state.products=state.products.filter((product)=>product.id!==action.payload)
            },
            updateProduct:(state,action)=>{
                const index=state.products.findIndex((product)=>product.id===action.payload.id)

                if(index!==-1){
                    state.products[index]=action.payload
                }
            }
        }
})

export const {updateProduct,addProducts,deleteProducts}=productSlice.actions
export default productSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import paymentData from '../../core/storage/DummyPayments.json' 
interface PaymentState{
    payments:any[];
    search:string;
}
const initialState:PaymentState ={
    payments:paymentData,
    search:''
}
const paymentSlice=createSlice({
    name:'payment',
    initialState,
    reducers:{
            setSearch:(state,action)=>{
            state.search=action.payload
        },

    }
})

export const {setSearch}=paymentSlice.actions
export default paymentSlice.reducer;
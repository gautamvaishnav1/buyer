import { createSlice } from "@reduxjs/toolkit";
import orderData from '../../core/storage/DummyOrders.json';
interface OrderState{
    orders:any[];
    search:string;
}
const initialState:OrderState={
    orders:orderData,
    search:''
}
const orderSlice=createSlice({
    name:'order',
    initialState,
    reducers:{
            addOrder:(state,action)=>{
                state.orders.push(action.payload)
            },
            completeOrder:(state,action)=>{
                state.orders=state.orders.map((order)=>order.id===action.payload.id? {...order,status:action.payload.status}:order)

            },
            deleteOrder:(state,action)=>{
                state.orders=state.orders.filter((order)=>order.id!==action.payload.id)
            },

    }
})

export const {addOrder,completeOrder,deleteOrder}=orderSlice.actions
export default orderSlice.reducer
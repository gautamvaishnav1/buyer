import { createSlice } from "@reduxjs/toolkit";
import rfqData from '../../core/storage/DummyRFQs.json'


const initialState={
    Rfq :rfqData
}
const rfqSlice=createSlice({


    name:'Rfq',
    initialState,
    reducers:{
            // readRfq:(state,action)=>{
            //         state.Rfq=action.payload
            // }
    }
})



export default rfqSlice.reducer
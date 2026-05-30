import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import rfqData from '../../core/storage/DummyRFQs.json'

interface RFQState{
    rfq:any[];
    search:string;
}
const initialState:RFQState={
    rfq :rfqData,
    search:''
}
const rfqSlice=createSlice({


    name:'Rfq',
    initialState,
    reducers:{
           setSearch:(state,action:PayloadAction<string>)=>{
            state.search=action.payload
        },

    }
})


export const {setSearch}=rfqSlice.actions
export default rfqSlice.reducer
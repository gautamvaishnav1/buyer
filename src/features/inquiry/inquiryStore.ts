import { createSlice } from "@reduxjs/toolkit";
import  inquiryData from '../../core/storage/DummyInquiries.json';

interface InquiryState{
    inquiries:any[];
    search:string;
}



const initialState:InquiryState={
    inquiries:inquiryData,
    search:''
}
const inquirySlice=createSlice({
    name:'inquiry',
    initialState:initialState,
    reducers:{
        setSearch:(state,action)=>{
            state.search=action.payload
        },
        addInquiries:(state,action)=>{
            state.inquiries.push(action.payload)
        },
        getInquiryById:(state,action)=>{
            state.inquiries=state.inquiries.filter((inquiry)=>inquiry.id===action.payload.id)
        },
        updateInquiry:(state,action)=>{
            const index=state.inquiries.findIndex((inquiry)=>inquiry.id===action.payload.id)
            if(index!== -1){
                state.inquiries[index]=action.payload
            }
        },
        deleteInquiry:(state,action)=>{
            state.inquiries=state.inquiries.filter((inquiry)=>inquiry.id!==action.payload.id)
        },
        updateInquiryStatus:(state,action)=>{
            state.inquiries=state.inquiries.map((inquiry)=>inquiry.id===action.payload.id? {...inquiry,status:action.payload.status}:inquiry)
        }
    }
})

export const {setSearch,addInquiries,getInquiryById,updateInquiry,deleteInquiry,updateInquiryStatus}=inquirySlice.actions
export default inquirySlice
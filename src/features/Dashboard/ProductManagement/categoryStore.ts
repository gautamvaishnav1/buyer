import { createSlice } from '@reduxjs/toolkit'
import productByCategory from '../../../core/storage/ProductByCategory.json'



const initialState={
    categories:productByCategory
}

const categorySlice=createSlice({
    
   name:'categories',
    initialState,

    reducers:{

    }
    }
)
export default categorySlice.reducer;
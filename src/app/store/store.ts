    import {configureStore} from '@reduxjs/toolkit'
import productReducer from '../../features/Dashboard/ProductManagement/productStore'
import categoryReducer from '../../features/Dashboard/ProductManagement/categoryStore'
import inquiryReducer from '../../features/inquiry/inquiryStore'
    const store=configureStore({
        reducer:{
            products: productReducer,
            category:categoryReducer,
            inquiries:inquiryReducer
        }
    }) 



    export default store;
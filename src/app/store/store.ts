    import {configureStore} from '@reduxjs/toolkit'
import productReducer from '../../features/Dashboard/ProductManagement/productStore'
import categoryReducer from '../../features/Dashboard/ProductManagement/categoryStore'

    const store=configureStore({
        reducer:{
            products: productReducer,
            category:categoryReducer
        }
    }) 



    export default store;
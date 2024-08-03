import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./authSlice"
import socketSlice from "./socketSlice"

const store = configureStore({
    reducer:{
        auth:authSlice,
        socket:socketSlice
    }
})

export default store
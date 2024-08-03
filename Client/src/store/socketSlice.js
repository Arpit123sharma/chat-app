import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    connected:false,
    socket:null
}

const socketSlice = createSlice({
    name:"socket",
    initialState,
    reducers:{
       connectSocket:(state,action)=>{
         state.connected = true
         state.socket = action.payload.socket
       } ,
       disconnectSocket:(state,action)=>{
         state.connected = false
         state.socket = null
       }
    }
})

export const {connectSocket , disconnectSocket} = socketSlice.actions
export default socketSlice.reducer
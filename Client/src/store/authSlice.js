// making a  auth slice for store

import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    status:false,
    userData:null
}

const authSlice = createSlice({
   name:"auth",
   initialState,
   reducers:{
     login:(state,action)=>{
         state.status = true
         state.userData = action.payload.userData
         //console.log("data set successfully",state.userData);
     },
     logout:(state,payload)=>{
        state.status = false
        state.userData = null
     }
   }
})

export const {login,logout} = authSlice.actions
export default authSlice.reducer
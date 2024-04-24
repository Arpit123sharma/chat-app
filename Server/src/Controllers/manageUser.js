import {ApiError} from "../utils/error.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../Models/user.model.js"

const updateUser = async(req,res)=>{
    try {
       const {userName="",email="",profile=""} = req.body 
       const {_id} = req?.user
       if ([userName,email,profile].forEach((val)=>(val?.trim()===""))) {
         throw new ApiError(400,"atleast one field is required !!")
       }
       const itemsToUpdate = {}
       const obj = {userName,email,profile}
       for(let key in obj){
           if(obj[key].trim()){
              itemsToUpdate = {...itemsToUpdate,key : obj[key]}
           }
       };
       const user = await User.findByIdAndUpdate(_id,itemsToUpdate,{
         new:true
       })

       if (!user) {
         throw new ApiError(500,"user cant be updated")
       }

       return res.status(200)
       .json(
        new ApiResponse("user updated successfully",user,200)
       )
    
    } catch (error) {
        console.error("error encountered while updating user information :: ",error);
    }
}

const changePassword = async(req,res)=>{
  
}

const logoutUser = async(req,res)=>{}

const deleteAccount = async(req,res)=>{}



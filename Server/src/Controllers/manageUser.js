import {ApiError} from "../utils/error.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../Models/user.model.js"
import { emailService } from "../utils/smsService.js"

const updateUser = async(req,res)=>{
    try {
       const {userName="",email="",profile=""} = req.body 
       const {_id} = req?.user
       if ([userName,email,profile].forEach((val)=>(val?.trim()===""))) {
        return res.status(400).json( new ApiError(400,"atleast one field is required !!"));
         
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
        return res.status(500).json( new ApiError(500,"user cant be updated"));
         
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
    try {
      const user = req?.user
      
      if (!user) {
        return res.status(401).json( new ApiError(401,"unAuthorised access !!"));
      }

      const {newPassword} = req.body
      if (!newPassword) {
        return res.status(400).json( new ApiError(400,"password is required"));
      }

      const userFromDB = await User.findById(user._id)
      if (!userFromDB) {
        return res.status(500).json( new ApiError(500,"user can't be fetched"));
      }

      if (userFromDB.isPasswordCorrect(newPassword)) {
        return res.status(400).json( new ApiError(400,"old password is same as new passowrd"));
      }

      userFromDB.password = newPassword
      await userFromDB.save()

      emailService.sendOtp(userFromDB?.email,true,"password changed successFully")

      return res.status(200)
      .json(
        new ApiResponse("user password changed successFully !!",{},200)
      )
    } catch (error) {
       console.error("error occured :: while changing the password :: ",error);
    }
}

const logoutUser = async(req,res)=>{
   const user = req?.user
   if (!user) {
    return res.status(401).json( new ApiError(401,"unAuthorised access !!"));
   }
   const options ={
     httpOnly:true,
     secure:true
   }
   return res.status(200)
   .clearCookie("accessToken")
   .clearCookie("refreshToken")
   .json(
    new ApiResponse("user logged out successFully !!",{},200)
   )
}

const deleteAccount = async(req,res)=>{
  
  const user = req?.user
   if (!user) {
    return res.status(401).json( new ApiError(401,"unAuthorised access !!"));
   }
   
   const deletedAccount = await User.findByIdAndDelete(user?._id)
   if (!deleteAccount) {
    return res.status(401).json( new ApiError(401,"account can't be deleted due to some problem in server try after sometime !!"));
   }

   return res.status(200)
   .json(
    new ApiResponse("user deletedSuccessfully",deletedAccount,200)
   )
}

export {
  changePassword,
  deleteAccount,
  logoutUser,
  updateUser
}



import {ApiError} from "../utils/error.js"
import  {User}  from "../Models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { emailService } from "../utils/smsService.js"
const registerUser = async(req,res)=>{
    try {
       const{userName,password,phone,email} =  req.body
       if ([userName,password,phone,email].forEach((value)=>(value?.trim() === ""))
      ) {
         throw new ApiError(400,"every field is required!!")
       }
       const userAlreadyExists = await User.findOne({
         $or : [{email},{phone}]
       })

       if (userAlreadyExists) {
         throw new ApiError(400,"user with the same phone or email already exists")
       }
      //  console.log(req.file);
       const profilePicturePath = req.file?.path
       
       if (!profilePicturePath) {
         throw new ApiError(400,"did'nt find the file !!!")
       }

       const isImageUploaded = await uploadOnCloudinary(profilePicturePath)

       if (!isImageUploaded) {
          throw new ApiError(500,"image not uploaded")
       }
       
       const createdUser = await User.create({
         userName,
         email,
         phone,
         dp: isImageUploaded?.url,
         password
       })
       
       //console.log(createdUser);

       if(!createdUser){
         throw new ApiError(500,"oops! something went wrong while creating user")
       }

       const userData = await User.findById(createdUser._id).select(" -password ")

       if(!userData){
        throw new ApiError(500,"oops! something went wrong while fetching user data newlycreated user")
      }  
      
       emailService.sendOtp(userData?.email,true)
       
      return res.status(200).json(
        new ApiResponse("user created successfully !!!",userData,200)
      )

    } catch (error) {
       throw error 
    }
}

export {registerUser}
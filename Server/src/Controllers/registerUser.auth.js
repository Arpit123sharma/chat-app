import{User}  from "../Models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { emailService } from "../utils/smsService.js"
import { ApiError } from "../utils/error.js"

const maleAvatar = ["https://res.cloudinary.com/deuq8e88u/image/upload/v1724139559/4333609_wairyo.png","https://res.cloudinary.com/deuq8e88u/image/upload/v1724139558/924915_s9g6ei.png","https://res.cloudinary.com/deuq8e88u/image/upload/v1724139558/4140037_sogwvz.png","https://res.cloudinary.com/deuq8e88u/image/upload/v1724139558/4140037_sogwvz.png"]
const femaleAvatar = ["https://res.cloudinary.com/deuq8e88u/image/upload/v1724139628/706830_pmkglf.png","https://res.cloudinary.com/deuq8e88u/image/upload/v1724139629/4322991_abrfx5.png","https://res.cloudinary.com/deuq8e88u/image/upload/v1724139629/11498793_smdaul.png"]
const registerUser = async(req,res)=>{
    try {
       const{userName,password,phone,email,gender} =  req.body
       if ([userName,password,phone,email,gender].forEach((value)=>(value?.trim() === ""))
      ) {
         return res.status(400)
         .json(new ApiError(400,"every feild is required !!"))
       }
       const userNameAlreadyExists = await User.findOne({userName:userName})

       if (userNameAlreadyExists) {
        return res.status(400).json( new ApiError(400,"user name already exists try with another user name "));
       }

       const userAlreadyExists = await User.findOne({
         $or : [{email},{phone}]
       })

       if (userAlreadyExists) {
        return res.status(400).json( new ApiError(400,"user with the same email or phone already exists"));
       }
      
       let dp = null;

       if (gender === "Male") {
        dp = maleAvatar[Math.floor(Math.random()*maleAvatar.length)]
       } else {
        dp = femaleAvatar[Math.floor(Math.random()*femaleAvatar.length)]
       }
       
       const createdUser = await User.create({
         userName,
         email,
         phone,
         password,
         gender,
         dp
       })
       
       //console.log(createdUser);

       if(!createdUser){
        return res.status(500).json( new ApiError(500,"oops!! something went wrong while creating user"));
       }

       const userData = await User.findById(createdUser._id).select(" -password ")

       if(!userData){
        return res.status(500).json( new ApiError(500,"oops! something went wrong  fetching user data newlycreated user"));
        
      }  
      
       emailService.sendOtp(userData?.email,true)
       
      return res.status(200).json(
        new ApiResponse("user created successfully !!!",userData,200)
      )

    } catch (error) {
       console.error("error while registering user in registerUser controller :: ",error); 
    }
}

export {registerUser}
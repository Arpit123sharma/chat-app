import {ApiError} from "../utils/error.js"
import  {User}  from "../Models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {emailService} from "../utils/smsService.js"
import jwt from "jsonwebtoken"
const loginInUser = async(req,res)=>{
    try {
        const {email , phone , password} = req.body
        
        if ((!email && !phone) || !password) {
            throw new ApiError(400,"email or phone  and passowrd is required!!")
        }
        
        const user = await User.findOne({
            $or : [{email},{phone}]
        })
        
        //console.log(user);
        if (!user) {
            throw new ApiError(400,"user with this email or phone number does not exits!!")
        }
        
        const passwordCheck = await user.isPasswordCorrect(password)
        //console.log(passwordCheck);
        if (! passwordCheck) {
            throw new ApiError(400,"password did'nt match !! incorrect password")
        }
        
        const sessionID = await user.generateTokens("300s")

        if (!sessionID) {
            throw new ApiError(500,"unable to generate the sessionId")
        }

        
        const otp = await emailService.sendOtp(user.email);

        if (!otp) {
            throw new ApiError(500,"did'nt find the otp")
        }
        return res.status(200)
        
        .cookie("sessionID",sessionID,{
            httpOnly:true,
            secure:true
        })
        .json(
            new ApiResponse("user verified successfully :: otp and sessionID send successfully",{},200)
        )
        
    } catch (error) {
        //throw new ApiError(500,"error occur :: during signing user ",[error]);
        throw error
    }
}

const otpVerification = async(req,res)=>{
    try {
        //const{sessionID} = req.params
        const{otp} = req.body
        if(!emailService.verifyOtp(otp)){
            throw new ApiError(400,"otp is incorrect !!")
        }
        
        const userId = await jwt.verify(req.cookies?.sessionID,process.env.JWT_SECRET)

        if (!userId) {
            throw new ApiError(400,"pls login first!!!")
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(400,"user don't find !!")
        }

        const accessToken = await user.generateTokens("1h",{
            userName:user.userName,
            email:user.email,
        })
        
        if(!accessToken) throw new ApiError(500,"error in generating access token");
        const refreshToken = await user.generateTokens("10d")

        if(!refreshToken) throw new ApiError(500,"error in generating refresh token");

        user.refreshToken = refreshToken
        await user.save({
            validateBeforeSave:false,
        })

        const options = {
            httpOnly:true,
            secure:true
        }
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .clearCookie("sessionID",options)
        .json(
            new ApiResponse("otp verification completed !! refresh and access token created successfully!!",{
                userData:user,
                token:accessToken
            },200)
        )
    } catch (error) {
        console.error("error ocurred :: during otpVerification :: ",error);
    }
}

const regenerateAccessToken = async(req,res)=>{
    try {
         const refreshToken = req.cookies?.refreshToken || ""
         if (!refreshToken) {
            throw new ApiError(400,"refresh token is required")
         }

         const userID = await jwt.verify(refreshToken,process.env.JWT_SECRET)

         if (!userID) {
            throw new ApiError(401,"pls login again !!")
         }

         const user = await User.findById(userID)

         if (!user) {
            throw new ApiError(400,"invalid token can't find user")
         }

         if(refreshToken !== user?.refreshToken){
            throw new ApiError(400,"token maybe expired or invalid it does'nt match reefreshToken in the database !!")
         }

         const accessToken = await user.generateTokens("1h",{
            userName: this.userName,
            email:this.email
         })

         if (!accessToken) {
            throw new ApiError(400,"error in making access Token")
         }

         return res.status(200)
         .cookie("accessToken",accessToken,{
            httpOnly:true,
            secure:true
         })
         .json(
            new ApiResponse("successfully regenerate access token using refresh token",accessToken,200)
         )

    } catch (error) {
        console.error("error in regeneration of accessToken through refresh token :: ",error);
    }
}

const forgetPassword = async(req,res)=>{
   const {phone} = req.body
   if (!phone) {
      throw new ApiError(400,"phone number is required  !!")
   }

   const user = await User.findOne({
       phone:phone
   })

   if (!user) {
      throw new ApiError(400,"incorrect phone number")
   }

   const sessionID = await user.generateTokens("300s")
   if (!sessionID) {
    throw new ApiError(400,"error in generating the session id !!")
   }
   
   await emailService.sendOtp(user?.email)

   return res.status(200)
   .cookie("sessionID",sessionID,{
     httpOnly:true,
     secure:true
   })
   .json(
      new ApiResponse("user verifiyed successfully for changing the password otp and sessionID sended !!",{},200)
   )
   
}
export {
    loginInUser,
    otpVerification,
    regenerateAccessToken,
    forgetPassword
}
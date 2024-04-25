import {ApiError} from "../utils/error.js"
import  {User}  from "../Models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {emailService} from "../utils/smsService.js"
import jwt from "jsonwebtoken"
const loginInUser = async(req,res)=>{
    try {
        const {email , phone , password} = req.body
        
        if ((!email && !phone) || !password) {
            return res.status(400)
            .json( new ApiError(400,"email or phone  and passowrd is required!!"))
        }
        
        const user = await User.findOne({
            $or : [{email},{phone}]
        })
        
        //console.log(user);
        if (!user) {
            return res.status(400)
            .json(  new ApiError(400,"user with this email or phone number does not exits!!"))  
        }
        
        const passwordCheck = await user.isPasswordCorrect(password)
        //console.log(passwordCheck);
        if (! passwordCheck) {
            return res.status(400)
            .json(  new ApiError(400,"password did'nt match !! incorrect password"))
             
        }
        
        const accessToken = await user.generateTokens("300s")

        if (!accessToken) {
            return res.status(500)
            .json( new ApiError(500,"unable to generate the accessToken"))  
        }

        
        const otp = await emailService.sendOtp(user.email);

        if (!otp) {
            return res.status(500)
            .json( new ApiError(500,"unable to generate the otp")) 
        }
        return res.status(200)
        
        .cookie("accessToken",accessToken,{
            httpOnly:true,
            secure:true
        })
        .json(
            new ApiResponse("user verified successfully :: otp and sessionID send successfully",{},200)
        )
        
    } catch (error) {
        //throw new ApiError(500,"error occur :: during signing user ",[error]);
        console.error("error while login user :: ",error);
    }
}

const otpVerification = async(req,res)=>{
    try {
        //const{sessionID} = req.params
        const{otp} = req.body
        if(!emailService.verifyOtp(otp)){
            return res.status(400)
            .json( new ApiError(400,"otp is not matched !!"))    
        }
        

        const user = req?.user

        if (!user) {
            return res.status(400)
            .json( new ApiError(400,"user don't find !!"))
            
        }

        const accessToken = await user.generateTokens("1h",{
            userName:user.userName,
            email:user.email,
        })
        
        if(!accessToken) return res.status(500).json( new ApiError(500,"error in generating access token"));
        const refreshToken = await user.generateTokens("10d")

        if(!refreshToken) return res.status(500).json( new ApiError(500,"error in generating refresh token"));

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
            return res.status(500).json( new ApiError(500,"refresh token is required"));
         }

         const userID = await jwt.verify(refreshToken,process.env.JWT_SECRET)

         if (!userID) {
            return res.status(401).json( new ApiError(401,"pls login again"));
         }

         const user = await User.findById(userID)

         if (!user) {
            return res.status(400).json( new ApiError(400,"inavlid token cant't find the user"));
         }

         if(refreshToken !== user?.refreshToken){
            return res.status(400).json( new ApiError(400,"token maybe expired or invalid it does'nt match refreshToken in the database !!"));
            
         }

         const accessToken = await user.generateTokens("1h",{
            userName: this.userName,
            email:this.email
         })

         if (!accessToken) {
            return res.status(500).json( new ApiError(500,"problem in generating the accessToken pls try again !!"));
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
    return res.status(400).json( new ApiError(400,"phone number is required"));
   }

   const user = await User.findOne({
       phone:phone
   })

   if (!user) {
    return res.status(400).json( new ApiError(400,"incorrect phone number"));
   }

   const accessToken = await user.generateTokens("300s")
   if (!accessToken) {
    return res.status(400).json( new ApiError(400,"prblm in generating the accessToken"));
   }
   
   await emailService.sendOtp(user?.email)

   return res.status(200)
   .cookie("accessToken",accessToken,{
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
import {ApiError} from "../utils/error.js"
import  {User}  from "../Models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {emailService} from "../utils/smsService.js"

const loginInUser = async(req,res)=>{
    try {
        const {email , phone , password} = req.body
        
        if ((!email && !phone) || !password) {
            throw new ApiError(400,"email or phone  and passowrd is required!!")
        }
        
        const user = await User.findOne({
            $or : [{email},{phone}]
        })

        if (!user) {
            throw new ApiError(400,"user with this email or phone number does not exits!!")
        }

        if (! await user.isPasswordCorrect(password)) {
            throw new ApiError(400,"password did'nt match !! incorrect password")
        }
        
        const sessionID = await user.generateTokens("60s")

        if (!sessionID) {
            throw new ApiError(500,"unable to generate the sessionId")
        }

        user.refreshToken = sessionID
        await user.save({
          validateBeforeSave:false  
        })
        
        const otp = await emailService.sendOtp(email);

        if (!otp) {
            throw new ApiError(500,"did'nt find the otp")
        }
        return res.status(200)
        .json(
            new ApiResponse("user verified successfully :: otp and sessionID send successfully",{
                session : sessionID,
                
            },200)
        )
        
    } catch (error) {
        throw new ApiError(500,"error occur :: during signing user ",[error]);
    }
}

const otpVerification = async(req,res)=>{
    try {
        const{otp,sessionID} = req.params
        if(!emailService.verifyOtp(otp)){
            throw new ApiError(400,"otp is incorrect !!")
        }
        
        const user = await User.findOne({
            refreshToken:sessionID
        })

        if (!user) {
            throw new ApiError(400,"pls login first!!!")
        }
    } catch (error) {
        console.error("error ocurred :: during otpVerification :: ",error);
    }
}

export {loginInUser}
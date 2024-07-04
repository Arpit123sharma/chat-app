import {ApiError} from "../utils/error.js"
import {User} from "../Models/user.model.js"
import jwt from "jsonwebtoken"
const authMiddleware = async(req,res,next)=>{
    console.log(req.cookies);
    try {
       const accessToken = req.cookies?.accessToken || ""
       
       if (!accessToken?.trim()) {
          return res.status(401).json(new ApiError(401,"pls login first there is no access token"))
       }
         
        const decodedToken = await jwt.verify(accessToken,process.env.JWT_SECRET)

        if (!decodedToken) {
            return res.status(401).json(new ApiError(400,"token is expired or corrupted "))
            
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        const verificationCode = decodedToken?.otp

        if (!user) {
            return res.status(400).json(new ApiError(400,"user not found")) 
        }
        req.user = user
        req.otp = verificationCode
        next();
    } catch (error) {
        console.error("error in check user is authenticated or not ",error);
        return res.status(401).json(new ApiError(401,`${error}`)) 
    }
}

export {
    authMiddleware
}
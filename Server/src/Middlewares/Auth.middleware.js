import {ApiError} from "../utils/error.js"
//import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../Models/user.model.js"
import jwt from "jsonwebtoken"
const authMiddleware = async(req,res,next)=>{
    try {
       const accessToken = req.cookies?.accessToken || ""
       
       if (!accessToken?.trim()) {
          throw new ApiError(401,"pls login first there is no access token")
       }
         
        const userID = await jwt.verify(accessToken,process.env.JWT_SECRET)

        if (!userID?.trim()) {
            throw new ApiError(400,"token is expired or corrupted ")
        }

        const user = await User.findById(userID).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(400,"user not found")
        }

        req.user = user
        return next();
    } catch (error) {
        console.error("error in check user is authenticated or not ",error);
    }
}

export {
    authMiddleware
}
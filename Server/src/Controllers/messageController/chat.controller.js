import { ApiError } from "../../utils/error.js"


const listOfOnlineUsers = new Map()

const makeConnection = async(req,res)=>{
    try {
        
    } catch (error) {
        return res.status(500).json(new ApiError(500,`something went wrong while makeing connection :: ERROR : ${error}`))
    }
}
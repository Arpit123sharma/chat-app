import { User } from "../../Models/user.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { ApiError } from "../../utils/error.js"

const sendingRequestToConnect = async(req,res)=>{
    try {
        const portNumber = process.env.PORT
        if(!portNumber) return res.status(500).json(new ApiError(500,`something went wrong while fetching port number try after sometime `))
        return res.status(200).json(new ApiResponse("you are ready to connect with the ws server use the port number to connect with ws",{
            port:portNumber,
            
        },200))
    } catch (error) {
        return res.status(500).json(new ApiError(500,`something went wrong while sending request to ws server to connnect :: ERROR:${error}`))
    }
}

const readPendingMessage = async(req,res)=>{
    try {
        const userID = req?.user?._id
        const {friendsID} = req.params

        if (!friendsID.trim()) {
            return res.status(400).json(new ApiError(400,`friendsID is required`))
        }

        const updatedUser = await User.findByIdAndUpdate(
            userID,
            { $pull: { pendingMessages: { friendId: friendsID } } },
            { new: true, validateBeforeSave: false }
        );

        if (!updatedUser) {
            return res.status(500).json(new ApiError(500,`foops something went wrong while updating the pending message list `))
        }

        const pendingMessages = updatedUser.pendingMessages

        return res.status(200).json(new ApiResponse("successfully read pending messages",{pendingMessages},200))

    } catch (error) {
        return res.status(500).json(new ApiError(500,`something went wrong while removing messages from pending list :: ERROR:${error}`))
    }
}

const fetchPendingMessages = async(req,res)=>{
    try {
        console.log("api hit");
        const userID = req?.user?._id
        
        const pendingMessages = await User.findById(userID).select("pendingMessages")

        if (!pendingMessages) {
            return res.status(500).json(new ApiError(500,`oops you dont have any pending messages`))
        }

        return res.status(200).json(new ApiResponse("successfully fetch pending messages",{
            pendingMessages
        },200))
    } catch (error) {
        return res.status(500).json(new ApiError(500,`something went wrong while fetching pending messages :: ERROR:${error}`))
    }
}

export{
    fetchPendingMessages,
    readPendingMessage
}
import { User } from "../../Models/user.model.js"
import {ApiResponse} from "../../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"
import { ApiError } from "../../utils/error.js";
import mongoose from "mongoose";


const sendRequestToUser = async(req,res)=>{
    try {
        
        const requestFrom = req?.user?._id
        
        const {requestTo} = req?.params
        
        if (!requestTo?.trim()) {
            return res.status(400).json(new ApiError(5400,`id of user required you are sending the friend request to !!`))
        }
        
        if(!isValidObjectId(requestTo)){
            return res.status(400).json(new ApiError(400,`pls give the valid mongodb id !!!`))
        }

        const sender =  await User.findById(requestFrom)

        if(!sender)  return res.status(400).json(new ApiError(400,`sender not exists`))

        sender.requestPendings.push({To:requestTo})

        await sender.save({
            validateBeforeSave:false
        })

            const receiver = await User.findById(requestTo)

            if(!receiver) return res.status(400).json(new ApiError(400,`receiver not exists`))
    
            receiver.requestsArrived.push({From:sender?._id})
    
            await receiver.save({
                validateBeforeSave:false
            })
    
            return res.status(200).json(new ApiResponse("request send successfully !!",{},200))
        

    } catch (error) {
        return res.status(500).json(new ApiError(500,`something went wrong while sending FriendRequest to the user ERROR:${error}`))
    }
}

const cancelRequestFromSender = async(req,res)=>{
    try {
        
            const senderID = req?.user?._id
            const {receiverID} = req?.params

            if (!receiverID.trim()) {
                return res.status(400).json(new ApiError(400,`id of user required for cancelling the friend request to !!`))
            }
    
            if(!isValidObjectId(receiverID)){
                return res.status(401).json(new ApiError(401,`pls give the valid mongodb id !!!`))
            }
    
            const sender =  await User.findById(senderID)
    
            if(!sender) return res.status(400).json(new ApiError(400,`sender not exists!!!`))
    
            sender.requestPendings.pull({To:receiverID})
            await sender.save({
                validateBeforeSave:false
            })
    
            const receiver = await User.findById(receiverID)
    
            if(!receiver) return res.status(400).json(new ApiError(400,`receiver not exists!!!`))
    
            receiver.requestsArrived.pull({From:sender?._id})
    
            await receiver.save({
                validateBeforeSave:false
            })
    
            return res.status(200).json(new ApiResponse("request cancel successfully !!",{},200))
        

    } catch (error) {
        return res.status(500).json(new ApiError(500,`something went wrong while cancelling FriendRequest of the user ERROR:${error}`))
    }
}

const cancelRequestFromReceiver = async(req,res)=>{
    try {
        const receiverID = req?.user?._id
        const {senderID} = req?.params

        if (!senderID?.trim()) {
            return res.status(400).json(new ApiError(400,`id of sender required  during deleting friend request !!`))
        }

        if(!isValidObjectId(senderID)){
            return res.status(401).json(new ApiError(401,`pls give the valid mongodb id !!!`))
        }

        const sender =  await User.findById(senderID)
    
        if(!sender) return res.status(400).json(new ApiError(400,"sender not exists"))
        
        sender.requestPendings.pull({To:receiverID})
        await sender.save({
            validateBeforeSave:false
        })

        const receiver =  await User.findById(receiverID)
    
        if(!receiver) return res.status(400).json(new ApiError(400,"receiver not exists"))
        
        receiver.requestsArrived.pull({From:sender?._id})
        await receiver.save({
            validateBeforeSave:false
        })
        
        return res.status(200).json(new ApiResponse("request rejected successfully !!",{},200))

    } catch (error) {
        return res.status(500).json(new ApiError(500,`something went wrong while cancelling FriendRequest of the user ERROR:${error}`)) 
    }
}
const acceptRequestByUser = async(req,res)=>{ // request was accept by the receiver i.e. we are taking requestFrom params
    try {
       const {requestFrom} = req?.params
       const requestTo = req?.user?._id
       
        if (!requestFrom?.trim()) {
            return res.status(400).json(new ApiError(400,`id of user required you are sending the friend request to !!`))
        }

        if(!isValidObjectId(requestFrom)){
            return res.status(401).json(new ApiError(401,`pls give the valid mongodb id !!!`))
        }

        const receiver = await User.findById(requestTo)

        if(!receiver) return res.status(400).json(new ApiError(400,`receiver not exists !!!`))

        receiver.friends.push({friendId:requestFrom,lastMessageDate:new Date(0)})
        
        receiver.requestsArrived.pull({From:requestFrom})
        await receiver.save({
            validateBeforeSave:false
        })

        
        const sender = await User.findById(requestFrom)

        if(!sender) return res.status(400).json(new ApiError(400,`sender not exists !!!`))

        sender.friends.push({friendId:requestTo,lastMessageDate:new Date(0)})

        sender.requestPendings.pull({From:requestTo})

        await sender.save({
            validateBeforeSave:false
        })

        return res.status(200).json(new ApiResponse("request accepted successfully !!",{},200))
       
    } catch (error) {
        return res.status(500).json(new ApiError(500,`something went wrong while accepting FriendRequest of the user ERROR:${error}`))   
    }
}

const allRequestOfUser = async (req, res) => {
    try {
        const userID = req?.user?._id;

        const user = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userID) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'requestPendings.To',
                    foreignField: '_id',
                    as: 'requestPendingsDetails',
                    pipeline: [
                        { $project: { _id: 1, userName: 1, dp: 1, email: 1, createdAt: 1 } }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'requestsArrived.From',
                    foreignField: '_id',
                    as: 'requestsArrivedDetails',
                    pipeline: [
                        { $project: { _id: 1, userName: 1, dp: 1, email: 1, createdAt: 1 } }
                    ]
                }
            },
            {
                $project: {
                    requestPendings: {
                        $map: {
                            input: "$requestPendings",
                            as: "pending",
                            in: {
                                _id: "$$pending._id",
                                To: {
                                    $arrayElemAt: [
                                        "$requestPendingsDetails",
                                        { $indexOfArray: ["$requestPendingsDetails._id", "$$pending.To"] }
                                    ]
                                }
                            }
                        }
                    },
                    requestsArrived: {
                        $map: {
                            input: "$requestsArrived",
                            as: "arrived",
                            in: {
                                _id: "$$arrived._id",
                                From: {
                                    $arrayElemAt: [
                                        "$requestsArrivedDetails",
                                        { $indexOfArray: ["$requestsArrivedDetails._id", "$$arrived.From"] }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);

        if (!user || user.length === 0) {
            return res.status(500).json(new ApiError(500, "User not found !!"));
        }

        return res.status(200).json(new ApiResponse("Successfully fetched request pending and arrived", user[0], 200));
    } catch (error) {
        return res.status(500).json(new ApiError(500, `Something went wrong while fetching FriendRequest of the user ERROR: ${error}`));
    }
}



export {
  sendRequestToUser,
  cancelRequestFromSender,
  cancelRequestFromReceiver,
  acceptRequestByUser,
  allRequestOfUser
 }
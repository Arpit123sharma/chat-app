import { User } from "../../Models/user.model.js"
import {ApiResponse} from "../../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"
import { ApiError } from "../../utils/error.js";


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

const cancelRequestFromUser = async(req,res)=>{
    try {
        const{user} = req?.params
        if (!user) return res.status(400).json(new ApiError(400,"pls tell who is cancelling the request"))

        if(user === "sender"){ // this part works when cancellation request goes from sender who sends the request
            const requestFrom = req?.user?._id
            const {requestTo} = req?.params

            if (!requestTo.trim()) {
                return res.status(400).json(new ApiError(400,`id of user required you are sending the friend request to !!`))
            }
    
            if(!isValidObjectId(requestTo)){
                return res.status(401).json(new ApiError(401,`pls give the valid mongodb id !!!`))
            }
    
            const sender =  await User.findById(requestFrom)
    
            if(!sender) return res.status(400).json(new ApiError(400,`sender not exists!!!`))
    
            sender.requestPendings.pull({To:requestTo})
            await sender.save({
                validateBeforeSave:false
            })
    
            const receiver = await User.findById(requestTo)
    
            if(!receiver) return res.status(400).json(new ApiError(400,`receiver not exists!!!`))
    
            receiver.requestsArrived.pull({From:sender?._id})
    
            await receiver.save({
                validateBeforeSave:false
            })
    
            return res.status(200).json(new ApiResponse("request cancel successfully !!",{},200))
        }else{ // this part when cancellation request goes from receiver

            const requestFrom = req?.user?._id // this is the recivers id don't get confused by the name requestFrom
            const {requestTo} = req?.params // this is the id of the sender who sends the request to the receiver don't get confused by the name requestTo

            if (!requestTo?.trim()) {
                return res.status(400).json(new ApiError(400,`id of user required you are sending the friend request to !!`))
            }
    
            if(!isValidObjectId(requestTo)){
                return res.status(401).json(new ApiError(401,`pls give the valid mongodb id !!!`))
            }
    
            const sender =  await User.findById(requestTo)
    
            if(!sender) return res.status(400).json(new ApiError(400,"sender not exists")) // in this sender who is the person who sends friend request i.e. requestTo
    
            sender.requestPendings.pull({To:requestFrom})
            await sender.save({
                validateBeforeSave:false
            })
    
            const receiver = await User.findById(requestFrom)
    
            if(!receiver) return res.status(400).json(new ApiError(400,"sender not exists")) // in this case receiver is the person who is sending the cancelling request i.e. requestFrom
    
            receiver.requestsArrived.pull({From:requestTo})
    
            await receiver.save({
                validateBeforeSave:false
            })
    
            return res.status(200).json(new ApiResponse("request rejected successfully !!",{},200))
        }


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

        receiver.friends.push({friendId:requestFrom})
        
        receiver.requestsArrived.pull({From:requestFrom})
        await receiver.save({
            validateBeforeSave:false
        })

        
        const sender = await User.findById(requestFrom)

        if(!sender) return res.status(400).json(new ApiError(400,`sender not exists !!!`))

        sender.friends.push({friendId:requestTo})

        sender.requestsArrived.pull({From:requestTo})

        await sender.save({
            validateBeforeSave:false
        })

        return res.status(200).json(new ApiResponse("request accepted successfully !!",{},200))
       
    } catch (error) {
        return res.status(500).json(new ApiError(500,`something went wrong while accepting FriendRequest of the user ERROR:${error}`))   
    }
}


export {
  sendRequestToUser,
  cancelRequestFromUser,
  acceptRequestByUser
 }
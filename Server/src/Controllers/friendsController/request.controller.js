import { User } from "../../Models/user.model.js"
import {ApiResponse} from "../../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"


const sendRequest = async(req,res)=>{
    try {
        const {requestFrom} = req?.user?._id
        const {requestTo} = req?.params

        if (!requestTo.trim()) {
            return res.status(500).json(`id of user required you are sending the friend request to !!`)
        }

        if(!isValidObjectId(requestTo)){
            return res.status(500).json(`pls give the valid mongodb id !!!`)
        }

        const sender =  await User.findById(requestFrom)

        if(!sender) return res.status(400).json("sender not exists")

        sender.requestPendings.push({To:requestTo})

        await sender.save({
            validateBeforeSave:false
        })

       const receiver = await User.findById(requestTo)

        if(!receiver) return res.status(400).json("receiver not exists")

        receiver.requestsArrived.push({From:sender?._id})

        await receiver.save({
            validateBeforeSave:false
        })

        return res.status(200).json(new ApiResponse("request send successfully !!",{},200))
    } catch (error) {
        return res.status(500).json(`something went wrong while sending FriendRequest to the user ERROR:${error}`)
    }
}

const cancelRequest = async(req,res)=>{
    try {
        const{user} = req.params

        if(user === "sender"){
            const {requestFrom} = req?.user?._id
            const {requestTo} = req.params

            if (!requestTo.trim()) {
                return res.status(500).json(`id of user required you are sending the friend request to !!`)
            }
    
            if(!isValidObjectId(requestTo)){
                return res.status(500).json(`pls give the valid mongodb id !!!`)
            }
    
            const sender =  await User.findById(requestFrom)
    
            if(!sender) return res.status(400).json("sender not exists")
    
            sender.requestPendings.pull({To:requestTo})
            await sender.save({
                validateBeforeSave:false
            })
    
            const receiver = await User.findById(requestTo)
    
            if(!receiver) return res.status(400).json("receiver not exists")
    
            receiver.requestsArrived.pull({From:sender?._id})
    
            await receiver.save({
                validateBeforeSave:false
            })
    
            return res.status(200).json(new ApiResponse("request cancel successfully !!",{},200))
        }else{

            const {requestTo} = req?.user?._id
            const {requestFrom} = req.params

            if (!requestFrom.trim()) {
                return res.status(500).json(`id of user required you are sending the friend request to !!`)
            }
    
            if(!isValidObjectId(requestFrom)){
                return res.status(500).json(`pls give the valid mongodb id !!!`)
            }
    
            const sender =  await User.findById(requestFrom)
    
            if(!sender) return res.status(400).json("sender not exists")
    
            sender.requestPendings.pull({To:requestTo})
            await sender.save({
                validateBeforeSave:false
            })
    
            const receiver = await User.findById(requestTo)
    
            if(!receiver) return res.status(400).json("receiver not exists")
    
            receiver.requestsArrived.pull({From:sender?._id})
    
            await receiver.save({
                validateBeforeSave:false
            })
    
            return res.status(200).json(new ApiResponse("request rejected successfully !!",{},200))
        }


    } catch (error) {
        return res.status(500).json(`something went wrong while cancelling FriendRequest of the user ERROR:${error}`)
    }
}

const acceptRequest = async(req,res)=>{
    try {
       const {requestFrom} = req.params
       const {requestTo} = req?.user?._id
       
        if (!requestFrom.trim()) {
            return res.status(500).json(`id of user required you are sending the friend request to !!`)
        }

        if(!isValidObjectId(requestFrom)){
            return res.status(500).json(`pls give the valid mongodb id !!!`)
        }

        const receiver = await User.findById(requestTo)

        if(!receiver) return res.status(400).json("receiver not exists")

        receiver.friends.push({friendId:requestFrom})
        
        receiver.requestsArrived.pull({From:requestFrom})
        await receiver.save({
            validateBeforeSave:false
        })

        
        const sender = await User.findById(requestFrom)

        if(!sender) return res.status(400).json("sender not exists")

        sender.friends.push({friendId:requestTo})

        sender.requestsArrived.pull({From:requestTo})

        await sender.save({
            validateBeforeSave:false
        })

        return res.status(200).json(new ApiResponse("request accepted successfully !!",{},200))
       
    } catch (error) {
        return res.status(500).json(`something went wrong while accepting FriendRequest of the user ERROR:${error}`)   
    }
}

export {
  sendRequest,
  cancelRequest,
  acceptRequest
 }
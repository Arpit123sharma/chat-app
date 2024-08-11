import { ApiError } from "../../utils/error.js"
import {User} from "../../Models/user.model.js"
import {Chat} from "../../Models/chats.model.js"
import { Group } from "../../Models/group.model.js"
import { uploadOnCloudinary } from "../../utils/cloudinary.js"
import { ApiResponse } from "../../utils/ApiResponse.js"


const textMessageHandlerForIndi = async(ws,message,onlineUsers)=>{
   try {

        // send message to the user
        const receiverID = message.to
        const senderID = message.from
        const receiverStatus = onlineUsers.has(receiverID.trim())
        if(receiverStatus){ // if receiver is online
          console.log("online user is caalling");
         const wsConnectionForRec = onlineUsers.get(receiverID.trim())
         const wsConnectionForSend = onlineUsers.get(senderID.trim())
          //  console.log("socket connection of rec",wsConnectionForRec);
          //  console.log("socket connection of sender",wsConnectionForSend);
           wsConnectionForRec.emit("message_received",JSON.stringify(message))
           wsConnectionForSend.emit("response",JSON.stringify({type:'A-D',status:true}))
           await Chat.create({
             From:message.from,
             Payload:message.payload,
             To:message.to,
             Time:message.time,
             Delivered:true,
             PayloadType:message.payloadType
           })
           //updating the friend list
           const sender = await User.findById(senderID)
           const receiver = await User.findById(receiverID)

           const senderListIndex = sender.friends.findIndex(friend=>friend.friendId === receiverID)
           const receiverListIndex = receiver.friends.findIndex(friend=>friend.friendId === senderID)

           if (senderListIndex !== -1 && receiverListIndex !== -1) {

             sender.friends[senderListIndex].lastMessage = Date.now()
             receiver.friends[receiverListIndex].lastMessage = Date.now()

             sender.friends.sort((a,b)=>(b.lastMessage - a.lastMessage))
             receiver.friends.sort((a,b)=>(b.lastMessage - a.lastMessage))

           }
           await sender.save({validateBeforeSave:false})
           await receiver.save({validateBeforeSave:false})

           return [sender.friends,receiver.friends]
        }
        else{ 
          // for offline user
          console.log("offline user is caalling");
            const wsConnectionForSend = onlineUsers.get(senderID.trim())
            wsConnectionForSend.send("response",JSON.stringify({type:'A-D',status:false}))
            const savedMessage = await Chat.create({
                From:message.from,
                Payload:message.payload,
                To:message.to,
                Time:message.time,
                Delivered:true,
                PayloadType:message.payloadType
              })
            const user = await User.findById(message.to) //push the message in receivers pending messages or unread message list
            if(!user){
                ws.send(new ApiError(500,`something went wrong while fetching offline user message from the user::ERROR:`))
            }
            // pendingMessages updating 

            let indexForPendingMessage = user.pendingMessages.findIndex((obj)=>obj.friendId === savedMessage?.From)

            if (indexForPendingMessage !== -1) {
              user.pendingMessages[indexForPendingMessage].unreadCount += 1
              user.pendingMessages[indexForPendingMessage].lastMessage = savedMessage.Payload
              await user.save({
                validateBeforeSave:false
              })
            } else {
              user.pendingMessages.push({friendId:savedMessage.From,unreadCount : 1,lastMessage:savedMessage.Payload})
              await user.save({
                  validateBeforeSave:false
              })
            }

            // updating friend list 

            const sender = await User.findById(senderID)
            const receiver = user

            const senderListIndex = sender.friends.findIndex(friend=>friend.friendId === receiver?._id)
            const receiverListIndex = receiver.friends.findIndex(friend=>friend.friendId === senderID)

            if (senderListIndex !== -1 && receiverListIndex !== -1) {

              sender.friends[senderListIndex].lastMessage = Date.now()
              receiver.friends[receiverListIndex].lastMessage = Date.now()

              sender.friends.sort((a,b)=>(b.lastMessage - a.lastMessage))
              receiver.friends.sort((a,b)=>(b.lastMessage - a.lastMessage))

            }
            await sender.save({validateBeforeSave:false})
            await receiver.save({validateBeforeSave:false})

            return [sender.friends,receiver.friends]
        }  
   } catch (error) {
     ws.send(JSON.stringify(new ApiError(500,`something went wrong while handling message from the user::ERROR:${error}`)))
   }
}

const textMessageHandlerForGroup = async(ws,message,onlineUsers)=>{
  try {
    const groupID = message.to
    const group = await Group.findById(groupID)
    const friendsList = new Set() 

    group.members.forEach((member)=>{
      friendsList.add(member.memberId)
    })
    
    friendsList.forEach((user)=>{
      if(onlineUsers.has(user)){
        const userWS = onlineUsers.get(user)
        if(userWS.readyState === userWS.OPEN){
          userWS.send(JSON.stringify(message))
          friendsList.delete(user)
        }
      }
    })

    if(friendsList.size()){
      friendsList.forEach(async(userID)=>{
         const user = await User.findById(userID)
         user.pendingMessages.push({message:message})
         await user.save({
          validateBeforeSave:false
         })
      })
    }

    const savedMessage = await Chat.create({
      From:message.from,
      Payload:message.payload,
      To:message.to,
      Time:message.time,
      Delivered:true,
      PayloadType:message.payloadType
    })


  } catch (error) {
    ws.send(JSON.stringify(new ApiError(500,`something went wrong while handling message from the user::ERROR:${error}`)))
  }
}

const fileHandler = async(req,res)=>{
  try {
    const filePath = req?.file?.filePath
    if (!filePath) {
      return res.status(400).json(new ApiError(400,`cant find the file message you sent!!! `))
    }

    const uploadedFile = await uploadOnCloudinary(filePath)
    
    if (!uploadedFile) {
      return res.status(500).json(new ApiError(500,`not able to save message in cloud try after sometime `))
    }

    return res.status(200).json(new ApiResponse("successfully upload the file you send!!",{url:uploadedFile?.url},200))
    
  } catch (error) {
    return res.status(500).json(new ApiError(500,`something went wrong during file handling ${error}`))
  }
}

const fetchChats = async(req,res)=>{
  try {
    const {user1ID,user2ID,skip,limit=20} = req.query
    if (!user1ID || !user2ID || !skip || !limit) {
      return res.status(400).json(new ApiError(400,`user1ID,user2ID,skip,limit :: All these fields are required !!`))
    }

    const Messages = await Chat.find({
      $or : [{From : user1ID , To: user2ID},{From : user2ID , To: user1ID}]
    })
    .sort({Timestamp:-1})
    .skip(skip)
    .limit(limit)

    if (!Messages) {
      return res.status(500).json(new ApiError(500,`no chats are found between these two users!!`))
    }

    return res.status(200).json(new ApiResponse("successfully fetch all messages between these users",Messages,200))

  } catch (error) {
    return res.status(500).json(new ApiError(500,`something went wrong while fetching chats ${error}`))
  }
}
export{
    textMessageHandlerForIndi,
    textMessageHandlerForGroup,
    fileHandler
}

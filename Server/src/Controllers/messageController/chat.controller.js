import { ApiError } from "../../utils/error.js"
import {User} from "../../Models/user.model.js"
import {Chat} from "../../Models/chats.model.js"
import { Group } from "../../Models/group.model.js"


const textMessageHandlerForIndi = async(ws,message,onlineUsers)=>{
   try {

        // send message to the user
        const receiverID = message.to
        const senderID = message.from
        const receiverStatus = onlineUsers.has(receiverID.trim())
        if(receiverStatus){ // if receiver is online
         const wsConnectionForRec = onlineUsers.get(receiverID.trim())
         const wsConnectionForSend = onlineUsers.get(senderID.trim())
           wsConnectionForRec.send(JSON.stringify(message))
           wsConnectionForSend.send(JSON.stringify({type:'A-D',status:true}))
           await Chat.create({
             From:message.from,
             Payload:message.payload,
             To:message.to,
             Time:message.time,
             Delivered:true,
             PayloadType:message.payloadType
           })
           return
        }
        else{ // for offline user
            const senderID = message.from
            const wsConnectionForSend = onlineUsers.get(senderID.trim())
            wsConnectionForSend.send(JSON.stringify({type:'A-D',status:false}))
            const savedMessage = await Chat.create({
                From:message.from,
                Payload:message.payload,
                To:message.to,
                Time:message.time,
                Delivered:true,
                PayloadType:message.payloadType
              })
            const user = await User.findById(message.to) //push the message in receivers pending messages or unread message list
            console.log(user);
            if(!user){
                ws.send(new ApiError(500,`something went wrong while fetching offline user message from the user::ERROR:`))
            }
            user.pendingMessages.push({message:savedMessage?._id})
            await user.save({
                validateBeforeSave:false
            })
              return
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

export{
    textMessageHandlerForIndi,
    textMessageHandlerForGroup
}
import { ApiError } from "../../utils/error.js"
import {User} from "../../Models/user.model.js"
import {Chat} from "../../Models/chats.model.js"


const textMessageHandler = async(ws,message,onlineUsers)=>{
   try {
    
     if(message.receiver === 'individual'){
        
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
        
     }
     
     else if(message.receiver === 'group'){
        // send message to the group
     }
   } catch (error) {
     ws.send(new ApiError(500,`something went wrong while handling message from the user::ERROR:${error}`))
   }
}

export{
    textMessageHandler
}
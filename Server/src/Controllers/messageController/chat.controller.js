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

         const wsConnectionForRec = onlineUsers.get(receiverID.trim())
         const wsConnectionForSend = onlineUsers.get(senderID.trim())

           wsConnectionForRec.emit("message_received",JSON.stringify(message))
        
             Chat.create({
             From:message.from,
             Payload:message.payload,
             To:message.to,
             Time:message.time,
             Delivered:true,
             PayloadType:message.payloadType
           }).catch(error => {
            console.error("Failed to save message to DB:", error);
            // Optionally handle error, such as retrying the save operation
          });
          
        }
        else{ 
         // For offline user
          const wsConnectionForSend = onlineUsers.get(senderID.trim());

          // Save the message to the Chat collection
          const saveMessagePromise = Chat.create({
              From: message.from,
              Payload: message.payload,
              To: message.to,
              Time: message.time,
              Delivered: true,
              PayloadType: message.payloadType,
          });

          // Update the user’s friend list
          const updateUserPromise = User.findOneAndUpdate(
              { 
                  _id: message.to, 
                  "friends.friendId": message.from // Match user and specific friend
              },
              {
                  $set: {
                      "friends.$.lastMessage": message.payload, // Update lastMessage
                      "friends.$.lastMessageDate": message.time // Update lastMessageDate
                  },
                  $inc: {
                      "friends.$.unreadCount": 1 // Increment unreadCount
                  }
              },
              { new: true, upsert: true } // Return the updated document and create if not found
          );

          // Wait for both operations to complete
          const [savedMessage, result] = await Promise.all([saveMessagePromise, updateUserPromise]);

          // Now you can handle the results as needed

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

const updateFriendList = (userID,friendList)=>{
  try {
    const updatedFriendList = friendList.map((friend)=>{
      return{
        ...friend,
        friendId:friend.friendId._id
      }
    })

    User.findByIdAndUpdate(userID,{
      $set:{friends:updatedFriendList}
    }).catch((error)=>{
      console.error("Failed to updateFriendList message to DB:", error);
    })

  } catch (error) {
     console.log("error occured while updating friend list:",error);
     throw new Error(`failed to update friend list ${error}`)
  }
}
export{
    textMessageHandlerForIndi,
    textMessageHandlerForGroup,
    fileHandler,
    updateFriendList,
    fetchChats
}

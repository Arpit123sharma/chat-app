import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {createServer} from "node:http"
import {WebSocketServer} from "ws"


const app = express() // express server
const server = createServer(app) 
const wss = new WebSocketServer({ server }); //web socket server 

//middlewares configuration of nodejs server
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}
))
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser())

// importing routes 

import userRouter from "./Routes/user.route.js"
import searchRouter from "./Routes/Search/searching.route.js"
import requestRoute from "./Routes/friends/request.route.js"
import friendsRoute from "./Routes/friends/friend.routes.js"
import wsRoute from "./Routes/messageRoutes/request.route.js"
import fileMessageRoute from "./Routes/messageRoutes/chat.route.js"
import {  textMessageHandlerForGroup, textMessageHandlerForIndi } from "./Controllers/messageController/chat.controller.js"


// routing decleration
app.use("/chat-app/api/v1/user",userRouter) // to manage user
app.use("/chat-app/api/v1/SearchFriends",searchRouter) // searching for friends
app.use("/chat-app/api/v1/requests",requestRoute) // route for sending friend request and cancelling ,acceptance
app.use("/chat-app/api/v1/Home",friendsRoute) // fetching friend list using this route
app.use("/chat-app/api/v1/ws",wsRoute)// to take the port to connect with ws server
app.use("/chat-app/api/v1/ws-message",fileMessageRoute)

//store the users in the map who are online 
const onlineUsersList = new Map();

// WebSocket server
wss.on("connection", (ws, req) => {
    // Parsing userId from the req parameters
    const params = new URLSearchParams(req.url.split('?')[1]);
    let userID = params.get('id');

    if (userID?.trim()) {
        // Trim and ensure the userID is stored as a string
        userID = userID.trim();
        onlineUsersList.set(userID, ws);
        console.log(`User with ID: ${userID} is successfully connected to the WebSocket server!`);

        ws.on('message', (data) => {
            console.log(`Received a message from ${userID}, message is ${data}`);
            ws.send(JSON.stringify({
                type:"A-S",
                status : true
            }))
            let parseData
            try {
                parseData = JSON.parse(data)
                
            } catch (error) {
                console.log("error during parsing data into json: ",error);
            }
            if ( parseData.receiver === 'individual') {
                    //message-handler-individual-user
                    textMessageHandlerForIndi(ws,parseData,onlineUsersList) 
            }
            else if(parseData.receiver === 'group'){
                //message-handler-individual-group
                textMessageHandlerForGroup(ws,parseData,onlineUsersList)

            }
            
            
        });

        ws.on('close', () => {
            onlineUsersList.delete(userID);
            console.log(`User disconnected from the server with ID: ${userID}`);
        });
    } else {
        ws.close(1008, "UserID is required to connect to the server");
    }
});


export {
    app,
    server
}

// Step-by-step communication between both clients is as follows:

// User A and User B create a communication channel with the chat server.
// User A sends a message to the chat server.
// When a message is received, the chat server acknowledges back to user A.
// The chat server sends the message to user B and stores the message in the database if the receiver’s status is offline.
// User B sends an acknowledgment to the chat server.
// The chat server notifies user A that the message has been successfully delivered.
// When user B reads the message, the application notifies the chat server.
// The chat server notifies user A that user B has read the message.
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {createServer} from "node:http"
import {WebSocketServer} from "ws"


const app = express() // express server
const server = createServer(app) 
const wss = new WebSocketServer({ server }); //web socket server 

//middlewares configuration of nodejs server
app.use(cors())
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


// routing decleration
app.use("/chat-app/api/v1/user",userRouter) // to manage user
app.use("/chat-app/api/v1/SearchFriends",searchRouter) // searching for friends
app.use("/chat-app/api/v1/requests",requestRoute) // route for sending friend request and cancelling ,acceptance
app.use("/chat-app/api/v1/Home",friendsRoute) // fetching friend list using this route
app.use("/chat-app/api/v1/ws",wsRoute)// to take the port to connect with ws server

//store the users in the map who are online 
const onlineUsersList = new Map()

//web-socket server
wss.on("connection",(ws,req)=>{
    //parsing userId from the req parameters
    const params = new URLSearchParams(req.url.split('?')[1])
    const userID = params.get('id')

    if (userID?.trim()) {
        
         onlineUsersList.set(userID,ws)
         console.log(`user with this :${userID}, is successfully connected with the ws server !!`);

         ws.on('message',(data)=>{
            console.log(`get a message from the ${userID} , message is ${data}`);
         })

         ws.on('close',()=>{
            onlineUsersList.delete(userID)
            console.log(`user disconnected from the server with this userId :${userID}`);
         })

    } else {
        ws.close(1008,"userID is required to connect with the server")
    }
})

export {
    app,
    server
}
import express from "express"
import dotenv from 'dotenv'
import {connectDB} from "./DB/mongodb.connection.js"
import cors from "cors"
import userRouter from "./Routes/user.route.js"
import cookieParser from "cookie-parser"
import {createServer} from "node:http"
import {WebSocketServer} from "ws"
import searchRouter from "./Routes/Search/searching.route.js"
import requestRoute from "./Routes/friends/request.route.js"
import friendsRoute from "./Routes/friends/friend.routes.js"
dotenv.config({
    path:"./.env"
})

const port = process.env.PORT || 3000

const app = express()
const server = createServer(app) 
const wss = new WebSocketServer({ server });


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser())
// routing

app.use("/chat-app/api/v1/user",userRouter)
app.use("/chat-app/api/v1/SearchFriends",searchRouter)
app.use("/chat-app/api/v1/requests",requestRoute)
app.use("/chat-app/api/v1/Home",friendsRoute)
app.use("/chat-app/api/v1/userDetails",userRouter)
connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`server is listing on ${port}`);
        console.log(`http://localhost:${port}`);
    })
})
.catch((err)=>{
    throw err;
})

export {wss}
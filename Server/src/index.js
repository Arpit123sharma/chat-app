import express from "express"
import dotenv from 'dotenv'
import {connectDB} from "./DB/mongodb.connection.js"
import cors from "cors"
import userRouter from "./Routes/user.route.js"
import cookieParser from "cookie-parser"
dotenv.config({
    path:"./.env"
})

const port = process.env.PORT || 3000

const app = express()
 
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser())
// routing

app.use("/chat-app/api/v1/user",userRouter)



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
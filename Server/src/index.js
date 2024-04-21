import express from "express"
import dotenv from 'dotenv'
import {connectDB} from "./DB/mongodb.connection.js"
import cors from "cors"
import { registerUser } from "./Controllers/registerUser.auth.js"
import { upload } from "./Middlewares/multer.js"
import { loginInUser, otpVerification } from "./Controllers/LoginIn.auth.js"
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

app.route("/chat-app/api/v1/user/register").post(upload.single("profile"),registerUser) // signup
app.route("/chat-app/api/v1/user/login").post(loginInUser)// login make session
app.route("/chat-app/api/v1/user/otpVerification").post(otpVerification) // login 2 step verification (otp)

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
import express from "express"
import dotenv from 'dotenv'
import {connectDB} from "./DB/mongodb.connection.js"

dotenv.config({
    path:"./.env"
})

const port = process.env.PORT || 3000

const app = express()
 
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
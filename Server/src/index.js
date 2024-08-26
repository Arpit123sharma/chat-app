import dotenv from 'dotenv'
import {connectDB} from "./DB/mongodb.connection.js"
import { server } from './app.js'
//  import { clearDB } from './dbName.js'


//env file configuration
dotenv.config({
    path:"./.env"
})

const port = process.env.PORT || 3000

//server is listing when DB is successfully connected !!
connectDB()
.then(()=>{
    server.listen(port,()=>{
        console.log(`server is listing on ${port}`);
        console.log(`http://localhost:${port}`);
        //   clearDB("neetu sharma")
    })
})
.catch((err)=>{
    throw err;
})

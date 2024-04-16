import mongoose from "mongoose"
import dbName from "../dbName.js"
const connectDB = async()=>{
    try {
       const connectionHost = await mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`) 
       console.log("database conneted successfully :: host :: ",connectionHost.connection.host);
    } catch (error) {
        console.error("error in connecting with mongodb :: ",error);
    }
}

export {connectDB}
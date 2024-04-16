import mongoose,{Schema} from "mongoose"
import User from "./user.model.js"

const chatSchema = Schema({
    source:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    payload:{
        type:String,
        required:true
    },
    destination:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    time:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export const Chat = mongoose.model("Chat",chatSchema)
import mongoose,{Schema} from "mongoose"


const chatSchema = Schema({
    source:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    payload:{
        type:String,
        required:true
    },
    destination:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    time:{
        type:String,
        required:true
    },
    mssgStatus:{
        type:Boolean
    },
    readStatus : {
        type:Boolean
    }
},{
    timestamps:true
})

export const Chat = mongoose.model("Chat",chatSchema)
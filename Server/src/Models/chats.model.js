import mongoose,{Schema} from "mongoose"


const chatSchema = Schema({
    From:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    Payload:{
        type:String,
        required:true
    },
    To:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    Time:{
        type:String,
    },
    Read : {
        type:Boolean,
        default:false
    },
    Delivered : {
        type:Boolean,
        default:false
    },
    PayloadType: String
},{
    timestamps:true
})

/*
{ chat give by client:-
 
 from,
 to,
 payload,
 time,
 payloadType = normal || file,
 recivier:'individual' || group

}
*/
export const Chat = mongoose.model("Chat",chatSchema)
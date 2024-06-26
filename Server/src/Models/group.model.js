import mongoose,{Schema} from "mongoose";

const groupSchema = new Schema({
    groupName:{
        type:String,
        unique:true,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    members:[
        {
            memberId:{
                type:Schema.Types.ObjectId,
                ref:'User'
            },
            joinedSince:{
                type:Date,
                default:Date.now
            }
        }
    ],
    requestPending:[
        {
            To:{
                type:Schema.Types.ObjectId,
                ref:'User'
            }
        }
    ],
    requestArrived:[
        {
            From:{
                type:Schema.Types.ObjectId,
                ref:'User'
            }
        }
    ]
},{timestamps:true})



export const Group = mongoose.model("Group",groupSchema);
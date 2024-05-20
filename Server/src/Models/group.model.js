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
    ]
},{timestamps:true})

groupSchema.index({groupName:"text"})

export default Group = mongoose.model(groupSchema,'Group');
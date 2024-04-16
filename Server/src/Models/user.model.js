import mongoose,{Schema} from "mongoose"

const userSchema = Schema({
    userName:{
        type:String,
        required:true,
        lowercase:true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true  
    },
    Number:{
        type:Number,
        required:true,
        unique:true
    },
    dp:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export const User = mongoose.model("User",userSchema);
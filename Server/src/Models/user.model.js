import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"
const userSchema = new Schema({
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
    phone:{
        type:String,
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

userSchema.pre("save",async function(next){
    if(!this.isModified) return next();
    try {
        this.password = await bcrypt.hash(this.password,10); 
    } catch (error) {
        throw error
    }
    next();
})

export const User = mongoose.model("User", userSchema)
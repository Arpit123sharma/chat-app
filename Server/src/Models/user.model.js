import mongoose,{Schema, Types} from "mongoose"
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken"
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
    },
    refreshToken:{
        type:String
    },
    friends:[
        {
        friendId:{
            type:Types.ObjectId,
            ref:'User',
        },
        friendSince:{
            type:Date,
            default:Date.now
        }

     }
    ],
    groups:[
        {
            GroupsId:{
                type:Types.ObjectId,
                ref:'Group'
            },
            joinedAt:{
                type:Date,
                default:Date.now
            }
        }
    ]
},{
    timestamps:true
})

userSchema.index({userName:"text"})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password,10); 
    } catch (error) {
        throw error
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateTokens = async function(time,data = {}){
    try {
        
      
        return await jwt.sign({
            _id : this._id,
            ...data
          },process.env.JWT_SECRET,{
            expiresIn:time
          })
       }

    catch (error) {
       console.error("error :: during the token generation :: ",error); 
    }
}

export const User = mongoose.model("User", userSchema)
import { User } from "../../Models/user.model.js"
import {ApiResponse} from "../../utils/ApiResponse.js"


const userFriendList = async(req,res)=>{
    try {
       const {user} = req?.user
       const friendsList = await User.aggregate([
        {
            $match:{_id:user?._id}
        },
        {
            $project:{
                friends:{
                    _id:1,
                    userName:1,
                    dp:1
                }
            }
        }
       ])

       if(friendsList.length === 0){
        return res.status(500).json(`user don't have friends !!`)
       }
       return res.status(200).json(new ApiResponse("user's friend fetched successfully",friendsList[0],200))
    } catch (error) {
        return res.status(500).json(`something went wrong while fethcing users friends list ERROR:${error}`)
    }
}

export {
       userFriendList,
    }
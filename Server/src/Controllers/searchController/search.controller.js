import {User} from "../../Models/user.model.js"
import {Group} from "../../Models/group.model.js"
import {ApiResponse} from "../../utils/ApiResponse.js"
import { ApiError } from "../../utils/error.js"

const Searching = async(req,res)=>{
  try {
    const {query,page=1,limit = 10,queryFor="users"} = req.query
    if (!query.trim() || !page || !queryFor.trim()) {
      return res.status(400).json(new ApiError(400,"query and page and queryFor is required "))
    }

    let users = null
    let groups =  null

    const regex = new RegExp(query,'i')

    if (queryFor === "users") {

       users = await User.find({userName:regex}).skip((Number(page)-1)*limit).limit(limit)

       console.log(users);
      if (users.length === 0) {
        return res.status(500).json(new ApiError(500,"user not exists you are searching for "))
      }
    }else if(queryFor === "groups"){
       groups = await Group.find({groupName:regex}).skip((Number(page)-1)*limit).limit(limit)

      if (!groups) {
        return res.status(500).json(new ApiError(500,"groups did'nt exists you are searching for"))
    }
    }
 
    return res.status(200).json( new ApiResponse("users or groups fetched successfully", users || groups , 200))
      
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500,`something went wrong while searching users or groups !! try after sometime error you encountered : ${error}`))
  }
}

export {Searching}
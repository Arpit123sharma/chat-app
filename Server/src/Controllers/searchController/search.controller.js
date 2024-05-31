import User from "../../Models/user.model.js"
import Group from "../../Models/group.model.js"
import {ApiResponse} from "../../utils/ApiResponse.js"
import { ApiError } from "../../utils/error.js"

const Searching = async(req,res)=>{
  try {
    const {query,page,no_docs = 10,queryFor} = req.query
    if (!query.trim() || !page.trim() || !queryFor.trim()) {
      return res.status(400).json(new ApiError(400,"query and page and queryFor is required "))
    }

    let users = null
    let groups =  null

    if (queryFor === "users") {

       users = await User.find(query).skip(no_docs*page).limit(no_docs)

      if (!users) {
        return res.status(500).json(new ApiError(500,"user not exists you are searching for "))
      }
    }else if(queryFor === "groups"){
       groups = await Group.find(query).skip(no_docs*page).limit(no_docs)

      if (!groups) {
        return res.status(500).json(new ApiError(500,"groups did'nt exists you are searching for"))
    }
    }
 
    return res.status(200).json( new ApiResponse("users or groups fetched successfully", users || groups , 200))
      
  } catch (error) {
    return res.status(500).json(new ApiError(500,"something went wrong while searching users or groups !! try after sometime"))
  }
}
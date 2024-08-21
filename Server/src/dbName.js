import {User} from "./Models/user.model.js"
const dbName = "chatTestDB";
export default dbName

// export const clearDB = async (name)=>{
//     try {
//         const user = await User.findOne({userName:name})
//         console.log(name,user.pendingMessages);
        
//         user.pendingMessages = []
//         await user.save({
//             validateBeforeSave:false
//         })

//         console.log(user.pendingMessages);
        
//     } catch (error) {
//         console.log(error);
        
//     }
// }
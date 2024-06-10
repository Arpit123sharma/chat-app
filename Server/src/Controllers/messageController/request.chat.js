import { ApiResponse } from "../../utils/ApiResponse"
import { ApiError } from "../../utils/error"

const sendingRequestToConnect = async(_,res)=>{
    try {
        const portNumber = process.env.portNumber
        if(!portNumber) return res.status(500).json(new ApiError(500,`something went wrong while fetching port number try after sometime `))
        return res.status(200).json(new ApiResponse("you are ready to connect with the ws server use the port number to connect with ws",{
            port:portNumber,
            
        },200))
    } catch (error) {
        return res.status(500).json(new ApiError(500,`something went wrong while sending request to ws server to connnect :: ERROR:${error}`))
    }
}

export{
    sendingRequestToConnect
}
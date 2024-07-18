import {useState,useEffect} from "react";
import axios from "axios"

const ApiHandler=(url,method,dependencies=[])=>{
    const[value,setValue] = useState(null)
    const[loading,setLoading] = useState(false)
    const[error,setError] = useState("")
    const[response,setResponse]=useState({})

    useEffect(()=>{
        const controller = new AbortController()
       ;(async ()=>{
        try {
            setError("")
            setLoading(true)
            if (value) {
                url = url+value
            }
            const res = await axios({
                method:method,
                url:url,
                withCredentials:true,
                signal:controller.signal
            })
            if(res){
                console.log(res);
                setLoading(false)
                setResponse(res)
            }
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log("request cancelle",err);
                return
            }
            setError(err?.response?.data?.data||err.message)
            setLoading(false)
            console.log(err);

        }

        
       })()

       return ()=>{
        controller.abort()
       }
    },[...dependencies,value])

    return [value,setValue,loading,error,response]
}

export {ApiHandler}
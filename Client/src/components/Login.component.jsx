import React,{useState} from 'react'
import {useCookies} from "react-cookie"
import { Input,Button } from '@nextui-org/react'
import { Link ,useNavigate} from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL_HEADER

function isEmail(value) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(value);
  }
  
function isPhoneNumber(value) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(value);
  }

function LoginComponent() {
    const {handleSubmit,register} = useForm()
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
    const [inputVariable,setInputVariable] = useState("")
    const navigate = useNavigate()

    const create = async(data)=>{
       try {
        setError("")
        setLoading(true)
        let modifyData = {
            [inputVariable]:data.contact,     
             password:data.password   
        }
   

        let response = await axios.post(`${apiUrl}/user/login`,modifyData)
        setLoading(false)
        console.log(modifyData);
        
        navigate("/otpVerification")
        

       } catch (error) {
        setLoading(false)
        setError(error?.response?.data?.data || error.message)
        console.log("error while login user :: ",error);
       }
    }

    const handleInputChange = (value) => {
        if (isEmail(value)) {
          setInputVariable("email");
        } else if (isPhoneNumber(value)) {
          setInputVariable("phone");
        } else {
          setInputVariable("");
        }
      }
    
  return (
    <div className='w-6/12 h-4/5 bg-white  text-white rounded-lg overflow-hidden'>
       <div className='h-1/2 w-full bg-[url(https://img.freepik.com/free-vector/red-abstract-background_698452-868.jpg?t=st=1719809106~exp=1719812706~hmac=0a8a215e46c896b9c631fd9f02afcec222760e1dd22764a49ede853f256d83de&w=1060)]'>
         <h1 className='font-semibold text-3xl text-center pt-24'>Welcome !!</h1>
         <h1 className='font-semibold text-2xl text-center '>To The Chat-App</h1>
       </div>
       <div className='w-full h-1/2 bg-zinc-200 relative'>
         <div >
            <h1 className='text-red-500 font-medium text-center text-xl p-3'>User Login</h1>
         </div>
         <Link className='text-red-500 absolute right-10 bottom-24 hover:text-blue-500' to={"/forgetPassword"}>forget password?</Link>
         <div className='flex items-center justify-center'>
            <form onSubmit={handleSubmit(create)}>
                <div className='w-4/5 pl-7'>
                    
                    <Input
                    isRequired
                    type="text"
                    label="Email/Phone"
                    labelPlacement={"outside"}
                    {...register( "contact",{
                        onChange:(e)=>handleInputChange(e.target.value),
                        validate:(value)=>{
                            if(isEmail(value) || isPhoneNumber(value)){ 
                                return
                            }
                            
                            setError("pls give correct email or phone number !!")
                        }
                    })}
                    />

                    <Input
                    isRequired
                    type="password"
                    label="password"
                    labelPlacement={"outside"}
                    {...register("password",{
                        required:true
                    })}
                    />

                    <div className='flex justify-center items-center pt-7'>
                        {loading?(
                            <Button color="primary" isLoading>
                            Loading
                          </Button>
                        ):
                        (
                            <Button color="primary" variant="shadow" type='submit' >
                                Login
                            </Button>
                        )
                    }
                    </div>

            
             </div>

            </form>

         </div>
         {error && <p className="text-red-600 text-center">{error}</p>}
       </div>
    </div>
  )
}

export default LoginComponent
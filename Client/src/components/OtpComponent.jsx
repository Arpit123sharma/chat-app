import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import {useDispatch} from "react-redux"
import {login,logout} from "../store/authSlice.js"
import {useNavigate} from "react-router-dom"
import { Input, Button } from '@nextui-org/react';
import axios from "axios"

    const OtpComponent = () => {
        const { control, handleSubmit,} = useForm();
        const [error,setError] = useState("")
        const [loading,setLoading] = useState(false)
        const dispatch = useDispatch()
        const navigate = useNavigate()
      
        const onSubmit = async(data) => {
            try {
                setLoading(true)
                setError("")
                let otp=""
                for(let n of data.otp){
                  otp+=n
                }
                console.log('OTP Data:', otp);
                const response = await axios.post(`${import.meta.env.VITE_API_URL_HEADER}/user/otpVerification`, {otp}, {
                    withCredentials: true
                });
                console.log(response);
                dispatch(login({
                    userName:response?.data?.data?.userName,
                    dp:response?.data?.data?.dp
                }))
                setLoading(false)
                navigate("/chat-room")

            } catch (error) {
                dispatch(logout())
                setLoading(false)
                setError(error?.response?.data?.data || error?.message)
                console.log("we got an error while handlinhg otp: ",error);
            }
        };

   return (
    <div className='bg-zinc-800 w-3/5 h-3/5 rounded-xl text-white'>
        <div className='m-5'>
          <h1 className='text-2xl text-white font-medium p-3'>Code Verification</h1>
           <p className='pl-3 text-lg'>Enter the code that we've send you on your email</p>
        </div>
        <div className='mt-8'>
        <h2 className='text-center mb-5'>Enter OTP</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center'>
        <div className='flex space-x-3'>
          {[0, 1, 2, 3].map((index) => (
            <Controller
              key={index}
              name={`otp[${index}]`}
              control={control}
              rules={{ required: 'OTP is required', maxLength: { value: 1, message: 'Must be a single digit' }, minLength: { value: 1, message: 'Must be a single digit' } }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  maxLength={1}
                  className='w-10 '
                  aria-label={`OTP digit ${index + 1}`}
                  size='xs'
                  color={"secondary"}
                />
              )}
            />
          ))}
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        
        {loading?(
            <Button className='mt-5' type='submit' color="danger" size="lg" isLoading>
                sending OTP
            </Button>
        )
        :
        (
            <Button className='mt-5' type='submit' color="success" size="lg">
               Verify OTP
            </Button>
        )}
      </form>
        </div>
    </div>
  )
}

export default OtpComponent
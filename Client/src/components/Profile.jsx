import React from 'react'
import {Avatar, Button} from "@nextui-org/react";
import { MdDeleteOutline } from "react-icons/md";
import { ApiHandler } from '../utils/ApiHandler';

function Profile({
    profileData
}) {
    const[value, setValue, loading, error, response] = ApiHandler(`${import.meta.env.VITE_API_URL_HEADER}/requests/`, "get")
  return (
    <div className='w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center'>
       <div className='w-11/12 h-full pt-3 pb-3 relative'>
          <div className='w-full h-1/2 bg-[url(https://images.unsplash.com/photo-1721041879224-ff011603ada5?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] rounded-lg bg-cover bg-center shadow-lg'>

          </div>
          <div className='absolute left-52 top-64'>
            <Avatar src= {profileData?.dp} size="lg" isBordered color='warning' showFallback/>
          </div>
          <div className='w-full h-full flex justify-between'>
            <div>
                <h1>{profileData?.userName}</h1>
                <h1>{profileData?.email}</h1>
                <h1>{profileData?.createdAt}</h1>
            </div>
            <div>
                <div className='flex p-3 gap-3'>
                   {profileData?.requestType === "Arrived" ?(
                     <Button color='success' onClick={()=>{
                        setValue(`acceptRequest/${profileData?.userID}`)
                     }}>Accept</Button>
                   ):(null)
                   }
                   <Button isIconOnly color="warning" >
                       <MdDeleteOutline className='text-lg' onClick={()=>{
                          if (profileData?.requestType === "Arrived") {
                            setValue(`cancelRequest/fromReceiver/${profileData?.userID}`)
                          }else{
                            setValue(`cancelRequest/fromSender/${profileData?.userID}`)
                          }
                       }}/>
                    </Button>
                </div>
            </div>
          </div>
       </div>
    </div>
  )
}

export default Profile
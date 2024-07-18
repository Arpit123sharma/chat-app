import React, { useEffect, useState } from 'react'
import UserComponent from './UserComponent'
import { CircularProgress } from "@nextui-org/react";
import { ApiHandler } from '../utils/ApiHandler'
import Profile from './Profile';

function RequestComponent() {
    const [value, setValue, loading, error, response] = ApiHandler(`${import.meta.env.VITE_API_URL_HEADER}/requests/`, "get")
    const [arrived, setArrived] = useState([])
    const [pending, setPending] = useState([])
    const [profile , setProfile] = useState(false)
    const [profileData,setProfileData] = useState({})

    useEffect(() => {
        if (value !== "AllRequests") setValue("AllRequests")
        if (response?.data?.data) {
            setArrived(response?.data?.data?.requestsArrived)
            setPending(response?.data?.data?.requestPendings)
        }
    }, [response])

    return (
        <div className='w-full h-full  flex'>
            <div className='w-6/12 h-full  relative'>
                {error && (<p className='text-lg font-semibold text-red-500 text-center'>{error}</p>)}
                {loading ? (
                    <div className='absolute top-64 left-1/2'>
                        <CircularProgress color="danger" aria-label="Loading..." size={"lg"} />
                    </div>
                ) : (
                    <div>
                        
                        <div className='w-full h-auto  flex flex-col gap-3 items-center pt-7'>
                            {arrived?.length !== 0 && arrived.map((user, index) => (
                                user.From ? (
                                    <UserComponent
                                        avatar={user.From.dp}
                                        userName={user.From.userName}
                                        key={index}
                                        displayState='Arrived'
                                        text='Arrived Requests'
                                        color='primary'
                                        onClick = {()=>{
                                            setProfile(true)
                                            setProfileData({email:user.From.email,userName:user.From.userName,dp:user.From.dp,createdAt:user.From.createdAt,requestType:"Arrived",userID:user.From._id})
                                        }}
                                        
                                    />
                                ) : (
                                    <p key={index} className='text-red-500'>Invalid user data</p>
                                )
                            ))}

                            {pending?.length !== 0 && pending.map((user, index) => (
                                user.To ? (
                                    <UserComponent
                                        avatar={user.To.dp}
                                        userName={user.To.userName}
                                        key={index}
                                        displayState='Pending'
                                        text='Pending'
                                        color='danger'
                                        onClick = {()=>{
                                            setProfile(true)
                                            setProfileData({email:user.To.email,userName:user.To.userName,dp:user.To.dp,createdAt:user.To.createdAt,requestType:"pending",userID:user.To._id})
                                        }}
                                    />
                                ) : (
                                    <p key={index} className='text-red-500'>Invalid user data</p>
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className='w-6/12 h-full bg-red-500'>
               {profile && <Profile profileData={profileData}/>}
            </div>
        </div>
    )
}

export default RequestComponent

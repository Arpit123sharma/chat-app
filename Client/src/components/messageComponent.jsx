import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import Searching from './Searching';
import { ApiHandler } from '../utils/ApiHandler';
import { CircularProgress } from '@nextui-org/react';
import UserComponent from './UserComponent';
import TextingInterface from './TextingInterface';

function MessageComponent({
    setMessage
}) {
    const [search, setSearch] = useState(false);
    const [value, setValue, loading, error, response] = ApiHandler(`${import.meta.env.VITE_API_URL_HEADER}/`,"get");
    const [value1, setValue1, loading1, error1, response1] = ApiHandler(`${import.meta.env.VITE_API_URL_HEADER}/`,"get");
    const [value2, setValue2, loading2, error2, response2] = ApiHandler(`${import.meta.env.VITE_API_URL_HEADER}/`,"get");

    const [friends, setFriends] = useState([]);
    const [MountTextingInterface,setMountTextingInterface] = useState(false)
    const [textingInterfaceData,setTextingInterfaceData] = useState({})
    const [pendingMessages,setPendingMessages] = useState(new Map())
    

    useEffect(() => {
        if(!value) setValue("Home/friendList");
        if (response?.data?.data) {
            setFriends(response.data.data.friends);
        }
    }, [response]);

    useEffect(()=>{
        if(!value1) setValue1("messages/pendingMessages");
        if(response1?.data?.data?.pendingMessages?.pendingMessages.length > 0 ){
            const messgList = response1?.data?.data?.pendingMessages?.pendingMessages
            
            const map = new Map()
            messgList.forEach(mssg => {
                map.set(mssg.friendId,mssg)
            });

            setPendingMessages(map)
        }
    },[response1])

    useEffect(()=>{
        if (response2?.data?.data?.pendingMessages) {
            const messgList = response2?.data?.data?.pendingMessages
            
            const map = new Map()
            messgList.forEach(mssg => {
                map.set(mssg.friendId,mssg)
            });

            setPendingMessages(map)
        }
        
    },[response2])

    return (
        <div className='w-full h-full flex'>
            <div className='w-6/12 h-full flex flex-col items-center'>
                <div className='w-full flex justify-between items-center p-5'>
                    <h1 className='text-white font-semibold text-3xl'>Chats</h1>
                    {search ? (
                        <IoMdArrowRoundBack className='text-white cursor-pointer text-lg hover:text-xl hover:text-gray-200' onClick={() => setSearch(false)} />
                    ) : (
                        <FaSearch className='text-white cursor-pointer text-lg hover:text-xl hover:text-gray-200' onClick={() => {
                          setSearch(true)
                          setMountTextingInterface(false)
                        }} />
                    )}
                </div>
                <div className='w-full flex-grow pb-3 overflow-y-auto max-h-full no-scrollbar'>
                    {error && (<p className='text-red-500 font-semibold text-lg'>{error}</p>)}
                    {loading ? (
                        <div className='absolute top-64 left-1/2'>
                            <CircularProgress color="danger" aria-label="Loading..." size={"lg"} />
                        </div>
                    ) : (
                        friends && friends.length > 0 ? (
                            friends.map((friend, index) => { 
                                const userId = friend?.friendId?._id
                                let pendingMessageResponse
                                if(pendingMessages.has(userId)){
                                    pendingMessageResponse = pendingMessages.get(userId)
                                }
                                
                                return (                               
                                <div className='p-3 ml-5' key={index} onClick={()=>{
                                  setMountTextingInterface(true)
                                  setTextingInterfaceData({
                                    userName:friend?.friendId?.userName,
                                    dp:friend?.friendId?.dp,
                                    userID:friend?.friendId?._id
                                  })
                                  if(pendingMessages.has(userId)){
                                    setValue2(`messages/readPendingMessages/${friend?.friendId?._id}`)
                                   }

                                }}>   
                                    <UserComponent
                                        userName={friend?.friendId?.userName}
                                        avatar={friend?.friendId?.dp}
                                        _id={friend?.friendId?._id}
                                        displayState='text'
                                        pendingMessageResponse = {pendingMessageResponse}
                                    />
                                </div>
                            )})
                         ) : (
                            (!error && <p className='text-white text-center'>No friends to display</p>)
                        )
                    )}
                </div>
            </div>
            <div className='w-full h-full'>
                {search ? (<Searching />) : (MountTextingInterface ? (<TextingInterface setMountTextingInterface={setMountTextingInterface} textingInterfaceData={textingInterfaceData} setMessage={setMessage}/>):(null))}
            </div>
        </div>
    );
}

export default MessageComponent;

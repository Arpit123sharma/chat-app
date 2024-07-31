import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import Searching from './Searching';
import { ApiHandler } from '../utils/ApiHandler';
import { CircularProgress } from '@nextui-org/react';
import UserComponent from './UserComponent';
import TextingInterface from './TextingInterface';

function MessageComponent() {
    const [search, setSearch] = useState(false);
    const [value, setValue, loading, error, response] = ApiHandler(`${import.meta.env.VITE_API_URL_HEADER}/`, "get");
    const [friends, setFriends] = useState([]);
    const [MountTextingInterface,setMountTextingInterface] = useState(false)
    const [textingInterfaceData,setTextingInterfaceData] = useState({})

    useEffect(() => {
        setValue("Home/friendList");
        if (response?.data?.data) {
            setFriends(response.data.data.friends);
        }
    }, [response]);

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
                            friends.map((friend, index) => (
                                <div className='p-3' key={index} onClick={()=>{
                                  setMountTextingInterface(true)
                                  setTextingInterfaceData({
                                    userName:friend?.friendId?.userName,
                                    dp:friend?.friendId?.dp,
                                    userID:friend?.friendId?._id
                                  })
                                }}>
                                    <UserComponent
                                        userName={friend?.friendId?.userName}
                                        avatar={friend?.friendId?.dp}
                                        _id={friend?.friendId?._id}
                                        displayState='text'
                                    />
                                </div>
                            ))
                        ) : (
                            <p className='text-white text-center'>No friends to display</p>
                        )
                    )}
                </div>
            </div>
            <div className='w-full h-full'>
                {search ? (<Searching />) : (MountTextingInterface ? (<TextingInterface setMountTextingInterface={setMountTextingInterface} textingInterfaceData={textingInterfaceData}/>):(null))}
            </div>
        </div>
    );
}

export default MessageComponent;

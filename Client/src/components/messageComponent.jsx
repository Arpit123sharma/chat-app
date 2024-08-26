import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import {ApiHandler} from '../utils/ApiHandler.js'; // Assuming you have an ApiHandler utility
import UserComponent from './UserComponent';
import TextingInterface from './TextingInterface';
import Searching from './Searching';
import { CircularProgress } from '@nextui-org/react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaSearch } from 'react-icons/fa';

function MessageComponent() {
    const [search, setSearch] = useState(false);
    const [value, setValue, loading, error, response] = ApiHandler(`${import.meta.env.VITE_API_URL_HEADER}/`, "get");
    const [friends, setFriends] = useState([]);
    const [MountTextingInterface, setMountTextingInterface] = useState(false);
    const [textingInterfaceData, setTextingInterfaceData] = useState({});
    const [activeFriendId, setActiveFriendId] = useState("");

    
    // Socket connection from store
    const socket = useSelector((state) => state.socket.socket);
    const userData = useSelector((state) => state.auth.userData); // user data from store

    let num = 0
    const updateFriendList = (time, payload, from, unreadCount = 0) => {
        console.log(" it was running:",++num);
        
        setFriends((prevFriends) => {
            return [...prevFriends].map((friend) => {
                if (friend?.friendId?._id === from) {   
                    return {
                        ...friend,
                        lastMessageDate: time || friend.lastMessageDate,
                        lastMessage: payload,
                        unreadCount:  friend.unreadCount + unreadCount,
                    };
                }
                return friend;
            }).sort((a,b)=>new Date(b.lastMessageDate) - new Date(a.lastMessageDate))
        });
    }

    // Memoized and debounced search handler
    const handleSearch = useCallback(debounce(() => {
        setSearch(true);
        setMountTextingInterface(false);
    }, 100), []);


    useEffect(() => {
        if (socket) {
            socket.on("message_received", (data) => {
                const { from, payload, time } = JSON.parse(data);
                if (from !== activeFriendId) {
                    updateFriendList(time, payload, from, 1);
                } else {
                    updateFriendList(time, payload, from);
                }
            });
        }

        return () => {
            socket.off("message_received", handleMessageReceived);
        };

    }, [socket]);

    useEffect(()=>{

        if (!value) setValue("Home/friendList");

        if (response?.data?.data) {
            setFriends(response.data.data.friends);
        }

    },[response])

    // Handler for when a friend is clicked
    const handleFriendClick = (friend) => {
        setSearch(false)
        setMountTextingInterface(true);
        setTextingInterfaceData({
            userName: friend?.friendId?.userName,
            dp: friend?.friendId?.dp,
            userID: friend?.friendId?._id,
        });
        setActiveFriendId(friend?.friendId?._id);

        // Reset unread count for this friend
        num =0
        setFriends(prevFriends =>
            prevFriends.map(f =>
                f?.friendId?._id === friend.friendId._id
                    ? { ...f, unreadCount: 0 }
                    : f
            )
            
        );
    };

    return (
        <div className='w-full h-full flex'>
            <div className='w-6/12 h-full flex flex-col items-center'>
                <div className='w-full flex justify-between items-center p-5'>
                    <h1 className='text-white font-semibold text-3xl'>Chats</h1>
                    {search ? (
                        <IoMdArrowRoundBack
                            className='text-white cursor-pointer text-lg hover:text-xl hover:text-gray-200'
                            onClick={() => setSearch(false)}
                        />
                    ) : (
                        <FaSearch
                            className='text-white cursor-pointer text-lg hover:text-xl hover:text-gray-200'
                            onClick={handleSearch}
                        />
                    )}
                </div>
                <div className='w-full flex-grow pb-3 overflow-y-auto max-h-full no-scrollbar'>
                    {error ? (
                        <p className='text-red-500 font-semibold text-lg'>{error}</p>
                    ) : loading ? (
                        <div className='absolute top-64 left-1/2'>
                            <CircularProgress color="danger" aria-label="Loading..." size={"lg"} />
                        </div>
                    ) : friends.length > 0 ? (
                        friends.map((friend, index) => (
                            <div className='p-3 ml-5' key={index} onClick={() => handleFriendClick(friend)}>
                                <UserComponent
                                    userName={friend?.friendId?.userName}
                                    avatar={friend?.friendId?.dp}
                                    _id={friend?.friendId?._id}
                                    displayState='text'
                                    pendingMessageResponse={{ unreadCount: friend?.unreadCount, lastMessage: friend?.lastMessage }}
                                    lastMessageDate={friend?.lastMessageDate}
                                />
                            </div>
                        ))
                    ) : (
                        <p className='text-white text-center'>No friends to display</p>
                    )}
                </div>
            </div>
            <div className='w-full h-full'>
                {search ? (
                    <Searching />
                ) : (
                    MountTextingInterface && (
                        <TextingInterface
                            setMountTextingInterface={setMountTextingInterface}
                            textingInterfaceData={textingInterfaceData}
                            setFriends={setFriends}
                            friendsList={friends}
                        />
                    )
                )}
            </div>
        </div>
    );
}

export default MessageComponent;
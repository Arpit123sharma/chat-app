import React, { useEffect } from 'react';
import SideBar from './SideBar';
import { Outlet } from 'react-router-dom';
import { useSelector , useDispatch} from 'react-redux';
import { login } from '../store/authSlice';
import { ApiHandler } from '../utils/ApiHandler';
import io from 'socket.io-client';


function ChatRoom() {

  const dispatch = useDispatch()
  const [value,setValue,loading,error,response] = ApiHandler(`${import.meta.env.VITE_API_URL_HEADER}/`,"get")
  
  useEffect(()=>{
    if (!value) {
      setValue("user/profile")
    }
    if (response?.data?.data) {
      const {userName,dp,_id} = response?.data?.data
      dispatch(login({
        userData:{
           userName,
           dp,
           userID:_id
        }
      }))
    }
  },[response])

  const selector = useSelector((state)=>state.auth.userData)

  useEffect(() => {
    if (selector?.userID) {
        // Connect to the Socket.IO server
        const socket = io(`http://localhost:8000`, {
            query: { id: selector.userID }, // Pass userID in the query parameters
            withCredentials: true,
        });

        // Listen for server messages
        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        socket.on('response', (data) => {
            console.log('Received data from server:', data);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });

        // Cleanup function to disconnect the socket when the component unmounts
        return () => {
            socket.disconnect();
        };
    }
}, [selector?.userID]);

  
  return (
    <div className='w-9/12 h-4/5 flex'>
      <SideBar />
      <div className='flex-grow'>
        <Outlet />
      </div>
    </div>
  );
}

export default ChatRoom;

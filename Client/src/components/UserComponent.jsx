import React, { useState , useEffect} from 'react';
import { Avatar, Button,Badge} from '@nextui-org/react';
import {NotificationIcon} from "../utils/NotificationIcon";
import axios from 'axios';

function UserComponent({ avatar, userName, _id, displayState="",onClick,pendingMessageResponse,lastMessageDate}) {
  const [error, setError] = useState('');
  const [cancelRequest, setCancelRequest] = useState(false);
  const [timeOrDate,setTimeOrDate] = useState("")
  const colorArray = ["primary","secondary","success","warning","danger"]

  let message = ""
  if (pendingMessageResponse?.lastMessage.length > 15) {
    message = pendingMessageResponse?.lastMessage.slice(0,16) + "..."
  }
  else if(pendingMessageResponse?.lastMessage.length > 0){
    message = pendingMessageResponse?.lastMessage
  }
  


  useEffect(() => {
     if(lastMessageDate){
      let calculatedTimeOrDate = "";
      const lastmessageTime = new Date(lastMessageDate);
      if (isNaN(lastmessageTime.getTime())) { // Check if date is valid
          calculatedTimeOrDate = "No Date";
      } else {
          const todayDate = new Date();
          if (todayDate.toDateString() === lastmessageTime.toDateString()) {
              calculatedTimeOrDate = `${lastmessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          } else {
              calculatedTimeOrDate = `${lastmessageTime.toLocaleDateString()}`;
          }
      }
      setTimeOrDate(calculatedTimeOrDate);
     }
}, [lastMessageDate]);

  const sendRequest = async (receiversID = _id) => {
    try {
      setError('');

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_HEADER}/requests/sendRequest/${receiversID}`,
        {
          withCredentials: true,
        }
      );

      setCancelRequest(true);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <div className="w-11/12 h-auto flex justify-between items-center p-5 bg-zinc-900 rounded-xl cursor-pointer" onClick={onClick}>
      <div className='w-auto h-full flex items-center gap-3'>
      {
        displayState === "Arrived" && (
          <Badge content="new" color="danger" size="sm">
            <Avatar
              isBordered
              radius="md"
              color="danger"
              src={avatar}
            />
          </Badge>
        )
      }
      {
        displayState === "Pending" && (
          <Badge
            isOneChar
            content={<NotificationIcon size={12} />}
            color="danger"
            shape="circle"
            placement="top-right"
          >
            <Avatar
              radius="full"
              size="lg"
              src={avatar}
              showFallback
            />
          </Badge>
        )
      }
      {
        displayState === "button" && (
          <Avatar isBordered color="danger" src={avatar} showFallback/>
        )
      }
      {
        displayState === "text" && (
          <Avatar isBordered color={colorArray[Math.floor(Math.random()*5 )]} src={avatar} showFallback />
        )
      }
        <div>
          <h2 className='text-white font-medium text-lg'>{userName}</h2>
          <h3 className='text-white font-normal text-sm mt-2'>{message}</h3>
        </div>
      </div>
      {
        displayState === "button" && (
          cancelRequest ? (
            <Button color="error">Cancel Request</Button>
          ) : (
            <Button color="success" onClick={() => sendRequest()}>
              Request
            </Button>
          )
          
        )      
      }

      {
        displayState === "text" && (
          pendingMessageResponse?.unreadCount?(
          <div className='h-auto w-auto'>
          <h3 className='text-white text-xs'>
            {timeOrDate}
          </h3>
          <div className='rounded-full bg-sky-400 text-white font-semibold flex  w-6 h-6 justify-center items-center mt-2 ml-2'>
            {pendingMessageResponse?.unreadCount}
          </div>
          </div>

          ):pendingMessageResponse?.lastMessage.trim()?(
            <div className='w-auto h-full'>
              <h3 className='text-white text-xs mt-0'>
                {timeOrDate}
              </h3>
            </div>
          ):null
        )
      }
      
    </div>
  );
}

export default UserComponent;

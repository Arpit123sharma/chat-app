import React, { useState } from 'react';
import { Avatar, Button,Badge} from '@nextui-org/react';
import {NotificationIcon} from "../utils/NotificationIcon";
import axios from 'axios';

function UserComponent({ avatar, userName, _id, displayState="",onClick,pendingMessageResponse}) {
  const [error, setError] = useState('');
  const [cancelRequest, setCancelRequest] = useState(false);
  const colorArray = ["primary","secondary","success","warning","danger"]

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
        <h2 className='text-white font-medium text-lg'>{userName}</h2>
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
          <div className='rounded-full bg-lime-400 text-white font-semibold flex  w-8 h-8 justify-center items-center'>
            {pendingMessageResponse?.unreadCount}
          </div>):null
        )
      }
      
    </div>
  );
}

export default UserComponent;

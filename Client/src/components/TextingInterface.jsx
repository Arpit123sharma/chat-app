import React, { useState } from 'react'
import { Avatar , Input } from '@nextui-org/react'
import { BsFillFileRuledFill } from "react-icons/bs";
import { IoMdMic } from "react-icons/io";
import { LuSend } from "react-icons/lu";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdCall } from "react-icons/md";
import { FaVideo } from "react-icons/fa6";
import { SlOptionsVertical } from "react-icons/sl";
import { useSelector } from 'react-redux';
import socketService from '../utils/socketService';

function TextingInterface({
  textingInterfaceData,
  setMountTextingInterface,
  setFriends,
  friendsList
}) {
  const selector = useSelector((state) => state.auth.userData);
  const [online, setOnline] = useState(false);
  const [inputText, setInputText] = useState("");
  const socket = socketService.socket

  const updateFriendList = ()=>{
    setFriends((prevFriends)=>{ 
      return [...prevFriends].map((friend)=>{
        if (friend.friendId._id === textingInterfaceData?.userID) {
          return {
            ...friend,
            lastMessageDate:Date.now(), 
            lastMessage:inputText
          }
        }
        return friend ;
      }).sort((a,b)=>new Date(b.lastMessageDate) - new Date(a.lastMessageDate))
    })
 }

  const handleSendMessage = () => {
    const message = {
      from: selector?.userID,
      to: textingInterfaceData?.userID,
      payload: inputText,
      time: new Date(),
      receiver: "individual",
      payloadType: "text",
    };
    socket.emit("message_sended", JSON.stringify(message));
    console.log(message, "this message is sent to the chat-server");
    console.log(socket.id);
    setInputText("");
  };


  return (
    <div className='w-full h-full rounded-tr-lg overflow-hidden rounded-br-lg relative'>
      <div className='w-full h-auto p-2 flex justify-between items-center bg-slate-950'>
        <div className='flex gap-5 justify-center items-center p-2'>
          <IoMdArrowRoundBack className='text-white cursor-pointer text-xl' onClick={() => setMountTextingInterface(false)} />
          <Avatar src={textingInterfaceData?.dp} size="md" className='cursor-pointer' isBordered color='success' showFallback />
          <div>
            <h1 className='font-semibold text-white text-lg'>{textingInterfaceData?.userName}</h1>
            {online && (<h3 className='text-[#33deff]'>Online</h3>)}
          </div>
        </div>
        <div className='p-2 text-center text-white flex justify-center gap-7 items-center'>
          <MdCall className='text-white cursor-pointer text-xl' onClick={() => setOnline(!online)} />
          <FaVideo className='text-white cursor-pointer text-xl' />
          <SlOptionsVertical className='text-white cursor-pointer text-xl' />
        </div>
      </div>
      <div className='w-full h-auto p-3 absolute bottom-0 flex justify-between items-center gap-2'>
        <BsFillFileRuledFill className='text-white cursor-pointer text-xl' />
        <IoMdMic className='text-white cursor-pointer text-xl' />
        <Input
          radius="lg"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/70",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/70",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <LuSend className='text-white cursor-pointer text-xl' onClick={()=>{
          handleSendMessage()
          updateFriendList()
        }} />
      </div>
      <div className='w-full h-full'>    

      </div>
    </div>
  );
}

export default TextingInterface;

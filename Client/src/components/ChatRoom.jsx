import React from 'react'
import SideBar from './SideBar'
import {Outlet} from "react-router-dom"


function ChatRoom() {
  return (
    <div className='w-9/12 h-4/5 flex'>
      <SideBar />
      <div className='flex-grow'>
        <Outlet />
      </div>
    </div>
  )
}

export default ChatRoom
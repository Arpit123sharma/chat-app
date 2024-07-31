import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { HiMiniArrowsRightLeft } from "react-icons/hi2";
import { RiLogoutBoxLine } from "react-icons/ri";
import {Avatar} from "@nextui-org/react";

function SideBar() {
  return (
    <div className='w-1/12 relative  h-full'>
       <div className='flex flex-col justify-center items-center absolute top-1/4 h-2/5 w-full  gap-5'>
      <NavLink to="/Chats/" className={({ isActive }) => isActive ? "text-[#33deff]" : "text-gray-400 text-xl hover:text-[#33deff]"}>
        <FaUser />
      </NavLink>

      <NavLink to="/Chats/group" className={({ isActive }) => isActive ? "text-blue-500" : "text-gray-400 text-xl hover:text-[#33deff]"}>
        <FaUserGroup />
      </NavLink>

      <NavLink to="/Chats/requests" className={({ isActive }) => isActive ? "text-blue-500" : "text-gray-400 text-xl hover:text-[#33deff]"}>
        <HiMiniArrowsRightLeft />
      </NavLink>
      
      
      <RiLogoutBoxLine className='text-gray-400 text-xl hover:text-[#ffbd33] cursor-pointer' title='logout'/>
      
       
      
    </div>
       <div className='absolute bottom-1 h-1/5 flex justify-center items-center w-full'>
         <Avatar isBordered color="danger" src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
       </div>
    </div>
  )
}

export default SideBar
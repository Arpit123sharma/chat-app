import React, { useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import Searching from './Searching';

function MessageComponent() {
    const [search,setSearch] = useState(false)
  return (
    <div className='w-full h-full flex'>
       <div className='w-6/12 h-full  flex flex-col items-center'>
          <div className='w-full flex justify-between items-center p-5 '>
             <h1 className='text-white font-semibold text-3xl'>Chats</h1>
             {search ?(<IoMdArrowRoundBack className='text-white cursor-pointer text-lg hover:text-xl hover:text-gray-200' onClick={()=>setSearch(false)}/>
              ):(
              <FaSearch className='text-white cursor-pointer text-lg hover:text-xl hover:text-gray-200' onClick={()=>setSearch(true)}/>)}            
          </div>
          <div className='w-full flex-grow p-3 '>

          </div>
       </div>
       <div className='w-full h-full '>
         {search ? (<Searching />) :(<div></div>)}
       </div>
    </div>
  )
}

export default MessageComponent
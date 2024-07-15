import React from 'react'
import { Avatar, Button } from '@nextui-org/react'

function UserComponent({
    avatar,
    userName
}) {
  return (
    <div className='w-9/12 h-auto flex justify-between items-center p-5 bg-zinc-700 rounded-full'>
      <Avatar isBordered color="warning" src={avatar} />
      <h2>{userName}</h2>
      <Button color="danger">
        request
      </Button> 
    </div>
  )
}

export default UserComponent
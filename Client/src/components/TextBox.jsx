import React from 'react'

function TextBox({
    messageType,
    texter
}) {
  return (
    <div className='w-auto h-auto '>
      {messageType === "text" && (
        texter === "receiver" && (
            <div className='bg-yellow-600 text-white p-2 text-start'>
                {data}
            </div>
        )
        (texter === "sender" && (
            <div className='bg-white text-black p-2 text-start'>
                {data}
            </div>
        )
      ))}  
    </div>
  )
}

export default TextBox
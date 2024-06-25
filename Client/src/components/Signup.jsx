import React from 'react'
import {Image} from "@nextui-org/image";

function SignupComponent() {

  return (
    <div className='w-9/12 h-4/5 rounded-3xl bg-purple-700 flex overflow-hidden'>
       <div className='m-8 w-1/2 h-full'>
          <h1>TEXT</h1>
       </div>
       <div className='w-1/2 h-full bg-zinc-50'>
          <Image
            width={700}
            radius='none'
            // loading='easy'
            alt="NextUI hero Image"
            src="https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
       </div>
    </div>
  )
}

export default SignupComponent
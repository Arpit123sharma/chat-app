import './App.css'
import { useNavigate } from 'react-router-dom';
import {CircularProgress} from "@nextui-org/react";
import {Button} from "@nextui-org/react";
import { useEffect,useState } from 'react';
import axios from "axios"
function App() {
  const navigate = useNavigate()
  
  useEffect(()=>{
    ;(
      async()=>{
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL_HEADER}/user/regenerateToken`,{
            withCredentials:true
          })

        } catch (error) {
          console.log(error);
        }
      }
    )()
  },[])
  return (
    
    <>
      (<div className='flex gap-10'>
        <h1 className='text-center'>Home</h1>
        <Button onClick={()=>{
          navigate("/signup")
        }}>
          signup
        </Button>

        <Button onClick={()=>{
          navigate("/login")
        }}>
          login
        </Button>
      </div>)
    </>
  )
}

export default App

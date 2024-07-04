import './App.css'
import { useNavigate } from 'react-router-dom';
import {Button} from "@nextui-org/react";
function App() {
  const navigate = useNavigate()

  return (
    <>
      <div className='flex gap-10'>
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
      </div>
    </>
  )
}

export default App

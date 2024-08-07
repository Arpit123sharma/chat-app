// main.tsx or main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import {NextUIProvider} from '@nextui-org/react'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import {Provider} from "react-redux"
import store from './store/store'
import App from './App'
import Signup from './pages/signup'
import Login from './pages/Login'
import Otp from './pages/Otp'
import Chat from './pages/Chat'
import MessageComponent from './components/messageComponent'
import './index.css'
import RequestComponent from './components/request'

const router = createBrowserRouter([
  {
    path:"/",
    element:<App />
  },
  {
    path:"/signup",
    element:<Signup />
  },
  {
    path:"/login",
    element:<Login />,
    
  },
  {
    path:"/otpVerification",
    element:<Otp />,    
  },
  {
    path:"/chats",
    element:<Chat />,    
    children:[{
      path:"/chats/",
      element:<MessageComponent />,  
    },
    {
      path:"/chats/requests",
      element:<RequestComponent />,  
    },
  ]
  },

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
       <Provider store={store}>
          <RouterProvider router={router} />
       </Provider>
    </NextUIProvider>
  </React.StrictMode>,
)
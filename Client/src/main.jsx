// main.tsx or main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import {NextUIProvider} from '@nextui-org/react'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import {Provider} from "react-redux"
import store from './store/store'
import App from './App'
import './index.css'

const router = createBrowserRouter([
  {
    path:"/",
    element:<App />
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
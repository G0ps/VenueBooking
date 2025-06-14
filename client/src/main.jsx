
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './manager/App.jsx'
import Login from './components/LoginForm/Login.jsx'
import Register from './components/RegisterForm/Register.jsx'
import Admin from './Admin/Admin.jsx'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/manager',
    element: <App />
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: '/admin',
    element : < Admin />
  }
])


createRoot(document.getElementById('root')).render(


    <RouterProvider router={router} />
)

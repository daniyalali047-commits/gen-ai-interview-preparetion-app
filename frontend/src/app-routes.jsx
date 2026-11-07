import {createBrowserRouter, Navigate} from 'react-router'
import Login from './features/authenticaton/pages/login'
import Register from './features/authenticaton/pages/register'
import Protected from './features/authenticaton/componemts/protectedroutes.jsx'

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path:"/",
        element:<Protected><h1>Home Page</h1></Protected>
    }
])
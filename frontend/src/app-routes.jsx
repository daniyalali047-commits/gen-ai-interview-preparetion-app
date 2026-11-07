import {createBrowserRouter, Navigate} from 'react-router'
import Login from './features/authenticaton/pages/login'
import Register from './features/authenticaton/pages/register'

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
        element:<h1>Home PAge</h1>
    }
])
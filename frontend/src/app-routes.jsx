import { createBrowserRouter, Navigate } from 'react-router'
import Login from './features/authenticaton/pages/login'
import Register from './features/authenticaton/pages/register'
import Protected from './features/authenticaton/componemts/protectedroutes.jsx'
import Homepage from './features/interview/pages/homepage.jsx'
import Interview from './features/interview/pages/interview.jsx'

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
        path: "/",
        element: <Navigate to="/login" replace />
    },
    {
        path: "/home",
        element: <Protected><Homepage /></Protected>
    },

    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
])
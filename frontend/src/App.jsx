import { RouterProvider } from 'react-router'
import { router } from './app-routes.jsx'
import { AuthProvider } from './features/authenticaton/auth.context.jsx'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App

import { useContext } from 'react'
import { AuthContext } from '../auth.context'
import { login, register, logout } from '../services/auth-api.js'

export const UseAuth = () => {
  const context = useContext(AuthContext)
  const { user, setUser, loading, setLoading } = context

  const handleLogin = async ({ email, password }) => {
    setLoading(true)

    try {
      const data = await login({ email, password })

      if (data?.user) {
        setUser(data.user)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true)

    try {
      const data = await register({ username, email, password })

      if (data?.user) {
        setUser(data.user)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)

    try {
      await logout()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, handleLogin, handleLogout, handleRegister }
}
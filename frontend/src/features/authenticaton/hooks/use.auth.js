import { useContext  , useEffect } from 'react'
import { AuthContext } from '../auth.context'
import { login, register, logout } from '../services/auth-api.js'
import { getME } from '../services/auth-api.js'

export const UseAuth = () => {
  const context = useContext(AuthContext)
  const { user, setUser, loading, setLoading } = context

  const handleLogin = async ({ email, password }) => {
    setLoading(true)

    try {
      const data = await login({ email, password })

      if (data?.user) {
        setUser(data.user)
        return data.user
      }

      return null
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true)

    try {
      const data = await register({ username, email, password })

      if (data?.user) {
        return data.user
      }

      return null
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

    useEffect(() => {
    const getUserAndSet = async () => {
      try {
        const data = await getME()
        setUser(data?.user ?? null)
      } catch (error) {
        console.error('Failed to fetch current user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUserAndSet()
  }, [])

  return { user, loading, handleLogin, handleLogout, handleRegister }
}
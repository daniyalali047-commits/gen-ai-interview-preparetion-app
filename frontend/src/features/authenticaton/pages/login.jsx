import React, { useState } from 'react'
import { UseAuth } from '../hooks/use.auth.js'
import { useNavigate } from 'react-router'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { loading, handleLogin } = UseAuth()
  const Navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await handleLogin({ email, password })

      if (user) {
        Navigate("/home")
      } else {
        window.alert('Invalid credentials. The email or password is incorrect.')
      }
    } catch (error) {
      window.alert(error.response?.data?.message || 'Invalid credentials. The email or password is incorrect.')
    }
  }

  if(loading){
    return (<main><h1>Loading...</h1></main>)
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">Welcome back</div>
        <h1>Sign in</h1>
        <p className="auth-subtitle">Access your workspace and continue where you left off.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="input-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="switch-text">
          Don’t have an account? <a href="/register">Create one</a>
        </p>
      </div>
    </main>
  )
}

export default Login
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { UseAuth } from '../hooks/use.auth'

const Register = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const {loading , handleRegister} = UseAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await handleRegister({ username, email, password })

      if (user) {
        navigate('/login')
      }
    } catch (error) {
      window.alert(error.response?.data?.message || 'Unable to create your account. Please try again.')
    }
  }
  

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">Join us</div>
        <h1>Create account</h1>
        <p className="auth-subtitle">Start building your profile and manage your projects with ease.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john_doe"
            />
          </div>

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
                placeholder="Create a strong password"
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
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="switch-text">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </main>
  )
}

export default Register
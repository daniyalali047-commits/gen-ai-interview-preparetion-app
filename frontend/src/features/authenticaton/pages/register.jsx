import React, { useState } from 'react'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
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
            <input id="username" type="text" placeholder="john_doe" />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="input-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
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

          <button type="submit" className="primary-btn">Register</button>
        </form>

        <p className="switch-text">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </main>
  )
}

export default Register
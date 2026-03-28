'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ChefHat, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }
    window.location.href = '/'
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '1.5px solid #e5e7eb',
    fontSize: 15,
    outline: 'none',
    background: '#fff',
    color: '#374151',
    transition: 'border-color 0.15s',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e6f7f6 0%, #f8fafb 60%)',
        padding: 16,
      }}
    >
      <div
        className="animate-fade-in-up"
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 20,
          padding: 40,
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: '#00B4A6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <ChefHat size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e' }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6 }}>Sign in to your Meal Prep account</p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: 14,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Email address
            </label>
            <input
              type="email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
              placeholder="you@example.com"
              onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                style={{ ...inputStyle, paddingRight: 44 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
                placeholder="••••••••"
                onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
                onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  display: 'flex',
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 10,
              border: 'none',
              background: loading ? '#9ca3af' : '#00B4A6',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 4,
              transition: 'background 0.15s',
            }}
          >
            {loading && <span className="spinner" />}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7280' }}>
          No account yet?{' '}
          <a
            href="/register"
            style={{ color: '#00B4A6', fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}
          >
            Create one
          </a>
        </div>
      </div>
    </div>
  )
}

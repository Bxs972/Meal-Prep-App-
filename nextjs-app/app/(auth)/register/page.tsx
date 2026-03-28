'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ChefHat, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = async () => {
    setError('')
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Create profile
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
      })
    }

    setSuccess(true)
    setLoading(false)

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = '/'
    }, 1500)
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
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e' }}>Create account</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6 }}>Start meal prepping smarter</p>
        </div>

        {success ? (
          <div
            style={{
              padding: '16px',
              borderRadius: 10,
              background: '#f0fdf4',
              border: '1px solid #22c55e',
              color: '#16a34a',
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Account created! Redirecting...
          </div>
        ) : (
          <>
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
                  Full name
                </label>
                <input
                  type="text"
                  style={inputStyle}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email"
                  style={inputStyle}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Min 6 characters"
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

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  style={inputStyle}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRegister() }}
                  placeholder="••••••••"
                  onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
                />
              </div>

              <button
                onClick={handleRegister}
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
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7280' }}>
              Already have an account?{' '}
              <a
                href="/login"
                style={{ color: '#00B4A6', fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}
              >
                Sign in
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

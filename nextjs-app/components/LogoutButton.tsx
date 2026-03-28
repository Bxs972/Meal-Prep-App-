'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '10px 16px',
        borderRadius: 8,
        border: 'none',
        background: 'none',
        color: '#ef4444',
        fontSize: 14,
        fontWeight: 500,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#fef2f2'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'none'
      }}
    >
      {loading ? (
        <span className="spinner" style={{ borderTopColor: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }} />
      ) : (
        <LogOut size={16} />
      )}
      Sign out
    </button>
  )
}

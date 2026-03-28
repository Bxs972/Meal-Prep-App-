'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { LogoutButton } from './LogoutButton'
import { X, User, BookOpen, CalendarDays, ShoppingCart } from 'lucide-react'
import type { Profile } from '@/types/database'

interface Stats {
  recipes: number
  plans: number
  shopping: number
}

export function ProfileModal({ onClose }: { onClose: () => void }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<Stats>({ recipes: 0, plans: 0, shopping: 0 })
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setEmail(user.email ?? '')

    const [profileRes, recipesRes, plansRes, shoppingRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('recipes').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('weekly_plans').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('shopping_items').select('id', { count: 'exact' }).eq('user_id', user.id),
    ])

    setProfile(profileRes.data)
    setStats({
      recipes: recipesRes.count ?? 0,
      plans: plansRes.count ?? 0,
      shopping: shoppingRes.count ?? 0,
    })
    setLoading(false)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 420,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: '#00B4A6', padding: '32px 24px 20px', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
            }}
          >
            <X size={16} />
          </button>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: '3px solid rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="avatar"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <User size={32} color="rgba(255,255,255,0.9)" />
            )}
          </div>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {loading ? '...' : (profile?.full_name || 'User')}
            </div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{email}</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#e5e7eb' }}>
          {[
            { label: 'Recipes', value: stats.recipes, icon: BookOpen },
            { label: 'Planned', value: stats.plans, icon: CalendarDays },
            { label: 'Shopping', value: stats.shopping, icon: ShoppingCart },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} style={{ background: '#fff', padding: '20px 16px', textAlign: 'center' }}>
              <Icon size={20} color="#00B4A6" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e' }}>{loading ? '-' : value}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ padding: '16px 24px 24px' }}>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

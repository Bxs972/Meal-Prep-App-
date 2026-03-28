'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { ChefHat, CalendarDays, ShoppingCart, BarChart3, Plus, ArrowRight } from 'lucide-react'
import type { Recipe, WeeklyPlan } from '@/types/database'
import { format, startOfWeek, endOfWeek } from 'date-fns'

export default function HomePage() {
  const [userName, setUserName] = useState('')
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([])
  const [todayPlans, setTodayPlans] = useState<WeeklyPlan[]>([])
  const [weeklyCount, setWeeklyCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = format(new Date(), 'yyyy-MM-dd')
    const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
    const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')

    const [profileRes, recipesRes, todayRes, weekRes] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', user.id).single(),
      supabase.from('recipes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(4),
      supabase.from('weekly_plans').select('*, recipes(*)').eq('user_id', user.id).eq('planned_date', today),
      supabase.from('weekly_plans').select('id', { count: 'exact' }).eq('user_id', user.id).gte('planned_date', weekStart).lte('planned_date', weekEnd),
    ])

    const name = profileRes.data?.full_name ?? user.email?.split('@')[0] ?? 'Chef'
    setUserName(name)
    setRecentRecipes((recipesRes.data as Recipe[]) ?? [])
    setTodayPlans((todayRes.data as WeeklyPlan[]) ?? [])
    setWeeklyCount(weekRes.count ?? 0)
    setLoading(false)
  }

  const mealTypes = [
    { label: 'Breakfast', href: '/recipes?category=breakfast', color: '#fffbeb', text: '#d97706', emoji: '🌅' },
    { label: 'Lunch', href: '/recipes?category=lunch', color: '#f0fdf4', text: '#16a34a', emoji: '🌞' },
    { label: 'Dinner', href: '/recipes?category=dinner', color: '#eff6ff', text: '#2563eb', emoji: '🌙' },
    { label: 'Snack', href: '/recipes?category=snack', color: '#fdf4ff', text: '#9333ea', emoji: '🍎' },
  ]

  const quickLinks = [
    { label: 'Weekly Plan', href: '/plan', icon: CalendarDays, color: '#00B4A6', bg: '#e6f7f6' },
    { label: 'Shopping', href: '/shopping', icon: ShoppingCart, color: '#f97316', bg: '#fff7ed' },
    { label: 'Analytics', href: '/stats', icon: BarChart3, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'New Recipe', href: '/recipes/new', icon: Plus, color: '#22c55e', bg: '#f0fdf4' },
  ]

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Greeting */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>
          {loading ? 'Loading...' : `What are we cooking today${userName ? `, ${userName.split(' ')[0]}` : ''}?`}
        </h1>
        <p style={{ fontSize: 15, color: '#6b7280' }}>
          {format(new Date(), 'EEEE, MMMM d')} — {weeklyCount > 0 ? `${weeklyCount} meal${weeklyCount !== 1 ? 's' : ''} planned this week` : 'No meals planned yet'}
        </p>
      </div>

      {/* Meal type cards */}
      <section>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#374151', marginBottom: 16 }}>Browse by meal type</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
          {mealTypes.map((mt) => (
            <Link
              key={mt.label}
              href={mt.href}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="card-hover"
                style={{
                  background: mt.color,
                  borderRadius: 14,
                  padding: '20px 16px',
                  border: `1px solid ${mt.color}`,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 10 }}>{mt.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: mt.text }}>{mt.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#374151', marginBottom: 16 }}>Quick access</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {quickLinks.map(({ label, href, icon: Icon, color, bg }) => (
            <Link key={label} href={href} style={{ textDecoration: 'none' }}>
              <div
                className="card-hover"
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's meals */}
      {todayPlans.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#374151' }}>Today's meals</h2>
            <Link href="/plan" style={{ fontSize: 13, color: '#00B4A6', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Full plan <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todayPlans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '14px 16px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 8, background: '#f3f4f6', overflow: 'hidden', flexShrink: 0 }}>
                  {plan.recipes?.image_url ? (
                    <img src={plan.recipes.image_url} alt={plan.recipes.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🍽️</div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{plan.recipes?.title}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', textTransform: 'capitalize', marginTop: 2 }}>{plan.meal_type}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent recipes */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#374151' }}>Recent recipes</h2>
          <Link href="/recipes" style={{ fontSize: 13, color: '#00B4A6', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            See all <ArrowRight size={13} />
          </Link>
        </div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <div className="skeleton" style={{ height: 140 }} />
                <div style={{ padding: 12 }}>
                  <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 12, width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : recentRecipes.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 12, padding: '32px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👨‍🍳</div>
            <p style={{ color: '#6b7280', marginBottom: 16 }}>No recipes yet. Create your first one!</p>
            <Link
              href="/recipes/new"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 8,
                background: '#00B4A6',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <Plus size={16} /> Create recipe
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {recentRecipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`} style={{ textDecoration: 'none' }}>
                <div className="card-hover" style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                  <div style={{ height: 140, background: '#f3f4f6' }}>
                    {recipe.image_url ? (
                      <img src={recipe.image_url} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🍽️</div>
                    )}
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {recipe.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3, textTransform: 'capitalize' }}>{recipe.category}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

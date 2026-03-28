'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { StatsCards } from '@/components/analytics/StatsCards'
import { MacroChart } from '@/components/analytics/MacroChart'
import { WeeklyChart } from '@/components/analytics/WeeklyChart'
import { CategoryChart } from '@/components/analytics/CategoryChart'
import { ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react'
import type { Recipe, WeeklyPlan } from '@/types/database'
import { format, startOfWeek, addWeeks, subWeeks, addDays } from 'date-fns'

export default function StatsPage() {
  const [currentWeek, setCurrentWeek] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [plans, setPlans] = useState<WeeklyPlan[]>([])
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (userId) loadData()
  }, [userId, currentWeek])

  const init = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUserId(user.id)
  }

  const loadData = async () => {
    setLoading(true)
    const supabase = createClient()

    const weekStart = format(currentWeek, 'yyyy-MM-dd')
    const weekEnd = format(addDays(currentWeek, 6), 'yyyy-MM-dd')

    const [recipesRes, plansRes] = await Promise.all([
      supabase.from('recipes').select('*').eq('user_id', userId),
      supabase
        .from('weekly_plans')
        .select('*, recipes(*)')
        .eq('user_id', userId)
        .gte('planned_date', weekStart)
        .lte('planned_date', weekEnd),
    ])

    setRecipes((recipesRes.data as Recipe[]) ?? [])
    setPlans((plansRes.data as WeeklyPlan[]) ?? [])
    setLoading(false)
  }

  const weekLabel = `${format(currentWeek, 'MMM d')} – ${format(addDays(currentWeek, 6), 'MMM d, yyyy')}`

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 10 }}>
            <BarChart3 size={26} color="#00B4A6" />
            Analytics
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>{weekLabel}</p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setCurrentWeek((w) => subWeeks(w, 1))}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#374151' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#374151' }}
          >
            This week
          </button>
          <button
            onClick={() => setCurrentWeek((w) => addWeeks(w, 1))}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#374151' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 90, borderRadius: 12 }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="skeleton" style={{ height: 320, borderRadius: 12 }} />
            <div className="skeleton" style={{ height: 320, borderRadius: 12 }} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <StatsCards recipes={recipes} plans={plans} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
            {/* Macro distribution */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 16 }}>Macro Distribution</h3>
              <MacroChart plans={plans} />
            </div>

            {/* Meals by type */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 16 }}>Meals by Type</h3>
              <CategoryChart plans={plans} />
            </div>
          </div>

          {/* Calories per day */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 16 }}>Calories per Day</h3>
            <WeeklyChart plans={plans} />
          </div>

          {/* Recipe stats */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 16 }}>Recipe library</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
              {[
                { label: 'Total recipes', value: recipes.length },
                { label: 'Public recipes', value: recipes.filter((r) => r.is_public).length },
                { label: 'Easy recipes', value: recipes.filter((r) => r.difficulty === 'easy').length },
                { label: 'With nutrition info', value: recipes.filter((r) => r.nutritional_info).length },
              ].map(({ label, value }) => (
                <div key={label} style={{ textAlign: 'center', padding: '14px', background: '#f9fafb', borderRadius: 10 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#00B4A6' }}>{value}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

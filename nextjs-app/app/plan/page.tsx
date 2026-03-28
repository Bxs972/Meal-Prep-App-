'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { MealPlanDisplay } from '@/components/meal-plan/MealPlanDisplay'
import { ToastContainer } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
// P1 BUG FIX: addDays was missing — now properly imported
import { format, startOfWeek, addWeeks, subWeeks, addDays } from 'date-fns'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import type { WeeklyPlan, Recipe } from '@/types/database'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack']

export default function PlanPage() {
  const [currentWeek, setCurrentWeek] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [plans, setPlans] = useState<WeeklyPlan[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const { toasts, success, error, removeToast } = useToast()

  useEffect(() => {
    initUser()
  }, [])

  useEffect(() => {
    if (userId) loadPlans()
  }, [userId, currentWeek])

  const initUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUserId(user.id)
  }

  const loadPlans = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    const weekStart = format(currentWeek, 'yyyy-MM-dd')
    const weekEnd = format(addDays(currentWeek, 6), 'yyyy-MM-dd')

    const [plansRes, recipesRes] = await Promise.all([
      supabase
        .from('weekly_plans')
        .select('*, recipes(*)')
        .eq('user_id', userId)
        .gte('planned_date', weekStart)
        .lte('planned_date', weekEnd),
      supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId)
        .order('title'),
    ])

    setPlans((plansRes.data as WeeklyPlan[]) ?? [])
    setRecipes((recipesRes.data as Recipe[]) ?? [])
    setLoading(false)
  }, [userId, currentWeek])

  // P1 BUG FIX: correctly compute the date for each day using addDays
  const getDateForDay = (day: string): string => {
    const dayIndex = DAYS.indexOf(day)
    // dayIndex = 0 → Monday = currentWeek, 6 → Sunday = currentWeek + 6
    return format(addDays(currentWeek, dayIndex), 'yyyy-MM-dd')
  }

  const handleSelectRecipe = async (recipeId: string, date: string, mealType: string) => {
    const supabase = createClient()

    // Check for duplicate (UNIQUE constraint: user_id + planned_date + meal_type)
    const existing = plans.find(
      (p) => p.planned_date === date && p.meal_type === mealType
    )
    if (existing) {
      error('This slot is already taken. Remove the existing meal first.')
      return
    }

    const { data, error: insertError } = await supabase
      .from('weekly_plans')
      .insert({ user_id: userId, recipe_id: recipeId, planned_date: date, meal_type: mealType })
      .select('*, recipes(*)')
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        error('This slot is already taken.')
      } else {
        error('Failed to add meal: ' + insertError.message)
      }
      return
    }

    setPlans((prev) => [...prev, data as WeeklyPlan])
    success('Meal added to your plan!')
  }

  const handleDeletePlan = async (planId: string) => {
    const supabase = createClient()
    const { error: deleteError } = await supabase
      .from('weekly_plans')
      .delete()
      .eq('id', planId)

    if (deleteError) {
      error('Failed to remove meal.')
      return
    }

    setPlans((prev) => prev.filter((p) => p.id !== planId))
    success('Meal removed from plan.')
  }

  const weekLabel = `${format(currentWeek, 'MMM d')} – ${format(addDays(currentWeek, 6), 'MMM d, yyyy')}`

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CalendarDays size={26} color="#00B4A6" />
            Weekly Plan
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>{weekLabel}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setCurrentWeek((w) => subWeeks(w, 1))}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1.5px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#374151',
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1.5px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              color: '#374151',
            }}
          >
            Today
          </button>
          <button
            onClick={() => setCurrentWeek((w) => addWeeks(w, 1))}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1.5px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#374151',
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
          <div className="spinner" style={{ width: 36, height: 36, borderTopColor: '#00B4A6', borderColor: 'rgba(0,180,166,0.2)' }} />
        </div>
      ) : (
        <MealPlanDisplay
          plans={plans}
          recipes={recipes}
          days={DAYS}
          mealTypes={MEAL_TYPES}
          onSelectRecipe={handleSelectRecipe}
          onDeletePlan={handleDeletePlan}
          getDateForDay={getDateForDay}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

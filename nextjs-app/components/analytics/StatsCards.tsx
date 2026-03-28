'use client'
import { Utensils, BookOpen, Flame, Clock } from 'lucide-react'
import type { Recipe, WeeklyPlan } from '@/types/database'

interface StatsCardsProps {
  recipes: Recipe[]
  plans: WeeklyPlan[]
}

export function StatsCards({ recipes, plans }: StatsCardsProps) {
  const totalRecipes = recipes.length
  const totalPlanned = plans.length

  const totalCalories = plans.reduce((sum, plan) => {
    return sum + (plan.recipes?.nutritional_info?.calories ?? 0)
  }, 0)

  const avgCookTime =
    recipes.length > 0
      ? Math.round(
          recipes.reduce((sum, r) => sum + (r.cooking_time ?? 0), 0) / recipes.length
        )
      : 0

  const cards = [
    {
      label: 'Total Recipes',
      value: totalRecipes,
      icon: BookOpen,
      color: '#00B4A6',
      bg: '#e6f7f6',
    },
    {
      label: 'Meals Planned',
      value: totalPlanned,
      icon: Utensils,
      color: '#f97316',
      bg: '#fff7ed',
    },
    {
      label: 'Weekly Calories',
      value: totalCalories > 0 ? `${totalCalories.toLocaleString()} kcal` : '—',
      icon: Flame,
      color: '#ef4444',
      bg: '#fef2f2',
    },
    {
      label: 'Avg Cook Time',
      value: avgCookTime > 0 ? `${avgCookTime} min` : '—',
      icon: Clock,
      color: '#8b5cf6',
      bg: '#f5f3ff',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div
          key={label}
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '20px 24px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={22} color={color} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{value}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

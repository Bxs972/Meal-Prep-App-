'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { WeeklyPlan, MealType } from '@/types/database'

const MEAL_COLORS: Record<MealType, string> = {
  breakfast: '#f59e0b',
  lunch: '#22c55e',
  dinner: '#3b82f6',
  snack: '#a855f7',
}

export function CategoryChart({ plans }: { plans: WeeklyPlan[] }) {
  const counts: Record<string, number> = {}
  plans.forEach((p) => {
    counts[p.meal_type] = (counts[p.meal_type] ?? 0) + 1
  })

  const data = Object.entries(counts).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
    type: type as MealType,
  }))

  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🍽️</div>
        <p style={{ fontSize: 13 }}>No meal types to display yet.</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          dataKey="value"
          label={({ name, value }) => `${name} (${value})`}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={MEAL_COLORS[entry.type] ?? '#9ca3af'} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

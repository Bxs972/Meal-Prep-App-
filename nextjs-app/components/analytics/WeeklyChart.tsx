'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { WeeklyPlan } from '@/types/database'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function WeeklyChart({ plans }: { plans: WeeklyPlan[] }) {
  const data = DAYS.map((day, i) => {
    const dayPlans = plans.filter((p) => {
      const d = new Date(p.planned_date)
      // getDay() returns 0=Sun, 1=Mon...
      const idx = (d.getDay() + 6) % 7 // convert to Mon=0
      return idx === i
    })
    const calories = dayPlans.reduce(
      (sum, p) => sum + (p.recipes?.nutritional_info?.calories ?? 0),
      0
    )
    return { day, calories, meals: dayPlans.length }
  })

  const hasData = data.some((d) => d.calories > 0 || d.meals > 0)

  if (!hasData) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>📅</div>
        <p style={{ fontSize: 13 }}>Plan some meals to see your weekly breakdown.</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6b7280' }} />
        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
        <Tooltip
          formatter={(value: number) => [`${value} kcal`, 'Calories']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
        />
        <Bar dataKey="calories" fill="#00B4A6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

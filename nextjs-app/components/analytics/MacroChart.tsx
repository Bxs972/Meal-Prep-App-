'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { WeeklyPlan } from '@/types/database'

const COLORS = ['#00B4A6', '#f97316', '#3b82f6', '#22c55e']

export function MacroChart({ plans }: { plans: WeeklyPlan[] }) {
  const totals = plans.reduce(
    (acc, plan) => {
      const n = plan.recipes?.nutritional_info
      if (!n) return acc
      return {
        protein: acc.protein + (n.protein ?? 0),
        carbs: acc.carbs + (n.carbs ?? 0),
        fat: acc.fat + (n.fat ?? 0),
        calories: acc.calories + (n.calories ?? 0),
      }
    },
    { protein: 0, carbs: 0, fat: 0, calories: 0 }
  )

  const data = [
    { name: 'Protein', value: totals.protein, unit: 'g' },
    { name: 'Carbs', value: totals.carbs, unit: 'g' },
    { name: 'Fat', value: totals.fat, unit: 'g' },
  ].filter((d) => d.value > 0)

  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
        <p style={{ fontSize: 13 }}>No nutritional data yet. Add recipes with nutritional info.</p>
      </div>
    )
  }

  return (
    <div>
      {totals.calories > 0 && (
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#00B4A6' }}>
            {totals.calories.toLocaleString()}
          </span>
          <span style={{ fontSize: 14, color: '#6b7280', marginLeft: 4 }}>kcal / week</span>
        </div>
      )}
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            label={({ name, value, unit }) => `${name}: ${value}${unit}`}
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string) => [`${value}g`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

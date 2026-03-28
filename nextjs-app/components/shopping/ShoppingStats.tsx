'use client'
import type { ShoppingItem } from '@/types/database'

export function ShoppingStats({ items }: { items: ShoppingItem[] }) {
  const total = items.length
  const checked = items.filter((i) => i.is_purchased).length
  const overallPct = total === 0 ? 0 : Math.round((checked / total) * 100)

  // Group by category
  const byCategory = items.reduce<Record<string, { total: number; checked: number }>>((acc, item) => {
    const cat = item.category || 'Other'
    if (!acc[cat]) acc[cat] = { total: 0, checked: 0 }
    acc[cat].total++
    if (item.is_purchased) acc[cat].checked++
    return acc
  }, {})

  const categories = Object.entries(byCategory).sort((a, b) => b[1].total - a[1].total)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Overall progress */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '20px 24px',
          border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Overall progress</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#00B4A6' }}>
            {checked}/{total}
          </span>
        </div>
        <div style={{ height: 10, borderRadius: 5, background: '#e5e7eb', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              borderRadius: 5,
              background: checked === total && total > 0 ? '#22c55e' : '#00B4A6',
              width: `${overallPct}%`,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6, textAlign: 'right' }}>
          {overallPct}% complete
        </div>
      </div>

      {/* By category */}
      {categories.length > 0 && (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '20px 24px',
            border: '1px solid #e5e7eb',
          }}
        >
          <h4 style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 16 }}>By category</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {categories.map(([cat, data]) => {
              const pct = Math.round((data.checked / data.total) * 100)
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: '#374151', textTransform: 'capitalize', fontWeight: 500 }}>
                      {cat}
                    </span>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>
                      {data.checked}/{data.total}
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: '#e5e7eb', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 3,
                        background: pct === 100 ? '#22c55e' : '#00B4A6',
                        width: `${pct}%`,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      {total > 0 && (
        <div
          style={{
            background: overallPct === 100 ? '#f0fdf4' : '#e6f7f6',
            borderRadius: 12,
            padding: '14px 20px',
            border: `1px solid ${overallPct === 100 ? '#22c55e' : '#00B4A6'}`,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 14, color: overallPct === 100 ? '#16a34a' : '#00B4A6', fontWeight: 600 }}>
            {overallPct === 100
              ? '✓ Shopping complete!'
              : `${total - checked} item${total - checked !== 1 ? 's' : ''} remaining`}
          </span>
        </div>
      )}
    </div>
  )
}

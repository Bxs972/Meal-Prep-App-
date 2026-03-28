'use client'
import { useState } from 'react'
import { X, Search, Clock, Users } from 'lucide-react'
import type { Recipe, WeeklyPlan } from '@/types/database'

interface MealPlanDisplayProps {
  plans: WeeklyPlan[]
  recipes: Recipe[]
  days: string[]
  mealTypes: string[]
  onSelectRecipe: (recipeId: string, date: string, mealType: string) => void
  onDeletePlan: (planId: string) => void
  getDateForDay: (day: string) => string
}

interface ModalState {
  day: string
  mealType: string
}

const MEAL_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  breakfast: { bg: '#fffbeb', text: '#d97706' },
  lunch: { bg: '#f0fdf4', text: '#16a34a' },
  dinner: { bg: '#eff6ff', text: '#2563eb' },
  snack: { bg: '#fdf4ff', text: '#9333ea' },
}

export function MealPlanDisplay({
  plans,
  recipes,
  days,
  mealTypes,
  onSelectRecipe,
  onDeletePlan,
  getDateForDay,
}: MealPlanDisplayProps) {
  const [modal, setModal] = useState<ModalState | null>(null)
  const [search, setSearch] = useState('')

  const getPlanForSlot = (day: string, mealType: string) => {
    const date = getDateForDay(day)
    return plans.find(
      (p) => p.planned_date === date && p.meal_type === mealType
    )
  }

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (recipeId: string) => {
    if (!modal) return
    const date = getDateForDay(modal.day)
    onSelectRecipe(recipeId, date, modal.mealType)
    setModal(null)
    setSearch('')
  }

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `120px repeat(${days.length}, minmax(140px, 1fr))`,
            gap: 2,
            minWidth: 900,
          }}
        >
          {/* Header row */}
          <div style={{ padding: '10px 0' }} />
          {days.map((day) => (
            <div
              key={day}
              style={{
                padding: '10px 12px',
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: '#374151',
                background: '#f9fafb',
                borderRadius: 8,
              }}
            >
              {day}
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400, marginTop: 2 }}>
                {getDateForDay(day).split('-').slice(1).reverse().join('/')}
              </div>
            </div>
          ))}

          {/* Meal type rows */}
          {mealTypes.map((mealType) => {
            const colors = MEAL_TYPE_COLORS[mealType] ?? { bg: '#f9fafb', text: '#374151' }
            return [
              <div
                key={`label-${mealType}`}
                style={{
                  padding: '10px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: colors.text,
                  background: colors.bg,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                }}
              >
                {mealType}
              </div>,
              ...days.map((day) => {
                const plan = getPlanForSlot(day, mealType)
                const recipe = plan?.recipes

                return (
                  <div
                    key={`${day}-${mealType}`}
                    style={{
                      minHeight: 90,
                      borderRadius: 8,
                      border: '1.5px solid #e5e7eb',
                      background: '#fff',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {plan && recipe ? (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {recipe.image_url && (
                          <div style={{ height: 50, overflow: 'hidden', flexShrink: 0 }}>
                            <img
                              src={recipe.image_url}
                              alt={recipe.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                        <div style={{ padding: '6px 8px', flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', lineHeight: 1.3 }}>
                            {recipe.title}
                          </div>
                          {recipe.cooking_time && (
                            <div style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
                              <Clock size={10} />
                              {recipe.cooking_time}min
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => onDeletePlan(plan.id)}
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.5)',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setModal({ day, mealType })}
                        style={{
                          width: '100%',
                          height: '100%',
                          minHeight: 90,
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          color: '#d1d5db',
                          fontSize: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
                      >
                        +
                      </button>
                    )}
                  </div>
                )
              }),
            ]
          })}
        </div>
      </div>

      {/* Recipe selection modal */}
      {modal && (
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
          onClick={() => { setModal(null); setSearch('') }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 520,
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e' }}>Choose a recipe</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2, textTransform: 'capitalize' }}>
                    {modal.day} — {modal.mealType}
                  </p>
                </div>
                <button
                  onClick={() => { setModal(null); setSearch('') }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                >
                  <X size={20} />
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    borderRadius: 8,
                    border: '1.5px solid #e5e7eb',
                    fontSize: 14,
                    outline: 'none',
                  }}
                  placeholder="Search recipes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
                  autoFocus
                />
              </div>
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filteredRecipes.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🍽️</div>
                  <p style={{ fontSize: 14 }}>No recipes found</p>
                </div>
              ) : (
                filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => handleSelect(recipe.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '12px 24px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fff' }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 8,
                        background: '#f3f4f6',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {recipe.image_url ? (
                        <img src={recipe.image_url} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                          🍽️
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {recipe.title}
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginTop: 3 }}>
                        <span style={{ fontSize: 12, color: '#9ca3af', textTransform: 'capitalize' }}>{recipe.category}</span>
                        {recipe.cooking_time && (
                          <span style={{ fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Clock size={10} />
                            {recipe.cooking_time}min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

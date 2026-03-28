'use client'
import Link from 'next/link'
import { Globe, Lock, Clock, Users } from 'lucide-react'
import type { Recipe } from '@/types/database'

const DIFFICULTY_COLORS = {
  easy: { bg: '#f0fdf4', color: '#16a34a' },
  medium: { bg: '#fffbeb', color: '#d97706' },
  hard: { bg: '#fef2f2', color: '#dc2626' },
}

export function SearchResults({
  recipes,
  currentUserId,
  loading,
}: {
  recipes: Recipe[]
  currentUserId: string
  loading?: boolean
}) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            <div className="skeleton" style={{ height: 160 }} />
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ height: 16, width: '75%' }} />
              <div className="skeleton" style={{ height: 12, width: '50%' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#374151' }}>No recipes found</h3>
        <p>Try adjusting your filters or search query.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
      {recipes.map((recipe) => {
        const diff = DIFFICULTY_COLORS[recipe.difficulty] ?? DIFFICULTY_COLORS.easy
        const isOwner = recipe.user_id === currentUserId

        return (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="card-hover"
              style={{
                background: '#fff',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {/* Image */}
              <div style={{ height: 160, background: '#f3f4f6', position: 'relative', flexShrink: 0 }}>
                {recipe.image_url ? (
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                    🍽️
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '3px 8px',
                    borderRadius: 20,
                    background: recipe.is_public ? 'rgba(34,197,94,0.9)' : 'rgba(107,114,128,0.85)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {recipe.is_public ? <Globe size={10} /> : <Lock size={10} />}
                  {isOwner ? (recipe.is_public ? 'Public' : 'Private') : 'Community'}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3 }}>
                    {recipe.title}
                  </span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      background: diff.bg,
                      color: diff.color,
                      flexShrink: 0,
                      textTransform: 'capitalize',
                    }}
                  >
                    {recipe.difficulty}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#9ca3af' }}>
                  <span style={{ textTransform: 'capitalize', color: '#00B4A6', fontWeight: 500 }}>{recipe.category}</span>
                  {recipe.cooking_time && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={11} />
                      {recipe.cooking_time}min
                    </span>
                  )}
                  {recipe.servings && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Users size={11} />
                      {recipe.servings}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

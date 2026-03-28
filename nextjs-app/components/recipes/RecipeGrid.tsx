'use client'
import Link from 'next/link'
import { Clock, Users, Trash2, Globe, Lock, Edit } from 'lucide-react'
import type { Recipe } from '@/types/database'

const DIFFICULTY_COLORS = {
  easy: { bg: '#f0fdf4', color: '#16a34a' },
  medium: { bg: '#fffbeb', color: '#d97706' },
  hard: { bg: '#fef2f2', color: '#dc2626' },
}

function RecipeCard({
  recipe,
  isOwner,
  onDelete,
}: {
  recipe: Recipe
  isOwner: boolean
  onDelete?: (id: string) => void
}) {
  const diff = DIFFICULTY_COLORS[recipe.difficulty] ?? DIFFICULTY_COLORS.easy

  return (
    <div
      className="card-hover"
      style={{
        background: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, background: '#f3f4f6', flexShrink: 0 }}>
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
            🍽️
          </div>
        )}
        {/* Visibility badge */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 20,
            background: recipe.is_public ? 'rgba(34,197,94,0.9)' : 'rgba(107,114,128,0.9)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {recipe.is_public ? <Globe size={10} /> : <Lock size={10} />}
          {recipe.is_public ? 'Public' : 'Private'}
        </div>
        {/* Category */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            padding: '3px 8px',
            borderRadius: 20,
            background: 'rgba(0,180,166,0.9)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        >
          {recipe.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3, flex: 1 }}>
            {recipe.title}
          </h3>
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

        {recipe.description && (
          <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {recipe.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#9ca3af', marginTop: 'auto' }}>
          {recipe.cooking_time && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} />
              {recipe.cooking_time}min
            </span>
          )}
          {recipe.servings && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Users size={12} />
              {recipe.servings} servings
            </span>
          )}
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '2px 8px',
                  borderRadius: 20,
                  fontSize: 11,
                  background: '#f3f4f6',
                  color: '#6b7280',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        {isOwner && (
          <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>
            <Link
              href={`/recipes/${recipe.id}`}
              style={{
                flex: 1,
                padding: '7px 0',
                borderRadius: 8,
                background: '#f3f4f6',
                color: '#374151',
                textAlign: 'center',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              View
            </Link>
            <Link
              href={`/recipes/${recipe.id}/edit`}
              style={{
                padding: '7px 12px',
                borderRadius: 8,
                background: '#e6f7f6',
                color: '#00B4A6',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Edit size={13} />
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(recipe.id)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 8,
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <div className="skeleton" style={{ height: 180 }} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 18, width: '70%' }} />
        <div className="skeleton" style={{ height: 14, width: '90%' }} />
        <div className="skeleton" style={{ height: 14, width: '60%' }} />
      </div>
    </div>
  )
}

export function RecipeGrid({
  recipes,
  loading,
  currentUserId,
  onDelete,
}: {
  recipes: Recipe[]
  loading?: boolean
  currentUserId?: string
  onDelete?: (id: string) => void
}) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#374151' }}>No recipes yet</h3>
        <p>Start by creating your first recipe.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isOwner={recipe.user_id === currentUserId}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

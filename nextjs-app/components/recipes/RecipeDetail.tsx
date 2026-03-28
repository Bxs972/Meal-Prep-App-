'use client'
import { useState } from 'react'
import { Clock, Users, ChefHat, Globe, Lock, ArrowLeft } from 'lucide-react'
import type { Recipe, RecipeIngredient } from '@/types/database'

const DIFFICULTY_COLORS = {
  easy: { bg: '#f0fdf4', color: '#16a34a' },
  medium: { bg: '#fffbeb', color: '#d97706' },
  hard: { bg: '#fef2f2', color: '#dc2626' },
}

export function RecipeDetail({
  recipe,
  recipeIngredients,
}: {
  recipe: Recipe
  recipeIngredients: RecipeIngredient[]
}) {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients')
  const diff = DIFFICULTY_COLORS[recipe.difficulty] ?? DIFFICULTY_COLORS.easy

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 800, margin: '0 auto' }}>
      <button
        onClick={() => window.history.back()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#6b7280',
          fontSize: 14,
          marginBottom: 24,
          padding: 0,
        }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Hero image */}
      {recipe.image_url && (
        <div style={{ borderRadius: 16, overflow: 'hidden', height: 320, marginBottom: 24 }}>
          <img
            src={recipe.image_url}
            alt={recipe.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: '#e6f7f6',
              color: '#00B4A6',
              textTransform: 'capitalize',
            }}
          >
            {recipe.category}
          </span>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: diff.bg,
              color: diff.color,
              textTransform: 'capitalize',
            }}
          >
            {recipe.difficulty}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: recipe.is_public ? '#f0fdf4' : '#f3f4f6',
              color: recipe.is_public ? '#16a34a' : '#6b7280',
            }}
          >
            {recipe.is_public ? <Globe size={11} /> : <Lock size={11} />}
            {recipe.is_public ? 'Public' : 'Private'}
          </span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 10 }}>
          {recipe.title}
        </h1>

        {recipe.description && (
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6, marginBottom: 16 }}>
            {recipe.description}
          </p>
        )}

        {/* Meta stats */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {recipe.prep_time && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#374151' }}>
              <Clock size={16} color="#00B4A6" />
              <span style={{ fontSize: 14 }}>
                <strong>Prep:</strong> {recipe.prep_time}min
              </span>
            </div>
          )}
          {recipe.cooking_time && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#374151' }}>
              <ChefHat size={16} color="#00B4A6" />
              <span style={{ fontSize: 14 }}>
                <strong>Cook:</strong> {recipe.cooking_time}min
              </span>
            </div>
          )}
          {recipe.servings && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#374151' }}>
              <Users size={16} color="#00B4A6" />
              <span style={{ fontSize: 14 }}>
                <strong>Serves:</strong> {recipe.servings}
              </span>
            </div>
          )}
        </div>

        {/* Nutritional info */}
        {recipe.nutritional_info && (
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Calories', value: recipe.nutritional_info.calories, unit: 'kcal' },
              { label: 'Protein', value: recipe.nutritional_info.protein, unit: 'g' },
              { label: 'Carbs', value: recipe.nutritional_info.carbs, unit: 'g' },
              { label: 'Fat', value: recipe.nutritional_info.fat, unit: 'g' },
            ]
              .filter((n) => n.value !== undefined)
              .map((n) => (
                <div
                  key={n.label}
                  style={{
                    textAlign: 'center',
                    padding: '10px 16px',
                    borderRadius: 10,
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    minWidth: 80,
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#00B4A6' }}>
                    {n.value}
                    <span style={{ fontSize: 11 }}>{n.unit}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{n.label}</div>
                </div>
              ))}
          </div>
        )}

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: 12,
                  background: '#f3f4f6',
                  color: '#6b7280',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '2px solid #e5e7eb', display: 'flex', gap: 0, marginBottom: 24 }}>
        {(['ingredients', 'instructions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 600,
              textTransform: 'capitalize',
              color: activeTab === tab ? '#00B4A6' : '#6b7280',
              borderBottom: activeTab === tab ? '2px solid #00B4A6' : '2px solid transparent',
              marginBottom: -2,
              transition: 'all 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'ingredients' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recipeIngredients.length > 0 ? (
            recipeIngredients.map((ri) => (
              <div
                key={ri.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#f9fafb',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                }}
              >
                <span style={{ fontSize: 14, color: '#374151', textTransform: 'capitalize' }}>
                  {ri.ingredients?.name ?? ''}
                  {ri.notes && <span style={{ color: '#9ca3af', fontSize: 12 }}> ({ri.notes})</span>}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#00B4A6' }}>
                  {ri.quantity} {ri.unit}
                </span>
              </div>
            ))
          ) : recipe.ingredients && recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ing, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#f9fafb',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                }}
              >
                <span style={{ fontSize: 14, color: '#374151', textTransform: 'capitalize' }}>
                  {ing.name}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#00B4A6' }}>
                  {ing.quantity} {ing.unit}
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No ingredients listed.</p>
          )}
        </div>
      )}

      {activeTab === 'instructions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {recipe.instructions && recipe.instructions.length > 0 ? (
            recipe.instructions.map((step, i) => (
              <div
                key={i}
                style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#00B4A6',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {i + 1}
                </div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, paddingTop: 6 }}>{step}</p>
              </div>
            ))
          ) : (
            <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No instructions provided.</p>
          )}
        </div>
      )}
    </div>
  )
}

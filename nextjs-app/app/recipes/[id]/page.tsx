'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { RecipeDetail } from '@/components/recipes/RecipeDetail'
import Link from 'next/link'
import { Edit } from 'lucide-react'
import type { Recipe, RecipeIngredient } from '@/types/database'

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    loadRecipe()
  }, [params.id])

  const loadRecipe = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [recipeRes, ingredientsRes] = await Promise.all([
      supabase
        .from('recipes')
        .select('*')
        .eq('id', params.id)
        .single(),
      supabase
        .from('recipe_ingredients')
        .select('*, ingredients(*)')
        .eq('recipe_id', params.id),
    ])

    if (recipeRes.error || !recipeRes.data) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const r = recipeRes.data as Recipe
    // Check access: owner or public
    if (!r.is_public && r.user_id !== user?.id) {
      setNotFound(true)
      setLoading(false)
      return
    }

    setRecipe(r)
    setRecipeIngredients((ingredientsRes.data as RecipeIngredient[]) ?? [])
    setIsOwner(r.user_id === user?.id)
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="skeleton" style={{ height: 320, borderRadius: 16, marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 20, width: '80%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 20, width: '70%' }} />
      </div>
    )
  }

  if (notFound) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Recipe not found</h2>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>This recipe doesn't exist or you don't have access to it.</p>
        <Link
          href="/recipes"
          style={{ padding: '10px 24px', borderRadius: 8, background: '#00B4A6', color: '#fff', textDecoration: 'none', fontWeight: 600 }}
        >
          Back to recipes
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up">
      {isOwner && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Link
            href={`/recipes/${params.id}/edit`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              borderRadius: 8,
              background: '#00B4A6',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Edit size={15} />
            Edit recipe
          </Link>
        </div>
      )}
      <RecipeDetail recipe={recipe!} recipeIngredients={recipeIngredients} />
    </div>
  )
}

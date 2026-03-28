'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { RecipeGrid } from '@/components/recipes/RecipeGrid'
import { ToastContainer } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Recipe } from '@/types/database'

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const { toasts, success, error, removeToast } = useToast()

  useEffect(() => {
    loadRecipes()
  }, [])

  const loadRecipes = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUserId(user.id)

    const { data, error: fetchError } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      error('Failed to load recipes.')
    } else {
      setRecipes((data as Recipe[]) ?? [])
    }
    setLoading(false)
  }

  const handleDelete = async (recipeId: string) => {
    if (!confirm('Delete this recipe? This action cannot be undone.')) return

    const supabase = createClient()
    const { error: deleteError } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId)

    if (deleteError) {
      error('Failed to delete recipe.')
      return
    }

    setRecipes((prev) => prev.filter((r) => r.id !== recipeId))
    success('Recipe deleted.')
  }

  return (
    <div className="animate-fade-in-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e' }}>My Recipes</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
            {loading ? '' : `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          href="/recipes/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 10,
            background: '#00B4A6',
            color: '#fff',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <Plus size={16} />
          New recipe
        </Link>
      </div>

      <RecipeGrid
        recipes={recipes}
        loading={loading}
        currentUserId={userId}
        onDelete={handleDelete}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

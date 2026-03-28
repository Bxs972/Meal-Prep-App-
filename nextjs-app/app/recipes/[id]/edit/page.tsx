'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { RecipeForm } from '@/components/recipes/RecipeForm'
import { ToastContainer } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
import { ChevronLeft } from 'lucide-react'
import type { Recipe } from '@/types/database'

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const { toasts, success, error, removeToast } = useToast()

  useEffect(() => {
    loadRecipe()
  }, [params.id])

  const loadRecipe = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error: fetchError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', params.id)
      .single()

    if (fetchError || !data) {
      setForbidden(true)
      setLoading(false)
      return
    }

    if (data.user_id !== user?.id) {
      setForbidden(true)
      setLoading(false)
      return
    }

    setRecipe(data as Recipe)
    setLoading(false)
  }

  const handleSuccess = (updated: Recipe) => {
    success(`"${updated.title}" updated!`)
    setTimeout(() => {
      window.location.href = `/recipes/${params.id}`
    }, 1000)
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className="skeleton" style={{ height: 28, width: '40%', marginBottom: 28 }} />
        <div className="skeleton" style={{ height: 220, borderRadius: 12, marginBottom: 20 }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 48, borderRadius: 8, marginBottom: 14 }} />
        ))}
      </div>
    )
  }

  if (forbidden) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Access denied</h2>
        <p style={{ color: '#6b7280' }}>You cannot edit this recipe.</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => window.history.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            fontSize: 14,
            padding: 0,
          }}
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e' }}>Edit Recipe</h1>
      </div>

      <RecipeForm
        initialData={recipe ?? undefined}
        onSuccess={handleSuccess}
        onCancel={() => window.history.back()}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

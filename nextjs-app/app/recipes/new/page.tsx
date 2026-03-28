'use client'
import { RecipeForm } from '@/components/recipes/RecipeForm'
import { ToastContainer } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
import { ChevronLeft } from 'lucide-react'
import type { Recipe } from '@/types/database'

export default function NewRecipePage() {
  const { toasts, success, removeToast } = useToast()

  const handleSuccess = (recipe: Recipe) => {
    success(`"${recipe.title}" created!`)
    setTimeout(() => {
      window.location.href = `/recipes/${recipe.id}`
    }, 1000)
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
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e' }}>New Recipe</h1>
        </div>
      </div>

      <RecipeForm
        onSuccess={handleSuccess}
        onCancel={() => window.history.back()}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

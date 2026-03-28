'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { ShoppingStats } from '@/components/shopping/ShoppingStats'
import { ToastContainer } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
import { generateShoppingPDF } from '@/lib/generateShoppingPDF'
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileDown,
  Trash2,
  Check,
} from 'lucide-react'
import type { ShoppingItem } from '@/types/database'
import { format, startOfWeek, addWeeks, subWeeks, addDays } from 'date-fns'

export default function ShoppingPage() {
  const [currentWeek, setCurrentWeek] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const { toasts, success, error, removeToast } = useToast()

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (userId) loadItems()
  }, [userId, currentWeek])

  const init = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUserId(user.id)
  }

  const weekStart = format(currentWeek, 'yyyy-MM-dd')
  const weekEnd = format(addDays(currentWeek, 6), 'yyyy-MM-dd')
  const weekLabel = `${format(currentWeek, 'MMM d')} – ${format(addDays(currentWeek, 6), 'MMM d, yyyy')}`

  const loadItems = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start', weekStart)
      .order('category')
      .order('ingredient_name')

    setItems((data as ShoppingItem[]) ?? [])
    setLoading(false)
  }

  // P3 FIX: Generate shopping list from recipe_ingredients (not from shopping_items manually)
  const generateFromPlan = async () => {
    setGenerating(true)
    const supabase = createClient()

    // 1. Get all weekly plans for this week
    const { data: plans, error: plansError } = await supabase
      .from('weekly_plans')
      .select('recipe_id, recipes(title)')
      .eq('user_id', userId)
      .gte('planned_date', weekStart)
      .lte('planned_date', weekEnd)

    if (plansError || !plans?.length) {
      error('No meals planned for this week.')
      setGenerating(false)
      return
    }

    // 2. For each recipe, get its recipe_ingredients JOIN ingredients
    const ingredientMap = new Map<string, {
      name: string
      totalAmount: number
      unit: string
      category: string
      sources: string[]
    }>()

    for (const plan of plans) {
      const recipeTitle = (plan.recipes as any)?.title ?? ''
      const { data: ris } = await supabase
        .from('recipe_ingredients')
        .select('quantity, unit, ingredients(name, category)')
        .eq('recipe_id', plan.recipe_id)

      if (!ris) continue

      for (const ri of ris) {
        const ing = ri.ingredients as any
        if (!ing) continue

        const key = `${ing.name.toLowerCase()}__${ri.unit}`
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!
          existing.totalAmount += ri.quantity
          if (!existing.sources.includes(recipeTitle)) {
            existing.sources.push(recipeTitle)
          }
        } else {
          ingredientMap.set(key, {
            name: ing.name,
            totalAmount: ri.quantity,
            unit: ri.unit,
            category: ing.category ?? 'Other',
            sources: [recipeTitle],
          })
        }
      }
    }

    // 3. Delete existing shopping items for this week
    await supabase
      .from('shopping_items')
      .delete()
      .eq('user_id', userId)
      .eq('week_start', weekStart)

    // 4. Insert new items
    const newItems = Array.from(ingredientMap.values()).map((item) => ({
      user_id: userId,
      week_start: weekStart,
      ingredient_name: item.name,
      total_amount: item.totalAmount.toString(),
      unit: item.unit,
      category: item.category,
      recipe_sources: item.sources,
      is_purchased: false,
    }))

    if (newItems.length === 0) {
      error('No ingredients found in planned recipes. Make sure your recipes have ingredients.')
      setGenerating(false)
      return
    }

    const { data: inserted, error: insertError } = await supabase
      .from('shopping_items')
      .insert(newItems)
      .select()

    if (insertError) {
      error('Failed to generate shopping list.')
      setGenerating(false)
      return
    }

    setItems((inserted as ShoppingItem[]) ?? [])
    success(`${newItems.length} items added to your shopping list!`)
    setGenerating(false)
  }

  const toggleItem = async (item: ShoppingItem) => {
    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('shopping_items')
      .update({ is_purchased: !item.is_purchased })
      .eq('id', item.id)

    if (updateError) {
      error('Failed to update item.')
      return
    }

    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_purchased: !i.is_purchased } : i))
    )
  }

  const deleteItem = async (itemId: string) => {
    const supabase = createClient()
    const { error: deleteError } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', itemId)

    if (deleteError) {
      error('Failed to delete item.')
      return
    }

    setItems((prev) => prev.filter((i) => i.id !== itemId))
    success('Item removed.')
  }

  const handleExportPDF = async () => {
    if (items.length === 0) {
      error('No items to export.')
      return
    }
    await generateShoppingPDF({ weekLabel, items })
    success('PDF downloaded!')
  }

  const groupedItems = items.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const cat = item.category || 'Other'
    ;(acc[cat] = acc[cat] ?? []).push(item)
    return acc
  }, {})

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingCart size={26} color="#00B4A6" />
            Shopping List
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>{weekLabel}</p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentWeek((w) => subWeeks(w, 1))}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#374151' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#374151' }}
          >
            This week
          </button>
          <button
            onClick={() => setCurrentWeek((w) => addWeeks(w, 1))}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#374151' }}
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={generateFromPlan}
            disabled={generating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: generating ? '#9ca3af' : '#00B4A6',
              color: '#fff',
              cursor: generating ? 'not-allowed' : 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {generating ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <RefreshCw size={15} />}
            Generate from plan
          </button>
          <button
            onClick={handleExportPDF}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              border: '1.5px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              color: '#374151',
            }}
          >
            <FileDown size={15} />
            PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        {/* Items list */}
        <div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 52, borderRadius: 10 }} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 8 }}>No items yet</h3>
              <p style={{ color: '#6b7280', marginBottom: 20 }}>
                Plan your meals for the week, then click "Generate from plan" to build your shopping list.
              </p>
              <button
                onClick={generateFromPlan}
                disabled={generating}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#00B4A6',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                <RefreshCw size={15} />
                Generate from plan
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {Object.entries(groupedItems).sort(([a], [b]) => a.localeCompare(b)).map(([cat, catItems]) => (
                <div key={cat}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4A6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, paddingBottom: 6, borderBottom: '2px solid #e6f7f6' }}>
                    {cat}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {catItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '12px 16px',
                          borderRadius: 10,
                          background: '#fff',
                          border: '1px solid #e5e7eb',
                          opacity: item.is_purchased ? 0.6 : 1,
                          transition: 'opacity 0.2s',
                        }}
                      >
                        <div
                          onClick={() => toggleItem(item)}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            border: `2px solid ${item.is_purchased ? '#00B4A6' : '#d1d5db'}`,
                            background: item.is_purchased ? '#00B4A6' : '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.15s',
                          }}
                        >
                          {item.is_purchased && <Check size={13} color="#fff" strokeWidth={3} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{
                            fontSize: 14,
                            color: '#374151',
                            textDecoration: item.is_purchased ? 'line-through' : 'none',
                            textTransform: 'capitalize',
                          }}>
                            {item.ingredient_name}
                          </span>
                          {item.recipe_sources?.length > 0 && (
                            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                              From: {item.recipe_sources.slice(0, 2).join(', ')}
                              {item.recipe_sources.length > 2 && ` +${item.recipe_sources.length - 2} more`}
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#00B4A6', flexShrink: 0 }}>
                          {item.total_amount} {item.unit}
                        </span>
                        <button
                          onClick={() => deleteItem(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#d1d5db',
                            padding: 4,
                            display: 'flex',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444' }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#d1d5db' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats sidebar */}
        <div style={{ position: 'sticky', top: 24 }}>
          <ShoppingStats items={items} />
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

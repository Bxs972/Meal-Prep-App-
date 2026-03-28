'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { SearchResults } from '@/components/search/SearchResults'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { Recipe, Difficulty, RecipeCategory } from '@/types/database'

const CATEGORIES: RecipeCategory[] = ['breakfast', 'lunch', 'dinner', 'snack']
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
const MAX_COOK_TIMES = [15, 30, 45, 60, 90]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Filters
  const [category, setCategory] = useState<RecipeCategory | ''>('')
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('')
  const [maxCookTime, setMaxCookTime] = useState<number | null>(null)

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      doSearch()
    }, 300)
    return () => clearTimeout(timer)
  }, [query, category, difficulty, maxCookTime])

  const init = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUserId(user.id)
  }

  const doSearch = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    let q = supabase
      .from('recipes')
      .select('*')
      .or(`user_id.eq.${userId},is_public.eq.true`)

    if (query.trim()) {
      q = q.ilike('title', `%${query.trim()}%`)
    }
    if (category) {
      q = q.eq('category', category)
    }
    if (difficulty) {
      q = q.eq('difficulty', difficulty)
    }
    if (maxCookTime) {
      q = q.lte('cooking_time', maxCookTime)
    }

    q = q.order('created_at', { ascending: false }).limit(48)

    const { data } = await q
    setRecipes((data as Recipe[]) ?? [])
    setLoading(false)
  }, [userId, query, category, difficulty, maxCookTime])

  const clearFilters = () => {
    setCategory('')
    setDifficulty('')
    setMaxCookTime(null)
  }

  const activeFilterCount = [category, difficulty, maxCookTime !== null].filter(Boolean).length

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: 20,
    border: `1.5px solid ${active ? '#00B4A6' : '#e5e7eb'}`,
    background: active ? '#e6f7f6' : '#fff',
    color: active ? '#00B4A6' : '#6b7280',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    transition: 'all 0.15s',
  })

  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Search Recipes</h1>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: 10,
                border: '1.5px solid #e5e7eb',
                fontSize: 15,
                outline: 'none',
                background: '#fff',
                transition: 'border-color 0.15s',
              }}
              placeholder="Search by name, ingredient..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: 0 }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              border: `1.5px solid ${showFilters || activeFilterCount > 0 ? '#00B4A6' : '#e5e7eb'}`,
              background: showFilters || activeFilterCount > 0 ? '#e6f7f6' : '#fff',
              cursor: 'pointer',
              color: showFilters || activeFilterCount > 0 ? '#00B4A6' : '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
              position: 'relative',
            }}
          >
            <SlidersHorizontal size={17} />
            Filters
            {activeFilterCount > 0 && (
              <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#00B4A6', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '20px 24px',
            border: '1px solid #e5e7eb',
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>Filters</span>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 13, fontWeight: 600 }}
              >
                Clear all
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(category === cat ? '' : cat)}
                    style={chipStyle(category === cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Difficulty</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(difficulty === d ? '' : d)}
                    style={chipStyle(difficulty === d)}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max cook time</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {MAX_COOK_TIMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setMaxCookTime(maxCookTime === t ? null : t)}
                    style={chipStyle(maxCookTime === t)}
                  >
                    {t}min
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 16, fontSize: 14, color: '#6b7280' }}>
        {loading ? 'Searching...' : `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} found`}
        {(query || activeFilterCount > 0) && (
          <span style={{ marginLeft: 8, color: '#00B4A6' }}>
            {query && `"${query}"`}
          </span>
        )}
      </div>

      <SearchResults recipes={recipes} currentUserId={userId} loading={loading} />
    </div>
  )
}

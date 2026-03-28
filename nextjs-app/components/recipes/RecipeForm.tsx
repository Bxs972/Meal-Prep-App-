'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { ImageUpload } from './ImageUpload'
import { Plus, X, ChevronDown } from 'lucide-react'
import type { Recipe, Difficulty, RecipeCategory, NutritionalInfo } from '@/types/database'

interface IngredientInput {
  name: string
  quantity: string
  unit: string
}

interface RecipeFormProps {
  initialData?: Partial<Recipe>
  onSuccess: (recipe: Recipe) => void
  onCancel?: () => void
}

const CATEGORIES: RecipeCategory[] = ['breakfast', 'lunch', 'dinner', 'snack']
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
const UNITS = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'piece', 'slice', 'handful']

const DIFF_COLORS = {
  easy: '#16a34a',
  medium: '#d97706',
  hard: '#dc2626',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1.5px solid #e5e7eb',
  fontSize: 14,
  color: '#374151',
  outline: 'none',
  background: '#fff',
  transition: 'border-color 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 6,
}

export function RecipeForm({ initialData, onSuccess, onCancel }: RecipeFormProps) {
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Basic fields
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [category, setCategory] = useState<RecipeCategory>(initialData?.category ?? 'lunch')
  const [difficulty, setDifficulty] = useState<Difficulty>(initialData?.difficulty ?? 'easy')
  const [prepTime, setPrepTime] = useState(initialData?.prep_time?.toString() ?? '')
  const [cookTime, setCookTime] = useState(initialData?.cooking_time?.toString() ?? '')
  const [servings, setServings] = useState(initialData?.servings?.toString() ?? '')
  const [isPublic, setIsPublic] = useState(initialData?.is_public ?? false)
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url ?? null)

  // Complex fields
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [instructions, setInstructions] = useState<string[]>(
    initialData?.instructions?.length ? initialData.instructions : ['']
  )
  const [ingredients, setIngredients] = useState<IngredientInput[]>(
    initialData?.ingredients?.length
      ? initialData.ingredients.map((i) => ({ name: i.name, quantity: i.quantity, unit: i.unit }))
      : [{ name: '', quantity: '', unit: 'g' }]
  )

  // Nutritional info
  const [nutrition, setNutrition] = useState<NutritionalInfo>(
    initialData?.nutritional_info ?? {}
  )

  // Autocomplete suggestions
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [activeIngredientIndex, setActiveIngredientIndex] = useState<number | null>(null)

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (user) setUserId(user.id)
      })
  }, [])

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }
    const supabase = createClient()
    const { data } = await supabase
      .from('ingredients')
      .select('name')
      .ilike('name', `%${query}%`)
      .limit(6)
    setSuggestions(data?.map((d) => d.name) ?? [])
  }

  // Tags
  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }
  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag))

  // Instructions
  const updateInstruction = (i: number, val: string) => {
    const next = [...instructions]
    next[i] = val
    setInstructions(next)
  }
  const addInstruction = () => setInstructions([...instructions, ''])
  const removeInstruction = (i: number) =>
    setInstructions(instructions.filter((_, idx) => idx !== i))

  // Ingredients
  const updateIngredient = (i: number, field: keyof IngredientInput, val: string) => {
    const next = [...ingredients]
    next[i] = { ...next[i], [field]: val }
    setIngredients(next)
    if (field === 'name') {
      setActiveIngredientIndex(i)
      fetchSuggestions(val)
    }
  }
  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '', unit: 'g' }])
  const removeIngredient = (i: number) =>
    setIngredients(ingredients.filter((_, idx) => idx !== i))

  const handleSubmit = async () => {
    setError('')
    if (!title.trim()) {
      setError('Recipe name is required.')
      return
    }
    if (!userId) {
      setError('Not authenticated.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const filteredIngredients = ingredients.filter((i) => i.name.trim())
    const filteredInstructions = instructions.filter((s) => s.trim())

    const recipePayload = {
      user_id: userId,
      title: title.trim(),
      description: description.trim() || null,
      category,
      difficulty,
      prep_time: prepTime ? parseInt(prepTime) : null,
      cooking_time: cookTime ? parseInt(cookTime) : null,
      servings: servings ? parseInt(servings) : null,
      is_public: isPublic,
      image_url: imageUrl,
      tags,
      instructions: filteredInstructions,
      ingredients: filteredIngredients,
      nutritional_info: Object.keys(nutrition).length > 0 ? nutrition : null,
    }

    let recipeId = initialData?.id

    if (recipeId) {
      // Update
      const { data, error: updateErr } = await supabase
        .from('recipes')
        .update(recipePayload)
        .eq('id', recipeId)
        .select()
        .single()

      if (updateErr) {
        setError(updateErr.message)
        setLoading(false)
        return
      }

      // Delete old recipe_ingredients and re-insert
      await supabase.from('recipe_ingredients').delete().eq('recipe_id', recipeId)
      await saveRecipeIngredients(supabase, recipeId, filteredIngredients)
      onSuccess(data as Recipe)
    } else {
      // Insert
      const { data, error: insertErr } = await supabase
        .from('recipes')
        .insert(recipePayload)
        .select()
        .single()

      if (insertErr) {
        setError(insertErr.message)
        setLoading(false)
        return
      }

      recipeId = data.id
      await saveRecipeIngredients(supabase, recipeId, filteredIngredients)
      onSuccess(data as Recipe)
    }

    setLoading(false)
  }

  const saveRecipeIngredients = async (
    supabase: ReturnType<typeof createClient>,
    recipeId: string,
    ings: IngredientInput[]
  ) => {
    for (const ing of ings) {
      if (!ing.name.trim()) continue

      // Upsert ingredient
      const { data: ingredientData } = await supabase
        .from('ingredients')
        .upsert({ name: ing.name.trim().toLowerCase() }, { onConflict: 'name' })
        .select('id')
        .single()

      if (!ingredientData) continue

      await supabase.from('recipe_ingredients').insert({
        recipe_id: recipeId,
        ingredient_id: ingredientData.id,
        quantity: parseFloat(ing.quantity) || 0,
        unit: ing.unit,
      })
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: '#fef2f2', border: '1px solid #ef4444', color: '#dc2626', marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Photo */}
        <section>
          <label style={labelStyle}>Photo</label>
          <ImageUpload value={imageUrl} onChange={setImageUrl} userId={userId} />
        </section>

        {/* Basic info */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Recipe name *</label>
            <input
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grilled Salmon with Vegetables"
              onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, height: 80, resize: 'vertical', fontFamily: 'inherit' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the recipe..."
              onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
            />
          </div>
        </section>

        {/* Category, Difficulty, Times, Servings */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={category}
              onChange={(e) => setCategory(e.target.value as RecipeCategory)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} style={{ textTransform: 'capitalize' }}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Difficulty</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer', color: DIFF_COLORS[difficulty] }}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d} style={{ color: DIFF_COLORS[d] }}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Prep time (min)</label>
            <input
              type="number"
              style={inputStyle}
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              min={0}
              placeholder="15"
              onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Cook time (min)</label>
            <input
              type="number"
              style={inputStyle}
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              min={0}
              placeholder="30"
              onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Servings</label>
            <input
              type="number"
              style={inputStyle}
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              min={1}
              placeholder="4"
              onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 24 }}>
            <div
              onClick={() => setIsPublic(!isPublic)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: isPublic ? '#00B4A6' : '#d1d5db',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  left: isPublic ? 22 : 2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  transition: 'left 0.2s',
                }}
              />
            </div>
            <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>
              {isPublic ? 'Public recipe' : 'Private recipe'}
            </span>
          </div>
        </section>

        {/* Nutritional info */}
        <section>
          <label style={labelStyle}>Nutritional info (per serving)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { key: 'calories', label: 'Calories', unit: 'kcal' },
              { key: 'protein', label: 'Protein', unit: 'g' },
              { key: 'carbs', label: 'Carbs', unit: 'g' },
              { key: 'fat', label: 'Fat', unit: 'g' },
            ].map(({ key, label, unit }) => (
              <div key={key}>
                <label style={{ ...labelStyle, fontWeight: 500, color: '#6b7280' }}>
                  {label} ({unit})
                </label>
                <input
                  type="number"
                  style={inputStyle}
                  value={(nutrition as any)[key] ?? ''}
                  onChange={(e) =>
                    setNutrition((prev) => ({
                      ...prev,
                      [key]: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                  min={0}
                  placeholder="0"
                  onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Tags */}
        <section>
          <label style={labelStyle}>Tags</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder="e.g. vegetarian, quick, low-carb"
              onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
            />
            <button
              onClick={addTag}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#00B4A6',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: '#e6f7f6',
                    color: '#00B4A6',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00B4A6', display: 'flex', padding: 0 }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Ingredients */}
        <section>
          <label style={labelStyle}>Ingredients</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ingredients.map((ing, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 36px', gap: 8 }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      style={inputStyle}
                      value={ing.name}
                      onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                      placeholder="Ingredient name"
                      onFocus={(e) => {
                        setActiveIngredientIndex(i)
                        e.target.style.borderColor = '#00B4A6'
                      }}
                      onBlur={(e) => {
                        setTimeout(() => setSuggestions([]), 200)
                        e.target.style.borderColor = '#e5e7eb'
                      }}
                    />
                    {activeIngredientIndex === i && suggestions.length > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: 8,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          zIndex: 100,
                          overflow: 'hidden',
                        }}
                      >
                        {suggestions.map((s) => (
                          <div
                            key={s}
                            onMouseDown={() => {
                              updateIngredient(i, 'name', s)
                              setSuggestions([])
                            }}
                            style={{
                              padding: '8px 12px',
                              fontSize: 13,
                              cursor: 'pointer',
                              textTransform: 'capitalize',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff' }}
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="number"
                    style={inputStyle}
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(i, 'quantity', e.target.value)}
                    placeholder="Qty"
                    min={0}
                    onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
                    onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
                  />
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={ing.unit}
                    onChange={(e) => updateIngredient(i, 'unit', e.target.value)}
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeIngredient(i)}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      border: 'none',
                      background: '#fef2f2',
                      color: '#dc2626',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={addIngredient}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                border: '1.5px dashed #d1d5db',
                background: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                width: 'fit-content',
              }}
            >
              <Plus size={14} />
              Add ingredient
            </button>
          </div>
        </section>

        {/* Instructions */}
        <section>
          <label style={labelStyle}>Instructions</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {instructions.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#00B4A6',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 8,
                  }}
                >
                  {i + 1}
                </div>
                <textarea
                  style={{ ...inputStyle, flex: 1, height: 70, resize: 'vertical', fontFamily: 'inherit' }}
                  value={step}
                  onChange={(e) => updateInstruction(i, e.target.value)}
                  placeholder={`Step ${i + 1}...`}
                  onFocus={(e) => { e.target.style.borderColor = '#00B4A6' }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb' }}
                />
                {instructions.length > 1 && (
                  <button
                    onClick={() => removeInstruction(i)}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      border: 'none',
                      background: '#fef2f2',
                      color: '#dc2626',
                      cursor: 'pointer',
                      marginTop: 4,
                      flexShrink: 0,
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addInstruction}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                border: '1.5px dashed #d1d5db',
                background: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                width: 'fit-content',
              }}
            >
              <Plus size={14} />
              Add step
            </button>
          </div>
        </section>

        {/* Submit */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: 10,
              border: 'none',
              background: loading ? '#9ca3af' : '#00B4A6',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 0.15s',
            }}
          >
            {loading && <span className="spinner" />}
            {loading ? 'Saving...' : (initialData?.id ? 'Update recipe' : 'Create recipe')}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: '14px 24px',
                borderRadius: 10,
                border: '1.5px solid #e5e7eb',
                background: '#fff',
                color: '#374151',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export interface Recipe {
  id: string
  user_id: string
  title: string
  description: string | null
  prep_time: number | null
  cooking_time: number | null
  servings: number | null
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  instructions: string[]
  is_public: boolean
  image_url: string | null
  nutritional_info: NutritionalInfo | null
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ingredients: IngredientJSON[] // legacy JSON field
  created_at?: string
}

export interface NutritionalInfo {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
}

export interface IngredientJSON {
  name: string
  quantity: string
  unit: string
}

export interface Ingredient {
  id: string
  name: string
  unit_default: string | null
  category: string | null
}

export interface RecipeIngredient {
  id: string
  recipe_id: string
  ingredient_id: string
  quantity: number
  unit: string
  notes: string | null
  ingredients?: Ingredient
}

export interface WeeklyPlan {
  id: string
  user_id: string
  recipe_id: string
  planned_date: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  recipes?: Recipe
}

export interface ShoppingItem {
  id: string
  user_id: string
  week_start: string
  ingredient_name: string
  total_amount: string
  unit: string
  category: string
  recipe_sources: string[]
  is_purchased: boolean
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack'

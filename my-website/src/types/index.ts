/**
 * Interface définissant la structure d'une recette.
 * Basée sur l'extrait de App.tsx.pdf [1].
 */
export interface Recipe {
  id: string;
  name: string;
  cookTime?: number;
  servings?: number;
  ingredients: string[];
  instructions?: string;
}

/**
 * Interface définissant la structure d'un repas.
 * Basée sur l'extrait de App.tsx.pdf [1].
 * Le type 'supper' est inclus ici, ce qui était la clé pour résoudre l'incompatibilité.
 */
export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'supper';
  day: string;
  recipe?: Recipe;
  notes?: string;
  imageUrl?: string;
  isFavorite?: boolean;
}

/**
 * Interface définissant la structure d'un plan de repas complet.
 * Basée sur les extraits de App.tsx.pdf [1, 2].
 */
export interface MealPlan {
  id: string;
  name: string;
  description?: string;
  color: string;
  meals: Meal[];
  recipes: Recipe[];
  createdAt: Date;
  isActive: boolean;
  category: 'personal' | 'family' | 'diet' | 'fitness' | 'custom';
}
import { Search, X } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { WeeklyMealCard } from "./weekly-meal-card";

interface Recipe {
  id: string;
  name: string;
  cookTime?: number;
  servings?: number;
  ingredients: string[];
  instructions?: string;
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'supper';
  day: string;
  recipe?: Recipe;
  notes?: string;
  imageUrl?: string;
  isFavorite?: boolean;
}

interface SearchResultsProps {
  searchQuery: string;
  meals: Meal[];
  onEditMeal: (meal: Meal) => void;
  onDeleteMeal: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (meal: Meal) => void;
  onClearSearch: () => void;
}

export function SearchResults({ searchQuery, meals, onEditMeal, onDeleteMeal, onToggleFavorite, onViewDetails, onClearSearch }: SearchResultsProps) {
  const filteredMeals = meals.filter(meal => {
    const query = searchQuery.toLowerCase();
    return (
      meal.name.toLowerCase().includes(query) ||
      meal.type.toLowerCase().includes(query) ||
      meal.day.toLowerCase().includes(query) ||
      meal.recipe?.name.toLowerCase().includes(query) ||
      meal.recipe?.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(query)
      ) ||
      meal.notes?.toLowerCase().includes(query)
    );
  });

  if (!searchQuery) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-800 mb-2">
            <span className="text-primary">Search</span> Results
          </h1>
          <p className="text-gray-600">
            {filteredMeals.length} result{filteredMeals.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        </div>
        <Button variant="outline" onClick={onClearSearch}>
          <X className="h-4 w-4 mr-2" />
          Clear Search
        </Button>
      </div>

      {filteredMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMeals.map((meal) => (
            <WeeklyMealCard
              key={meal.id}
              meal={meal}
              onEdit={onEditMeal}
              onDelete={onDeleteMeal}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg text-gray-800 mb-2">No meals found</h3>
          <p className="text-gray-600 mb-4">
            No meals match your search for "{searchQuery}". Try a different search term.
          </p>
          <Button variant="outline" onClick={onClearSearch}>
            Clear Search
          </Button>
        </Card>
      )}
    </div>
  );
}
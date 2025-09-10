import { useState } from "react";
import { Filter, X, Clock, Users, ChefHat } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
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
}

interface FilterPageProps {
  meals: Meal[];
  onEditMeal: (meal: Meal) => void;
  onDeleteMeal: (id: string) => void;
}

const mealTypes = ['breakfast', 'lunch', 'dinner', 'supper'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function FilterPage({ meals, onEditMeal, onDeleteMeal }: FilterPageProps) {
  const [activeFilters, setActiveFilters] = useState<{
    mealTypes: string[];
    days: string[];
    cookTimeRange: [number, number];
    servingsRange: [number, number];
  }>({
    mealTypes: [],
    days: [],
    cookTimeRange: [0, 60],
    servingsRange: [1, 8]
  });

  const toggleMealType = (type: string) => {
    setActiveFilters(prev => ({
      ...prev,
      mealTypes: prev.mealTypes.includes(type)
        ? prev.mealTypes.filter(t => t !== type)
        : [...prev.mealTypes, type]
    }));
  };

  const toggleDay = (day: string) => {
    setActiveFilters(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      mealTypes: [],
      days: [],
      cookTimeRange: [0, 60],
      servingsRange: [1, 8]
    });
  };

  // Filter meals based on active filters
  const filteredMeals = meals.filter(meal => {
    // Filter by meal type
    if (activeFilters.mealTypes.length > 0 && !activeFilters.mealTypes.includes(meal.type)) {
      return false;
    }

    // Filter by day
    if (activeFilters.days.length > 0 && !activeFilters.days.includes(meal.day)) {
      return false;
    }

    // Filter by cook time
    if (meal.recipe?.cookTime) {
      const cookTime = meal.recipe.cookTime;
      if (cookTime < activeFilters.cookTimeRange[0] || cookTime > activeFilters.cookTimeRange[1]) {
        return false;
      }
    }

    // Filter by servings
    if (meal.recipe?.servings) {
      const servings = meal.recipe.servings;
      if (servings < activeFilters.servingsRange[0] || servings > activeFilters.servingsRange[1]) {
        return false;
      }
    }

    return true;
  });

  const activeFilterCount = 
    activeFilters.mealTypes.length + 
    activeFilters.days.length + 
    (activeFilters.cookTimeRange[0] > 0 || activeFilters.cookTimeRange[1] < 60 ? 1 : 0) +
    (activeFilters.servingsRange[0] > 1 || activeFilters.servingsRange[1] < 8 ? 1 : 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-800 mb-2">
            <span className="text-primary">Filter</span> Meals
          </h1>
          <p className="text-gray-600">Filter and find your perfect meals</p>
        </div>
        {activeFilterCount > 0 && (
          <Button variant="outline" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All ({activeFilterCount})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg text-gray-800 mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filters
            </h3>
            
            {/* Meal Types Filter */}
            <div className="space-y-3 mb-6">
              <h4 className="text-gray-800">Meal Types</h4>
              <div className="space-y-2">
                {mealTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={activeFilters.mealTypes.includes(type)}
                      onCheckedChange={() => toggleMealType(type)}
                    />
                    <label htmlFor={type} className="text-sm text-gray-600 capitalize cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Days Filter */}
            <div className="space-y-3 mb-6">
              <h4 className="text-gray-800">Days of Week</h4>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <Badge
                    key={day}
                    variant={activeFilters.days.includes(day) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleDay(day)}
                  >
                    {day.slice(0, 3)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cook Time Filter */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <h4 className="text-gray-800">Cook Time</h4>
              </div>
              <div className="space-y-2">
                <Slider
                  value={activeFilters.cookTimeRange}
                  onValueChange={(value) => setActiveFilters(prev => ({ ...prev, cookTimeRange: value as [number, number] }))}
                  max={60}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{activeFilters.cookTimeRange[0]}min</span>
                  <span>{activeFilters.cookTimeRange[1]}min</span>
                </div>
              </div>
            </div>

            {/* Servings Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h4 className="text-gray-800">Servings</h4>
              </div>
              <div className="space-y-2">
                <Slider
                  value={activeFilters.servingsRange}
                  onValueChange={(value) => setActiveFilters(prev => ({ ...prev, servingsRange: value as [number, number] }))}
                  max={8}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{activeFilters.servingsRange[0]} person{activeFilters.servingsRange[0] !== 1 ? 's' : ''}</span>
                  <span>{activeFilters.servingsRange[1]} person{activeFilters.servingsRange[1] !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtered Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg text-gray-800">
              {filteredMeals.length} meal{filteredMeals.length !== 1 ? 's' : ''} found
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ChefHat className="h-4 w-4" />
              Total meals: {meals.length}
            </div>
          </div>

          {filteredMeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMeals.map((meal) => (
                <WeeklyMealCard
                  key={meal.id}
                  meal={meal}
                  onEdit={onEditMeal}
                  onDelete={onDeleteMeal}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg text-gray-800 mb-2">No meals found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
import { WeeklyMealCard } from "./weekly-meal-card";
import { AddMealDialog } from "../pages/add-meal-dialog";
import { Button } from "./ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useResponsive } from "./ui/use-responsive";

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

interface ModernWeeklyPlannerProps {
  meals: Meal[];
  recipes: Recipe[];
  onAddMeal: (meal: Omit<Meal, 'id'>) => void;
  onEditMeal: (id: string, meal: Omit<Meal, 'id'>) => void;
  onDeleteMeal: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onViewMealDetails: (meal: Meal) => void;
  currentWeek: Date;
  onAddPlan?: () => void;
}

export function ModernWeeklyPlanner({ 
  meals, 
  recipes, 
  onAddMeal, 
  onEditMeal, 
  onDeleteMeal,
  onToggleFavorite,
  onViewMealDetails,
  currentWeek,
  onAddPlan
}: ModernWeeklyPlannerProps) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const { isMobile, isTablet } = useResponsive();
  
  const getMealsForDay = (day: string) => {
    return meals.filter(meal => meal.day === day);
  };

  const handleEditMeal = (meal: Meal) => {
    onEditMeal(meal.id, {
      name: meal.name,
      type: meal.type,
      day: meal.day,
      recipe: meal.recipe,
      notes: meal.notes,
      imageUrl: meal.imageUrl
    });
  };

  // Format week display
  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return `Week ${Math.ceil((start.getTime() - new Date(start.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-600 mb-1`}>
            <span className="text-primary">Personal</span> meal plan
          </h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "sm"} 
            className="text-primary border-primary hover:bg-primary/10"
            onClick={onAddPlan}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isMobile ? "ADD" : "ADD PLAN"}
          </Button>
          <Button variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`grid gap-4 ${
        isMobile 
          ? 'grid-cols-1' 
          : isTablet 
            ? 'grid-cols-3' 
            : 'grid-cols-7'
      }`}>
        {daysOfWeek.map((day) => {
          const dayMeals = getMealsForDay(day);
          const weekNumber = getWeekRange(currentWeek);
          
          return (
            <div key={day} className="space-y-4">
              <div className={`text-center ${isMobile ? 'text-left' : ''}`}>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  {weekNumber}
                </p>
                <h3 className={`text-gray-700 ${isMobile ? 'text-lg font-medium' : ''}`}>{day}</h3>
              </div>
              
              <div className={`space-y-3 ${isMobile ? 'flex flex-wrap gap-2' : ''}`}>
                {dayMeals.length > 0 ? (
                  dayMeals.map((meal) => (
                    <div key={meal.id} className={isMobile ? 'flex-1 min-w-[300px]' : ''}>
                      <WeeklyMealCard
                        meal={meal}
                        onEdit={handleEditMeal}
                        onDelete={onDeleteMeal}
                        onToggleFavorite={onToggleFavorite}
                        onViewDetails={onViewMealDetails}
                      />
                    </div>
                  ))
                ) : (
                  <div className={`bg-gray-100 rounded-2xl ${isMobile ? 'h-24' : 'h-32'} flex items-center justify-center border-2 border-dashed border-gray-300`}>
                    <AddMealDialog
                      day={day}
                      mealType="breakfast"
                      recipes={recipes}
                      onSave={onAddMeal}
                      trigger={
                        <Button variant="ghost" className="text-gray-400 hover:text-gray-600">
                          <Plus className="h-4 w-4 mr-1" />
                          Add meal
                        </Button>
                      }
                    />
                  </div>
                )}
                
                {dayMeals.length > 0 && dayMeals.length < 3 && (
                  <AddMealDialog
                    day={day}
                    mealType="breakfast"
                    recipes={recipes}
                    onSave={onAddMeal}
                    trigger={
                      <Button 
                        variant="ghost" 
                        className={`${isMobile ? 'w-auto px-4' : 'w-full'} h-8 text-xs text-gray-400 hover:text-gray-600 border border-dashed border-gray-300 hover:border-gray-400 rounded-lg`}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add meal
                      </Button>
                    }
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
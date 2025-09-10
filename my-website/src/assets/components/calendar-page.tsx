import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AddMealDialog } from "../pages/add-meal-dialog";

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

interface CalendarPageProps {
  meals: Meal[];
  recipes: Recipe[];
  onAddMeal: (meal: Omit<Meal, 'id'>) => void;
  onEditMeal: (id: string, meal: Omit<Meal, 'id'>) => void;
  onDeleteMeal: (id: string) => void;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypeColors = {
  breakfast: 'bg-orange-100 text-orange-800',
  lunch: 'bg-blue-100 text-blue-800',
  dinner: 'bg-gray-100 text-gray-800',
  supper: 'bg-green-100 text-green-800'
};

export function CalendarPage({ meals, recipes, onAddMeal, onEditMeal, onDeleteMeal }: CalendarPageProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    
    return daysOfWeek.map((_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  };

  const weekDates = getWeekDates(currentWeek);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const getMealsForDay = (day: string) => {
    return meals.filter(meal => meal.day === day);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-800 mb-2">
            <span className="text-primary">Calendar</span> View
          </h1>
          <p className="text-gray-600">Plan your meals across the week</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-32 text-center">
              {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
            </span>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Today
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-6">
        <div className="grid grid-cols-7 gap-4">
          {/* Header */}
          {daysOfWeek.map((day, index) => (
            <div key={day} className="text-center pb-4 border-b border-gray-200">
              <div className="space-y-1">
                <h3 className="text-gray-800">{day}</h3>
                <p className="text-sm text-gray-500">{formatDate(weekDates[index])}</p>
              </div>
            </div>
          ))}

          {/* Calendar Body */}
          {daysOfWeek.map((day, index) => {
            const dayMeals = getMealsForDay(day);
            const isToday = weekDates[index].toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={day} 
                className={`min-h-96 p-4 rounded-lg border-2 border-dashed transition-colors ${
                  isToday 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="space-y-3">
                  {dayMeals.length > 0 ? (
                    dayMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedDay(day)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${mealTypeColors[meal.type]}`}
                            >
                              {meal.type}
                            </Badge>
                            {meal.recipe?.cookTime && (
                              <span className="text-xs text-gray-500">
                                {meal.recipe.cookTime}min
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-800 line-clamp-2">{meal.name}</p>
                          {meal.recipe && meal.recipe.ingredients.length > 0 && (
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {meal.recipe.ingredients.slice(0, 2).join(', ')}
                              {meal.recipe.ingredients.length > 2 && '...'}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                      <CalendarIcon className="h-8 w-8 mb-2" />
                      <p className="text-sm">No meals planned</p>
                    </div>
                  )}
                  
                  <AddMealDialog
                    day={day}
                    mealType="breakfast"
                    recipes={recipes}
                    onSave={onAddMeal}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Week Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl text-gray-800">{meals.length}</p>
            <p className="text-sm text-gray-600">Total Meals</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl text-gray-800">
              {meals.filter(meal => meal.type === 'breakfast').length}
            </p>
            <p className="text-sm text-gray-600">Breakfasts</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl text-gray-800">
              {meals.filter(meal => meal.type === 'lunch').length}
            </p>
            <p className="text-sm text-gray-600">Lunches</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl text-gray-800">
              {meals.filter(meal => meal.type === 'dinner').length + 
               meals.filter(meal => meal.type === 'supper').length}
            </p>
            <p className="text-sm text-gray-600">Dinners</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
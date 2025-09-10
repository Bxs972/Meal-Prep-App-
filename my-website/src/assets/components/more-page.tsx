import { ArrowRight, BookOpen, Utensils, ShoppingCart, BarChart3, Heart, Star } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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

interface MorePageProps {
  meals: Meal[];
  recipes: Recipe[];
  onViewChange: (view: string) => void;
}

export function MorePage({ meals, recipes, onViewChange }: MorePageProps) {
  const quickActions = [
    {
      title: 'Recipe Manager',
      description: 'Manage your recipe collection',
      icon: BookOpen,
      color: 'bg-blue-500',
      action: () => onViewChange('recipes'),
      count: recipes.length
    },
    {
      title: 'Shopping List',
      description: 'Generate shopping lists from meals',
      icon: ShoppingCart,
      color: 'bg-green-500',
      action: () => onViewChange('shopping'),
      count: meals.reduce((sum, meal) => sum + (meal.recipe?.ingredients.length || 0), 0)
    },
    {
      title: 'Analytics',
      description: 'View meal planning statistics',
      icon: BarChart3,
      color: 'bg-purple-500',
      action: () => onViewChange('analytics'),
      count: meals.length
    },
    {
      title: 'Filter Meals',
      description: 'Find meals with advanced filters',
      icon: Utensils,
      color: 'bg-orange-500',
      action: () => onViewChange('filter'),
      count: meals.length
    }
  ];

  const recentStats = {
    totalMeals: meals.length,
    totalRecipes: recipes.length,
    avgCookTime: recipes.reduce((sum, recipe) => sum + (recipe.cookTime || 0), 0) / recipes.length || 0,
    mostUsedIngredients: getMostUsedIngredients(recipes)
  };

  function getMostUsedIngredients(recipes: Recipe[]) {
    const ingredientCounts: { [key: string]: number } = {};
    
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const normalized = ingredient.toLowerCase().trim();
        ingredientCounts[normalized] = (ingredientCounts[normalized] || 0) + 1;
      });
    });
    
    return Object.entries(ingredientCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([ingredient, count]) => ({ ingredient, count }));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl text-gray-800 mb-2">
          <span className="text-primary">More</span> Options
        </h1>
        <p className="text-gray-600">Access additional features and information</p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={action.action}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary">{action.count}</Badge>
              </div>
              <h3 className="text-gray-800 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{action.description}</p>
              <Button variant="ghost" size="sm" className="w-full text-primary hover:bg-primary/10">
                Open
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-xl text-gray-800 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800">Overview</h3>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Meals</span>
                <span className="text-gray-800">{recentStats.totalMeals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Recipes</span>
                <span className="text-gray-800">{recentStats.totalRecipes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Cook Time</span>
                <span className="text-gray-800">{Math.round(recentStats.avgCookTime)}min</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800">Popular Ingredients</h3>
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              {recentStats.mostUsedIngredients.slice(0, 4).map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize text-sm">{item.ingredient}</span>
                  <Badge variant="outline" className="text-xs">{item.count}</Badge>
                </div>
              ))}
              {recentStats.mostUsedIngredients.length === 0 && (
                <p className="text-gray-500 text-sm">No ingredients yet</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800">This Week</h3>
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Breakfast</span>
                <span className="text-gray-800">
                  {meals.filter(meal => meal.type === 'breakfast').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lunch</span>
                <span className="text-gray-800">
                  {meals.filter(meal => meal.type === 'lunch').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dinner</span>
                <span className="text-gray-800">
                  {meals.filter(meal => meal.type === 'dinner').length + 
                   meals.filter(meal => meal.type === 'supper').length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Help & Support */}
      <Card className="p-6">
        <h3 className="text-lg text-gray-800 mb-4">Help & Support</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-gray-800 mb-2">Getting Started</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Add your favorite recipes</li>
              <li>• Plan meals for the week</li>
              <li>• Generate shopping lists</li>
              <li>• Track your meal statistics</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-800 mb-2">Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use filters to find specific meals</li>
              <li>• Export your data for backup</li>
              <li>• Set up notifications for reminders</li>
              <li>• Customize your preferences in settings</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
import { BarChart3, TrendingUp, Calendar, Utensils } from "lucide-react";
import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

interface AnalyticsPageProps {
  meals: Meal[];
  recipes: Recipe[];
}

const COLORS = ['#3ecfcf', '#64748b', '#f97316', '#22c55e'];

export function AnalyticsPage({ meals, recipes }: AnalyticsPageProps) {
  // Calculate statistics
  const totalMeals = meals.length;
  const totalRecipes = recipes.length;
  const avgCookTime = recipes.reduce((sum, recipe) => sum + (recipe.cookTime || 0), 0) / recipes.length || 0;

  // Meals by day data
  const mealsByDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({
    day,
    meals: meals.filter(meal => meal.day === day).length
  }));

  // Meals by type data
  const mealsByType = [
    { name: 'Breakfast', value: meals.filter(meal => meal.type === 'breakfast').length },
    { name: 'Lunch', value: meals.filter(meal => meal.type === 'lunch').length },
    { name: 'Dinner', value: meals.filter(meal => meal.type === 'dinner').length },
    { name: 'Supper', value: meals.filter(meal => meal.type === 'supper').length },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl text-gray-800 mb-2">
          <span className="text-primary">Analytics</span> Overview
        </h1>
        <p className="text-gray-600">Track your meal planning statistics and trends</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Meals</p>
              <p className="text-2xl text-gray-800">{totalMeals}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Utensils className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Recipes</p>
              <p className="text-2xl text-gray-800">{totalRecipes}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Cook Time</p>
              <p className="text-2xl text-gray-800">{Math.round(avgCookTime)}min</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">This Week</p>
              <p className="text-2xl text-gray-800">{mealsByDay.reduce((sum, day) => sum + day.meals, 0)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Meals by Day Chart */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-800 mb-4">Meals by Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mealsByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="meals" fill="#3ecfcf" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Meals by Type Chart */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-800 mb-4">Meals by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mealsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mealsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg text-gray-800 mb-4">Recent Meals</h3>
        <div className="space-y-3">
          {meals.slice(-5).reverse().map((meal) => (
            <div key={meal.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Utensils className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-gray-800">{meal.name}</p>
                  <p className="text-sm text-gray-500">{meal.day} • {meal.type}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {meal.recipe?.cookTime && `${meal.recipe.cookTime}min`}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
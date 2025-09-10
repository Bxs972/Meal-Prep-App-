import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { ChefHat, Clock, Users, CheckCircle2, Circle, ArrowLeft } from 'lucide-react';

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

interface PreparationPageProps {
  meals: Meal[];
  onBack: () => void;
}

export function PreparationPage({ meals, onBack }: PreparationPageProps) {
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});
  const [selectedDay, setSelectedDay] = useState<string>('all');

  // Obtenir les repas de la semaine
  const currentWeekMeals = meals.filter(meal => meal.recipe);
  
  // Filtrer par jour si sélectionné
  const filteredMeals = selectedDay === 'all' 
    ? currentWeekMeals 
    : currentWeekMeals.filter(meal => meal.day === selectedDay);

  // Regrouper tous les ingrédients uniques
  const allIngredients = Array.from(
    new Set(
      filteredMeals.flatMap(meal => meal.recipe?.ingredients || [])
    )
  );

  // Calculer le temps total de préparation
  const totalCookTime = filteredMeals.reduce((total, meal) => {
    return total + (meal.recipe?.cookTime || 0);
  }, 0);

  // Calculer le nombre total de portions
  const totalServings = filteredMeals.reduce((total, meal) => {
    return total + (meal.recipe?.servings || 1);
  }, 0);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const getMealTypeLabel = (type: string) => {
    const labels = {
      breakfast: 'Petit-déjeuner',
      lunch: 'Déjeuner', 
      dinner: 'Dîner',
      supper: 'Souper'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getMealTypeColor = (type: string) => {
    const colors = {
      breakfast: 'bg-orange-100 text-orange-800',
      lunch: 'bg-blue-100 text-blue-800',
      dinner: 'bg-purple-100 text-purple-800',
      supper: 'bg-green-100 text-green-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1>Préparation des repas</h1>
          <p className="text-muted-foreground">
            Organisez et préparez vos repas de la semaine
          </p>
        </div>
      </div>

      {/* Filtres par jour */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedDay === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedDay('all')}
        >
          Tous les jours
        </Button>
        {days.map(day => (
          <Button
            key={day}
            variant={selectedDay === day ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </Button>
        ))}
      </div>

      {/* Statistiques de préparation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Temps total</p>
                <p className="text-xl">{totalCookTime} min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Portions totales</p>
                <p className="text-xl">{totalServings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ChefHat className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Repas planifiés</p>
                <p className="text-xl">{filteredMeals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des ingrédients */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des ingrédients</CardTitle>
          <CardDescription>
            Tous les ingrédients nécessaires pour vos repas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {allIngredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
                <Checkbox
                  id={`ingredient-${index}`}
                  checked={completedSteps[`ingredient-${index}`] || false}
                  onCheckedChange={() => toggleStepCompletion(`ingredient-${index}`)}
                />
                <label
                  htmlFor={`ingredient-${index}`}
                  className={`flex-1 cursor-pointer ${
                    completedSteps[`ingredient-${index}`] ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {ingredient}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Planning de préparation */}
      <Card>
        <CardHeader>
          <CardTitle>Planning de préparation</CardTitle>
          <CardDescription>
            Suivez l'ordre de préparation pour optimiser votre temps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredMeals.map((meal, index) => (
            <div key={meal.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {completedSteps[`meal-${meal.id}`] ? (
                      <CheckCircle2 
                        className="h-5 w-5 text-green-600 cursor-pointer" 
                        onClick={() => toggleStepCompletion(`meal-${meal.id}`)}
                      />
                    ) : (
                      <Circle 
                        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-primary" 
                        onClick={() => toggleStepCompletion(`meal-${meal.id}`)}
                      />
                    )}
                    <span className="text-sm text-muted-foreground">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className={completedSteps[`meal-${meal.id}`] ? 'line-through text-muted-foreground' : ''}>
                      {meal.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={getMealTypeColor(meal.type)}>
                        {getMealTypeLabel(meal.type)}
                      </Badge>
                      <Badge variant="outline">{meal.day}</Badge>
                      {meal.recipe?.cookTime && (
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {meal.recipe.cookTime} min
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {meal.recipe?.instructions && (
                <div className="pl-8">
                  <p className="text-sm text-muted-foreground">
                    {meal.recipe.instructions}
                  </p>
                </div>
              )}

              <div className="pl-8">
                <p className="text-sm">
                  <span className="font-medium">Ingrédients : </span>
                  {meal.recipe?.ingredients.join(', ')}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {filteredMeals.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3>Aucun repas planifié</h3>
            <p className="text-muted-foreground">
              {selectedDay === 'all' 
                ? 'Ajoutez des repas à votre planning pour commencer la préparation.'
                : `Aucun repas planifié pour ${selectedDay}.`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Plus, Edit, Trash2, Clock, Users, ChefHat, Shuffle, Coffee, Sun, Moon } from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  cookTime?: number;
  servings?: number;
  ingredients: string[];
  instructions?: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner';
}

interface RecipeManagerProps {
  recipes: Recipe[];
  onAddRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  onEditRecipe: (id: string, recipe: Omit<Recipe, 'id'>) => void;
  onDeleteRecipe: (id: string) => void;
}

interface MealSuggestion {
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
}

export function RecipeManager({ recipes, onAddRecipe, onEditRecipe, onDeleteRecipe }: RecipeManagerProps) {
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRouletteDialog, setShowRouletteDialog] = useState(false);
  const [mealSuggestions, setMealSuggestions] = useState<MealSuggestion>({});
  const [isSpinning, setIsSpinning] = useState(false);

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="h-4 w-4" />;
      case 'lunch': return <Sun className="h-4 w-4" />;
      case 'dinner': return <Moon className="h-4 w-4" />;
      default: return <ChefHat className="h-4 w-4" />;
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'lunch': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'dinner': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const generateMealSuggestions = () => {
    setIsSpinning(true);
    
    // Simuler l'animation de la roulette
    setTimeout(() => {
      const breakfastRecipes = recipes.filter(r => r.mealType === 'breakfast');
      const lunchRecipes = recipes.filter(r => r.mealType === 'lunch');
      const dinnerRecipes = recipes.filter(r => r.mealType === 'dinner');
      
      // Si pas assez de recettes par type, utiliser toutes les recettes
      const allRecipes = recipes.length > 0 ? recipes : [];
      
      const suggestions: MealSuggestion = {};
      
      if (breakfastRecipes.length > 0) {
        suggestions.breakfast = breakfastRecipes[Math.floor(Math.random() * breakfastRecipes.length)];
      } else if (allRecipes.length > 0) {
        suggestions.breakfast = allRecipes[Math.floor(Math.random() * allRecipes.length)];
      }
      
      if (lunchRecipes.length > 0) {
        suggestions.lunch = lunchRecipes[Math.floor(Math.random() * lunchRecipes.length)];
      } else if (allRecipes.length > 0) {
        suggestions.lunch = allRecipes[Math.floor(Math.random() * allRecipes.length)];
      }
      
      if (dinnerRecipes.length > 0) {
        suggestions.dinner = dinnerRecipes[Math.floor(Math.random() * dinnerRecipes.length)];
      } else if (allRecipes.length > 0) {
        suggestions.dinner = allRecipes[Math.floor(Math.random() * allRecipes.length)];
      }
      
      setMealSuggestions(suggestions);
      setIsSpinning(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2">
          <ChefHat className="h-6 w-6" />
          Recipe Library
        </h2>
        <div className="flex gap-2">
          <Dialog open={showRouletteDialog} onOpenChange={setShowRouletteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Shuffle className="h-4 w-4 mr-2" />
                Roulette des Plats
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shuffle className="h-5 w-5" />
                  Roulette des Plats
                </DialogTitle>
                <DialogDescription>
                  Découvrez vos suggestions de repas pour aujourd'hui !
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="text-center">
                  <Button 
                    onClick={generateMealSuggestions} 
                    disabled={isSpinning || recipes.length === 0}
                    className="mb-4"
                  >
                    {isSpinning ? (
                      <>
                        <Shuffle className="h-4 w-4 mr-2 animate-spin" />
                        En cours...
                      </>
                    ) : (
                      <>
                        <Shuffle className="h-4 w-4 mr-2" />
                        Faire tourner la roulette
                      </>
                    )}
                  </Button>
                  
                  {recipes.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      Ajoutez des recettes pour utiliser la roulette !
                    </p>
                  )}
                </div>
                
                {(mealSuggestions.breakfast || mealSuggestions.lunch || mealSuggestions.dinner) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Petit-déjeuner */}
                    <Card className={`${isSpinning ? 'animate-pulse' : ''}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Coffee className="h-5 w-5 text-orange-500" />
                          Petit-déjeuner
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {mealSuggestions.breakfast ? (
                          <div className="space-y-2">
                            <h4 className="font-medium">{mealSuggestions.breakfast.name}</h4>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                              {mealSuggestions.breakfast.cookTime && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {mealSuggestions.breakfast.cookTime}min
                                </span>
                              )}
                              {mealSuggestions.breakfast.servings && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {mealSuggestions.breakfast.servings}
                                </span>
                              )}
                            </div>
                            {mealSuggestions.breakfast.ingredients.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {mealSuggestions.breakfast.ingredients.slice(0, 2).map((ingredient, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {ingredient}
                                  </Badge>
                                ))}
                                {mealSuggestions.breakfast.ingredients.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{mealSuggestions.breakfast.ingredients.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">Aucune suggestion</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Déjeuner */}
                    <Card className={`${isSpinning ? 'animate-pulse' : ''}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Sun className="h-5 w-5 text-yellow-500" />
                          Déjeuner
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {mealSuggestions.lunch ? (
                          <div className="space-y-2">
                            <h4 className="font-medium">{mealSuggestions.lunch.name}</h4>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                              {mealSuggestions.lunch.cookTime && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {mealSuggestions.lunch.cookTime}min
                                </span>
                              )}
                              {mealSuggestions.lunch.servings && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {mealSuggestions.lunch.servings}
                                </span>
                              )}
                            </div>
                            {mealSuggestions.lunch.ingredients.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {mealSuggestions.lunch.ingredients.slice(0, 2).map((ingredient, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {ingredient}
                                  </Badge>
                                ))}
                                {mealSuggestions.lunch.ingredients.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{mealSuggestions.lunch.ingredients.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">Aucune suggestion</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Dîner */}
                    <Card className={`${isSpinning ? 'animate-pulse' : ''}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Moon className="h-5 w-5 text-blue-500" />
                          Dîner
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {mealSuggestions.dinner ? (
                          <div className="space-y-2">
                            <h4 className="font-medium">{mealSuggestions.dinner.name}</h4>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                              {mealSuggestions.dinner.cookTime && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {mealSuggestions.dinner.cookTime}min
                                </span>
                              )}
                              {mealSuggestions.dinner.servings && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {mealSuggestions.dinner.servings}
                                </span>
                              )}
                            </div>
                            {mealSuggestions.dinner.ingredients.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {mealSuggestions.dinner.ingredients.slice(0, 2).map((ingredient, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {ingredient}
                                  </Badge>
                                ))}
                                {mealSuggestions.dinner.ingredients.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{mealSuggestions.dinner.ingredients.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">Aucune suggestion</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Recipe
              </Button>
            </DialogTrigger>
            <RecipeForm 
              onSave={(recipe) => {
                onAddRecipe(recipe);
                setShowAddDialog(false);
              }}
              onCancel={() => setShowAddDialog(false)}
            />
          </Dialog>
        </div>
      </div>

      {recipes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
            <h3>No recipes yet</h3>
            <p className="text-muted-foreground mb-4">Start building your recipe collection</p>
            <Button onClick={() => setShowAddDialog(true)}>
              Add Your First Recipe
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-2">{recipe.name}</CardTitle>
                    {recipe.mealType && (
                      <Badge className={`text-xs w-fit ${getMealTypeColor(recipe.mealType)}`}>
                        <span className="flex items-center gap-1">
                          {getMealIcon(recipe.mealType)}
                          {recipe.mealType === 'breakfast' ? 'Petit-déj.' : 
                           recipe.mealType === 'lunch' ? 'Déjeuner' : 'Dîner'}
                        </span>
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setEditingRecipe(recipe)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <RecipeForm
                        recipe={editingRecipe}
                        onSave={(updatedRecipe) => {
                          if (editingRecipe) {
                            onEditRecipe(editingRecipe.id, updatedRecipe);
                          }
                          setEditingRecipe(null);
                        }}
                        onCancel={() => setEditingRecipe(null)}
                      />
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => onDeleteRecipe(recipe.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {recipe.cookTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.cookTime} min</span>
                    </div>
                  )}
                  {recipe.servings && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  )}
                </div>
                
                {recipe.ingredients.length > 0 && (
                  <div>
                    <Label className="text-xs">Ingredients:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{recipe.ingredients.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {recipe.instructions && (
                  <div>
                    <Label className="text-xs">Instructions:</Label>
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                      {recipe.instructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

interface RecipeFormProps {
  recipe?: Recipe | null;
  onSave: (recipe: Omit<Recipe, 'id'>) => void;
  onCancel: () => void;
}

function RecipeForm({ recipe, onSave, onCancel }: RecipeFormProps) {
  const [name, setName] = useState(recipe?.name || '');
  const [cookTime, setCookTime] = useState(recipe?.cookTime?.toString() || '');
  const [servings, setServings] = useState(recipe?.servings?.toString() || '');
  const [ingredients, setIngredients] = useState(recipe?.ingredients.join(', ') || '');
  const [instructions, setInstructions] = useState(recipe?.instructions || '');
  const [mealType, setMealType] = useState(recipe?.mealType || '');

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      cookTime: cookTime ? parseInt(cookTime) : undefined,
      servings: servings ? parseInt(servings) : undefined,
      ingredients: ingredients.split(',').map(i => i.trim()).filter(i => i),
      instructions: instructions.trim() || undefined,
      mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | undefined
    });

    // Reset form
    setName('');
    setCookTime('');
    setServings('');
    setIngredients('');
    setInstructions('');
    setMealType('');
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{recipe ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
        <DialogDescription>
          {recipe ? 'Modify the recipe details below' : 'Create a new recipe for your meal planning'}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="recipe-name">Recipe Name</Label>
          <Input
            id="recipe-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter recipe name"
          />
        </div>

        <div>
          <Label htmlFor="meal-type">Type de repas</Label>
          <select
            id="meal-type"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez un type</option>
            <option value="breakfast">Petit-déjeuner</option>
            <option value="lunch">Déjeuner</option>
            <option value="dinner">Dîner</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cook-time">Cook Time (minutes)</Label>
            <Input
              id="cook-time"
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              placeholder="30"
            />
          </div>
          <div>
            <Label htmlFor="servings">Servings</Label>
            <Input
              id="servings"
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              placeholder="4"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
          <Textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="chicken breast, rice, vegetables, olive oil"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="instructions">Instructions (Optional)</Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="1. Preheat oven to 375°F..."
            rows={4}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} disabled={!name.trim()}>
            {recipe ? 'Update' : 'Add'} Recipe
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
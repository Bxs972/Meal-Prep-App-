import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Plus } from "lucide-react";

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

interface AddMealDialogProps {
  day: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'supper';
  recipes: Recipe[];
  meal?: Meal;
  onSave: (meal: Omit<Meal, 'id'>) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddMealDialog({ day, mealType, recipes, meal, onSave, trigger, open: externalOpen, onOpenChange: externalOnOpenChange }: AddMealDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = externalOpen ?? internalOpen;
  const setOpen = externalOnOpenChange ?? setInternalOpen;
  const [mealName, setMealName] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<string>('none');
  const [notes, setNotes] = useState('');
  const [customRecipe, setCustomRecipe] = useState(false);
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState('');

  useEffect(() => {
    if (meal) {
      setMealName(meal.name);
      setNotes(meal.notes || '');
      if (meal.recipe) {
        const existingRecipe = recipes.find(r => r.id === meal.recipe?.id);
        if (existingRecipe) {
          setSelectedRecipe(meal.recipe.id);
        } else {
          setCustomRecipe(true);
          setCookTime(meal.recipe.cookTime?.toString() || '');
          setServings(meal.recipe.servings?.toString() || '');
          setIngredients(meal.recipe.ingredients.join(', '));
        }
      } else {
        setSelectedRecipe('none');
      }
    } else {
      // Reset for new meal
      setMealName('');
      setSelectedRecipe('none');
      setNotes('');
      setCustomRecipe(false);
      setCookTime('');
      setServings('');
      setIngredients('');
    }
  }, [meal, recipes, open]);

  const handleSave = () => {
    if (!mealName.trim()) return;

    let recipe: Recipe | undefined;
    
    if (selectedRecipe && selectedRecipe !== 'none') {
      recipe = recipes.find(r => r.id === selectedRecipe);
    } else if (customRecipe && (cookTime || servings || ingredients)) {
      recipe = {
        id: `custom-${Date.now()}`,
        name: mealName,
        cookTime: cookTime ? parseInt(cookTime) : undefined,
        servings: servings ? parseInt(servings) : undefined,
        ingredients: ingredients.split(',').map(i => i.trim()).filter(i => i)
      };
    }

    onSave({
      name: mealName,
      type: mealType,
      day,
      recipe,
      notes: notes.trim() || undefined,
      imageUrl: meal?.imageUrl,
      isFavorite: meal?.isFavorite || false
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      {!trigger && externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full h-8 text-gray-400 hover:text-gray-600 border border-dashed border-gray-300 hover:border-gray-400"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add meal
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {meal ? 'Edit' : 'Add'} {mealType} for {day}
          </DialogTitle>
          <DialogDescription>
            {meal ? 'Modify the details of this meal' : 'Add a new meal to your weekly planner'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="meal-name">Meal Name</Label>
            <Input
              id="meal-name"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="Enter meal name"
            />
          </div>

          <div>
            <Label htmlFor="recipe-select">Recipe (Optional)</Label>
            <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
              <SelectTrigger>
                <SelectValue placeholder="Select a recipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No recipe</SelectItem>
                {recipes.map((recipe) => (
                  <SelectItem key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRecipe === 'none' && (
            <div className="space-y-3">
              <Label>
                <input
                  type="checkbox"
                  checked={customRecipe}
                  onChange={(e) => setCustomRecipe(e.target.checked)}
                  className="mr-2"
                />
                Add recipe details
              </Label>
              
              {customRecipe && (
                <div className="space-y-3 pl-6 border-l-2 border-muted">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="cook-time">Cook Time (min)</Label>
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
                      placeholder="chicken, rice, vegetables"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions, prep notes, etc."
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={!mealName.trim()}>
              {meal ? 'Update' : 'Add'} Meal
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, Edit, Trash2, Save, X, Image, Plus } from "lucide-react";

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

interface MealDetailDialogProps {
  meal: Meal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, meal: Omit<Meal, 'id'>) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const mealTypeColors = {
  breakfast: 'bg-orange-500',
  lunch: 'bg-blue-500',
  dinner: 'bg-gray-600',
  supper: 'bg-green-500'
};

const mealTypeLabels = {
  breakfast: 'BREAKFAST',
  lunch: 'LUNCH', 
  dinner: 'DINNER',
  supper: 'SUPPER'
};

export function MealDetailDialog({ 
  meal, 
  open, 
  onOpenChange, 
  onSave, 
  onDelete, 
  onToggleFavorite 
}: MealDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeal, setEditedMeal] = useState<Meal | null>(null);
  const [newIngredient, setNewIngredient] = useState('');

  useEffect(() => {
    if (meal) {
      setEditedMeal({ ...meal });
      setIsEditing(false);
    }
  }, [meal]);

  if (!meal || !editedMeal) return null;

  const handleSave = () => {
    onSave(meal.id, {
      name: editedMeal.name,
      type: editedMeal.type,
      day: editedMeal.day,
      recipe: editedMeal.recipe,
      notes: editedMeal.notes,
      imageUrl: editedMeal.imageUrl,
      isFavorite: editedMeal.isFavorite
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedMeal({ ...meal });
    setIsEditing(false);
  };

  const addIngredient = () => {
    if (newIngredient.trim() && editedMeal.recipe) {
      setEditedMeal({
        ...editedMeal,
        recipe: {
          ...editedMeal.recipe,
          ingredients: [...editedMeal.recipe.ingredients, newIngredient.trim()]
        }
      });
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    if (editedMeal.recipe) {
      setEditedMeal({
        ...editedMeal,
        recipe: {
          ...editedMeal.recipe,
          ingredients: editedMeal.recipe.ingredients.filter((_, i) => i !== index)
        }
      });
    }
  };

  const updateIngredient = (index: number, value: string) => {
    if (editedMeal.recipe) {
      const newIngredients = [...editedMeal.recipe.ingredients];
      newIngredients[index] = value;
      setEditedMeal({
        ...editedMeal,
        recipe: {
          ...editedMeal.recipe,
          ingredients: newIngredients
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {isEditing ? (
                <Input
                  value={editedMeal.name}
                  onChange={(e) => setEditedMeal({ ...editedMeal, name: e.target.value })}
                  className="text-lg font-semibold"
                />
              ) : (
                <>
                  {meal.name}
                  <Badge className={`text-white text-xs ${mealTypeColors[meal.type]}`}>
                    {mealTypeLabels[meal.type]}
                  </Badge>
                </>
              )}
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(meal.id)}
              >
                <Heart className={`h-4 w-4 ${meal.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              {!isEditing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onDelete(meal.id);
                  onOpenChange(false);
                }}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Modifier les détails du repas, les ingrédients et marquer comme favori
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Section */}
          <div className="space-y-3">
            <Label>Photo du plat</Label>
            <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={editedMeal.imageUrl || "https://images.unsplash.com/photo-1651352650142-385087834d9d"}
                alt={editedMeal.name}
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      const newImageUrl = prompt('Entrez l\'URL de la nouvelle image:', editedMeal.imageUrl || '');
                      if (newImageUrl !== null) {
                        setEditedMeal({ ...editedMeal, imageUrl: newImageUrl });
                      }
                    }}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Changer l'image
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Recipe Information */}
          {editedMeal.recipe && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations de la recette</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {editedMeal.recipe.cookTime && (
                  <div>
                    <Label>Temps de cuisson</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedMeal.recipe.cookTime}
                        onChange={(e) => setEditedMeal({
                          ...editedMeal,
                          recipe: editedMeal.recipe ? {
                            ...editedMeal.recipe,
                            cookTime: parseInt(e.target.value) || 0
                          } : undefined
                        })}
                        placeholder="minutes"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{editedMeal.recipe.cookTime} minutes</p>
                    )}
                  </div>
                )}
                
                {editedMeal.recipe.servings && (
                  <div>
                    <Label>Portions</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedMeal.recipe.servings}
                        onChange={(e) => setEditedMeal({
                          ...editedMeal,
                          recipe: editedMeal.recipe ? {
                            ...editedMeal.recipe,
                            servings: parseInt(e.target.value) || 0
                          } : undefined
                        })}
                        placeholder="portions"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{editedMeal.recipe.servings} portions</p>
                    )}
                  </div>
                )}
              </div>

              {/* Ingredients */}
              <div className="space-y-3">
                <Label>Ingrédients</Label>
                <div className="space-y-2">
                  {editedMeal.recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <Input
                            value={ingredient}
                            onChange={(e) => updateIngredient(index, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIngredient(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">{ingredient}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isEditing && (
                    <div className="flex items-center gap-2 mt-3">
                      <Input
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                        placeholder="Nouvel ingrédient"
                        onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addIngredient}
                        disabled={!newIngredient.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {(editedMeal.notes || isEditing) && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label>Notes</Label>
                {isEditing ? (
                  <Textarea
                    value={editedMeal.notes || ''}
                    onChange={(e) => setEditedMeal({ ...editedMeal, notes: e.target.value })}
                    placeholder="Ajouter des notes sur ce plat..."
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{editedMeal.notes}</p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
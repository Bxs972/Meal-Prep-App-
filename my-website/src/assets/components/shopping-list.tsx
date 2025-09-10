import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ShoppingCart, Download, Check, RotateCcw } from "lucide-react";

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
  type: 'breakfast' | 'lunch' | 'dinner';
  day: string;
  recipe?: Recipe;
  notes?: string;
}

interface ShoppingListProps {
  meals: Meal[];
}

interface IngredientItem {
  name: string;
  count: number;
  sources: string[];
}

export function ShoppingList({ meals }: ShoppingListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const ingredientsList = useMemo(() => {
    const ingredientsMap = new Map<string, IngredientItem>();

    meals.forEach(meal => {
      if (meal.recipe?.ingredients) {
        meal.recipe.ingredients.forEach(ingredient => {
          const normalizedIngredient = ingredient.toLowerCase().trim();
          if (ingredientsMap.has(normalizedIngredient)) {
            const existing = ingredientsMap.get(normalizedIngredient)!;
            existing.count += 1;
            existing.sources.push(meal.name);
          } else {
            ingredientsMap.set(normalizedIngredient, {
              name: ingredient,
              count: 1,
              sources: [meal.name]
            });
          }
        });
      }
    });

    return Array.from(ingredientsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [meals]);

  const toggleIngredient = (ingredient: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(ingredient)) {
      newChecked.delete(ingredient);
    } else {
      newChecked.add(ingredient);
    }
    setCheckedItems(newChecked);
  };

  const toggleAllIngredients = () => {
    if (checkedItems.size === ingredientsList.length) {
      setCheckedItems(new Set());
    } else {
      setCheckedItems(new Set(ingredientsList.map(item => item.name)));
    }
  };

  const exportShoppingList = () => {
    const listText = ingredientsList
      .map(item => `${item.count > 1 ? `(${item.count}x) ` : ''}${item.name}`)
      .join('\n');
    
    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const checkedCount = checkedItems.size;
  const totalCount = ingredientsList.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Shopping List
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportShoppingList} disabled={totalCount === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Button 
            variant="outline" 
            onClick={toggleAllIngredients}
            disabled={totalCount === 0}
          >
            {checkedCount === totalCount ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2" />
                Uncheck All
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Check All
              </>
            )}
          </Button>
        </div>
      </div>

      {ingredientsList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3>No ingredients to shop for</h3>
            <p className="text-muted-foreground">Add some meals with recipes to generate your shopping list</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Ingredients ({totalCount} items)</span>
                {checkedCount > 0 && (
                  <Badge variant="secondary">
                    {checkedCount} of {totalCount} checked
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ingredientsList.map((item, index) => (
                <div key={item.name}>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id={item.name}
                      checked={checkedItems.has(item.name)}
                      onCheckedChange={() => toggleIngredient(item.name)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <label 
                        htmlFor={item.name}
                        className={`block cursor-pointer ${checkedItems.has(item.name) ? 'line-through text-muted-foreground' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{item.name}</span>
                          {item.count > 1 && (
                            <Badge variant="outline" className="text-xs">
                              {item.count}x
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          From: {item.sources.slice(0, 3).join(', ')}
                          {item.sources.length > 3 && ` +${item.sources.length - 3} more`}
                        </div>
                      </label>
                    </div>
                  </div>
                  {index < ingredientsList.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          {checkedCount > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">
                    {checkedCount} item{checkedCount !== 1 ? 's' : ''} checked off your list!
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Trash2, Edit, Clock, Users } from "lucide-react";

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'supper';
  day: string;
  recipe?: {
    id: string;
    name: string;
    cookTime?: number;
    servings?: number;
    ingredients: string[];
  };
  notes?: string;
  imageUrl?: string;
  isFavorite?: boolean;
}

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

const mealTypeColors = {
  breakfast: "bg-orange-100 text-orange-800",
  lunch: "bg-blue-100 text-blue-800", 
  dinner: "bg-purple-100 text-purple-800",
  supper: "bg-green-100 text-green-800"
};

export function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
  return (
    <Card className="relative group hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="truncate pr-2">{meal.name}</h4>
            <Badge 
              variant="secondary" 
              className={`${mealTypeColors[meal.type]} text-xs capitalize mt-1`}
            >
              {meal.type}
            </Badge>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(meal)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onDelete(meal.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {meal.recipe && (
          <div className="space-y-1 text-xs text-muted-foreground">
            {meal.recipe.cookTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{meal.recipe.cookTime} min</span>
              </div>
            )}
            {meal.recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{meal.recipe.servings} servings</span>
              </div>
            )}
          </div>
        )}
        
        {meal.notes && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {meal.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
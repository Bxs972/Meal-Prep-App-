import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
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

interface WeeklyMealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onViewDetails?: (meal: Meal) => void;
}

const mealTypeLabels = {
  breakfast: 'BREAKFAST',
  lunch: 'LUNCH', 
  dinner: 'DINNER',
  supper: 'SUPPER'
};

const mealTypeColors = {
  breakfast: 'bg-orange-500',
  lunch: 'bg-blue-500',
  dinner: 'bg-gray-600',
  supper: 'bg-green-500'
};

export function WeeklyMealCard({ 
  meal, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onViewDetails
}: WeeklyMealCardProps) {
  const { isMobile } = useResponsive();
  
  return (
    <div 
      className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group cursor-pointer"
      onClick={() => onViewDetails?.(meal)}
    >
      <div className={`relative ${isMobile ? 'h-24' : 'h-32'}`}>
        <ImageWithFallback
          src={meal.imageUrl || "https://images.unsplash.com/photo-1651352650142-385087834d9d"}
          alt={meal.name}
          className="w-full h-full object-cover"
        />
        
        {/* Meal type badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-white ${isMobile ? 'text-xs' : 'text-xs'} ${mealTypeColors[meal.type]}`}>
          {isMobile ? meal.type.charAt(0).toUpperCase() : mealTypeLabels[meal.type]}
        </div>
        
        {/* Action buttons */}
        <div className={`absolute top-2 right-2 flex gap-1 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
          <Button
            variant="ghost"
            size="sm"
            className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} p-0 bg-white/80 hover:bg-white text-gray-600`}
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite(meal.id);
            }}
          >
            <Heart className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} ${meal.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} p-0 bg-white/80 hover:bg-white text-gray-600`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(meal);
            }}
          >
            <Edit className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} p-0 bg-white/80 hover:bg-white text-gray-600 hover:text-red-600`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(meal.id);
            }}
          >
            <Trash2 className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
          </Button>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      
      <div className={`${isMobile ? 'p-3' : 'p-4'}`}>
        <h4 className={`text-gray-800 mb-1 line-clamp-1 ${isMobile ? 'text-sm' : ''}`}>{meal.name}</h4>
        {meal.recipe && meal.recipe.ingredients.length > 0 && (
          <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-xs'}`}>
            {meal.recipe.ingredients.slice(0, 2).join(', ')}
            {meal.recipe.ingredients.length > 2 && '...'}
          </p>
        )}
      </div>
    </div>
  );
}
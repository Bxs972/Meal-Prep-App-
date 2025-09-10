import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useResponsive } from "./ui/use-responsive";

interface MealTypeCardProps {
  title: string;
  ingredientsCount: number;
  imageUrl: string;
  onClick?: () => void;
}

export function MealTypeCard({ title, ingredientsCount, imageUrl, onClick }: MealTypeCardProps) {
  const { isMobile } = useResponsive();
  
  return (
    <div 
      className="flex flex-col items-center space-y-3 cursor-pointer group"
      onClick={onClick}
    >
      <div className={`relative ${isMobile ? 'w-20 h-20' : 'w-24 h-24'} rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-200 ring-4 ring-white shadow-lg`}>
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center">
        <h4 className={`text-gray-800 mb-1 ${isMobile ? 'text-sm' : ''}`}>{title}</h4>
        <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          Need {ingredientsCount} ingredients
        </p>
      </div>
    </div>
  );
}
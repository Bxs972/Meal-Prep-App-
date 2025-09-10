// Déplacez les interfaces 'Recipe' et 'Meal' vers un fichier de types centralisé (ex: src/types/index.ts)
// puis importez-les ici.
// Cela résout les erreurs "Types of parameters are incompatible".
// Correction : les composants sont maintenant dans le sous-dossier 'pages'
import { MealCard } from "./pages/meal-card";
import { AddMealDialog } from "./pages/add-meal-dialog";

// Correction : le chemin vers le dossier 'types' doit être ajusté
// Depuis 'components', il faut remonter de deux niveaux (../..) pour atteindre 'src'
import { Meal, Recipe } from "../../pages";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface WeeklyMealPlannerProps {
    meals: Meal[];
    recipes: Recipe[];
    onAddMeal: (meal: Omit<Meal, 'id'>) => void;
    onEditMeal: (id: string, meal: Omit<Meal, 'id'>) => void;
    onDeleteMeal: (id: string) => void;
    currentWeek: Date;
}

export function WeeklyMealPlanner({ 
    meals, 
    recipes, 
    onAddMeal, 
    onEditMeal, 
    onDeleteMeal,
    currentWeek 
}: WeeklyMealPlannerProps) {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealTypes: ('breakfast' | 'lunch' | 'dinner' | 'supper')[] = ['breakfast', 'lunch', 'dinner', 'supper'];

    const getMealsForDayAndType = (day: string, type: 'breakfast' | 'lunch' | 'dinner' | 'supper') => {
        return meals.filter(meal => meal.day === day && meal.type === type);
    };

    const handleEditMeal = (meal: Meal) => {
        onEditMeal(meal.id, {
            name: meal.name,
            type: meal.type,
            day: meal.day,
            recipe: meal.recipe,
            notes: meal.notes
        });
    };

    const getWeekRange = (date: Date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2>Week of {getWeekRange(currentWeek)}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {daysOfWeek.map((day) => (
                    <Card key={day} className="min-h-[500px]">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-center">{day}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {mealTypes.map((type) => {
                                const dayMeals = getMealsForDayAndType(day, type);
                                
                                return (
                                    <div key={`${day}-${type}`} className="space-y-2">
                                        {dayMeals.length > 0 ? (
                                            dayMeals.map((meal) => (
                                                <MealCard
                                                    key={meal.id}
                                                    meal={meal}
                                                    onEdit={handleEditMeal}
                                                    onDelete={onDeleteMeal}
                                                />
                                            ))
                                        ) : (
                                            <AddMealDialog
                                                day={day}
                                                mealType={type}
                                                recipes={recipes}
                                                onSave={onAddMeal}
                                            />
                                        )}
                                        
                                        {dayMeals.length > 0 && (
                                            <AddMealDialog
                                                day={day}
                                                mealType={type}
                                                recipes={recipes}
                                                onSave={onAddMeal}
                                                trigger={
                                                    <button className="w-full text-xs text-muted-foreground hover:text-foreground py-1 border border-dashed border-muted-foreground/30 rounded hover:border-muted-foreground/60 transition-colors">
                                                        + Add another {type}
                                                    </button>
                                                }
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
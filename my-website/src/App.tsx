import { useState, useEffect } from 'react';
import { Sidebar } from './assets/components/ui/sidebar';
import { MobileNavigation } from './assets/components/mobile-navigation';
import { MobileSearchModal } from './assets/components/mobile-search-modal';
import { ModernWeeklyPlanner } from './assets/components/modern-weekly-planner';
import { MealTypeCard } from './assets/components/meal-type-card';
import { RecipeManager } from './assets/components/recipe-manager';
import { ShoppingList } from './assets/components/shopping-list';
import { AddMealDialog } from './assets/pages/add-meal-dialog';
import { MealDetailDialog } from './assets/components/meal-detail-dialog';
import { AnalyticsPage } from './assets/components/analytics-page';
import { FilterPage } from './assets/components/filter-page';
import { SettingsPage } from './assets/components/settings-page';
import { CalendarPage } from './assets/components/calendar-page';
import { MorePage } from './assets/components/more-page';
import { SearchResults } from './assets/components/search-results';
import { PreparationPage } from './assets/components/preparation-page';
import { AddPlanPage } from './assets/components/add-plan-page';
import { PlanManagerPage } from './assets/components/plan-manager-page';
import { Button } from './assets/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './assets/components/ui/dropdown-menu';
import { ChevronLeft, MoreHorizontal, Plus, Search, Calendar, ChefHat, Settings } from 'lucide-react';
import { useResponsive } from './assets/components/ui/use-responsive';

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

interface MealPlan {
  id: string;
  name: string;
  description?: string;
  color: string;
  meals: Meal[];
  recipes: Recipe[];
  createdAt: Date;
  isActive: boolean;
  category: 'personal' | 'family' | 'diet' | 'fitness' | 'custom';
}

const mealTypes = [
  {
    title: 'Steak',
    ingredientsCount: 3,
    imageUrl: 'https://images.unsplash.com/photo-1602216475919-37336ceb4ad3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVhayUyMGRpbm5lciUyMG1lYXR8ZW58MXx8fHwxNzU3MTE0NTIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    title: 'Veg Food',
    ingredientsCount: 2,
    imageUrl: 'https://images.unsplash.com/photo-1606757819934-d61a9f7279d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFyaWFuJTIwc2FsYWQlMjBoZWFsdGh5fGVufDF8fHx8MTc1NzExNDUyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    title: 'Meal',
    ingredientsCount: 4,
    imageUrl: 'https://images.unsplash.com/photo-1651352650142-385087834d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiYWxhbmNlZCUyMG1lYWwlMjBoZWFsdGh5fGVufDF8fHx8MTc1NzExNDUzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    title: 'Steak Fries',
    ingredientsCount: 3,
    imageUrl: 'https://images.unsplash.com/photo-1651843465180-5965076f7368?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmcmllcyUyMG1lYWx8ZW58MXx8fHwxNzU3MTE0NTI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export default function App() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string>('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [activeView, setActiveView] = useState('menu');
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [showAddMealDialog, setShowAddMealDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingMealDetails, setViewingMealDetails] = useState<Meal | null>(null);
  const [showMobileSearchModal, setShowMobileSearchModal] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  // Get current active plan
  const activePlan = mealPlans.find(plan => plan.id === activePlanId);
  const meals = activePlan?.meals || [];
  const recipes = activePlan?.recipes || [];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPlans = localStorage.getItem('meal-planner-plans');
    const savedActivePlanId = localStorage.getItem('meal-planner-active-plan-id');
    
    if (savedPlans) {
      const plans = JSON.parse(savedPlans);
      setMealPlans(plans);
      
      if (savedActivePlanId && plans.find((p: MealPlan) => p.id === savedActivePlanId)) {
        setActivePlanId(savedActivePlanId);
      } else if (plans.length > 0) {
        setActivePlanId(plans[0].id);
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (mealPlans.length > 0) {
      localStorage.setItem('meal-planner-plans', JSON.stringify(mealPlans));
    }
  }, [mealPlans]);

  useEffect(() => {
    if (activePlanId) {
      localStorage.setItem('meal-planner-active-plan-id', activePlanId);
    }
  }, [activePlanId]);

  // Initialize with sample data if empty
  useEffect(() => {
    if (mealPlans.length === 0) {
      const sampleRecipes: Recipe[] = [
        {
          id: 'recipe-1',
          name: 'Toast with banana flavor',
          cookTime: 5,
          servings: 1,
          ingredients: ['bread', 'banana', 'honey', 'butter'],
          instructions: '1. Toast bread. 2. Mash banana. 3. Spread on toast with honey.'
        },
        {
          id: 'recipe-2',
          name: 'Pizza with varian poul',
          cookTime: 25,
          servings: 4,
          ingredients: ['pizza dough', 'chicken', 'vegetables', 'cheese'],
          instructions: '1. Prepare dough. 2. Add toppings. 3. Bake until golden.'
        },
        {
          id: 'recipe-3',
          name: 'Pancake with honey',
          cookTime: 15,
          servings: 2,
          ingredients: ['flour', 'eggs', 'milk', 'honey'],
          instructions: '1. Mix batter. 2. Cook pancakes. 3. Serve with honey.'
        },
        {
          id: 'recipe-4',
          name: 'Set of salad',
          cookTime: 10,
          servings: 2,
          ingredients: ['mixed greens', 'vegetables', 'dressing', 'nuts'],
          instructions: '1. Wash greens. 2. Chop vegetables. 3. Mix with dressing.'
        }
      ];

      const sampleMeals: Meal[] = [
        {
          id: 'meal-1',
          name: 'Toast with banana flavor',
          type: 'breakfast',
          day: 'Monday',
          recipe: sampleRecipes[0],
          imageUrl: 'https://images.unsplash.com/photo-1645802733740-50f48729d151?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2FzdCUyMGVnZ3MlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzU3MTE0NTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        },
        {
          id: 'meal-2',
          name: 'Pizza with varian poul',
          type: 'lunch',
          day: 'Tuesday',
          recipe: sampleRecipes[1],
          imageUrl: 'https://images.unsplash.com/photo-1743615357582-375c0400064d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHZlZ2V0YWJsZXMlMjBsdW5jaHxlbnwxfHx8fDE3NTcxMTQ1Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        },
        {
          id: 'meal-3',
          name: 'Pancake with honey',
          type: 'dinner',
          day: 'Wednesday',
          recipe: sampleRecipes[2],
          imageUrl: 'https://images.unsplash.com/photo-1620108091863-55147620ddaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5jYWtlcyUyMGhvbmV5JTIwYnJlYWtmYXN0fGVufDF8fHx8MTc1NzExNDU0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        },
        {
          id: 'meal-4',
          name: 'Set of salad',
          type: 'supper',
          day: 'Thursday',
          recipe: sampleRecipes[3],
          imageUrl: 'https://images.unsplash.com/photo-1643750182373-b4a55a8c2801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGJvd2wlMjBoZWFsdGh5fGVufDF8fHx8MTc1NzAyNjMzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        }
      ];

      const defaultPlan: MealPlan = {
        id: 'plan-default',
        name: 'Personal Meal Plan',
        description: 'My personal meal planning',
        color: '#3ecfcf',
        meals: sampleMeals,
        recipes: sampleRecipes,
        createdAt: new Date(),
        isActive: true,
        category: 'personal'
      };

      setMealPlans([defaultPlan]);
      setActivePlanId(defaultPlan.id);
    }
  }, [mealPlans.length]);

  // Plan management functions
  const createPlan = (planData: Omit<MealPlan, 'id' | 'createdAt'>) => {
    const newPlan: MealPlan = {
      ...planData,
      id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    setMealPlans(prev => [...prev, newPlan]);
  };

  const updatePlan = (id: string, updates: Partial<MealPlan>) => {
    setMealPlans(prev => prev.map(plan => 
      plan.id === id ? { ...plan, ...updates } : plan
    ));
  };

  const deletePlan = (id: string) => {
    setMealPlans(prev => prev.filter(plan => plan.id !== id));
  };

  const setActivePlan = (id: string) => {
    setActivePlanId(id);
    setMealPlans(prev => prev.map(plan => ({ 
      ...plan, 
      isActive: plan.id === id 
    })));
  };

  // Meal management functions
  const addMeal = (mealData: Omit<Meal, 'id'>) => {
    if (!activePlanId) return;
    
    const newMeal: Meal = {
      ...mealData,
      id: `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    updatePlan(activePlanId, {
      meals: [...meals, newMeal]
    });
    setShowAddMealDialog(false);
  };

  const editMeal = (id: string, mealData: Omit<Meal, 'id'>) => {
    if (!activePlanId) return;
    
    const updatedMeals = meals.map(meal => 
      meal.id === id ? { ...mealData, id } : meal
    );
    
    updatePlan(activePlanId, { meals: updatedMeals });
    setEditingMeal(null);
  };

  const deleteMeal = (id: string) => {
    if (!activePlanId) return;
    
    const updatedMeals = meals.filter(meal => meal.id !== id);
    updatePlan(activePlanId, { meals: updatedMeals });
  };

  const toggleMealFavorite = (id: string) => {
    if (!activePlanId) return;
    
    const updatedMeals = meals.map(meal => 
      meal.id === id ? { ...meal, isFavorite: !meal.isFavorite } : meal
    );
    
    updatePlan(activePlanId, { meals: updatedMeals });
  };

  // Recipe management functions
  const addRecipe = (recipeData: Omit<Recipe, 'id'>) => {
    if (!activePlanId) return;
    
    const newRecipe: Recipe = {
      ...recipeData,
      id: `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    updatePlan(activePlanId, {
      recipes: [...recipes, newRecipe]
    });
  };

  const editRecipe = (id: string, recipeData: Omit<Recipe, 'id'>) => {
    if (!activePlanId) return;
    
    const updatedRecipes = recipes.map(recipe => 
      recipe.id === id ? { ...recipeData, id } : recipe
    );
    
    updatePlan(activePlanId, { recipes: updatedRecipes });
  };

  const deleteRecipe = (id: string) => {
    if (!activePlanId) return;
    
    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
    const updatedMeals = meals.map(meal => 
      meal.recipe?.id === id ? { ...meal, recipe: undefined } : meal
    );
    
    updatePlan(activePlanId, { 
      recipes: updatedRecipes,
      meals: updatedMeals
    });
  };

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setActiveView('search');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setActiveView('menu');
  };

  // Settings page functions
  const exportData = () => {
    const data = {
      meals,
      recipes,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-planner-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (data: any) => {
    if (data.meals && Array.isArray(data.meals)) {
      setMeals(data.meals);
    }
    if (data.recipes && Array.isArray(data.recipes)) {
      setRecipes(data.recipes);
    }
    alert('Data imported successfully!');
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setMeals([]);
      setRecipes([]);
      localStorage.removeItem('meal-planner-meals');
      localStorage.removeItem('meal-planner-recipes');
      alert('All data has been cleared.');
    }
  };

  // Handle view changes for mobile search
  const handleViewChange = (view: string) => {
    if (view === 'search' && isMobile) {
      setShowMobileSearchModal(true);
    } else {
      setActiveView(view);
    }
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'search':
        return (
          <SearchResults
            searchQuery={searchQuery}
            meals={meals}
            onEditMeal={(meal) => setEditingMeal(meal)}
            onDeleteMeal={deleteMeal}
            onToggleFavorite={toggleMealFavorite}
            onViewDetails={setViewingMealDetails}
            onClearSearch={clearSearch}
          />
        );
      case 'preparation':
        return (
          <PreparationPage
            meals={meals}
            onBack={() => setActiveView('menu')}
          />
        );
      case 'add-plan':
        return (
          <AddPlanPage
            meals={meals}
            recipes={recipes}
            onBack={() => setActiveView('menu')}
            onAddMeal={addMeal}
          />
        );
      case 'plan-manager':
        return (
          <PlanManagerPage
            plans={mealPlans}
            activePlanId={activePlanId}
            onBack={() => setActiveView('menu')}
            onCreatePlan={createPlan}
            onUpdatePlan={updatePlan}
            onDeletePlan={deletePlan}
            onSetActivePlan={setActivePlan}
          />
        );
      case 'analytics':
        return <AnalyticsPage meals={meals} recipes={recipes} />;
      case 'filter':
        return (
          <FilterPage
            meals={meals}
            onEditMeal={(meal) => setEditingMeal(meal)}
            onDeleteMeal={deleteMeal}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            onExportData={exportData}
            onImportData={importData}
            onClearData={clearAllData}
          />
        );
      case 'calendar':
        return (
          <CalendarPage
            meals={meals}
            recipes={recipes}
            onAddMeal={addMeal}
            onEditMeal={editMeal}
            onDeleteMeal={deleteMeal}
          />
        );
      case 'more':
        return (
          <MorePage
            meals={meals}
            recipes={recipes}
            onViewChange={setActiveView}
          />
        );
      case 'recipes':
        return (
          <RecipeManager
            recipes={recipes}
            onAddRecipe={addRecipe}
            onEditRecipe={editRecipe}
            onDeleteRecipe={deleteRecipe}
          />
        );
      case 'shopping':
        return <ShoppingList meals={meals} />;
      default:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!isMobile && (
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Home
                  </Button>
                )}
                {/* Mobile search button in header */}
                {isMobile && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500"
                      onClick={() => setShowMobileSearchModal(true)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500"
                      onClick={() => setActiveView('add-plan')}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="text-primary border-primary hover:bg-primary/10"
                  onClick={() => setActiveView('preparation')}
                >
                  <ChefHat className="h-4 w-4 mr-2" />
                  {isMobile ? "PREP" : "PREPARE"}
                </Button>
                {!isMobile && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setActiveView('add-plan')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Add Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActiveView('plan-manager')}>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Plans
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setShowAddMealDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Meal
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Main title */}
            <div>
              <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} text-gray-800 mb-8`}>
                What are we cooking <span className="text-primary">today</span>?
              </h1>
            </div>

            {/* Meal type cards */}
            <div className={`grid gap-${isMobile ? '4' : '8'} ${
              isMobile 
                ? 'grid-cols-2 max-w-md' 
                : isTablet 
                  ? 'grid-cols-3 max-w-lg' 
                  : 'grid-cols-4 max-w-2xl'
            }`}>
              {mealTypes.map((mealType, index) => (
                <MealTypeCard
                  key={index}
                  title={mealType.title}
                  ingredientsCount={mealType.ingredientsCount}
                  imageUrl={mealType.imageUrl}
                  onClick={() => setShowAddMealDialog(true)}
                />
              ))}
            </div>

            {/* Weekly meal planner */}
            <ModernWeeklyPlanner
              meals={meals}
              recipes={recipes}
              currentWeek={currentWeek}
              onAddMeal={addMeal}
              onEditMeal={editMeal}
              onDeleteMeal={deleteMeal}
              onToggleFavorite={toggleMealFavorite}
              onViewMealDetails={setViewingMealDetails}
              onAddPlan={() => setActiveView('add-plan')}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        activeView={activeView} 
        onViewChange={handleViewChange} 
        onSearch={handleSearch}
      />
      
      <div className={`flex-1 ${isMobile ? 'p-4 pb-20' : 'p-8'}`}>
        {renderMainContent()}
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation 
        activeView={activeView} 
        onViewChange={handleViewChange}
      />

      {/* Mobile Search Modal */}
      <MobileSearchModal
        open={showMobileSearchModal}
        onOpenChange={setShowMobileSearchModal}
        onSearch={handleSearch}
      />

      {/* Add meal dialog */}
      <AddMealDialog
        day="Monday"
        mealType="breakfast"
        recipes={recipes}
        open={showAddMealDialog}
        onOpenChange={setShowAddMealDialog}
        onSave={(mealData) => {
          addMeal(mealData);
          setShowAddMealDialog(false);
        }}
      />

      {/* Edit meal dialog */}
      {editingMeal && (
        <AddMealDialog
          day={editingMeal.day}
          mealType={editingMeal.type}
          recipes={recipes}
          meal={editingMeal}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingMeal(null);
          }}
          onSave={(mealData) => {
            editMeal(editingMeal.id, mealData);
            setEditingMeal(null);
          }}
        />
      )}

      {/* Meal detail dialog */}
      <MealDetailDialog
        meal={viewingMealDetails}
        open={!!viewingMealDetails}
        onOpenChange={(open) => {
          if (!open) setViewingMealDetails(null);
        }}
        onSave={editMeal}
        onDelete={deleteMeal}
        onToggleFavorite={toggleMealFavorite}
      />
    </div>
  );
}
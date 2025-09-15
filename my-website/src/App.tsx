// src/App.tsx
import { useState, useEffect } from 'react';
import { Sidebar } from './assets/components/sidebar';
import { MobileNavigation } from './assets/components/mobile-navigation';
import { MobileSearchModal } from './assets/components/mobile-search-modal';
import { ModernWeeklyPlanner } from './assets/components/modern-weekly-planner';
import { MealTypeCard } from './assets/components/meal-type-card';
import { RecipeManager } from './assets/components/recipe-manager';
import { ShoppingList } from './assets/components/shopping-list';

import { AddMealDialog } from './assets/components/add-meal-dialog';
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
import { Recipe, Meal, MealPlan } from './types';

// ⚡ Exemple de mealTypes
const mealTypes = [
  { title: 'Breakfast', ingredientsCount: 3, imageUrl: 'https://picsum.photos/200/200?1' },
  { title: 'Lunch', ingredientsCount: 4, imageUrl: 'https://picsum.photos/200/200?2' },
  { title: 'Dinner', ingredientsCount: 5, imageUrl: 'https://picsum.photos/200/200?3' },
  { title: 'Snack', ingredientsCount: 2, imageUrl: 'https://picsum.photos/200/200?4' },
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

  // ✅ Active plan
  const activePlan = mealPlans.find(plan => plan.id === activePlanId);
  const meals = activePlan?.meals || [];
  const recipes = activePlan?.recipes || [];

  // ✅ Chargement initial depuis localStorage
  useEffect(() => {
    const savedPlans = localStorage.getItem('meal-planner-plans');
    const savedActivePlanId = localStorage.getItem('meal-planner-active-plan-id');

    if (savedPlans) {
      const plans = JSON.parse(savedPlans).map((plan: any) => ({
        ...plan,
        createdAt: new Date(plan.createdAt),
      }));
      setMealPlans(plans);

      if (savedActivePlanId && plans.find((p: MealPlan) => p.id === savedActivePlanId)) {
        setActivePlanId(savedActivePlanId);
      } else if (plans.length > 0) {
        setActivePlanId(plans[0].id);
      }
    }
  }, []);

  // ✅ Sauvegarde dans localStorage
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

  // --- Rendu principal selon activeView ---
  const renderMainContent = () => {
    switch (activeView) {
      case 'search':
        return (
          <SearchResults
            searchQuery={searchQuery}
            meals={meals}
            onEditMeal={(meal) => setEditingMeal(meal)}
            onDeleteMeal={() => {}}
            onToggleFavorite={() => {}}
            onViewDetails={setViewingMealDetails}
            onClearSearch={() => setSearchQuery('')}
          />
        );
      case 'preparation':
        return <PreparationPage meals={meals} onBack={() => setActiveView('menu')} />;
      case 'add-plan':
        return <AddPlanPage meals={meals} recipes={recipes} onBack={() => setActiveView('menu')} onAddMeal={() => {}} />;
      case 'plan-manager':
        return (
          <PlanManagerPage
            plans={mealPlans}
            activePlanId={activePlanId}
            onBack={() => setActiveView('menu')}
            onCreatePlan={() => {}}
            onUpdatePlan={() => {}}
            onDeletePlan={() => {}}
            onSetActivePlan={() => {}}
          />
        );
      case 'analytics':
        return <AnalyticsPage meals={meals} recipes={recipes} />;
      case 'filter':
        return <FilterPage meals={meals} onEditMeal={() => {}} onDeleteMeal={() => {}} />;
      case 'settings':
        return <SettingsPage onExportData={() => {}} onImportData={() => {}} onClearData={() => {}} />;
      case 'calendar':
        return <CalendarPage meals={meals} recipes={recipes} onAddMeal={() => {}} onEditMeal={() => {}} onDeleteMeal={() => {}} />;
      case 'more':
        return <MorePage meals={meals} recipes={recipes} onViewChange={setActiveView} />;
      case 'recipes':
        return <RecipeManager recipes={recipes} onAddRecipe={() => {}} onEditRecipe={() => {}} onDeleteRecipe={() => {}} />;
      case 'shopping':
        return <ShoppingList meals={meals} />;
      default:
        return (
          <div className="space-y-8">
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} text-gray-800 mb-8`}>
              What are we cooking <span className="text-primary">today</span>?
            </h1>
            <div className={`grid gap-${isMobile ? '4' : '8'} grid-cols-2 md:grid-cols-4`}>
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
            <ModernWeeklyPlanner
              meals={meals}
              recipes={recipes}
              currentWeek={currentWeek}
              onAddMeal={() => {}}
              onEditMeal={() => {}}
              onDeleteMeal={() => {}}
              onToggleFavorite={() => {}}
              onViewMealDetails={setViewingMealDetails}
              onAddPlan={() => setActiveView('add-plan')}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} onSearch={setSearchQuery} />
      <div className={`flex-1 ${isMobile ? 'p-4 pb-20' : 'p-8'}`}>{renderMainContent()}</div>
      <MobileNavigation activeView={activeView} onViewChange={setActiveView} />
      <MobileSearchModal open={showMobileSearchModal} onOpenChange={setShowMobileSearchModal} onSearch={setSearchQuery} />
      <AddMealDialog
        day="Monday"
        mealType="breakfast"
        recipes={recipes}
        open={showAddMealDialog}
        onOpenChange={setShowAddMealDialog}
        onSave={() => setShowAddMealDialog(false)}
      />
      <MealDetailDialog
        meal={viewingMealDetails}
        open={!!viewingMealDetails}
        onOpenChange={(open) => {
          if (!open) setViewingMealDetails(null);
        }}
        onSave={() => {}}
        onDelete={() => {}}
        onToggleFavorite={() => {}}
      />
    </div>
  );
}
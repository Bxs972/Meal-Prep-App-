import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Plus, Calendar, Clock, Users, Trash2, Edit, Copy, Save } from 'lucide-react';
import { toast } from 'sonner';

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
  meals: Omit<Meal, 'id'>[];
  createdAt: Date;
  category: 'healthy' | 'family' | 'vegetarian' | 'quick' | 'custom';
}

interface AddPlanPageProps {
  meals: Meal[];
  recipes: Recipe[];
  onBack: () => void;
  onAddMeal: (meal: Omit<Meal, 'id'>) => void;
}

export function AddPlanPage({ meals, recipes, onBack, onAddMeal }: AddPlanPageProps) {
  const [savedPlans, setSavedPlans] = useState<MealPlan[]>([]);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState<Omit<MealPlan, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    meals: [],
    category: 'custom'
  });
  const [selectedPlanMeals, setSelectedPlanMeals] = useState<Omit<Meal, 'id'>[]>([]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'supper'] as const;

  // Charger les plans sauvegardés
  useEffect(() => {
    const saved = localStorage.getItem('meal-planner-plans');
    if (saved) {
      setSavedPlans(JSON.parse(saved));
    } else {
      // Plans prédéfinis
      const defaultPlans: MealPlan[] = [
        {
          id: 'plan-healthy',
          name: 'Plan Santé',
          description: 'Une semaine équilibrée avec des repas sains et nutritifs',
          category: 'healthy',
          createdAt: new Date(),
          meals: [
            {
              name: 'Smoothie aux fruits',
              type: 'breakfast',
              day: 'Monday',
              notes: 'Riche en vitamines'
            },
            {
              name: 'Salade de quinoa',
              type: 'lunch',
              day: 'Monday',
              notes: 'Protéines végétales'
            },
            {
              name: 'Saumon grillé aux légumes',
              type: 'dinner',
              day: 'Monday',
              notes: 'Oméga-3 et fibres'
            }
          ]
        },
        {
          id: 'plan-family',
          name: 'Plan Famille',
          description: 'Des repas conviviaux pour toute la famille',
          category: 'family',
          createdAt: new Date(),
          meals: [
            {
              name: 'Pancakes maison',
              type: 'breakfast',
              day: 'Sunday',
              notes: 'Weekend en famille'
            },
            {
              name: 'Pâtes bolognaise',
              type: 'lunch',
              day: 'Sunday',
              notes: 'Plat familial'
            }
          ]
        },
        {
          id: 'plan-quick',
          name: 'Plan Express',
          description: 'Repas rapides pour les semaines chargées',
          category: 'quick',
          createdAt: new Date(),
          meals: [
            {
              name: 'Toast avocat',
              type: 'breakfast',
              day: 'Monday',
              notes: 'Prêt en 5 minutes'
            },
            {
              name: 'Salade préparée',
              type: 'lunch',
              day: 'Monday',
              notes: 'Repas rapide'
            }
          ]
        }
      ];
      setSavedPlans(defaultPlans);
      localStorage.setItem('meal-planner-plans', JSON.stringify(defaultPlans));
    }
  }, []);

  // Sauvegarder les plans
  useEffect(() => {
    if (savedPlans.length > 0) {
      localStorage.setItem('meal-planner-plans', JSON.stringify(savedPlans));
    }
  }, [savedPlans]);

  const getCategoryLabel = (category: string) => {
    const labels = {
      healthy: 'Santé',
      family: 'Famille',
      vegetarian: 'Végétarien',
      quick: 'Rapide',
      custom: 'Personnalisé'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      family: 'bg-blue-100 text-blue-800',
      vegetarian: 'bg-orange-100 text-orange-800',
      quick: 'bg-purple-100 text-purple-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMealTypeLabel = (type: string) => {
    const labels = {
      breakfast: 'Petit-déjeuner',
      lunch: 'Déjeuner',
      dinner: 'Dîner',
      supper: 'Souper'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const savePlan = () => {
    if (!newPlan.name.trim()) {
      toast.error('Veuillez entrer un nom pour le plan');
      return;
    }

    const plan: MealPlan = {
      ...newPlan,
      id: `plan-${Date.now()}`,
      createdAt: new Date(),
      meals: selectedPlanMeals
    };

    setSavedPlans(prev => [...prev, plan]);
    setNewPlan({ name: '', description: '', meals: [], category: 'custom' });
    setSelectedPlanMeals([]);
    setIsCreatingPlan(false);
    toast.success('Plan sauvegardé avec succès !');
  };

  const deletePlan = (planId: string) => {
    setSavedPlans(prev => prev.filter(plan => plan.id !== planId));
    toast.success('Plan supprimé');
  };

  const duplicatePlan = (plan: MealPlan) => {
    const duplicatedPlan: MealPlan = {
      ...plan,
      id: `plan-${Date.now()}`,
      name: `${plan.name} (Copie)`,
      createdAt: new Date()
    };
    setSavedPlans(prev => [...prev, duplicatedPlan]);
    toast.success('Plan dupliqué');
  };

  const applyPlan = (plan: MealPlan) => {
    plan.meals.forEach(meal => {
      onAddMeal(meal);
    });
    toast.success(`Plan "${plan.name}" appliqué à votre planning !`);
  };

  const addMealToPlan = (day: string, type: string) => {
    const newMeal: Omit<Meal, 'id'> = {
      name: '',
      type: type as any,
      day,
      notes: ''
    };
    setSelectedPlanMeals(prev => [...prev, newMeal]);
  };

  const updatePlanMeal = (index: number, field: keyof Omit<Meal, 'id'>, value: any) => {
    setSelectedPlanMeals(prev => prev.map((meal, i) => 
      i === index ? { ...meal, [field]: value } : meal
    ));
  };

  const removePlanMeal = (index: number) => {
    setSelectedPlanMeals(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1>Plans de repas</h1>
            <p className="text-muted-foreground">
              Créez et gérez vos plans de repas prédéfinis
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreatingPlan(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau plan
        </Button>
      </div>

      <Tabs defaultValue="saved" className="space-y-6">
        <TabsList>
          <TabsTrigger value="saved">Plans sauvegardés</TabsTrigger>
          <TabsTrigger value="current">Plan actuel</TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPlans.map(plan => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <Badge className={getCategoryColor(plan.category)}>
                      {getCategoryLabel(plan.category)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {plan.meals.length} repas
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plan.meals.slice(0, 3).map((meal, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{meal.name || 'Repas sans nom'}</span>
                        <span className="text-muted-foreground"> - {meal.day} {getMealTypeLabel(meal.type)}</span>
                      </div>
                    ))}
                    {plan.meals.length > 3 && (
                      <div className="text-sm text-muted-foreground">
                        +{plan.meals.length - 3} autres repas...
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => applyPlan(plan)}>
                      Appliquer
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => duplicatePlan(plan)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deletePlan(plan.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {savedPlans.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3>Aucun plan sauvegardé</h3>
                <p className="text-muted-foreground">
                  Créez votre premier plan de repas pour commencer.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Votre planning actuel</CardTitle>
              <CardDescription>
                Repas actuellement planifiés dans votre calendrier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {days.map(day => {
                  const dayMeals = meals.filter(meal => meal.day === day);
                  return (
                    <div key={day} className="border rounded-lg p-4">
                      <h4>{day}</h4>
                      <div className="mt-2 space-y-2">
                        {dayMeals.length > 0 ? (
                          dayMeals.map(meal => (
                            <div key={meal.id} className="flex items-center justify-between text-sm">
                              <span>
                                <span className="font-medium">{meal.name}</span>
                                <span className="text-muted-foreground"> - {getMealTypeLabel(meal.type)}</span>
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Aucun repas planifié</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {meals.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <Button
                    onClick={() => {
                      const currentPlan: Omit<MealPlan, 'id' | 'createdAt'> = {
                        name: `Plan du ${new Date().toLocaleDateString()}`,
                        description: 'Plan créé à partir de votre planning actuel',
                        category: 'custom',
                        meals: meals.map(({ id, ...meal }) => meal)
                      };
                      setNewPlan(currentPlan);
                      setSelectedPlanMeals(currentPlan.meals);
                      setIsCreatingPlan(true);
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder comme nouveau plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de création de plan */}
      <Dialog open={isCreatingPlan} onOpenChange={setIsCreatingPlan}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau plan</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Nom du plan</Label>
                <Input
                  id="plan-name"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Mon super plan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-category">Catégorie</Label>
                <Select
                  value={newPlan.category}
                  onValueChange={(value) => setNewPlan(prev => ({ ...prev, category: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthy">Santé</SelectItem>
                    <SelectItem value="family">Famille</SelectItem>
                    <SelectItem value="vegetarian">Végétarien</SelectItem>
                    <SelectItem value="quick">Rapide</SelectItem>
                    <SelectItem value="custom">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-description">Description</Label>
              <Textarea
                id="plan-description"
                value={newPlan.description}
                onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de votre plan..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4>Repas du plan</h4>
                <Select onValueChange={(value) => {
                  const [day, type] = value.split('-');
                  addMealToPlan(day, type);
                }}>
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Ajouter un repas" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map(day => 
                      mealTypes.map(type => (
                        <SelectItem key={`${day}-${type}`} value={`${day}-${type}`}>
                          {day} - {getMealTypeLabel(type)}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedPlanMeals.map((meal, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Nom du repas"
                        value={meal.name}
                        onChange={(e) => updatePlanMeal(index, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Notes"
                        value={meal.notes || ''}
                        onChange={(e) => updatePlanMeal(index, 'notes', e.target.value)}
                      />
                      <div className="text-sm text-muted-foreground flex items-center">
                        {meal.day} - {getMealTypeLabel(meal.type)}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePlanMeal(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreatingPlan(false)}>
                Annuler
              </Button>
              <Button onClick={savePlan}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder le plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
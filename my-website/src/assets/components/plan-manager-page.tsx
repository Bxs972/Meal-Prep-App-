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
import { ArrowLeft, Plus, Calendar, Clock, Users, Trash2, Edit, Copy, Save, Star, Settings } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

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

interface PlanManagerPageProps {
  plans: MealPlan[];
  activePlanId: string;
  onBack: () => void;
  onCreatePlan: (plan: Omit<MealPlan, 'id' | 'createdAt'>) => void;
  onUpdatePlan: (id: string, plan: Partial<MealPlan>) => void;
  onDeletePlan: (id: string) => void;
  onSetActivePlan: (id: string) => void;
}

const planColors = [
  '#3ecfcf', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

const planCategories = [
  { value: 'personal', label: 'Personnel', icon: '👤' },
  { value: 'family', label: 'Famille', icon: '👨‍👩‍👧‍👦' },
  { value: 'diet', label: 'Régime', icon: '🥗' },
  { value: 'fitness', label: 'Fitness', icon: '💪' },
  { value: 'custom', label: 'Personnalisé', icon: '⚙️' }
];

export function PlanManagerPage({ 
  plans, 
  activePlanId, 
  onBack, 
  onCreatePlan, 
  onUpdatePlan, 
  onDeletePlan, 
  onSetActivePlan 
}: PlanManagerPageProps) {
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null);
  const [newPlan, setNewPlan] = useState<Omit<MealPlan, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    color: planColors[0],
    meals: [],
    recipes: [],
    isActive: false,
    category: 'personal'
  });

  const getCategoryLabel = (category: string) => {
    const cat = planCategories.find(c => c.value === category);
    return cat ? `${cat.icon} ${cat.label}` : category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800',
      family: 'bg-green-100 text-green-800',
      diet: 'bg-orange-100 text-orange-800',
      fitness: 'bg-purple-100 text-purple-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleCreatePlan = () => {
    if (!newPlan.name.trim()) {
      toast.error('Veuillez entrer un nom pour le plan');
      return;
    }

    onCreatePlan(newPlan);
    setNewPlan({
      name: '',
      description: '',
      color: planColors[0],
      meals: [],
      recipes: [],
      isActive: false,
      category: 'personal'
    });
    setIsCreatingPlan(false);
    toast.success('Plan créé avec succès !');
  };

  const handleUpdatePlan = () => {
    if (!editingPlan) return;
    
    onUpdatePlan(editingPlan.id, editingPlan);
    setEditingPlan(null);
    toast.success('Plan mis à jour !');
  };

  const handleDeletePlan = (planId: string) => {
    if (planId === activePlanId) {
      toast.error('Impossible de supprimer le plan actif');
      return;
    }
    onDeletePlan(planId);
    toast.success('Plan supprimé');
  };

  const handleDuplicatePlan = (plan: MealPlan) => {
    const duplicatedPlan: Omit<MealPlan, 'id' | 'createdAt'> = {
      ...plan,
      name: `${plan.name} (Copie)`,
      isActive: false
    };
    onCreatePlan(duplicatedPlan);
    toast.success('Plan dupliqué');
  };

  const handleSetActivePlan = (planId: string) => {
    onSetActivePlan(planId);
    toast.success('Plan activé !');
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
            <h1>Gestionnaire de plans</h1>
            <p className="text-muted-foreground">
              Créez et gérez vos différents plans de repas
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreatingPlan(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <Card 
            key={plan.id} 
            className={`hover:shadow-md transition-all duration-200 ${
              plan.id === activePlanId ? 'ring-2 ring-primary shadow-lg' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: plan.color }}
                    />
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {plan.id === activePlanId && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <CardDescription className="mt-1">
                    {plan.description || 'Aucune description'}
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
                    <span className="text-muted-foreground"> - {meal.day}</span>
                  </div>
                ))}
                {plan.meals.length > 3 && (
                  <div className="text-sm text-muted-foreground">
                    +{plan.meals.length - 3} autres repas...
                  </div>
                )}
                {plan.meals.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    Aucun repas planifié
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                {plan.id !== activePlanId ? (
                  <Button size="sm" onClick={() => handleSetActivePlan(plan.id)}>
                    Activer
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" disabled>
                    <Star className="h-4 w-4 mr-1" />
                    Actif
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditingPlan(plan)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDuplicatePlan(plan)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={plan.id === activePlanId}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer le plan</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer le plan "{plan.name}" ? 
                        Cette action ne peut pas être annulée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeletePlan(plan.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}

        {plans.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3>Aucun plan créé</h3>
                <p className="text-muted-foreground mb-4">
                  Créez votre premier plan de repas pour commencer.
                </p>
                <Button onClick={() => setIsCreatingPlan(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un plan
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Dialog de création de plan */}
      <Dialog open={isCreatingPlan} onOpenChange={setIsCreatingPlan}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un nouveau plan</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Nom du plan</Label>
              <Input
                id="plan-name"
                value={newPlan.name}
                onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Mon plan de repas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-description">Description</Label>
              <Textarea
                id="plan-description"
                value={newPlan.description}
                onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du plan..."
                rows={3}
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
                  {planCategories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Couleur du plan</Label>
              <div className="flex gap-2 flex-wrap">
                {planColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      newPlan.color === color ? 'border-foreground' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewPlan(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreatingPlan(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreatePlan}>
                <Save className="h-4 w-4 mr-2" />
                Créer le plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition de plan */}
      <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le plan</DialogTitle>
          </DialogHeader>
          
          {editingPlan && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plan-name">Nom du plan</Label>
                <Input
                  id="edit-plan-name"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Mon plan de repas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-plan-description">Description</Label>
                <Textarea
                  id="edit-plan-description"
                  value={editingPlan.description || ''}
                  onChange={(e) => setEditingPlan(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Description du plan..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-plan-category">Catégorie</Label>
                <Select
                  value={editingPlan.category}
                  onValueChange={(value) => setEditingPlan(prev => prev ? { ...prev, category: value as any } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {planCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Couleur du plan</Label>
                <div className="flex gap-2 flex-wrap">
                  {planColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        editingPlan.color === color ? 'border-foreground' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditingPlan(prev => prev ? { ...prev, color } : null)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingPlan(null)}>
                  Annuler
                </Button>
                <Button onClick={handleUpdatePlan}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
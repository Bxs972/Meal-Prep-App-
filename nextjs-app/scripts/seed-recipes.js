/**
 * Seed script — inserts 6 public demo recipes.
 * Usage: NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node scripts/seed-recipes.js
 *
 * Requires a valid authenticated user_id (set below or via env var SEED_USER_ID).
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const userId = process.env.SEED_USER_ID

if (!supabaseUrl || !supabaseKey || !userId) {
  console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SEED_USER_ID')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const recipes = [
  {
    user_id: userId,
    title: 'Classic Overnight Oats',
    description: 'Creamy overnight oats loaded with fruit and nuts — no cooking required.',
    category: 'breakfast',
    difficulty: 'easy',
    prep_time: 5,
    cooking_time: 0,
    servings: 1,
    is_public: true,
    tags: ['quick', 'vegetarian', 'meal-prep'],
    instructions: [
      'Combine oats, milk, and yogurt in a jar.',
      'Stir in chia seeds and maple syrup.',
      'Seal and refrigerate overnight.',
      'Top with banana slices, berries, and honey before serving.',
    ],
    ingredients: [
      { name: 'rolled oats', quantity: '80', unit: 'g' },
      { name: 'almond milk', quantity: '120', unit: 'ml' },
      { name: 'greek yogurt', quantity: '50', unit: 'g' },
      { name: 'chia seeds', quantity: '10', unit: 'g' },
      { name: 'banana', quantity: '1', unit: 'piece' },
    ],
    nutritional_info: { calories: 380, protein: 14, carbs: 58, fat: 9 },
  },
  {
    user_id: userId,
    title: 'Grilled Chicken & Quinoa Bowl',
    description: 'High-protein lunch bowl with grilled chicken, fluffy quinoa, and roasted vegetables.',
    category: 'lunch',
    difficulty: 'medium',
    prep_time: 15,
    cooking_time: 25,
    servings: 2,
    is_public: true,
    tags: ['high-protein', 'gluten-free', 'meal-prep'],
    instructions: [
      'Season chicken breasts with olive oil, salt, pepper, and garlic powder.',
      'Grill for 6–7 minutes per side until cooked through. Let rest, then slice.',
      'Cook quinoa in chicken broth for extra flavour.',
      'Roast bell peppers and zucchini at 200°C for 20 minutes.',
      'Assemble bowls with quinoa, chicken, vegetables, and drizzle with lemon.',
    ],
    ingredients: [
      { name: 'chicken breast', quantity: '300', unit: 'g' },
      { name: 'quinoa', quantity: '160', unit: 'g' },
      { name: 'bell pepper', quantity: '2', unit: 'piece' },
      { name: 'zucchini', quantity: '1', unit: 'piece' },
      { name: 'olive oil', quantity: '2', unit: 'tbsp' },
      { name: 'lemon', quantity: '1', unit: 'piece' },
    ],
    nutritional_info: { calories: 520, protein: 42, carbs: 48, fat: 14 },
  },
  {
    user_id: userId,
    title: 'Salmon with Sweet Potato',
    description: 'Oven-baked salmon with honey-glazed sweet potato — ready in 30 minutes.',
    category: 'dinner',
    difficulty: 'easy',
    prep_time: 10,
    cooking_time: 25,
    servings: 2,
    is_public: true,
    tags: ['omega-3', 'gluten-free', 'healthy'],
    instructions: [
      'Preheat oven to 200°C. Cut sweet potato into wedges and toss with olive oil and paprika.',
      'Roast sweet potato wedges for 20–25 minutes.',
      'Place salmon fillets on a baking sheet. Brush with honey, soy sauce, and garlic.',
      'Bake salmon for 12–15 minutes until flaky.',
      'Serve with steamed broccoli and a squeeze of lemon.',
    ],
    ingredients: [
      { name: 'salmon fillet', quantity: '300', unit: 'g' },
      { name: 'sweet potato', quantity: '400', unit: 'g' },
      { name: 'broccoli', quantity: '200', unit: 'g' },
      { name: 'honey', quantity: '1', unit: 'tbsp' },
      { name: 'soy sauce', quantity: '1', unit: 'tbsp' },
    ],
    nutritional_info: { calories: 480, protein: 36, carbs: 42, fat: 18 },
  },
  {
    user_id: userId,
    title: 'Greek Yogurt Parfait',
    description: 'A quick and healthy snack packed with probiotics, antioxidants, and crunch.',
    category: 'snack',
    difficulty: 'easy',
    prep_time: 5,
    cooking_time: 0,
    servings: 1,
    is_public: true,
    tags: ['quick', 'vegetarian', 'no-cook'],
    instructions: [
      'Layer Greek yogurt at the bottom of a glass.',
      'Add mixed berries (fresh or frozen-thawed).',
      'Top with granola and a drizzle of honey.',
      'Serve immediately or refrigerate for up to 4 hours.',
    ],
    ingredients: [
      { name: 'greek yogurt', quantity: '150', unit: 'g' },
      { name: 'mixed berries', quantity: '80', unit: 'g' },
      { name: 'granola', quantity: '30', unit: 'g' },
      { name: 'honey', quantity: '1', unit: 'tsp' },
    ],
    nutritional_info: { calories: 240, protein: 16, carbs: 32, fat: 4 },
  },
  {
    user_id: userId,
    title: 'Beef & Vegetable Stir-fry',
    description: 'Quick weeknight dinner with tender beef strips and crispy vegetables in a savory sauce.',
    category: 'dinner',
    difficulty: 'medium',
    prep_time: 15,
    cooking_time: 15,
    servings: 3,
    is_public: true,
    tags: ['quick', 'high-protein', 'asian-inspired'],
    instructions: [
      'Slice beef thinly against the grain. Marinate with soy sauce and cornstarch for 10 minutes.',
      'Heat oil in a wok over high heat. Cook beef for 2–3 minutes, then remove.',
      'Stir-fry broccoli, snap peas, and carrots for 3–4 minutes.',
      'Return beef to the wok. Add garlic, ginger, oyster sauce, and sesame oil.',
      'Toss everything together and serve over steamed rice.',
    ],
    ingredients: [
      { name: 'beef sirloin', quantity: '400', unit: 'g' },
      { name: 'broccoli', quantity: '200', unit: 'g' },
      { name: 'snap peas', quantity: '100', unit: 'g' },
      { name: 'carrot', quantity: '1', unit: 'piece' },
      { name: 'soy sauce', quantity: '3', unit: 'tbsp' },
      { name: 'sesame oil', quantity: '1', unit: 'tbsp' },
      { name: 'garlic', quantity: '3', unit: 'piece' },
    ],
    nutritional_info: { calories: 420, protein: 38, carbs: 18, fat: 22 },
  },
  {
    user_id: userId,
    title: 'Avocado Toast with Poached Eggs',
    description: 'The ultimate breakfast — creamy avocado on sourdough topped with perfectly poached eggs.',
    category: 'breakfast',
    difficulty: 'medium',
    prep_time: 10,
    cooking_time: 5,
    servings: 2,
    is_public: true,
    tags: ['vegetarian', 'high-protein', 'brunch'],
    instructions: [
      'Toast sourdough slices until golden.',
      'Mash avocado with lemon juice, salt, and red pepper flakes.',
      'Bring a pot of water to a gentle simmer. Add a splash of vinegar.',
      'Crack each egg into a cup, create a whirlpool in the water, and slide egg in. Cook 3 minutes.',
      'Spread avocado on toast, top with poached egg, season with everything bagel seasoning.',
    ],
    ingredients: [
      { name: 'sourdough bread', quantity: '2', unit: 'slice' },
      { name: 'avocado', quantity: '1', unit: 'piece' },
      { name: 'eggs', quantity: '2', unit: 'piece' },
      { name: 'lemon', quantity: '0.5', unit: 'piece' },
      { name: 'red pepper flakes', quantity: '1', unit: 'tsp' },
    ],
    nutritional_info: { calories: 360, protein: 18, carbs: 30, fat: 20 },
  },
]

async function seed() {
  console.log(`Seeding ${recipes.length} recipes...`)

  for (const recipe of recipes) {
    const { data, error } = await supabase
      .from('recipes')
      .upsert(recipe, { onConflict: 'user_id,title' })
      .select('id, title')
      .single()

    if (error) {
      console.error(`Failed to seed "${recipe.title}":`, error.message)
    } else {
      console.log(`✓ "${data.title}" (${data.id})`)
    }
  }

  console.log('Seed complete.')
}

seed().catch(console.error)

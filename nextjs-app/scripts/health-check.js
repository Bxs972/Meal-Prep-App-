/**
 * Health check script — verifies DB tables and Storage bucket are accessible.
 * Usage: NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node scripts/health-check.js
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const TABLES = [
  'recipes',
  'ingredients',
  'recipe_ingredients',
  'weekly_plans',
  'shopping_items',
  'profiles',
]

const BUCKET = 'recipe-images'

async function check() {
  console.log('=== Meal Prep App — Health Check ===\n')

  let passed = 0
  let failed = 0

  // Check tables
  console.log('DB Tables:')
  for (const table of TABLES) {
    const { error } = await supabase.from(table).select('count', { count: 'exact', head: true })
    if (error) {
      console.log(`  ✗ ${table} — ${error.message}`)
      failed++
    } else {
      console.log(`  ✓ ${table}`)
      passed++
    }
  }

  // Check storage bucket
  console.log('\nStorage:')
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
  if (bucketsError) {
    console.log(`  ✗ Storage not accessible — ${bucketsError.message}`)
    failed++
  } else {
    const bucket = buckets?.find((b) => b.name === BUCKET)
    if (bucket) {
      console.log(`  ✓ Bucket "${BUCKET}" exists (public: ${bucket.public})`)
      passed++
    } else {
      console.log(`  ✗ Bucket "${BUCKET}" not found. Create it in the Supabase dashboard.`)
      failed++
    }
  }

  // Summary
  console.log(`\n${'─'.repeat(40)}`)
  console.log(`Result: ${passed} passed, ${failed} failed`)

  if (failed > 0) {
    console.log('\nTo fix failed checks:')
    console.log('  1. Run your Supabase migrations to create missing tables.')
    console.log('  2. Create the "recipe-images" storage bucket in the Supabase dashboard.')
    console.log('  3. Enable RLS policies on all tables.')
    process.exit(1)
  } else {
    console.log('\nAll checks passed.')
  }
}

check().catch(console.error)

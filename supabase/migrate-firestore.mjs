// =============================================================
// VFITNESS BAHAMAS | Firestore -> Supabase data migration
// Run AFTER schema.sql has been applied to the Supabase project.
//
// Required env vars:
//   GOOGLE_APPLICATION_CREDENTIALS  path to Firebase service account JSON
//   SUPABASE_URL                    https://<project-ref>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY       service role key (Settings > API)
//
// Usage:
//   npm i firebase-admin @supabase/supabase-js
//   node supabase/migrate-firestore.mjs            # migrate everything
//   node supabase/migrate-firestore.mjs packages   # single collection
// =============================================================

import admin from 'firebase-admin';
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const fdb = admin.firestore();
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Every collection the app reads or writes (mapped from index.html).
// Postgres folds unquoted identifiers to lowercase, so table = name.toLowerCase().
const COLLECTIONS = [
  'users', // -> profiles_staging (special case)
  'packages', 'workoutProgramEnrollments', 'workoutLogs', 'checkIns',
  'appointments', 'sleepLogs', 'mealLogs', 'progressPhotos', 'user1RMs',
  'userCustomWeights', 'favorites', 'clientSessionLogs', 'sessionLogs',
  'clientAssessments', 'packagePurchases', 'packageReminders', 'invoices',
  'notifications', 'mealPlans', 'customPrograms', 'clientPrograms',
  'coachingApplications', 'chats', 'messages',
  'communityPosts', 'replies',
  'workoutPrograms', 'workoutTemplates', 'workoutPackages', 'workouts',
  'exerciseLibrary', 'testimonials', 'gallery', 'siteSettings', 'meals',
  'publicCoachingApplications', 'packageAuditLog',
];

// Recursively convert Firestore Timestamps / GeoPoints / References to JSON-safe values
function toJsonSafe(value) {
  if (value === null || value === undefined) return value;
  if (value instanceof admin.firestore.Timestamp) return value.toDate().toISOString();
  if (value instanceof admin.firestore.GeoPoint) return { lat: value.latitude, lng: value.longitude };
  if (value instanceof admin.firestore.DocumentReference) return value.path;
  if (Array.isArray(value)) return value.map(toJsonSafe);
  if (typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = toJsonSafe(v);
    return out;
  }
  return value;
}

function pickCreatedAt(d) {
  const c = d.createdAt || d.purchaseDate || d.startDate || d.date || d.timestamp || d.submittedAt;
  return typeof c === 'string' ? c : null; // already ISO after toJsonSafe
}

async function migrateUsers() {
  const snap = await fdb.collection('users').get();
  const rows = snap.docs.map((doc) => {
    const data = toJsonSafe(doc.data());
    return {
      firebase_uid: doc.id,
      data,
      created_at: pickCreatedAt(data) || new Date().toISOString(),
    };
  });
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await supabase
      .from('profiles_staging')
      .upsert(rows.slice(i, i + 500), { onConflict: 'firebase_uid' });
    if (error) throw new Error(`profiles_staging: ${error.message}`);
  }
  console.log(`users -> profiles_staging: ${rows.length} rows`);
  return rows.length;
}

async function migrateCollection(name) {
  if (name === 'users') return migrateUsers();
  const table = name.toLowerCase();
  const snap = await fdb.collection(name).get();
  const rows = snap.docs.map((doc) => {
    const data = toJsonSafe(doc.data());
    return {
      firestore_id: doc.id,
      client_uid: data.clientId || data.userId || data.uid || null,
      trainer_uid: data.trainerId || null,
      data,
      created_at: pickCreatedAt(data) || new Date().toISOString(),
    };
  });
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await supabase
      .from(table)
      .upsert(rows.slice(i, i + 500), { onConflict: 'firestore_id' });
    if (error) throw new Error(`${table}: ${error.message}`);
  }
  console.log(`${name} -> ${table}: ${rows.length} rows`);
  return rows.length;
}

const only = process.argv[2];
const targets = only ? [only] : COLLECTIONS;
let total = 0;
const failures = [];

for (const name of targets) {
  try {
    total += await migrateCollection(name);
  } catch (err) {
    console.error(`FAILED ${name}: ${err.message}`);
    failures.push(name);
  }
}

console.log(`\nDone. ${total} documents migrated.`);
if (failures.length) {
  console.error(`Failed collections (rerun individually): ${failures.join(', ')}`);
  process.exit(1);
}
console.log('Next: import auth users (see README), then run in SQL editor: select public.link_profiles();');

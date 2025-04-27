import { supabaseAdmin } from '../server/supabase';

// Version simplifiée : Création directe des tables en utilisant les API de Supabase
// pour éviter les problèmes d'exécution SQL
async function createSupabaseSchema() {
  console.log('🚀 Création du schéma dans Supabase...');

  try {
    // Vérification de tables existantes (test de connexion)
    console.log('📡 Test de la connexion Supabase...');
    
    try {
      const { data, error } = await supabaseAdmin.from('brands').select('count').limit(1);
      if (!error) {
        console.log('✅ Connexion OK - Table brands existe déjà');
        console.log('La migration a probablement déjà été effectuée, vérifiez votre base Supabase.');
        return;
      } else {
        console.log('👍 Table brands n\'existe pas encore, nous pouvons procéder');
      }
    } catch (e) {
      console.log('👍 Erreur attendue - Tables non existantes, nous pouvons procéder');
    }

    // Cette partie ne fonctionne pas via l'API, nous allons créer des instructions SQL
    // à exécuter dans l'interface SQL de Supabase (Console)
    console.log('\n⚠️ ATTENTION: Vous devez exécuter le script SQL manuellement dans la console Supabase ⚠️');
    console.log('\nVoici le script SQL à copier et exécuter dans la console SQL de Supabase:');

    console.log(`
-- Création des tables dans Supabase

-- Users
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user'
);

-- Brands
CREATE TABLE IF NOT EXISTS public.brands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue
CREATE TABLE IF NOT EXISTS public.revenue (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  amount NUMERIC NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad Spend
CREATE TABLE IF NOT EXISTS public.ad_spend (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  amount NUMERIC NOT NULL,
  platform TEXT NOT NULL,
  campaign TEXT,
  ad_set TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Agents
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  cost NUMERIC,
  metrics JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad Performance
CREATE TABLE IF NOT EXISTS public.ad_performance (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  ad_set_id TEXT NOT NULL,
  ad_set_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  spend NUMERIC NOT NULL,
  roas NUMERIC NOT NULL,
  ctr NUMERIC NOT NULL,
  status TEXT NOT NULL,
  thumbnail TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Operations Tasks
CREATE TABLE IF NOT EXISTS public.ops_tasks (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  category TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  progress INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajout des politiques RLS (Row Level Security)

-- Activer RLS sur toutes les tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_spend ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_tasks ENABLE ROW LEVEL SECURITY;

-- Créer une politique par défaut pour permettre toutes les opérations (pour tester)
CREATE POLICY "Allow all operations" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.brands FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.revenue FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.ad_spend FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.ai_agents FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.ad_performance FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.ops_tasks FOR ALL USING (true);`);
    
    console.log('\n⚠️ Après avoir exécuté ces commandes SQL dans la console Supabase, relancez l\'application');

  } catch (error) {
    console.error('❌ Erreur lors de la création du schéma Supabase:', error);
    throw error;
  }
}

// Exécuter la création du schéma
createSupabaseSchema()
  .catch(error => {
    console.error('Création du schéma terminée avec des erreurs:', error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
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

-- Politique par défaut : permettre uniquement à l'utilisateur authentifié d'accéder à ses données
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT 
  USING (auth.uid() = id::text);

CREATE POLICY "Admin users can view all brands" ON public.brands
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can view brand data" ON public.brands
  FOR SELECT 
  USING (true);

-- Politiques pour les données liées aux marques
CREATE POLICY "Users can view revenue data" ON public.revenue
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can view ad spend data" ON public.ad_spend
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can view ai agents data" ON public.ai_agents
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can view ad performance data" ON public.ad_performance
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can view ops tasks data" ON public.ops_tasks
  FOR SELECT 
  USING (true);

-- Politiques pour modifications (réservées aux admins)
CREATE POLICY "Admin users can modify all data" ON public.users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin users can modify all brand data" ON public.brands
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin users can modify all revenue data" ON public.revenue
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin users can modify all ad spend data" ON public.ad_spend
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin users can modify all ai agents data" ON public.ai_agents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin users can modify all ad performance data" ON public.ad_performance
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin users can modify all ops tasks data" ON public.ops_tasks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid() AND users.role = 'admin'
    )
  );
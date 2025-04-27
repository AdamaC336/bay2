import { supabaseAdmin } from '../server/supabase';

async function createTablesInSupabase() {
  console.log('🚀 Création des tables dans Supabase...');

  try {
    // 1. Création de la table users
    console.log('Création de la table users...');
    const { error: usersError } = await supabaseAdmin.rpc('create_table', {
      table_name: 'users',
      columns: `
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'user'
      `
    });
    
    if (usersError) {
      console.warn(`⚠️ Erreur lors de la création de la table users: ${usersError.message}`);
    } else {
      console.log('✅ Table users créée');
    }

    // 2. Création de la table brands
    console.log('Création de la table brands...');
    const { error: brandsError } = await supabaseAdmin.rpc('create_table', {
      table_name: 'brands',
      columns: `
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        code TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `
    });
    
    if (brandsError) {
      console.warn(`⚠️ Erreur lors de la création de la table brands: ${brandsError.message}`);
    } else {
      console.log('✅ Table brands créée');
    }

    // 3. Création de la table revenue
    console.log('Création de la table revenue...');
    const { error: revenueError } = await supabaseAdmin.rpc('create_table', {
      table_name: 'revenue',
      columns: `
        id SERIAL PRIMARY KEY,
        brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        amount NUMERIC NOT NULL,
        source TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `
    });
    
    if (revenueError) {
      console.warn(`⚠️ Erreur lors de la création de la table revenue: ${revenueError.message}`);
    } else {
      console.log('✅ Table revenue créée');
    }

    // 4. Création de la table ad_spend
    console.log('Création de la table ad_spend...');
    const { error: adSpendError } = await supabaseAdmin.rpc('create_table', {
      table_name: 'ad_spend',
      columns: `
        id SERIAL PRIMARY KEY,
        brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        amount NUMERIC NOT NULL,
        platform TEXT NOT NULL,
        campaign TEXT,
        ad_set TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `
    });
    
    if (adSpendError) {
      console.warn(`⚠️ Erreur lors de la création de la table ad_spend: ${adSpendError.message}`);
    } else {
      console.log('✅ Table ad_spend créée');
    }

    // 5. Création de la table ai_agents
    console.log('Création de la table ai_agents...');
    const { error: aiAgentsError } = await supabaseAdmin.rpc('create_table', {
      table_name: 'ai_agents',
      columns: `
        id SERIAL PRIMARY KEY,
        brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        cost NUMERIC,
        metrics JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `
    });
    
    if (aiAgentsError) {
      console.warn(`⚠️ Erreur lors de la création de la table ai_agents: ${aiAgentsError.message}`);
    } else {
      console.log('✅ Table ai_agents créée');
    }

    // 6. Création de la table ad_performance
    console.log('Création de la table ad_performance...');
    const { error: adPerformanceError } = await supabaseAdmin.rpc('create_table', {
      table_name: 'ad_performance',
      columns: `
        id SERIAL PRIMARY KEY,
        brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
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
      `
    });
    
    if (adPerformanceError) {
      console.warn(`⚠️ Erreur lors de la création de la table ad_performance: ${adPerformanceError.message}`);
    } else {
      console.log('✅ Table ad_performance créée');
    }

    // 7. Création de la table ops_tasks
    console.log('Création de la table ops_tasks...');
    const { error: opsTasksError } = await supabaseAdmin.rpc('create_table', {
      table_name: 'ops_tasks',
      columns: `
        id SERIAL PRIMARY KEY,
        brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        category TEXT NOT NULL,
        due_date TIMESTAMP WITH TIME ZONE,
        progress INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `
    });
    
    if (opsTasksError) {
      console.warn(`⚠️ Erreur lors de la création de la table ops_tasks: ${opsTasksError.message}`);
    } else {
      console.log('✅ Table ops_tasks créée');
    }

    console.log('🎉 Création des tables terminée !');
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
    throw error;
  }
}

// Exécuter la création des tables
createTablesInSupabase()
  .catch(error => {
    console.error('Création des tables terminée avec des erreurs:', error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
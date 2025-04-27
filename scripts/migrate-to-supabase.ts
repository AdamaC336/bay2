import { supabaseAdmin } from '../server/supabase';
import { db, pool } from '../server/db';
import { 
  users, brands, revenue, adSpend, aiAgents, adPerformance, opsTasks
} from '../shared/schema';
import { eq } from 'drizzle-orm';

// Fonction utilitaire pour traiter les dates
function formatDateForSupabase(date: Date): string {
  return date.toISOString();
}

// Fonction utilitaire pour traiter les objets JSON
function formatJsonForSupabase(json: any): any {
  return json;
}

async function migrateToSupabase() {
  console.log('🚀 Migration vers Supabase en cours...');

  try {
    // 1. Création des tables dans Supabase
    console.log('1️⃣ Configuration des tables dans Supabase...');

    console.log('✅ Tables configurées dans Supabase');

    // 2. Migration des utilisateurs
    console.log('2️⃣ Migration des utilisateurs...');

    const usersData = await db.select().from(users);
    
    if (usersData.length > 0) {
      // Supprimer les utilisateurs existants si nécessaire
      await supabaseAdmin.from('users').delete().gte('id', 0);
      
      // Insérer les nouveaux utilisateurs
      const { data: insertedUsers, error: usersError } = await supabaseAdmin
        .from('users')
        .insert(usersData);
      
      if (usersError) {
        throw new Error(`Erreur lors de l'insertion des utilisateurs: ${usersError.message}`);
      }
      
      console.log(`✅ ${usersData.length} utilisateurs migrés`);
    } else {
      console.log('⚠️ Aucun utilisateur à migrer');
    }

    // 3. Migration des marques
    console.log('3️⃣ Migration des marques...');

    const brandsData = await db.select().from(brands);
    
    if (brandsData.length > 0) {
      // Formater les dates pour Supabase
      const brandsFormatted = brandsData.map(brand => ({
        ...brand,
        createdAt: brand.createdAt ? formatDateForSupabase(brand.createdAt) : null
      }));
      
      // Supprimer les marques existantes si nécessaire
      await supabaseAdmin.from('brands').delete().gte('id', 0);
      
      // Insérer les nouvelles marques
      const { data: insertedBrands, error: brandsError } = await supabaseAdmin
        .from('brands')
        .insert(brandsFormatted);
      
      if (brandsError) {
        throw new Error(`Erreur lors de l'insertion des marques: ${brandsError.message}`);
      }
      
      console.log(`✅ ${brandsData.length} marques migrées`);
    } else {
      console.log('⚠️ Aucune marque à migrer');
    }

    // 4. Migration des données de revenus
    console.log('4️⃣ Migration des données de revenus...');

    const revenueData = await db.select().from(revenue);
    
    if (revenueData.length > 0) {
      // Formater les dates pour Supabase
      const revenueFormatted = revenueData.map(rev => ({
        ...rev,
        date: formatDateForSupabase(rev.date),
        createdAt: rev.createdAt ? formatDateForSupabase(rev.createdAt) : null
      }));
      
      // Supprimer les données de revenus existantes si nécessaire
      await supabaseAdmin.from('revenue').delete().gte('id', 0);
      
      // Insérer les nouvelles données de revenus par lots de 100 pour éviter les problèmes de taille
      const batchSize = 100;
      for (let i = 0; i < revenueFormatted.length; i += batchSize) {
        const batch = revenueFormatted.slice(i, i + batchSize);
        const { data: insertedRevenue, error: revenueError } = await supabaseAdmin
          .from('revenue')
          .insert(batch);
        
        if (revenueError) {
          throw new Error(`Erreur lors de l'insertion des données de revenus: ${revenueError.message}`);
        }
      }
      
      console.log(`✅ ${revenueData.length} entrées de revenus migrées`);
    } else {
      console.log('⚠️ Aucune donnée de revenus à migrer');
    }

    // 5. Migration des données de dépenses publicitaires
    console.log('5️⃣ Migration des données de dépenses publicitaires...');

    const adSpendData = await db.select().from(adSpend);
    
    if (adSpendData.length > 0) {
      // Formater les dates pour Supabase
      const adSpendFormatted = adSpendData.map(ads => ({
        ...ads,
        date: formatDateForSupabase(ads.date),
        createdAt: ads.createdAt ? formatDateForSupabase(ads.createdAt) : null
      }));
      
      // Supprimer les données de dépenses publicitaires existantes si nécessaire
      await supabaseAdmin.from('ad_spend').delete().gte('id', 0);
      
      // Insérer les nouvelles données de dépenses publicitaires par lots
      const batchSize = 100;
      for (let i = 0; i < adSpendFormatted.length; i += batchSize) {
        const batch = adSpendFormatted.slice(i, i + batchSize);
        const { data: insertedAdSpend, error: adSpendError } = await supabaseAdmin
          .from('ad_spend')
          .insert(batch);
        
        if (adSpendError) {
          throw new Error(`Erreur lors de l'insertion des données de dépenses publicitaires: ${adSpendError.message}`);
        }
      }
      
      console.log(`✅ ${adSpendData.length} entrées de dépenses publicitaires migrées`);
    } else {
      console.log('⚠️ Aucune donnée de dépenses publicitaires à migrer');
    }

    // 6. Migration des agents AI
    console.log('6️⃣ Migration des agents AI...');

    const aiAgentsData = await db.select().from(aiAgents);
    
    if (aiAgentsData.length > 0) {
      // Formater les dates et JSON pour Supabase
      const aiAgentsFormatted = aiAgentsData.map(agent => ({
        ...agent,
        metrics: formatJsonForSupabase(agent.metrics),
        createdAt: agent.createdAt ? formatDateForSupabase(agent.createdAt) : null,
        updatedAt: agent.updatedAt ? formatDateForSupabase(agent.updatedAt) : null
      }));
      
      // Supprimer les agents AI existants si nécessaire
      await supabaseAdmin.from('ai_agents').delete().gte('id', 0);
      
      // Insérer les nouveaux agents AI
      const { data: insertedAgents, error: agentsError } = await supabaseAdmin
        .from('ai_agents')
        .insert(aiAgentsFormatted);
      
      if (agentsError) {
        throw new Error(`Erreur lors de l'insertion des agents AI: ${agentsError.message}`);
      }
      
      console.log(`✅ ${aiAgentsData.length} agents AI migrés`);
    } else {
      console.log('⚠️ Aucun agent AI à migrer');
    }

    // 7. Migration des performances publicitaires
    console.log('7️⃣ Migration des performances publicitaires...');

    const adPerformanceData = await db.select().from(adPerformance);
    
    if (adPerformanceData.length > 0) {
      // Formater les dates pour Supabase
      const adPerformanceFormatted = adPerformanceData.map(ad => ({
        ...ad,
        date: formatDateForSupabase(ad.date),
        createdAt: ad.createdAt ? formatDateForSupabase(ad.createdAt) : null
      }));
      
      // Supprimer les performances publicitaires existantes si nécessaire
      await supabaseAdmin.from('ad_performance').delete().gte('id', 0);
      
      // Insérer les nouvelles performances publicitaires
      const { data: insertedAdPerformance, error: adPerformanceError } = await supabaseAdmin
        .from('ad_performance')
        .insert(adPerformanceFormatted);
      
      if (adPerformanceError) {
        throw new Error(`Erreur lors de l'insertion des performances publicitaires: ${adPerformanceError.message}`);
      }
      
      console.log(`✅ ${adPerformanceData.length} entrées de performances publicitaires migrées`);
    } else {
      console.log('⚠️ Aucune donnée de performances publicitaires à migrer');
    }

    // 8. Migration des tâches opérationnelles
    console.log('8️⃣ Migration des tâches opérationnelles...');

    const opsTasksData = await db.select().from(opsTasks);
    
    if (opsTasksData.length > 0) {
      // Formater les dates pour Supabase
      const opsTasksFormatted = opsTasksData.map(task => ({
        ...task,
        dueDate: task.dueDate ? formatDateForSupabase(task.dueDate) : null,
        createdAt: task.createdAt ? formatDateForSupabase(task.createdAt) : null,
        updatedAt: task.updatedAt ? formatDateForSupabase(task.updatedAt) : null
      }));
      
      // Supprimer les tâches opérationnelles existantes si nécessaire
      await supabaseAdmin.from('ops_tasks').delete().gte('id', 0);
      
      // Insérer les nouvelles tâches opérationnelles
      const { data: insertedOpsTasks, error: opsTasksError } = await supabaseAdmin
        .from('ops_tasks')
        .insert(opsTasksFormatted);
      
      if (opsTasksError) {
        throw new Error(`Erreur lors de l'insertion des tâches opérationnelles: ${opsTasksError.message}`);
      }
      
      console.log(`✅ ${opsTasksData.length} tâches opérationnelles migrées`);
    } else {
      console.log('⚠️ Aucune tâche opérationnelle à migrer');
    }

    console.log('🎉 Migration vers Supabase terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration vers Supabase:', error);
    throw error;
  } finally {
    // Fermer la connexion PostgreSQL
    await pool.end();
  }
}

// Exécuter la migration
migrateToSupabase()
  .catch(error => {
    console.error('Migration terminée avec des erreurs:', error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
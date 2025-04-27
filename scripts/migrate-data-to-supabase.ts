import { supabaseAdmin } from '../server/supabase';
import { db, pool } from '../server/db';
import { 
  users, brands, revenue, adSpend, aiAgents, adPerformance, opsTasks
} from '../shared/schema';

// Fonction utilitaire pour convertir les dates au format ISO
function convertDates(obj: any): any {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => {
    if (newObj[key] instanceof Date) {
      newObj[key] = newObj[key].toISOString();
    }
  });
  return newObj;
}

// Fonction utilitaire pour traiter les tableaux en batch
async function processBatch<T>(
  items: T[],
  batchSize: number,
  processFunction: (batch: T[]) => Promise<void>
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await processFunction(batch);
    console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)} traité`);
  }
}

async function migrateDataToSupabase() {
  console.log('🚀 Migration des données vers Supabase...');
  
  try {
    // 1. Vérification que les tables existent
    const { data: brandCheck, error: brandCheckError } = await supabaseAdmin
      .from('brands')
      .select('count(*)', { count: 'exact', head: true });
    
    if (brandCheckError) {
      throw new Error(`Erreur de connexion aux tables Supabase. Assurez-vous d'avoir créé les tables: ${brandCheckError.message}`);
    }
    
    console.log('✅ Connexion aux tables Supabase OK');

    // 2. Migration des utilisateurs
    console.log('\n1️⃣ Migration des utilisateurs...');
    const usersData = await db.select().from(users);
    
    if (usersData.length > 0) {
      // Supprimer les utilisateurs existants si nécessaire
      await supabaseAdmin.from('users').delete().gte('id', 0);
      
      // Insérer les nouveaux utilisateurs (en convertissant les dates)
      const usersToInsert = usersData.map(user => convertDates(user));
      
      const { error: usersError } = await supabaseAdmin
        .from('users')
        .insert(usersToInsert);
      
      if (usersError) {
        throw new Error(`Erreur lors de la migration des utilisateurs: ${usersError.message}`);
      }
      
      console.log(`✅ ${usersData.length} utilisateurs migrés`);
    } else {
      console.log('⚠️ Aucun utilisateur à migrer');
    }

    // 3. Migration des marques
    console.log('\n2️⃣ Migration des marques...');
    const brandsData = await db.select().from(brands);
    
    if (brandsData.length > 0) {
      // Supprimer les marques existantes si nécessaire
      await supabaseAdmin.from('brands').delete().gte('id', 0);
      
      // Insérer les nouvelles marques (en convertissant les dates)
      const brandsToInsert = brandsData.map(brand => convertDates(brand));
      
      const { error: brandsError } = await supabaseAdmin
        .from('brands')
        .insert(brandsToInsert);
      
      if (brandsError) {
        throw new Error(`Erreur lors de la migration des marques: ${brandsError.message}`);
      }
      
      console.log(`✅ ${brandsData.length} marques migrées`);
    } else {
      console.log('⚠️ Aucune marque à migrer');
    }

    // 4. Migration des revenus
    console.log('\n3️⃣ Migration des revenus...');
    const revenueData = await db.select().from(revenue);
    
    if (revenueData.length > 0) {
      // Supprimer les données existantes si nécessaire
      await supabaseAdmin.from('revenue').delete().gte('id', 0);
      
      // Insérer les données par lots (max 100 lignes par requête)
      const batchSize = 100;
      const revenueToInsert = revenueData.map(rev => ({
        ...convertDates(rev),
        // Mapper les noms de champs si nécessaire
        brand_id: rev.brandId
      }));
      
      await processBatch(revenueToInsert, batchSize, async (batch) => {
        const { error } = await supabaseAdmin.from('revenue').insert(batch);
        if (error) {
          throw new Error(`Erreur lors de la migration des revenus: ${error.message}`);
        }
      });
      
      console.log(`✅ ${revenueData.length} entrées de revenus migrées`);
    } else {
      console.log('⚠️ Aucune donnée de revenus à migrer');
    }

    // 5. Migration des dépenses publicitaires
    console.log('\n4️⃣ Migration des dépenses publicitaires...');
    const adSpendData = await db.select().from(adSpend);
    
    if (adSpendData.length > 0) {
      // Supprimer les données existantes si nécessaire
      await supabaseAdmin.from('ad_spend').delete().gte('id', 0);
      
      // Insérer les données par lots
      const batchSize = 100;
      const adSpendToInsert = adSpendData.map(ad => ({
        ...convertDates(ad),
        // Mapper les noms de champs
        brand_id: ad.brandId,
        ad_set: ad.adSet
      }));
      
      await processBatch(adSpendToInsert, batchSize, async (batch) => {
        const { error } = await supabaseAdmin.from('ad_spend').insert(batch);
        if (error) {
          throw new Error(`Erreur lors de la migration des dépenses publicitaires: ${error.message}`);
        }
      });
      
      console.log(`✅ ${adSpendData.length} entrées de dépenses publicitaires migrées`);
    } else {
      console.log('⚠️ Aucune donnée de dépenses publicitaires à migrer');
    }

    // 6. Migration des agents AI
    console.log('\n5️⃣ Migration des agents AI...');
    const aiAgentsData = await db.select().from(aiAgents);
    
    if (aiAgentsData.length > 0) {
      // Supprimer les données existantes si nécessaire
      await supabaseAdmin.from('ai_agents').delete().gte('id', 0);
      
      // Insérer les données
      const aiAgentsToInsert = aiAgentsData.map(agent => ({
        ...convertDates(agent),
        // Mapper les noms de champs
        brand_id: agent.brandId,
        // Convertir les champs spéciaux
        created_at: agent.createdAt ? agent.createdAt.toISOString() : new Date().toISOString(),
        updated_at: agent.updatedAt ? agent.updatedAt.toISOString() : new Date().toISOString()
      }));
      
      const { error: aiAgentsError } = await supabaseAdmin
        .from('ai_agents')
        .insert(aiAgentsToInsert);
      
      if (aiAgentsError) {
        throw new Error(`Erreur lors de la migration des agents AI: ${aiAgentsError.message}`);
      }
      
      console.log(`✅ ${aiAgentsData.length} agents AI migrés`);
    } else {
      console.log('⚠️ Aucun agent AI à migrer');
    }

    // 7. Migration des performances publicitaires
    console.log('\n6️⃣ Migration des performances publicitaires...');
    const adPerformanceData = await db.select().from(adPerformance);
    
    if (adPerformanceData.length > 0) {
      // Supprimer les données existantes si nécessaire
      await supabaseAdmin.from('ad_performance').delete().gte('id', 0);
      
      // Insérer les données
      const adPerformanceToInsert = adPerformanceData.map(ad => ({
        ...convertDates(ad),
        // Mapper les noms de champs
        brand_id: ad.brandId,
        ad_set_id: ad.adSetId,
        ad_set_name: ad.adSetName
      }));
      
      const { error: adPerformanceError } = await supabaseAdmin
        .from('ad_performance')
        .insert(adPerformanceToInsert);
      
      if (adPerformanceError) {
        throw new Error(`Erreur lors de la migration des performances publicitaires: ${adPerformanceError.message}`);
      }
      
      console.log(`✅ ${adPerformanceData.length} entrées de performances publicitaires migrées`);
    } else {
      console.log('⚠️ Aucune donnée de performances publicitaires à migrer');
    }

    // 8. Migration des tâches opérationnelles
    console.log('\n7️⃣ Migration des tâches opérationnelles...');
    const opsTasksData = await db.select().from(opsTasks);
    
    if (opsTasksData.length > 0) {
      // Supprimer les données existantes si nécessaire
      await supabaseAdmin.from('ops_tasks').delete().gte('id', 0);
      
      // Insérer les données
      const opsTasksToInsert = opsTasksData.map(task => ({
        ...convertDates(task),
        // Mapper les noms de champs
        brand_id: task.brandId,
        due_date: task.dueDate ? task.dueDate.toISOString() : null,
        created_at: task.createdAt ? task.createdAt.toISOString() : new Date().toISOString(),
        updated_at: task.updatedAt ? task.updatedAt.toISOString() : new Date().toISOString()
      }));
      
      const { error: opsTasksError } = await supabaseAdmin
        .from('ops_tasks')
        .insert(opsTasksToInsert);
      
      if (opsTasksError) {
        throw new Error(`Erreur lors de la migration des tâches opérationnelles: ${opsTasksError.message}`);
      }
      
      console.log(`✅ ${opsTasksData.length} tâches opérationnelles migrées`);
    } else {
      console.log('⚠️ Aucune tâche opérationnelle à migrer');
    }

    console.log('\n🎉 Migration des données vers Supabase terminée avec succès !');
  } catch (error) {
    console.error('\n❌ Erreur lors de la migration des données vers Supabase:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Exécuter la migration
migrateDataToSupabase()
  .catch(error => {
    console.error('Migration terminée avec des erreurs:', error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
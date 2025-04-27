import { supabaseAdmin } from '../server/supabase';
import { db, pool } from '../server/db';
import { 
  users, brands, revenue, adSpend, aiAgents, adPerformance, opsTasks
} from '../shared/schema';

// Fonction pour convertir camelCase en snake_case
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Fonction pour adapter les données au format Supabase
function formatForSupabase(obj: any): any {
  const result: any = {};
  
  // Parcourir toutes les propriétés et les convertir
  for (const [key, value] of Object.entries(obj)) {
    // Ignorer l'id et brandId qui seront traités séparément
    if (key === 'id') {
      result.id = value;
      continue;
    }
    
    // Traiter brandId spécialement
    if (key === 'brandId') {
      result.brand_id = value;
      continue;
    }
    
    // Convertir le nom de la clé en snake_case
    const snakeKey = camelToSnake(key);
    
    // Traiter les valeurs spéciales
    if (value instanceof Date) {
      // Convertir les dates en format ISO string
      result[snakeKey] = value.toISOString();
    } else if (value === undefined) {
      // Convertir undefined en null pour Supabase
      result[snakeKey] = null;
    } else {
      // Copier les autres valeurs telles quelles
      result[snakeKey] = value;
    }
  }
  
  return result;
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
    // 0. Vérifier la connexion de base à Supabase
    console.log('🔍 Test de la connexion Supabase...');
    console.log('🔑 URL Supabase:', process.env.SUPABASE_URL?.substring(0, 20) + '...[masqué]');
    console.log('🔑 Clé de service présente:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    // 1. Vérification que les tables existent
    console.log('🔍 Vérification des tables...');
    
    // Vérifier les tables requises
    const tables = ['users', 'brands', 'revenue', 'ad_spend', 'ai_agents', 'ad_performance', 'ops_tasks'];
    let allTablesOk = true;
    
    for (const table of tables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.error(`❌ Table "${table}" non accessible:`, error.message);
          allTablesOk = false;
        } else {
          console.log(`✅ Table "${table}" accessible`);
        }
      } catch (e) {
        console.error(`❌ Exception lors de la vérification de "${table}":`, e.message);
        allTablesOk = false;
      }
    }
    
    if (!allTablesOk) {
      throw new Error('Une ou plusieurs tables ne sont pas accessibles dans Supabase');
    }
    
    console.log('✅ Connexion aux tables Supabase OK');

    // 2. Migration des utilisateurs
    console.log('\n1️⃣ Migration des utilisateurs...');
    const usersData = await db.select().from(users);
    
    if (usersData.length > 0) {
      // Supprimer les utilisateurs existants si nécessaire
      await supabaseAdmin.from('users').delete().gte('id', 0);
      
      // Insérer les nouveaux utilisateurs (en adaptant le format pour Supabase)
      const usersToInsert = usersData.map(user => formatForSupabase(user));
      
      console.log('Exemple utilisateur à insérer:', usersToInsert[0]);
      
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
      
      // Insérer les nouvelles marques en adaptant au format Supabase
      const brandsToInsert = brandsData.map(brand => formatForSupabase(brand));
      
      console.log('Exemple marque à insérer:', brandsToInsert[0]);
      
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
      const revenueToInsert = revenueData.map(rev => formatForSupabase(rev));
      
      console.log('Exemple de données de revenus à insérer:', revenueToInsert[0]);
      
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
      const adSpendToInsert = adSpendData.map(ad => formatForSupabase(ad));
      
      console.log('Exemple de dépense publicitaire à insérer:', adSpendToInsert[0]);
      
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
      const aiAgentsToInsert = aiAgentsData.map(agent => formatForSupabase(agent));
      
      console.log('Exemple d\'agent AI à insérer:', aiAgentsToInsert[0]);
      
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
      const adPerformanceToInsert = adPerformanceData.map(ad => formatForSupabase(ad));
      
      console.log('Exemple de performance publicitaire à insérer:', adPerformanceToInsert[0]);
      
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
      const opsTasksToInsert = opsTasksData.map(task => formatForSupabase(task));
      
      console.log('Exemple de tâche opérationnelle à insérer:', opsTasksToInsert[0]);
      
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
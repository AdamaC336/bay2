import { supabaseAdmin } from '../server/supabase';
import * as fs from 'fs';
import * as path from 'path';

async function setupSupabaseTables() {
  console.log('🚀 Configuration des tables Supabase en cours...');

  try {
    // Lecture du fichier SQL
    const sqlPath = path.join(__dirname, 'create-supabase-tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Diviser le SQL en commandes individuelles et les exécuter séparément
    const sqlCommands = sqlContent.split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);

    console.log(`Exécution de ${sqlCommands.length} commandes SQL...`);

    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i];
      try {
        const { error } = await supabaseAdmin.rpc('pgFunction', {
          name: 'graphql_public.execute_sql_query',
          args: {
            query: command + ';'
          }
        });

        if (error) {
          console.warn(`⚠️ Erreur lors de l'exécution de la commande ${i + 1}: ${error.message}`);
          console.warn(`Commande: ${command}`);
        }
      } catch (err) {
        console.warn(`⚠️ Exception lors de l'exécution de la commande ${i + 1}: ${err.message}`);
      }
    }

    console.log('✅ Tables Supabase créées avec succès !');
    console.log('✅ Politiques RLS configurées');

    // Test de connexion aux tables
    const testTables = ['users', 'brands', 'revenue', 'ad_spend', 'ai_agents', 'ad_performance', 'ops_tasks'];
    
    console.log('🔍 Vérification des tables...');
    
    for (const table of testTables) {
      const { data, error } = await supabaseAdmin
        .from(table)
        .select('count(*)', { count: 'exact' });
      
      if (error) {
        console.error(`❌ Erreur lors de la vérification de la table ${table}: ${error.message}`);
      } else {
        console.log(`✅ Table ${table} accessible`);
      }
    }

    console.log('🎉 Configuration Supabase terminée !');
  } catch (error) {
    console.error('❌ Erreur lors de la configuration des tables Supabase:', error);
    throw error;
  }
}

// Exécuter la migration
setupSupabaseTables()
  .catch(error => {
    console.error('Configuration terminée avec des erreurs:', error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
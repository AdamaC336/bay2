import { supabaseAdmin } from '../server/supabase';

async function checkSupabaseTables() {
  console.log('🔍 Vérification des tables Supabase...');
  console.log('🔑 URL Supabase:', process.env.SUPABASE_URL?.substring(0, 15) + '...[masqué]');
  console.log('🔑 Clé de service présente:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

  const tables = ['users', 'brands', 'revenue', 'ad_spend', 'ai_agents', 'ad_performance', 'ops_tasks'];

  try {
    // Test simple avec une requête raw pour éviter les problèmes de typesafe
    const { data: tableInfo, error: tableInfoError } = await supabaseAdmin.rpc('get_schema_version');
    
    if (tableInfoError) {
      console.log('⚠️ Erreur lors de la vérification de la version du schéma:', tableInfoError.message);
    } else {
      console.log('✅ Version du schéma:', tableInfo);
    }

    // Vérifier chaque table individuellement
    for (const table of tables) {
      console.log(`\n🔍 Vérification de la table "${table}"...`);
      
      try {
        // Tentative 1: Query builder avec select
        const { data: queryData, error: queryError } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1);
        
        if (queryError) {
          console.log(`❌ Erreur lors de la requête select sur "${table}":`, queryError.message);
          console.log(`   Code:`, queryError.code);
          console.log(`   Détails:`, queryError.details);
        } else {
          console.log(`✅ Table "${table}" accessible via select`);
          console.log(`📊 Exemple de données:`, JSON.stringify(queryData).substring(0, 100) + '...');
        }
      } catch (selectError) {
        console.log(`❌ Exception lors de la requête select sur "${table}":`, selectError.message);
      }
    }

    console.log('\n✅ Vérification terminée !');
  } catch (error) {
    console.error('❌ Erreur générale lors de la vérification:', error);
  }
}

// Exécuter la vérification
checkSupabaseTables()
  .catch(error => {
    console.error('Vérification terminée avec des erreurs:', error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
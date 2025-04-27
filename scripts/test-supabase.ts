import { supabaseAdmin } from '../server/supabase';

async function testSupabaseConnection() {
  console.log('🔍 Test de connexion à Supabase en cours...');

  try {
    // Test simple pour vérifier si la connexion fonctionne
    const { data, error } = await supabaseAdmin.from('_prisma_migrations').select('*').limit(1);
    
    if (error) {
      console.log('⚠️ Erreur API attendue sur une table qui n\'existe probablement pas:', error.message);
    } else {
      console.log('✅ Requête exécutée avec succès');
      console.log('📋 Données:', data);
    }

    // Afficher les tables existantes
    const { data: tableList, error: tableError } = await supabaseAdmin.rpc('get_tables');
    
    if (tableError) {
      console.error('❌ Erreur lors de la récupération des tables:', tableError.message);
    } else {
      console.log('📊 Tables existantes:', tableList);
    }

    // Tester l'insertion d'une donnée simple
    try {
      const tableName = 'test_connection';
      
      // Créer une table de test si elle n'existe pas
      const { error: createError } = await supabaseAdmin
        .from(tableName)
        .insert({ test_value: 'Connection test at ' + new Date().toISOString() });
      
      if (createError) {
        console.log(`⚠️ Erreur lors de l'insertion (peut-être la table n'existe pas): ${createError.message}`);
      } else {
        console.log('✅ Insertion réussie dans la table de test');
      }
    } catch (e) {
      console.log('⚠️ Exception lors du test d\'insertion:', e.message);
    }

    console.log('🎉 Test de connexion terminé !');
    
    // Afficher les environnements variables de connexion (masqués pour la sécurité)
    console.log('🔑 URL Supabase:', process.env.SUPABASE_URL?.substring(0, 15) + '...[masqué]');
    console.log('🔑 Clé anonyme présente:', !!process.env.SUPABASE_ANON_KEY);
    console.log('🔑 Clé de service présente:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  } catch (error) {
    console.error('❌ Erreur lors du test de connexion:', error);
    throw error;
  }
}

// Exécuter le test
testSupabaseConnection()
  .catch(error => {
    console.error('Test terminé avec des erreurs:', error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
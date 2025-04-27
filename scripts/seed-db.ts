import { db } from '../server/db';
import { 
  users, brands, revenue, adSpend, aiAgents, adPerformance, opsTasks
} from '@shared/schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Création d'utilisateurs test
  const [user] = await db.insert(users).values({
    username: 'admin',
    name: 'Admin User',
    role: 'admin'
  }).returning();

  console.log('✅ Created user:', user);

  // Création d'une marque
  const [hydraBark] = await db.insert(brands).values({
    name: 'HydraBark',
    code: 'HB',
    createdAt: new Date()
  }).returning();

  console.log('✅ Created brand:', hydraBark);

  // Ajout d'une seconde marque pour test
  const [pawsomeTreats] = await db.insert(brands).values({
    name: 'PawsomeTreats',
    code: 'PT',
    createdAt: new Date()
  }).returning();

  console.log('✅ Created brand:', pawsomeTreats);

  // Génération de données de revenus sur 30 jours
  const today = new Date();
  const revenueData = [];
  const adSpendData = [];

  const sources = ['direct', 'organic', 'referral', 'social', 'email'];
  const platforms = ['facebook', 'instagram', 'tiktok', 'google'];

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Revenue data for HydraBark
    const baseRevenueHB = 2000 + Math.random() * 1000;
    for (const source of sources) {
      const sourceAmount = (baseRevenueHB / sources.length) * (0.8 + Math.random() * 0.4);
      revenueData.push({
        brandId: hydraBark.id,
        date,
        amount: parseFloat(sourceAmount.toFixed(2)),
        source,
        createdAt: new Date()
      });
    }

    // Revenue data for PawsomeTreats
    const baseRevenuePT = 1500 + Math.random() * 800;
    for (const source of sources) {
      const sourceAmount = (baseRevenuePT / sources.length) * (0.8 + Math.random() * 0.4);
      revenueData.push({
        brandId: pawsomeTreats.id,
        date,
        amount: parseFloat(sourceAmount.toFixed(2)),
        source,
        createdAt: new Date()
      });
    }

    // Ad spend data for HydraBark
    const baseAdSpendHB = 800 + Math.random() * 400;
    for (const platform of platforms) {
      const platformAmount = (baseAdSpendHB / platforms.length) * (0.8 + Math.random() * 0.4);
      adSpendData.push({
        brandId: hydraBark.id,
        date,
        amount: parseFloat(platformAmount.toFixed(2)),
        platform,
        createdAt: new Date()
      });
    }

    // Ad spend data for PawsomeTreats
    const baseAdSpendPT = 600 + Math.random() * 300;
    for (const platform of platforms) {
      const platformAmount = (baseAdSpendPT / platforms.length) * (0.8 + Math.random() * 0.4);
      adSpendData.push({
        brandId: pawsomeTreats.id,
        date,
        amount: parseFloat(platformAmount.toFixed(2)),
        platform,
        createdAt: new Date()
      });
    }
  }

  await db.insert(revenue).values(revenueData);
  console.log(`✅ Created ${revenueData.length} revenue entries`);

  await db.insert(adSpend).values(adSpendData);
  console.log(`✅ Created ${adSpendData.length} ad spend entries`);

  // AI Agents pour HydraBark
  const aiAgentsDataHB = [
    {
      brandId: hydraBark.id,
      name: 'Customer Support Assistant',
      type: 'support',
      status: 'active',
      cost: 19.99,
      metrics: { 
        messagesHandled: 243, 
        satisfactionRate: 92,
        avgResponseTime: "1m 42s"
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brandId: hydraBark.id,
      name: 'Inventory Optimization',
      type: 'operations',
      status: 'active',
      cost: 49.99,
      metrics: { 
        stockoutsPrevented: 12, 
        savingsGenerated: "$3,420", 
        accuracyRate: 94
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brandId: hydraBark.id,
      name: 'Ad Copy Generator',
      type: 'marketing',
      status: 'paused',
      cost: 29.99,
      metrics: { 
        adsGenerated: 48, 
        clickRateImprovement: 18, 
        conversionLift: 22 
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // AI Agents pour PawsomeTreats
  const aiAgentsDataPT = [
    {
      brandId: pawsomeTreats.id,
      name: 'Customer Feedback Analyzer',
      type: 'analytics',
      status: 'active',
      cost: 39.99,
      metrics: { 
        reviewsAnalyzed: 532, 
        insightsGenerated: 48,
        actionItems: 16
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brandId: pawsomeTreats.id,
      name: 'Product Recommendation Engine',
      type: 'sales',
      status: 'active',
      cost: 59.99,
      metrics: { 
        recommendationAccuracy: 89, 
        upsellRate: 24, 
        avgOrderValueIncrease: "$7.42"
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.insert(aiAgents).values([...aiAgentsDataHB, ...aiAgentsDataPT]);
  console.log(`✅ Created ${aiAgentsDataHB.length + aiAgentsDataPT.length} AI agents`);

  // Données de performances publicitaires pour HydraBark
  const adPerformanceDataHB = [
    {
      brandId: hydraBark.id,
      adSetId: 'fb_ad_123',
      adSetName: 'Summer Hydration Collection',
      platform: 'facebook',
      spend: 1200.50,
      roas: 4.2,
      ctr: 2.8,
      status: 'active',
      thumbnail: 'https://picsum.photos/100?random=1',
      date: new Date(),
      createdAt: new Date()
    },
    {
      brandId: hydraBark.id,
      adSetId: 'fb_ad_124',
      adSetName: 'Anti-Spill Technology',
      platform: 'facebook',
      spend: 850.75,
      roas: 3.7,
      ctr: 2.4,
      status: 'active',
      thumbnail: 'https://picsum.photos/100?random=2',
      date: new Date(),
      createdAt: new Date()
    },
    {
      brandId: hydraBark.id,
      adSetId: 'ig_ad_125',
      adSetName: 'Eco-Friendly Materials',
      platform: 'instagram',
      spend: 923.40,
      roas: 2.1,
      ctr: 1.9,
      status: 'paused',
      thumbnail: 'https://picsum.photos/100?random=3',
      date: new Date(),
      createdAt: new Date()
    },
    {
      brandId: hydraBark.id,
      adSetId: 'tt_ad_126',
      adSetName: 'Dog Park Essentials',
      platform: 'tiktok',
      spend: 1450.20,
      roas: 4.8,
      ctr: 3.5,
      status: 'active',
      thumbnail: 'https://picsum.photos/100?random=4',
      date: new Date(),
      createdAt: new Date()
    }
  ];

  // Données de performances publicitaires pour PawsomeTreats
  const adPerformanceDataPT = [
    {
      brandId: pawsomeTreats.id,
      adSetId: 'fb_ad_223',
      adSetName: 'Organic Treat Collection',
      platform: 'facebook',
      spend: 980.50,
      roas: 3.8,
      ctr: 2.5,
      status: 'active',
      thumbnail: 'https://picsum.photos/100?random=5',
      date: new Date(),
      createdAt: new Date()
    },
    {
      brandId: pawsomeTreats.id,
      adSetId: 'ig_ad_224',
      adSetName: 'Training Treats Special',
      platform: 'instagram',
      spend: 750.25,
      roas: 4.1,
      ctr: 2.9,
      status: 'active',
      thumbnail: 'https://picsum.photos/100?random=6',
      date: new Date(),
      createdAt: new Date()
    },
    {
      brandId: pawsomeTreats.id,
      adSetId: 'tt_ad_225',
      adSetName: 'Dental Health Chews',
      platform: 'tiktok',
      spend: 620.40,
      roas: 2.3,
      ctr: 1.8,
      status: 'paused',
      thumbnail: 'https://picsum.photos/100?random=7',
      date: new Date(),
      createdAt: new Date()
    }
  ];

  await db.insert(adPerformance).values([...adPerformanceDataHB, ...adPerformanceDataPT]);
  console.log(`✅ Created ${adPerformanceDataHB.length + adPerformanceDataPT.length} ad performance entries`);

  // Tâches opérationnelles pour HydraBark
  const opsTasksDataHB = [
    {
      brandId: hydraBark.id,
      title: 'Renouveler le stock de bouteilles bleues',
      description: 'Commander 500 unités de bouteilles bleues pour répondre à la demande estivale',
      status: 'todo',
      category: 'inventory',
      dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // Dans 7 jours
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brandId: hydraBark.id,
      title: 'Préparer la campagne publicitaire automne',
      description: 'Définir les visuels et le budget pour la campagne publicitaire d\'automne',
      status: 'in_progress',
      category: 'marketing',
      dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // Dans 14 jours
      progress: 30,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brandId: hydraBark.id,
      title: 'Résoudre les retards de livraison',
      description: 'Contacter le transporteur pour résoudre les problèmes de retard de livraison',
      status: 'in_progress',
      category: 'logistics',
      dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // Dans 2 jours
      progress: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brandId: hydraBark.id,
      title: 'Analyser les retours clients du mois de juin',
      description: 'Compiler et analyser les retours clients pour identifier les problèmes récurrents',
      status: 'done',
      category: 'customer_service',
      dueDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours
      progress: 100,
      createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), // Créé il y a 10 jours
      updatedAt: new Date()
    }
  ];

  // Tâches opérationnelles pour PawsomeTreats
  const opsTasksDataPT = [
    {
      brandId: pawsomeTreats.id,
      title: 'Mise à jour des ingrédients sur le site',
      description: 'Mettre à jour la liste des ingrédients sur le site web pour respecter les nouvelles réglementations',
      status: 'todo',
      category: 'website',
      dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // Dans 5 jours
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brandId: pawsomeTreats.id,
      title: 'Négociations avec les fournisseurs',
      description: 'Renégocier les contrats avec les fournisseurs principaux pour obtenir de meilleurs tarifs',
      status: 'in_progress',
      category: 'procurement',
      dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), // Dans 10 jours
      progress: 60,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      brandId: pawsomeTreats.id,
      title: 'Formation du personnel de production',
      description: 'Organiser une formation sur les nouvelles procédures de qualité pour l\'équipe de production',
      status: 'done',
      category: 'hr',
      dueDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // Il y a 3 jours
      progress: 100,
      createdAt: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000), // Créé il y a 8 jours
      updatedAt: new Date()
    }
  ];

  await db.insert(opsTasks).values([...opsTasksDataHB, ...opsTasksDataPT]);
  console.log(`✅ Created ${opsTasksDataHB.length + opsTasksDataPT.length} operations tasks`);

  console.log('🎉 Database seeding complete!');
}

// Execute the seed function
seed()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Closing database connection...');
    await db.end();
    process.exit(0);
  });
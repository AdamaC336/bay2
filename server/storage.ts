import {
  users,
  brands,
  revenue,
  adSpend,
  aiAgents,
  adPerformance,
  opsTasks,
  type User,
  type InsertUser,
  type Brand,
  type InsertBrand,
  type Revenue,
  type InsertRevenue,
  type AdSpend,
  type InsertAdSpend,
  type AIAgent,
  type InsertAIAgent,
  type AdPerformance,
  type InsertAdPerformance,
  type OpsTask,
  type InsertOpsTask
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Brand operations
  getBrands(): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  getBrandByCode(code: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;

  // Revenue operations
  getRevenue(brandId: number, fromDate: Date, toDate: Date): Promise<Revenue[]>;
  getTodayRevenue(brandId: number): Promise<number>;
  createRevenue(revenue: InsertRevenue): Promise<Revenue>;

  // Ad Spend operations
  getAdSpend(brandId: number, fromDate: Date, toDate: Date): Promise<AdSpend[]>;
  getTodayAdSpend(brandId: number): Promise<number>;
  createAdSpend(adSpend: InsertAdSpend): Promise<AdSpend>;

  // AI Agent operations
  getAIAgents(brandId: number): Promise<AIAgent[]>;
  getAIAgent(id: number): Promise<AIAgent | undefined>;
  createAIAgent(agent: InsertAIAgent): Promise<AIAgent>;
  updateAIAgentStatus(id: number, status: string): Promise<AIAgent | undefined>;
  updateAIAgentCost(id: number, cost: number): Promise<AIAgent | undefined>;

  // Ad Performance operations
  getAdPerformance(brandId: number, platform?: string): Promise<AdPerformance[]>;
  getAdPerformanceById(id: number): Promise<AdPerformance | undefined>;
  createAdPerformance(adPerformance: InsertAdPerformance): Promise<AdPerformance>;
  updateAdStatus(id: number, status: string): Promise<AdPerformance | undefined>;

  // Operations Tasks operations
  getOpsTasks(brandId: number, status?: string): Promise<OpsTask[]>;
  getOpsTask(id: number): Promise<OpsTask | undefined>;
  createOpsTask(task: InsertOpsTask): Promise<OpsTask>;
  updateOpsTaskStatus(id: number, status: string): Promise<OpsTask | undefined>;
  updateOpsTaskProgress(id: number, progress: number): Promise<OpsTask | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private brands: Map<number, Brand>;
  private revenueData: Map<number, Revenue>;
  private adSpendData: Map<number, AdSpend>;
  private aiAgentsData: Map<number, AIAgent>;
  private adPerformanceData: Map<number, AdPerformance>;
  private opsTasksData: Map<number, OpsTask>;
  
  private userId: number;
  private brandId: number;
  private revenueId: number;
  private adSpendId: number;
  private aiAgentId: number;
  private adPerformanceId: number;
  private opsTaskId: number;

  constructor() {
    this.users = new Map();
    this.brands = new Map();
    this.revenueData = new Map();
    this.adSpendData = new Map();
    this.aiAgentsData = new Map();
    this.adPerformanceData = new Map();
    this.opsTasksData = new Map();
    
    this.userId = 1;
    this.brandId = 1;
    this.revenueId = 1;
    this.adSpendId = 1;
    this.aiAgentId = 1;
    this.adPerformanceId = 1;
    this.opsTaskId = 1;

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create a default brand
    const brand: Brand = {
      id: this.brandId++,
      name: "HydraBark",
      code: "HB",
      createdAt: new Date()
    };
    this.brands.set(brand.id, brand);

    // Create admin user
    const user: User = {
      id: this.userId++,
      username: "admin",
      password: "admin",
      name: "John Doe",
      role: "admin"
    };
    this.users.set(user.id, user);

    // Create sample revenue data for the last 7 days
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const rev: Revenue = {
        id: this.revenueId++,
        brandId: brand.id,
        date: date,
        amount: 10000 + Math.random() * 5000,
        source: "shopify",
        createdAt: new Date()
      };
      this.revenueData.set(rev.id, rev);
      
      const ads: AdSpend = {
        id: this.adSpendId++,
        brandId: brand.id,
        date: date,
        amount: 3000 + Math.random() * 1500,
        platform: i % 2 === 0 ? "meta" : "tiktok",
        campaign: `Campaign ${i}`,
        adSet: `Ad Set ${i}`,
        createdAt: new Date()
      };
      this.adSpendData.set(ads.id, ads);
    }

    // Create AI agents
    const agent1: AIAgent = {
      id: this.aiAgentId++,
      brandId: brand.id,
      name: "Customer Support Assistant",
      type: "support",
      status: "active",
      cost: 0.84,
      metrics: { conversations: 24, avgResponse: "3.2s", satisfaction: "92%" },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.aiAgentsData.set(agent1.id, agent1);

    const agent2: AIAgent = {
      id: this.aiAgentId++,
      brandId: brand.id,
      name: "Content Creator",
      type: "content",
      status: "active",
      cost: 2.36,
      metrics: { articles: 3, tokens: "14.2k", quality: "8.7/10" },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.aiAgentsData.set(agent2.id, agent2);

    const agent3: AIAgent = {
      id: this.aiAgentId++,
      brandId: brand.id,
      name: "Ad Optimizer",
      type: "ads",
      status: "paused",
      cost: 0,
      metrics: { optimizations: 0, adSets: 12, roasImpact: "--" },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.aiAgentsData.set(agent3.id, agent3);

    // Create ad performance data
    const ad1: AdPerformance = {
      id: this.adPerformanceId++,
      brandId: brand.id,
      adSetId: "TT_HB_PUPPY_01",
      adSetName: "HydraBark Puppy",
      platform: "tiktok",
      spend: 1245.32,
      roas: 3.8,
      ctr: 2.1,
      status: "active",
      thumbnail: "https://images.unsplash.com/photo-1581888227599-779811939961",
      date: new Date(),
      createdAt: new Date()
    };
    this.adPerformanceData.set(ad1.id, ad1);

    const ad2: AdPerformance = {
      id: this.adPerformanceId++,
      brandId: brand.id,
      adSetId: "TT_HB_SENIOR_02",
      adSetName: "HydraBark Senior",
      platform: "tiktok",
      spend: 864.50,
      roas: 2.4,
      ctr: 1.3,
      status: "warning",
      thumbnail: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01",
      date: new Date(),
      createdAt: new Date()
    };
    this.adPerformanceData.set(ad2.id, ad2);

    const ad3: AdPerformance = {
      id: this.adPerformanceId++,
      brandId: brand.id,
      adSetId: "TT_HB_ADULT_01",
      adSetName: "HydraBark Adult",
      platform: "tiktok",
      spend: 1762.18,
      roas: 4.2,
      ctr: 2.8,
      status: "active",
      thumbnail: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97",
      date: new Date(),
      createdAt: new Date()
    };
    this.adPerformanceData.set(ad3.id, ad3);

    const ad4: AdPerformance = {
      id: this.adPerformanceId++,
      brandId: brand.id,
      adSetId: "TT_HB_BUNDLE_03",
      adSetName: "HydraBark Bundle",
      platform: "tiktok",
      spend: 0,
      roas: 1.2,
      ctr: 0.9,
      status: "paused",
      thumbnail: "https://images.unsplash.com/photo-1567014543648-e4391c989aab",
      date: new Date(),
      createdAt: new Date()
    };
    this.adPerformanceData.set(ad4.id, ad4);

    // Create operations tasks
    const task1: OpsTask = {
      id: this.opsTaskId++,
      brandId: brand.id,
      title: "Review new ad creatives",
      description: "Review 5 new TikTok ad creatives from the design team",
      status: "todo",
      category: "marketing",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.opsTasksData.set(task1.id, task1);

    const task2: OpsTask = {
      id: this.opsTaskId++,
      brandId: brand.id,
      title: "Approve customer refund",
      description: "Process refund for order #4392 due to shipping damage",
      status: "todo",
      category: "support",
      dueDate: new Date(),
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.opsTasksData.set(task2.id, task2);

    const task3: OpsTask = {
      id: this.opsTaskId++,
      brandId: brand.id,
      title: "Set up new product variants",
      description: "Create 3 new size variants for HydraBark Adult formula",
      status: "todo",
      category: "product",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.opsTasksData.set(task3.id, task3);

    const task4: OpsTask = {
      id: this.opsTaskId++,
      brandId: brand.id,
      title: "Optimize ad budget allocation",
      description: "Redistribute budget from underperforming campaigns to high ROAS ads",
      status: "in_progress",
      category: "marketing",
      dueDate: new Date(),
      progress: 75,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.opsTasksData.set(task4.id, task4);

    const task5: OpsTask = {
      id: this.opsTaskId++,
      brandId: brand.id,
      title: "Update inventory forecast",
      description: "Recalculate Q3 inventory needs based on new growth projections",
      status: "in_progress",
      category: "operations",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
      progress: 40,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.opsTasksData.set(task5.id, task5);

    const task6: OpsTask = {
      id: this.opsTaskId++,
      brandId: brand.id,
      title: "Publish weekly blog post",
      description: "Publish \"Top 10 Dog Nutrition Myths\" blog post",
      status: "done",
      category: "marketing",
      dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      progress: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.opsTasksData.set(task6.id, task6);

    const task7: OpsTask = {
      id: this.opsTaskId++,
      brandId: brand.id,
      title: "Update customer email sequence",
      description: "Revise the post-purchase email sequence with new product recommendations",
      status: "done",
      category: "support",
      dueDate: new Date(),
      progress: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.opsTasksData.set(task7.id, task7);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Brand operations
  async getBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async getBrandByCode(code: string): Promise<Brand | undefined> {
    return Array.from(this.brands.values()).find(
      (brand) => brand.code === code,
    );
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = this.brandId++;
    const brand: Brand = { ...insertBrand, id, createdAt: new Date() };
    this.brands.set(id, brand);
    return brand;
  }

  // Revenue operations
  async getRevenue(brandId: number, fromDate: Date, toDate: Date): Promise<Revenue[]> {
    return Array.from(this.revenueData.values()).filter(
      (rev) => 
        rev.brandId === brandId && 
        rev.date >= fromDate && 
        rev.date <= toDate
    );
  }

  async getTodayRevenue(brandId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayRevenue = Array.from(this.revenueData.values()).filter(
      (rev) => 
        rev.brandId === brandId && 
        rev.date >= today && 
        rev.date < tomorrow
    );
    
    return todayRevenue.reduce((sum, rev) => sum + rev.amount, 0);
  }

  async createRevenue(insertRevenue: InsertRevenue): Promise<Revenue> {
    const id = this.revenueId++;
    const revenue: Revenue = { ...insertRevenue, id, createdAt: new Date() };
    this.revenueData.set(id, revenue);
    return revenue;
  }

  // Ad Spend operations
  async getAdSpend(brandId: number, fromDate: Date, toDate: Date): Promise<AdSpend[]> {
    return Array.from(this.adSpendData.values()).filter(
      (spend) => 
        spend.brandId === brandId && 
        spend.date >= fromDate && 
        spend.date <= toDate
    );
  }

  async getTodayAdSpend(brandId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaySpend = Array.from(this.adSpendData.values()).filter(
      (spend) => 
        spend.brandId === brandId && 
        spend.date >= today && 
        spend.date < tomorrow
    );
    
    return todaySpend.reduce((sum, spend) => sum + spend.amount, 0);
  }

  async createAdSpend(insertAdSpend: InsertAdSpend): Promise<AdSpend> {
    const id = this.adSpendId++;
    const adSpend: AdSpend = { ...insertAdSpend, id, createdAt: new Date() };
    this.adSpendData.set(id, adSpend);
    return adSpend;
  }

  // AI Agent operations
  async getAIAgents(brandId: number): Promise<AIAgent[]> {
    return Array.from(this.aiAgentsData.values()).filter(
      (agent) => agent.brandId === brandId
    );
  }

  async getAIAgent(id: number): Promise<AIAgent | undefined> {
    return this.aiAgentsData.get(id);
  }

  async createAIAgent(insertAgent: InsertAIAgent): Promise<AIAgent> {
    const id = this.aiAgentId++;
    const now = new Date();
    const agent: AIAgent = { 
      ...insertAgent, 
      id, 
      cost: 0,
      createdAt: now,
      updatedAt: now
    };
    this.aiAgentsData.set(id, agent);
    return agent;
  }

  async updateAIAgentStatus(id: number, status: string): Promise<AIAgent | undefined> {
    const agent = this.aiAgentsData.get(id);
    if (!agent) return undefined;
    
    const updatedAgent: AIAgent = {
      ...agent,
      status,
      updatedAt: new Date()
    };
    
    this.aiAgentsData.set(id, updatedAgent);
    return updatedAgent;
  }

  async updateAIAgentCost(id: number, cost: number): Promise<AIAgent | undefined> {
    const agent = this.aiAgentsData.get(id);
    if (!agent) return undefined;
    
    const updatedAgent: AIAgent = {
      ...agent,
      cost,
      updatedAt: new Date()
    };
    
    this.aiAgentsData.set(id, updatedAgent);
    return updatedAgent;
  }

  // Ad Performance operations
  async getAdPerformance(brandId: number, platform?: string): Promise<AdPerformance[]> {
    return Array.from(this.adPerformanceData.values()).filter(
      (ad) => {
        if (platform) {
          return ad.brandId === brandId && ad.platform === platform;
        }
        return ad.brandId === brandId;
      }
    );
  }

  async getAdPerformanceById(id: number): Promise<AdPerformance | undefined> {
    return this.adPerformanceData.get(id);
  }

  async createAdPerformance(insertAdPerformance: InsertAdPerformance): Promise<AdPerformance> {
    const id = this.adPerformanceId++;
    const adPerformance: AdPerformance = { 
      ...insertAdPerformance, 
      id, 
      createdAt: new Date() 
    };
    this.adPerformanceData.set(id, adPerformance);
    return adPerformance;
  }

  async updateAdStatus(id: number, status: string): Promise<AdPerformance | undefined> {
    const ad = this.adPerformanceData.get(id);
    if (!ad) return undefined;
    
    const updatedAd: AdPerformance = {
      ...ad,
      status
    };
    
    this.adPerformanceData.set(id, updatedAd);
    return updatedAd;
  }

  // Operations Tasks operations
  async getOpsTasks(brandId: number, status?: string): Promise<OpsTask[]> {
    return Array.from(this.opsTasksData.values()).filter(
      (task) => {
        if (status) {
          return task.brandId === brandId && task.status === status;
        }
        return task.brandId === brandId;
      }
    );
  }

  async getOpsTask(id: number): Promise<OpsTask | undefined> {
    return this.opsTasksData.get(id);
  }

  async createOpsTask(insertTask: InsertOpsTask): Promise<OpsTask> {
    const id = this.opsTaskId++;
    const now = new Date();
    const task: OpsTask = { 
      ...insertTask, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.opsTasksData.set(id, task);
    return task;
  }

  async updateOpsTaskStatus(id: number, status: string): Promise<OpsTask | undefined> {
    const task = this.opsTasksData.get(id);
    if (!task) return undefined;
    
    const updatedTask: OpsTask = {
      ...task,
      status,
      updatedAt: new Date()
    };
    
    if (status === "done") {
      updatedTask.progress = 100;
    }
    
    this.opsTasksData.set(id, updatedTask);
    return updatedTask;
  }

  async updateOpsTaskProgress(id: number, progress: number): Promise<OpsTask | undefined> {
    const task = this.opsTasksData.get(id);
    if (!task) return undefined;
    
    const updatedTask: OpsTask = {
      ...task,
      progress,
      updatedAt: new Date()
    };
    
    if (progress === 100) {
      updatedTask.status = "done";
    } else if (progress > 0) {
      updatedTask.status = "in_progress";
    }
    
    this.opsTasksData.set(id, updatedTask);
    return updatedTask;
  }
}

import { DatabaseStorage } from './database-storage';

// Uncomment the line below and comment out the MemStorage line to use database storage
export const storage = new DatabaseStorage();
// export const storage = new MemStorage();

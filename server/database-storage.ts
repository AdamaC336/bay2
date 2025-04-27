import { db } from "./db";
import { 
  users, brands, revenue, adSpend, aiAgents, adPerformance, opsTasks,
  type User, type InsertUser, 
  type Brand, type InsertBrand,
  type Revenue, type InsertRevenue,
  type AdSpend, type InsertAdSpend,
  type AIAgent, type InsertAIAgent,
  type AdPerformance, type InsertAdPerformance,
  type OpsTask, type InsertOpsTask
} from "@shared/schema";
import { IStorage } from "./storage";
import { and, eq, gte, lte } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Brand operations
  async getBrands(): Promise<Brand[]> {
    return await db.select().from(brands);
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.id, id));
    return brand;
  }

  async getBrandByCode(code: string): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.code, code));
    return brand;
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const [brand] = await db.insert(brands).values(insertBrand).returning();
    return brand;
  }

  // Revenue operations
  async getRevenue(brandId: number, fromDate: Date, toDate: Date): Promise<Revenue[]> {
    return await db.select().from(revenue).where(
      and(
        eq(revenue.brandId, brandId),
        gte(revenue.date, fromDate),
        lte(revenue.date, toDate)
      )
    );
  }

  async getTodayRevenue(brandId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayRevenue = await db.select().from(revenue).where(
      and(
        eq(revenue.brandId, brandId),
        gte(revenue.date, today),
        lte(revenue.date, tomorrow)
      )
    );

    return todayRevenue.reduce((sum, rev) => sum + rev.amount, 0);
  }

  async createRevenue(insertRevenue: InsertRevenue): Promise<Revenue> {
    const [rev] = await db.insert(revenue).values(insertRevenue).returning();
    return rev;
  }

  // Ad Spend operations
  async getAdSpend(brandId: number, fromDate: Date, toDate: Date): Promise<AdSpend[]> {
    return await db.select().from(adSpend).where(
      and(
        eq(adSpend.brandId, brandId),
        gte(adSpend.date, fromDate),
        lte(adSpend.date, toDate)
      )
    );
  }

  async getTodayAdSpend(brandId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySpend = await db.select().from(adSpend).where(
      and(
        eq(adSpend.brandId, brandId),
        gte(adSpend.date, today),
        lte(adSpend.date, tomorrow)
      )
    );

    return todaySpend.reduce((sum, spend) => sum + spend.amount, 0);
  }

  async createAdSpend(insertAdSpend: InsertAdSpend): Promise<AdSpend> {
    const [spend] = await db.insert(adSpend).values(insertAdSpend).returning();
    return spend;
  }

  // AI Agent operations
  async getAIAgents(brandId: number): Promise<AIAgent[]> {
    return await db.select().from(aiAgents).where(eq(aiAgents.brandId, brandId));
  }

  async getAIAgent(id: number): Promise<AIAgent | undefined> {
    const [agent] = await db.select().from(aiAgents).where(eq(aiAgents.id, id));
    return agent;
  }

  async createAIAgent(insertAgent: InsertAIAgent): Promise<AIAgent> {
    const [agent] = await db.insert(aiAgents).values(insertAgent).returning();
    return agent;
  }

  async updateAIAgentStatus(id: number, status: string): Promise<AIAgent | undefined> {
    const [agent] = await db
      .update(aiAgents)
      .set({ status, updatedAt: new Date() })
      .where(eq(aiAgents.id, id))
      .returning();
    return agent;
  }

  async updateAIAgentCost(id: number, cost: number): Promise<AIAgent | undefined> {
    const [agent] = await db
      .update(aiAgents)
      .set({ cost, updatedAt: new Date() })
      .where(eq(aiAgents.id, id))
      .returning();
    return agent;
  }

  // Ad Performance operations
  async getAdPerformance(brandId: number, platform?: string): Promise<AdPerformance[]> {
    if (platform) {
      return await db
        .select()
        .from(adPerformance)
        .where(and(eq(adPerformance.brandId, brandId), eq(adPerformance.platform, platform)));
    }
    return await db.select().from(adPerformance).where(eq(adPerformance.brandId, brandId));
  }

  async getAdPerformanceById(id: number): Promise<AdPerformance | undefined> {
    const [ad] = await db.select().from(adPerformance).where(eq(adPerformance.id, id));
    return ad;
  }

  async createAdPerformance(insertAdPerformance: InsertAdPerformance): Promise<AdPerformance> {
    const [ad] = await db.insert(adPerformance).values(insertAdPerformance).returning();
    return ad;
  }

  async updateAdStatus(id: number, status: string): Promise<AdPerformance | undefined> {
    const [ad] = await db
      .update(adPerformance)
      .set({ status })
      .where(eq(adPerformance.id, id))
      .returning();
    return ad;
  }

  // Operations Tasks operations
  async getOpsTasks(brandId: number, status?: string): Promise<OpsTask[]> {
    if (status) {
      return await db
        .select()
        .from(opsTasks)
        .where(and(eq(opsTasks.brandId, brandId), eq(opsTasks.status, status)));
    }
    return await db.select().from(opsTasks).where(eq(opsTasks.brandId, brandId));
  }

  async getOpsTask(id: number): Promise<OpsTask | undefined> {
    const [task] = await db.select().from(opsTasks).where(eq(opsTasks.id, id));
    return task;
  }

  async createOpsTask(insertTask: InsertOpsTask): Promise<OpsTask> {
    const [task] = await db.insert(opsTasks).values(insertTask).returning();
    return task;
  }

  async updateOpsTaskStatus(id: number, status: string): Promise<OpsTask | undefined> {
    const [task] = await db
      .update(opsTasks)
      .set({ status, updatedAt: new Date() })
      .where(eq(opsTasks.id, id))
      .returning();
    return task;
  }

  async updateOpsTaskProgress(id: number, progress: number): Promise<OpsTask | undefined> {
    const [task] = await db
      .update(opsTasks)
      .set({ progress, updatedAt: new Date() })
      .where(eq(opsTasks.id, id))
      .returning();
    return task;
  }
}
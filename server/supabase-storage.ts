import { supabaseAdmin } from './supabase';
import { IStorage } from './storage';
import {
  User, InsertUser,
  Brand, InsertBrand,
  Revenue, InsertRevenue,
  AdSpend, InsertAdSpend,
  AIAgent, InsertAIAgent,
  AdPerformance, InsertAdPerformance,
  OpsTask, InsertOpsTask
} from '../shared/schema';

export class SupabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return this.mapUser(data);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return undefined;
    return this.mapUser(data);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(insertUser)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return this.mapUser(data);
  }

  // Brand operations
  async getBrands(): Promise<Brand[]> {
    const { data, error } = await supabaseAdmin
      .from('brands')
      .select('*');
    
    if (error) throw new Error(`Failed to get brands: ${error.message}`);
    return data.map(this.mapBrand);
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    const { data, error } = await supabaseAdmin
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return this.mapBrand(data);
  }

  async getBrandByCode(code: string): Promise<Brand | undefined> {
    const { data, error } = await supabaseAdmin
      .from('brands')
      .select('*')
      .eq('code', code)
      .single();
    
    if (error || !data) return undefined;
    return this.mapBrand(data);
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const { data, error } = await supabaseAdmin
      .from('brands')
      .insert(insertBrand)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create brand: ${error.message}`);
    return this.mapBrand(data);
  }

  // Revenue operations
  async getRevenue(brandId: number, fromDate: Date, toDate: Date): Promise<Revenue[]> {
    const { data, error } = await supabaseAdmin
      .from('revenue')
      .select('*')
      .eq('brand_id', brandId)
      .gte('date', fromDate.toISOString())
      .lte('date', toDate.toISOString());
    
    if (error) throw new Error(`Failed to get revenue: ${error.message}`);
    return data.map(this.mapRevenue);
  }

  async getTodayRevenue(brandId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabaseAdmin
      .from('revenue')
      .select('amount')
      .eq('brandId', brandId)
      .gte('date', today.toISOString());
    
    if (error) throw new Error(`Failed to get today's revenue: ${error.message}`);
    
    return data.reduce((sum, item) => sum + (item.amount || 0), 0);
  }

  async createRevenue(insertRevenue: InsertRevenue): Promise<Revenue> {
    const { data, error } = await supabaseAdmin
      .from('revenue')
      .insert(insertRevenue)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create revenue: ${error.message}`);
    return this.mapRevenue(data);
  }

  // Ad Spend operations
  async getAdSpend(brandId: number, fromDate: Date, toDate: Date): Promise<AdSpend[]> {
    const { data, error } = await supabaseAdmin
      .from('ad_spend')
      .select('*')
      .eq('brandId', brandId)
      .gte('date', fromDate.toISOString())
      .lte('date', toDate.toISOString());
    
    if (error) throw new Error(`Failed to get ad spend: ${error.message}`);
    return data.map(this.mapAdSpend);
  }

  async getTodayAdSpend(brandId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabaseAdmin
      .from('ad_spend')
      .select('amount')
      .eq('brandId', brandId)
      .gte('date', today.toISOString());
    
    if (error) throw new Error(`Failed to get today's ad spend: ${error.message}`);
    
    return data.reduce((sum, item) => sum + (item.amount || 0), 0);
  }

  async createAdSpend(insertAdSpend: InsertAdSpend): Promise<AdSpend> {
    const { data, error } = await supabaseAdmin
      .from('ad_spend')
      .insert(insertAdSpend)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create ad spend: ${error.message}`);
    return this.mapAdSpend(data);
  }

  // AI Agent operations
  async getAIAgents(brandId: number): Promise<AIAgent[]> {
    const { data, error } = await supabaseAdmin
      .from('ai_agents')
      .select('*')
      .eq('brandId', brandId);
    
    if (error) throw new Error(`Failed to get AI agents: ${error.message}`);
    return data.map(this.mapAIAgent);
  }

  async getAIAgent(id: number): Promise<AIAgent | undefined> {
    const { data, error } = await supabaseAdmin
      .from('ai_agents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return this.mapAIAgent(data);
  }

  async createAIAgent(insertAgent: InsertAIAgent): Promise<AIAgent> {
    const { data, error } = await supabaseAdmin
      .from('ai_agents')
      .insert(insertAgent)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create AI agent: ${error.message}`);
    return this.mapAIAgent(data);
  }

  async updateAIAgentStatus(id: number, status: string): Promise<AIAgent | undefined> {
    const { data, error } = await supabaseAdmin
      .from('ai_agents')
      .update({ status, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    return this.mapAIAgent(data);
  }

  async updateAIAgentCost(id: number, cost: number): Promise<AIAgent | undefined> {
    const { data, error } = await supabaseAdmin
      .from('ai_agents')
      .update({ cost, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    return this.mapAIAgent(data);
  }

  // Ad Performance operations
  async getAdPerformance(brandId: number, platform?: string): Promise<AdPerformance[]> {
    let query = supabaseAdmin
      .from('ad_performance')
      .select('*')
      .eq('brandId', brandId);
    
    if (platform) {
      query = query.eq('platform', platform);
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(`Failed to get ad performance: ${error.message}`);
    return data.map(this.mapAdPerformance);
  }

  async getAdPerformanceById(id: number): Promise<AdPerformance | undefined> {
    const { data, error } = await supabaseAdmin
      .from('ad_performance')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return this.mapAdPerformance(data);
  }

  async createAdPerformance(insertAdPerformance: InsertAdPerformance): Promise<AdPerformance> {
    const { data, error } = await supabaseAdmin
      .from('ad_performance')
      .insert(insertAdPerformance)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create ad performance: ${error.message}`);
    return this.mapAdPerformance(data);
  }

  async updateAdStatus(id: number, status: string): Promise<AdPerformance | undefined> {
    const { data, error } = await supabaseAdmin
      .from('ad_performance')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    return this.mapAdPerformance(data);
  }

  // Operations Tasks operations
  async getOpsTasks(brandId: number, status?: string): Promise<OpsTask[]> {
    let query = supabaseAdmin
      .from('ops_tasks')
      .select('*')
      .eq('brandId', brandId);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(`Failed to get ops tasks: ${error.message}`);
    return data.map(this.mapOpsTask);
  }

  async getOpsTask(id: number): Promise<OpsTask | undefined> {
    const { data, error } = await supabaseAdmin
      .from('ops_tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return this.mapOpsTask(data);
  }

  async createOpsTask(insertTask: InsertOpsTask): Promise<OpsTask> {
    const { data, error } = await supabaseAdmin
      .from('ops_tasks')
      .insert(insertTask)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create ops task: ${error.message}`);
    return this.mapOpsTask(data);
  }

  async updateOpsTaskStatus(id: number, status: string): Promise<OpsTask | undefined> {
    const { data, error } = await supabaseAdmin
      .from('ops_tasks')
      .update({ status, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    return this.mapOpsTask(data);
  }

  async updateOpsTaskProgress(id: number, progress: number): Promise<OpsTask | undefined> {
    const { data, error } = await supabaseAdmin
      .from('ops_tasks')
      .update({ progress, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    return this.mapOpsTask(data);
  }

  // Mappers pour convertir les données Supabase au format de notre schéma
  private mapUser(data: any): User {
    return {
      id: data.id,
      username: data.username,
      password: data.password,
      name: data.name,
      role: data.role,
    };
  }

  private mapBrand(data: any): Brand {
    return {
      id: data.id,
      name: data.name,
      code: data.code,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    };
  }

  private mapRevenue(data: any): Revenue {
    return {
      id: data.id,
      brandId: data.brandId,
      date: new Date(data.date),
      amount: data.amount,
      source: data.source,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    };
  }

  private mapAdSpend(data: any): AdSpend {
    return {
      id: data.id,
      brandId: data.brandId,
      date: new Date(data.date),
      amount: data.amount,
      platform: data.platform,
      campaign: data.campaign,
      adSet: data.adSet,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    };
  }

  private mapAIAgent(data: any): AIAgent {
    return {
      id: data.id,
      brandId: data.brandId,
      name: data.name,
      type: data.type,
      status: data.status,
      cost: data.cost,
      metrics: data.metrics,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }

  private mapAdPerformance(data: any): AdPerformance {
    return {
      id: data.id,
      brandId: data.brandId,
      adSetId: data.adSetId,
      adSetName: data.adSetName,
      platform: data.platform,
      spend: data.spend,
      roas: data.roas,
      ctr: data.ctr,
      status: data.status,
      thumbnail: data.thumbnail,
      date: new Date(data.date),
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    };
  }

  private mapOpsTask(data: any): OpsTask {
    return {
      id: data.id,
      brandId: data.brandId,
      title: data.title,
      description: data.description,
      status: data.status,
      category: data.category,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      progress: data.progress,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }
}
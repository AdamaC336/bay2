import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertBrandSchema, insertRevenueSchema, insertAdSpendSchema, insertAIAgentSchema, insertAdPerformanceSchema, insertOpsTaskSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiPrefix = "/api";

  // Authentication routes
  app.post(`${apiPrefix}/login`, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user.id;
    return res.status(200).json({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    });
  });

  app.get(`${apiPrefix}/me`, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    });
  });

  app.post(`${apiPrefix}/logout`, (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Brand routes
  app.get(`${apiPrefix}/brands`, async (req, res) => {
    const brands = await storage.getBrands();
    res.json(brands);
  });

  app.get(`${apiPrefix}/brands/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }

    const brand = await storage.getBrand(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.json(brand);
  });

  app.post(`${apiPrefix}/brands`, async (req, res) => {
    try {
      const brandData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(brandData);
      res.status(201).json(brand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brand data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create brand" });
    }
  });

  // Revenue routes
  app.get(`${apiPrefix}/revenue/:brandId`, async (req, res) => {
    const brandId = parseInt(req.params.brandId);
    if (isNaN(brandId)) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }

    const fromDateStr = req.query.fromDate as string;
    const toDateStr = req.query.toDate as string;

    if (!fromDateStr || !toDateStr) {
      return res.status(400).json({ message: "fromDate and toDate are required" });
    }

    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const revenue = await storage.getRevenue(brandId, fromDate, toDate);
    res.json(revenue);
  });

  app.get(`${apiPrefix}/revenue/:brandId/today`, async (req, res) => {
    const brandId = parseInt(req.params.brandId);
    if (isNaN(brandId)) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }

    const todayRevenue = await storage.getTodayRevenue(brandId);
    res.json({ amount: todayRevenue });
  });

  app.post(`${apiPrefix}/revenue`, async (req, res) => {
    try {
      const revenueData = insertRevenueSchema.parse(req.body);
      const revenue = await storage.createRevenue(revenueData);
      res.status(201).json(revenue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid revenue data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create revenue" });
    }
  });

  // Ad Spend routes
  app.get(`${apiPrefix}/ad-spend/:brandId`, async (req, res) => {
    const brandId = parseInt(req.params.brandId);
    if (isNaN(brandId)) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }

    const fromDateStr = req.query.fromDate as string;
    const toDateStr = req.query.toDate as string;

    if (!fromDateStr || !toDateStr) {
      return res.status(400).json({ message: "fromDate and toDate are required" });
    }

    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const adSpend = await storage.getAdSpend(brandId, fromDate, toDate);
    res.json(adSpend);
  });

  app.get(`${apiPrefix}/ad-spend/:brandId/today`, async (req, res) => {
    const brandId = parseInt(req.params.brandId);
    if (isNaN(brandId)) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }

    const todayAdSpend = await storage.getTodayAdSpend(brandId);
    res.json({ amount: todayAdSpend });
  });

  app.post(`${apiPrefix}/ad-spend`, async (req, res) => {
    try {
      const adSpendData = insertAdSpendSchema.parse(req.body);
      const adSpend = await storage.createAdSpend(adSpendData);
      res.status(201).json(adSpend);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ad spend data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ad spend" });
    }
  });

  // AI Agents routes
  app.get(`${apiPrefix}/ai-agents/:brandId`, async (req, res) => {
    const brandId = parseInt(req.params.brandId);
    if (isNaN(brandId)) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }

    const agents = await storage.getAIAgents(brandId);
    res.json(agents);
  });

  app.get(`${apiPrefix}/ai-agents/:brandId/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid agent ID" });
    }

    const agent = await storage.getAIAgent(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(agent);
  });

  app.post(`${apiPrefix}/ai-agents`, async (req, res) => {
    try {
      const agentData = insertAIAgentSchema.parse(req.body);
      const agent = await storage.createAIAgent(agentData);
      res.status(201).json(agent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid agent data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create agent" });
    }
  });

  app.patch(`${apiPrefix}/ai-agents/:id/status`, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid agent ID" });
    }

    const { status } = req.body;
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ message: "Status is required" });
    }

    const agent = await storage.updateAIAgentStatus(id, status);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(agent);
  });

  app.patch(`${apiPrefix}/ai-agents/:id/cost`, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid agent ID" });
    }

    const { cost } = req.body;
    if (typeof cost !== 'number') {
      return res.status(400).json({ message: "Cost must be a number" });
    }

    const agent = await storage.updateAIAgentCost(id, cost);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(agent);
  });

  // Ad Performance routes
  app.get(`${apiPrefix}/ad-performance/:brandId`, async (req, res) => {
    const brandId = parseInt(req.params.brandId);
    if (isNaN(brandId)) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }

    const platform = req.query.platform as string;
    const ads = await storage.getAdPerformance(brandId, platform);
    res.json(ads);
  });

  app.post(`${apiPrefix}/ad-performance`, async (req, res) => {
    try {
      const adData = insertAdPerformanceSchema.parse(req.body);
      const ad = await storage.createAdPerformance(adData);
      res.status(201).json(ad);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ad performance data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ad performance" });
    }
  });

  app.patch(`${apiPrefix}/ad-performance/:id/status`, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ad ID" });
    }

    const { status } = req.body;
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ message: "Status is required" });
    }

    const ad = await storage.updateAdStatus(id, status);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json(ad);
  });

  // Operations Tasks routes
  app.get(`${apiPrefix}/ops-tasks/:brandId`, async (req, res) => {
    const brandId = parseInt(req.params.brandId);
    if (isNaN(brandId)) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }

    const status = req.query.status as string;
    const tasks = await storage.getOpsTasks(brandId, status);
    res.json(tasks);
  });

  app.get(`${apiPrefix}/ops-tasks/:brandId/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await storage.getOpsTask(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  });

  app.post(`${apiPrefix}/ops-tasks`, async (req, res) => {
    try {
      const taskData = insertOpsTaskSchema.parse(req.body);
      const task = await storage.createOpsTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch(`${apiPrefix}/ops-tasks/:id/status`, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const { status } = req.body;
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ message: "Status is required" });
    }

    const task = await storage.updateOpsTaskStatus(id, status);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  });

  app.patch(`${apiPrefix}/ops-tasks/:id/progress`, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const { progress } = req.body;
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({ message: "Progress must be a number between 0 and 100" });
    }

    const task = await storage.updateOpsTaskProgress(id, progress);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  });

  const httpServer = createServer(app);
  return httpServer;
}

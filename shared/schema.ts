import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  role: text("role").default("user"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
});

// Brands
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBrandSchema = createInsertSchema(brands).pick({
  name: true,
  code: true,
});

// Revenue
export const revenue = pgTable("revenue", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull(),
  date: timestamp("date").notNull(),
  amount: real("amount").notNull(),
  source: text("source").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRevenueSchema = createInsertSchema(revenue).pick({
  brandId: true,
  date: true,
  amount: true,
  source: true,
});

// Expenses (Ad Spend)
export const adSpend = pgTable("ad_spend", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull(),
  date: timestamp("date").notNull(),
  amount: real("amount").notNull(),
  platform: text("platform").notNull(),
  campaign: text("campaign"),
  adSet: text("ad_set"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAdSpendSchema = createInsertSchema(adSpend).pick({
  brandId: true,
  date: true,
  amount: true,
  platform: true,
  campaign: true,
  adSet: true,
});

// AI Agents
export const aiAgents = pgTable("ai_agents", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  cost: real("cost").default(0),
  metrics: jsonb("metrics"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAIAgentSchema = createInsertSchema(aiAgents).pick({
  brandId: true,
  name: true,
  type: true,
  status: true,
  metrics: true,
});

// Ad Performance
export const adPerformance = pgTable("ad_performance", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull(),
  adSetId: text("ad_set_id").notNull(),
  adSetName: text("ad_set_name").notNull(),
  platform: text("platform").notNull(),
  spend: real("spend").notNull(),
  roas: real("roas").notNull(),
  ctr: real("ctr").notNull(),
  status: text("status").notNull(),
  thumbnail: text("thumbnail"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAdPerformanceSchema = createInsertSchema(adPerformance).pick({
  brandId: true,
  adSetId: true,
  adSetName: true,
  platform: true,
  spend: true,
  roas: true,
  ctr: true,
  status: true,
  thumbnail: true,
  date: true,
});

// Operations Tasks
export const opsTasks = pgTable("ops_tasks", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(), // 'todo', 'in_progress', 'done'
  category: text("category").notNull(),
  dueDate: timestamp("due_date"),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOpsTaskSchema = createInsertSchema(opsTasks).pick({
  brandId: true,
  title: true,
  description: true,
  status: true,
  category: true,
  dueDate: true,
  progress: true,
});

// Types exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;

export type Revenue = typeof revenue.$inferSelect;
export type InsertRevenue = z.infer<typeof insertRevenueSchema>;

export type AdSpend = typeof adSpend.$inferSelect;
export type InsertAdSpend = z.infer<typeof insertAdSpendSchema>;

export type AIAgent = typeof aiAgents.$inferSelect;
export type InsertAIAgent = z.infer<typeof insertAIAgentSchema>;

export type AdPerformance = typeof adPerformance.$inferSelect;
export type InsertAdPerformance = z.infer<typeof insertAdPerformanceSchema>;

export type OpsTask = typeof opsTasks.$inferSelect;
export type InsertOpsTask = z.infer<typeof insertOpsTaskSchema>;

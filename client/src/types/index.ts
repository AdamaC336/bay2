// Brand types
export interface Brand {
  id: number;
  name: string;
  code: string;
  createdAt: Date;
}

// User types
export interface User {
  id: number;
  username: string;
  name: string | null;
  role: string;
}

// Revenue types
export interface Revenue {
  id: number;
  brandId: number;
  date: Date;
  amount: number;
  source: string;
  createdAt: Date;
}

export interface RevenueMetrics {
  today: number;
  yesterday: number;
  percentChange: number;
  weekTotal: number;
  monthTotal: number;
}

// Ad Spend types
export interface AdSpend {
  id: number;
  brandId: number;
  date: Date;
  amount: number;
  platform: string;
  campaign?: string;
  adSet?: string;
  createdAt: Date;
}

export interface AdSpendMetrics {
  today: number;
  yesterday: number;
  percentChange: number;
  weekTotal: number;
  monthTotal: number;
}

// ROAS types
export interface ROASMetrics {
  average: number;
  previousPeriod: number;
  percentChange: number;
  target: number;
}

// AI Agent types
export interface AIAgent {
  id: number;
  brandId: number;
  name: string;
  type: string;
  status: string;
  cost: number;
  metrics: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Ad Performance types
export interface AdPerformance {
  id: number;
  brandId: number;
  adSetId: string;
  adSetName: string;
  platform: string;
  spend: number;
  roas: number;
  ctr: number;
  status: string;
  thumbnail?: string;
  date: Date;
  createdAt: Date;
}

// Operations Task types
export interface OpsTask {
  id: number;
  brandId: number;
  title: string;
  description?: string;
  status: string;
  category: string;
  dueDate?: Date;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }[];
}

// Dashboard types
export interface DashboardMetrics {
  revenue: RevenueMetrics;
  adSpend: AdSpendMetrics;
  roas: ROASMetrics;
  customerAcquisitionCost: number;
  activeAgents: number;
  totalAgentCost: number;
  activeAdSets: number;
  pausedAdSets: number;
  pendingTasks: number;
}

// Theme types
export type Theme = 'dark' | 'light';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          username: string
          password: string
          name: string | null
          role: string | null
        }
        Insert: {
          id?: number
          username: string
          password: string
          name?: string | null
          role?: string | null
        }
        Update: {
          id?: number
          username?: string
          password?: string
          name?: string | null
          role?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          id: number
          name: string
          code: string
          createdAt: string | null
        }
        Insert: {
          id?: number
          name: string
          code: string
          createdAt?: string | null
        }
        Update: {
          id?: number
          name?: string
          code?: string
          createdAt?: string | null
        }
        Relationships: []
      }
      revenue: {
        Row: {
          id: number
          brandId: number
          date: string
          amount: number
          source: string
          createdAt: string | null
        }
        Insert: {
          id?: number
          brandId: number
          date: string
          amount: number
          source: string
          createdAt?: string | null
        }
        Update: {
          id?: number
          brandId?: number
          date?: string
          amount?: number
          source?: string
          createdAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_brandId_fkey"
            columns: ["brandId"]
            referencedRelation: "brands"
            referencedColumns: ["id"]
          }
        ]
      }
      ad_spend: {
        Row: {
          id: number
          brandId: number
          date: string
          amount: number
          platform: string
          campaign: string | null
          adSet: string | null
          createdAt: string | null
        }
        Insert: {
          id?: number
          brandId: number
          date: string
          amount: number
          platform: string
          campaign?: string | null
          adSet?: string | null
          createdAt?: string | null
        }
        Update: {
          id?: number
          brandId?: number
          date?: string
          amount?: number
          platform?: string
          campaign?: string | null
          adSet?: string | null
          createdAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_spend_brandId_fkey"
            columns: ["brandId"]
            referencedRelation: "brands"
            referencedColumns: ["id"]
          }
        ]
      }
      ai_agents: {
        Row: {
          id: number
          brandId: number
          name: string
          type: string
          status: string
          cost: number | null
          metrics: Json
          createdAt: string | null
          updatedAt: string | null
        }
        Insert: {
          id?: number
          brandId: number
          name: string
          type: string
          status: string
          cost?: number | null
          metrics?: Json
          createdAt?: string | null
          updatedAt?: string | null
        }
        Update: {
          id?: number
          brandId?: number
          name?: string
          type?: string
          status?: string
          cost?: number | null
          metrics?: Json
          createdAt?: string | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agents_brandId_fkey"
            columns: ["brandId"]
            referencedRelation: "brands"
            referencedColumns: ["id"]
          }
        ]
      }
      ad_performance: {
        Row: {
          id: number
          brandId: number
          adSetId: string
          adSetName: string
          platform: string
          spend: number
          roas: number
          ctr: number
          status: string
          thumbnail: string | null
          date: string
          createdAt: string | null
        }
        Insert: {
          id?: number
          brandId: number
          adSetId: string
          adSetName: string
          platform: string
          spend: number
          roas: number
          ctr: number
          status: string
          thumbnail?: string | null
          date: string
          createdAt?: string | null
        }
        Update: {
          id?: number
          brandId?: number
          adSetId?: string
          adSetName?: string
          platform?: string
          spend?: number
          roas?: number
          ctr?: number
          status?: string
          thumbnail?: string | null
          date?: string
          createdAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_performance_brandId_fkey"
            columns: ["brandId"]
            referencedRelation: "brands"
            referencedColumns: ["id"]
          }
        ]
      }
      ops_tasks: {
        Row: {
          id: number
          brandId: number
          title: string
          description: string | null
          status: string
          category: string
          dueDate: string | null
          progress: number | null
          createdAt: string | null
          updatedAt: string | null
        }
        Insert: {
          id?: number
          brandId: number
          title: string
          description?: string | null
          status: string
          category: string
          dueDate?: string | null
          progress?: number | null
          createdAt?: string | null
          updatedAt?: string | null
        }
        Update: {
          id?: number
          brandId?: number
          title?: string
          description?: string | null
          status?: string
          category?: string
          dueDate?: string | null
          progress?: number | null
          createdAt?: string | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ops_tasks_brandId_fkey"
            columns: ["brandId"]
            referencedRelation: "brands"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
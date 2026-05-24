export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "advertiser" | "publisher" | "admin";
export type CampaignType = "cpc" | "cpm" | "cpa";
export type CampaignStatus = "draft" | "pending_review" | "active" | "paused" | "completed" | "rejected";
export type AdPlacement = "header" | "in-content" | "sidebar" | "footer" | "interstitial";
export type PayoutMethod = "paypal" | "wise" | "bank";
export type WaitlistType = "advertiser" | "publisher";

export interface Database {
  public: {
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          role?: UserRole;
          updated_at?: string;
        };
      };
      advertisers: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          website: string | null;
          industry: string | null;
          balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name?: string;
          website?: string | null;
          industry?: string | null;
          balance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          company_name?: string;
          website?: string | null;
          industry?: string | null;
          balance?: number;
          updated_at?: string;
        };
      };
      publishers: {
        Row: {
          id: string;
          user_id: string;
          display_name: string;
          site_url: string | null;
          verified: boolean;
          revenue_share: number;
          pending_payout: number;
          total_earned: number;
          payout_method: PayoutMethod | null;
          payout_details: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string;
          site_url?: string | null;
          verified?: boolean;
          revenue_share?: number;
          pending_payout?: number;
          total_earned?: number;
          payout_method?: PayoutMethod | null;
          payout_details?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string;
          site_url?: string | null;
          verified?: boolean;
          revenue_share?: number;
          pending_payout?: number;
          total_earned?: number;
          payout_method?: PayoutMethod | null;
          payout_details?: Json | null;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          advertiser_id: string;
          name: string;
          type: CampaignType;
          status: CampaignStatus;
          daily_budget: number;
          total_budget: number;
          spend: number;
          bid_amount: number;
          targeting_json: Json;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          advertiser_id: string;
          name: string;
          type: CampaignType;
          status?: CampaignStatus;
          daily_budget?: number;
          total_budget?: number;
          spend?: number;
          bid_amount?: number;
          targeting_json?: Json;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          type?: CampaignType;
          status?: CampaignStatus;
          daily_budget?: number;
          total_budget?: number;
          spend?: number;
          bid_amount?: number;
          targeting_json?: Json;
          start_date?: string | null;
          end_date?: string | null;
          updated_at?: string;
        };
      };
      ad_creatives: {
        Row: {
          id: string;
          campaign_id: string;
          headline: string;
          description: string | null;
          destination_url: string;
          cta_text: string;
          image_url: string | null;
          size: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          headline: string;
          description?: string | null;
          destination_url: string;
          cta_text?: string;
          image_url?: string | null;
          size?: string;
          created_at?: string;
        };
        Update: {
          headline?: string;
          description?: string | null;
          destination_url?: string;
          cta_text?: string;
          image_url?: string | null;
          size?: string;
        };
      };
      ad_units: {
        Row: {
          id: string;
          publisher_id: string;
          name: string;
          site_url: string;
          size: string;
          placement: AdPlacement;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          publisher_id: string;
          name: string;
          site_url: string;
          size?: string;
          placement?: AdPlacement;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          site_url?: string;
          size?: string;
          placement?: AdPlacement;
          active?: boolean;
        };
      };
      impressions: {
        Row: {
          id: string;
          campaign_id: string;
          ad_unit_id: string | null;
          creative_id: string | null;
          ip_hash: string | null;
          country: string | null;
          user_agent: string | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          ad_unit_id?: string | null;
          creative_id?: string | null;
          ip_hash?: string | null;
          country?: string | null;
          user_agent?: string | null;
          timestamp?: string;
        };
        Update: Record<string, never>;
      };
      clicks: {
        Row: {
          id: string;
          impression_id: string | null;
          campaign_id: string;
          ip_hash: string | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          impression_id?: string | null;
          campaign_id: string;
          ip_hash?: string | null;
          timestamp?: string;
        };
        Update: Record<string, never>;
      };
      waitlist: {
        Row: {
          id: string;
          name: string;
          email: string;
          type: WaitlistType;
          company: string | null;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          type: WaitlistType;
          company?: string | null;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          email?: string;
          type?: WaitlistType;
          company?: string | null;
          source?: string | null;
        };
      };
    };
  };
}

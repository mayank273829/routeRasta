export interface Database {
  public: {
    Tables: {
      transport_modes: {
        Row: {
          id: string;
          name: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          created_at?: string;
        };
      };
      routes: {
        Row: {
          id: string;
          start_location: string;
          end_location: string;
          total_time_minutes: number;
          total_cost_inr: number;
          total_transfers: number;
          route_type: string;
          user_submitted: boolean;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          start_location: string;
          end_location: string;
          total_time_minutes?: number;
          total_cost_inr?: number;
          total_transfers?: number;
          route_type?: string;
          user_submitted?: boolean;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          start_location?: string;
          end_location?: string;
          total_time_minutes?: number;
          total_cost_inr?: number;
          total_transfers?: number;
          route_type?: string;
          user_submitted?: boolean;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      route_steps: {
        Row: {
          id: string;
          route_id: string;
          step_number: number;
          transport_mode_id: string;
          from_location: string;
          to_location: string;
          duration_minutes: number;
          cost_inr: number;
          instructions: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          route_id: string;
          step_number: number;
          transport_mode_id: string;
          from_location: string;
          to_location: string;
          duration_minutes: number;
          cost_inr: number;
          instructions: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          route_id?: string;
          step_number?: number;
          transport_mode_id?: string;
          from_location?: string;
          to_location?: string;
          duration_minutes?: number;
          cost_inr?: number;
          instructions?: string;
          created_at?: string;
        };
      };
      user_route_submissions: {
        Row: {
          id: string;
          user_email: string | null;
          start_location: string;
          end_location: string;
          route_description: string;
          estimated_time: string | null;
          estimated_cost: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_email?: string | null;
          start_location: string;
          end_location: string;
          route_description: string;
          estimated_time?: string | null;
          estimated_cost?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_email?: string | null;
          start_location?: string;
          end_location?: string;
          route_description?: string;
          estimated_time?: string | null;
          estimated_cost?: string | null;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type TransportMode = Database['public']['Tables']['transport_modes']['Row'];
export type Route = Database['public']['Tables']['routes']['Row'];
export type RouteStep = Database['public']['Tables']['route_steps']['Row'];
export type UserRouteSubmission = Database['public']['Tables']['user_route_submissions']['Row'];

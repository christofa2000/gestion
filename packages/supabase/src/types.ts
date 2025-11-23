// Placeholder types - these will be generated from Supabase
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      // Add your tables here
      profiles: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      // Add your views here
    };
    Functions: {
      // Add your functions here
    };
    Enums: {
      // Add your enums here
    };
  };
}


export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          contact: string
          created_at: string
          handled: boolean
          id: string
          message: string
          name: string
          topic: string
          user_id: string | null
        }
        Insert: {
          contact: string
          created_at?: string
          handled?: boolean
          id?: string
          message: string
          name: string
          topic?: string
          user_id?: string | null
        }
        Update: {
          contact?: string
          created_at?: string
          handled?: boolean
          id?: string
          message?: string
          name?: string
          topic?: string
          user_id?: string | null
        }
        Relationships: []
      }
      hostels: {
        Row: {
          active: boolean
          campus_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          campus_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          campus_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      order_events: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          line_total: number
          order_id: string
          quantity: number
          service_id: string
          service_name: string
          unit: string
          unit_price: number
        }
        Insert: {
          id?: string
          line_total: number
          order_id: string
          quantity: number
          service_id: string
          service_name: string
          unit: string
          unit_price: number
        }
        Update: {
          id?: string
          line_total?: number
          order_id?: string
          quantity?: number
          service_id?: string
          service_name?: string
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          code: string
          created_at: string
          delivery_date: string | null
          delivery_slot: string | null
          delivery_speed: string
          express_fee: number
          id: string
          notes: string
          payment_method: string
          payment_status: string
          pickup_date: string
          pickup_location: string
          pickup_slot: string
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          code?: string
          created_at?: string
          delivery_date?: string | null
          delivery_slot?: string | null
          delivery_speed?: string
          express_fee?: number
          id?: string
          notes?: string
          payment_method?: string
          payment_status?: string
          pickup_date: string
          pickup_location: string
          pickup_slot: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          delivery_date?: string | null
          delivery_slot?: string | null
          delivery_speed?: string
          express_fee?: number
          id?: string
          notes?: string
          payment_method?: string
          payment_status?: string
          pickup_date?: string
          pickup_location?: string
          pickup_slot?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          active: boolean
          created_at: string
          description: string
          features: string[]
          id: string
          kg_allowance: number
          name: string
          period_days: number
          pickups_included: number
          price: number
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          kg_allowance?: number
          name: string
          period_days: number
          pickups_included?: number
          price: number
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          kg_allowance?: number
          name?: string
          period_days?: number
          pickups_included?: number
          price?: number
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          campus: string
          created_at: string
          full_name: string
          hostel: string
          id: string
          institution_id: string
          member_type: string
          mobile: string
          room: string
          university: string
          updated_at: string
          verification_status: string
        }
        Insert: {
          campus?: string
          created_at?: string
          full_name?: string
          hostel?: string
          id: string
          institution_id?: string
          member_type?: string
          mobile?: string
          room?: string
          university?: string
          updated_at?: string
          verification_status?: string
        }
        Update: {
          campus?: string
          created_at?: string
          full_name?: string
          hostel?: string
          id?: string
          institution_id?: string
          member_type?: string
          mobile?: string
          room?: string
          university?: string
          updated_at?: string
          verification_status?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string
          id: string
          name: string
          price: number
          slug: string
          sort_order: number
          turnaround: string
          unit: string
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string
          id?: string
          name: string
          price: number
          slug: string
          sort_order?: number
          turnaround?: string
          unit?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          price?: number
          slug?: string
          sort_order?: number
          turnaround?: string
          unit?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          ends_on: string | null
          id: string
          payment_method: string
          payment_status: string
          plan_id: string
          price: number
          starts_on: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_on?: string | null
          id?: string
          payment_method?: string
          payment_status?: string
          plan_id: string
          price: number
          starts_on?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_on?: string | null
          id?: string
          payment_method?: string
          payment_status?: string
          plan_id?: string
          price?: number
          starts_on?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist_interests: {
        Row: {
          campus: string | null
          contact: string
          created_at: string
          delivery_date: string | null
          hostel: string | null
          id: string
          name: string
          pickup_time: string | null
          service: string
          university: string | null
          user_id: string | null
        }
        Insert: {
          campus?: string | null
          contact: string
          created_at?: string
          delivery_date?: string | null
          hostel?: string | null
          id?: string
          name: string
          pickup_time?: string | null
          service: string
          university?: string | null
          user_id?: string | null
        }
        Update: {
          campus?: string | null
          contact?: string
          created_at?: string
          delivery_date?: string | null
          hostel?: string | null
          id?: string
          name?: string
          pickup_time?: string | null
          service?: string
          university?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_my_order: { Args: { _id: string }; Returns: undefined }
      cancel_my_subscription: { Args: { _id: string }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      place_order: {
        Args: {
          _delivery_speed: string
          _items: Json
          _notes: string
          _payment_method: string
          _pickup_date: string
          _pickup_location: string
          _pickup_slot: string
        }
        Returns: {
          code: string
          id: string
        }[]
      }
      set_order_delivery: {
        Args: {
          _delivery_date: string
          _delivery_slot: string
          _order_id: string
        }
        Returns: undefined
      }
      track_order: {
        Args: { _code: string }
        Returns: {
          code: string
          pickup_date: string
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "user"
      order_status:
        | "placed"
        | "pickup_scheduled"
        | "picked_up"
        | "received"
        | "washing"
        | "drying"
        | "ironing"
        | "quality_check"
        | "packed"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "user"],
      order_status: [
        "placed",
        "pickup_scheduled",
        "picked_up",
        "received",
        "washing",
        "drying",
        "ironing",
        "quality_check",
        "packed",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const

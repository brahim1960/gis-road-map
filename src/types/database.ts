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
      departments: {
        Row: {
          id: string
          name: string
          description: string | null
          manager_id: string | null
          budget: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          manager_id?: string | null
          budget?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          manager_id?: string | null
          budget?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'employee' | 'client' | 'hr_manager' | 'project_manager'
          avatar_url: string | null
          phone: string | null
          address: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          department_id: string | null
          job_title: string | null
          employee_id: string | null
          hire_date: string | null
          hourly_rate: number
          weekly_hours: number
          contract_type: string
          is_active: boolean
          last_login: string | null
          timezone: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'employee' | 'client' | 'hr_manager' | 'project_manager'
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          department_id?: string | null
          job_title?: string | null
          employee_id?: string | null
          hire_date?: string | null
          hourly_rate?: number
          weekly_hours?: number
          contract_type?: string
          is_active?: boolean
          last_login?: string | null
          timezone?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'employee' | 'client' | 'hr_manager' | 'project_manager'
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          department_id?: string | null
          job_title?: string | null
          employee_id?: string | null
          hire_date?: string | null
          hourly_rate?: number
          weekly_hours?: number
          contract_type?: string
          is_active?: boolean
          last_login?: string | null
          timezone?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          company: string | null
          contact_person: string | null
          hourly_rate: number | null
          currency: string
          tax_rate: number
          payment_terms: number
          is_active: boolean
          notes: string | null
          industry: string | null
          company_size: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          company?: string | null
          contact_person?: string | null
          hourly_rate?: number | null
          currency?: string
          tax_rate?: number
          payment_terms?: number
          is_active?: boolean
          notes?: string | null
          industry?: string | null
          company_size?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          company?: string | null
          contact_person?: string | null
          hourly_rate?: number | null
          currency?: string
          tax_rate?: number
          payment_terms?: number
          is_active?: boolean
          notes?: string | null
          industry?: string | null
          company_size?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          client_id: string | null
          status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
          priority: number
          start_date: string | null
          end_date: string | null
          estimated_hours: number | null
          hourly_rate: number | null
          budget: number | null
          is_billable: boolean
          color: string
          progress: number
          location: string | null
          latitude: number | null
          longitude: number | null
          geofence_radius: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          client_id?: string | null
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
          priority?: number
          start_date?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          hourly_rate?: number | null
          budget?: number | null
          is_billable?: boolean
          color?: string
          progress?: number
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          geofence_radius?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          client_id?: string | null
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
          priority?: number
          start_date?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          hourly_rate?: number | null
          budget?: number | null
          is_billable?: boolean
          color?: string
          progress?: number
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          geofence_radius?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_tasks: {
        Row: {
          id: string
          project_id: string
          name: string
          description: string | null
          status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          priority: number
          estimated_hours: number | null
          actual_hours: number
          start_date: string | null
          due_date: string | null
          completed_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          priority?: number
          estimated_hours?: number | null
          actual_hours?: number
          start_date?: string | null
          due_date?: string | null
          completed_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          priority?: number
          estimated_hours?: number | null
          actual_hours?: number
          start_date?: string | null
          due_date?: string | null
          completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_assignments: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: string
          hourly_rate: number | null
          assigned_at: string
          assigned_by: string | null
          is_active: boolean
          can_manage_tasks: boolean
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: string
          hourly_rate?: number | null
          assigned_at?: string
          assigned_by?: string | null
          is_active?: boolean
          can_manage_tasks?: boolean
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: string
          hourly_rate?: number | null
          assigned_at?: string
          assigned_by?: string | null
          is_active?: boolean
          can_manage_tasks?: boolean
        }
      }
      time_entries: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          task_id: string | null
          description: string | null
          start_time: string
          end_time: string | null
          duration: number | null
          status: 'running' | 'paused' | 'completed' | 'approved' | 'rejected'
          is_billable: boolean
          hourly_rate: number | null
          attendance_method: 'qr_code' | 'nfc_badge' | 'facial_recognition' | 'fingerprint' | 'geolocation' | 'ibeacon' | 'mobile_app' | null
          location_checkin: string | null
          location_checkout: string | null
          latitude_checkin: number | null
          longitude_checkin: number | null
          latitude_checkout: number | null
          longitude_checkout: number | null
          device_info: Json | null
          ip_address: string | null
          is_overtime: boolean
          overtime_rate: number
          break_duration: number
          tags: string[] | null
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          task_id?: string | null
          description?: string | null
          start_time: string
          end_time?: string | null
          duration?: number | null
          status?: 'running' | 'paused' | 'completed' | 'approved' | 'rejected'
          is_billable?: boolean
          hourly_rate?: number | null
          attendance_method?: 'qr_code' | 'nfc_badge' | 'facial_recognition' | 'fingerprint' | 'geolocation' | 'ibeacon' | 'mobile_app' | null
          location_checkin?: string | null
          location_checkout?: string | null
          latitude_checkin?: number | null
          longitude_checkin?: number | null
          latitude_checkout?: number | null
          longitude_checkout?: number | null
          device_info?: Json | null
          ip_address?: string | null
          is_overtime?: boolean
          overtime_rate?: number
          break_duration?: number
          tags?: string[] | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          task_id?: string | null
          description?: string | null
          start_time?: string
          end_time?: string | null
          duration?: number | null
          status?: 'running' | 'paused' | 'completed' | 'approved' | 'rejected'
          is_billable?: boolean
          hourly_rate?: number | null
          attendance_method?: 'qr_code' | 'nfc_badge' | 'facial_recognition' | 'fingerprint' | 'geolocation' | 'ibeacon' | 'mobile_app' | null
          location_checkin?: string | null
          location_checkout?: string | null
          latitude_checkin?: number | null
          longitude_checkin?: number | null
          latitude_checkout?: number | null
          longitude_checkout?: number | null
          device_info?: Json | null
          ip_address?: string | null
          is_overtime?: boolean
          overtime_rate?: number
          break_duration?: number
          tags?: string[] | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_rooms: {
        Row: {
          id: string
          name: string
          description: string | null
          project_id: string | null
          is_private: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          project_id?: string | null
          is_private?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          project_id?: string | null
          is_private?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          room_id: string
          sender_id: string
          message_type: 'text' | 'file' | 'image' | 'system'
          content: string | null
          file_url: string | null
          file_name: string | null
          file_size: number | null
          reply_to_id: string | null
          is_edited: boolean
          edited_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          sender_id: string
          message_type?: 'text' | 'file' | 'image' | 'system'
          content?: string | null
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          reply_to_id?: string | null
          is_edited?: boolean
          edited_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          sender_id?: string
          message_type?: 'text' | 'file' | 'image' | 'system'
          content?: string | null
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          reply_to_id?: string | null
          is_edited?: boolean
          edited_at?: string | null
          created_at?: string
        }
      }
      employee_locations: {
        Row: {
          id: string
          employee_id: string
          latitude: number
          longitude: number
          accuracy: number | null
          timestamp: string
          is_work_location: boolean
          project_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          latitude: number
          longitude: number
          accuracy?: number | null
          timestamp?: string
          is_work_location?: boolean
          project_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          latitude?: number
          longitude?: number
          accuracy?: number | null
          timestamp?: string
          is_work_location?: boolean
          project_id?: string | null
          created_at?: string
        }
      }
      travel_logs: {
        Row: {
          id: string
          employee_id: string
          from_project_id: string | null
          to_project_id: string | null
          travel_type: 'project_to_project' | 'home_to_office' | 'client_visit' | 'business_trip'
          start_time: string
          end_time: string | null
          distance_km: number | null
          transport_mode: string | null
          cost: number | null
          is_billable: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          from_project_id?: string | null
          to_project_id?: string | null
          travel_type: 'project_to_project' | 'home_to_office' | 'client_visit' | 'business_trip'
          start_time: string
          end_time?: string | null
          distance_km?: number | null
          transport_mode?: string | null
          cost?: number | null
          is_billable?: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          from_project_id?: string | null
          to_project_id?: string | null
          travel_type?: 'project_to_project' | 'home_to_office' | 'client_visit' | 'business_trip'
          start_time?: string
          end_time?: string | null
          distance_km?: number | null
          transport_mode?: string | null
          cost?: number | null
          is_billable?: boolean
          notes?: string | null
          created_at?: string
        }
      }
      wellness_metrics: {
        Row: {
          id: string
          employee_id: string
          date: string
          work_life_balance_score: number | null
          stress_level: number | null
          hours_worked: number | null
          breaks_taken: number | null
          overtime_hours: number | null
          burnout_risk_score: number | null
          recommendations: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          date?: string
          work_life_balance_score?: number | null
          stress_level?: number | null
          hours_worked?: number | null
          breaks_taken?: number | null
          overtime_hours?: number | null
          burnout_risk_score?: number | null
          recommendations?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          date?: string
          work_life_balance_score?: number | null
          stress_level?: number | null
          hours_worked?: number | null
          breaks_taken?: number | null
          overtime_hours?: number | null
          burnout_risk_score?: number | null
          recommendations?: string[] | null
          created_at?: string
        }
      }
      gamification_badges: {
        Row: {
          id: string
          employee_id: string
          badge_type: 'punctuality' | 'productivity' | 'collaboration' | 'innovation' | 'wellness'
          badge_name: string
          description: string | null
          points: number
          earned_date: string
          criteria_met: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          badge_type: 'punctuality' | 'productivity' | 'collaboration' | 'innovation' | 'wellness'
          badge_name: string
          description?: string | null
          points?: number
          earned_date?: string
          criteria_met?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          badge_type?: 'punctuality' | 'productivity' | 'collaboration' | 'innovation' | 'wellness'
          badge_name?: string
          description?: string | null
          points?: number
          earned_date?: string
          criteria_met?: Json | null
          created_at?: string
        }
      }
      carbon_footprint_tracking: {
        Row: {
          id: string
          employee_id: string
          date: string
          commute_distance_km: number | null
          transport_mode: string | null
          remote_work_hours: number | null
          office_work_hours: number | null
          business_travel_km: number | null
          co2_saved_kg: number | null
          co2_emitted_kg: number | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          date?: string
          commute_distance_km?: number | null
          transport_mode?: string | null
          remote_work_hours?: number | null
          office_work_hours?: number | null
          business_travel_km?: number | null
          co2_saved_kg?: number | null
          co2_emitted_kg?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          date?: string
          commute_distance_km?: number | null
          transport_mode?: string | null
          remote_work_hours?: number | null
          office_work_hours?: number | null
          business_travel_km?: number | null
          co2_saved_kg?: number | null
          co2_emitted_kg?: number | null
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          is_public: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          is_public?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          is_public?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      project_time_stats: {
        Row: {
          project_id: string
          project_name: string
          status: string
          client_id: string | null
          client_name: string | null
          total_entries: number
          total_seconds: number
          total_hours: number
          unique_employees: number
          first_entry: string | null
          last_entry: string | null
          billable_hours: number
        }
      }
      employee_stats: {
        Row: {
          employee_id: string
          full_name: string | null
          role: string
          department_id: string | null
          department_name: string | null
          total_entries: number
          total_hours: number
          projects_worked_on: number
          avg_wellness_score: number
          overtime_hours: number
        }
      }
      employee_current_status: {
        Row: {
          employee_id: string
          full_name: string | null
          department_id: string | null
          current_status: 'present' | 'absent' | 'late' | 'on_leave' | 'remote'
          current_project_id: string | null
          current_project_name: string | null
          last_latitude: number | null
          last_longitude: number | null
          last_location_update: string | null
        }
      }
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: 'admin' | 'employee' | 'client' | 'hr_manager' | 'project_manager'
      }
      calculate_overtime: {
        Args: { employee_id: string; start_date: string; end_date: string }
        Returns: {
          regular_hours: number
          overtime_hours: number
          night_hours: number
          weekend_hours: number
        }[]
      }
      calculate_carbon_footprint: {
        Args: { employee_id: string; calculation_date: string }
        Returns: number
      }
      analyze_burnout_risk: {
        Args: { employee_id: string }
        Returns: number
      }
    }
    Enums: {
      user_role: 'admin' | 'employee' | 'client' | 'hr_manager' | 'project_manager'
      project_status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
      task_status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled'
      time_entry_status: 'running' | 'paused' | 'completed' | 'approved' | 'rejected'
      attendance_method: 'qr_code' | 'nfc_badge' | 'facial_recognition' | 'fingerprint' | 'geolocation' | 'ibeacon' | 'mobile_app'
      employee_status: 'present' | 'absent' | 'late' | 'on_leave' | 'remote'
      travel_type: 'project_to_project' | 'home_to_office' | 'client_visit' | 'business_trip'
      badge_type: 'punctuality' | 'productivity' | 'collaboration' | 'innovation' | 'wellness'
      chat_message_type: 'text' | 'file' | 'image' | 'system'
    }
  }
}
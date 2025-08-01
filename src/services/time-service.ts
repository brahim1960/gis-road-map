import { getSupabaseClient } from '../lib/supabase/client'

export interface TimeEntry {
  id: string
  user_id: string
  project_id?: string
  description?: string
  start_time: string
  end_time?: string
  duration?: number
  status: 'running' | 'paused' | 'completed'
  is_billable: boolean
}

export class TimeService {
  private supabase = getSupabaseClient()

  async startTimer(projectId: string, description?: string): Promise<TimeEntry | null> {
    try {
      const { data, error } = await this.supabase
        .from('time_entries')
        .insert({
          project_id: projectId,
          description,
          start_time: new Date().toISOString(),
          status: 'running',
          is_billable: true,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error starting timer:', error)
      return null
    }
  }

  async stopTimer(entryId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('time_entries')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
        })
        .eq('id', entryId)

      return !error
    } catch (error) {
      console.error('Error stopping timer:', error)
      return false
    }
  }

  async getUserTimeEntries(userId: string, limit = 10): Promise<TimeEntry[]> {
    try {
      const { data, error } = await this.supabase
        .from('time_entries')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching time entries:', error)
      return []
    }
  }
}

export const timeService = new TimeService()
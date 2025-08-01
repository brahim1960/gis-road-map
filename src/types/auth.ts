export type UserRole = 'admin' | 'employee' | 'client' | 'hr_manager' | 'project_manager'

export interface User {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  department_id: string | null
  job_title: string | null
  avatar_url: string | null
  phone: string | null
  hourly_rate: number
  is_active: boolean
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
  role: UserRole
  departmentId?: string
  jobTitle?: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}
export const USER_ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  CLIENT: 'client',
  HR_MANAGER: 'hr_manager',
  PROJECT_MANAGER: 'project_manager',
} as const

export const PROJECT_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const TIME_ENTRY_STATUS = {
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export const ATTENDANCE_METHODS = {
  QR_CODE: 'qr_code',
  NFC_BADGE: 'nfc_badge',
  FACIAL_RECOGNITION: 'facial_recognition',
  FINGERPRINT: 'fingerprint',
  GEOLOCATION: 'geolocation',
  IBEACON: 'ibeacon',
  MOBILE_APP: 'mobile_app',
} as const

export const DEFAULT_SETTINGS = {
  WORKING_HOURS_PER_DAY: 8,
  WORKING_DAYS_PER_WEEK: 5,
  DEFAULT_HOURLY_RATE: 50,
  DEFAULT_CURRENCY: 'EUR',
  OVERTIME_RATE: 1.5,
} as const
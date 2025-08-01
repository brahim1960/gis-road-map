import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/database'

export const createMiddlewareClient = (req: NextRequest, res: NextResponse) => {
  return createMiddlewareClient<Database>({ req, res })
}
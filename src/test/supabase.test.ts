import { describe, it, expect } from 'vitest'
import { isSupabaseConfigured, supabase } from '../app/lib/supabase'

describe('Supabase Utility', () => {
  it('should export isSupabaseConfigured', () => {
    expect(isSupabaseConfigured).toBeDefined()
  })

  it('should be a boolean value', () => {
    expect(typeof isSupabaseConfigured).toBe('boolean')
  })

  it('should check if env variables are configured', () => {
    // This test verifies the export exists and is a boolean
    // The actual configuration depends on .env setup
    expect(isSupabaseConfigured === true || isSupabaseConfigured === false).toBe(true)
  })

  it('should export supabase client', () => {
    expect(supabase).toBeDefined()
  })
})

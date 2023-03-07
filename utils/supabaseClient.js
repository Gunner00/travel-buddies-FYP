import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://insoigtiivtwancisiuo.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imluc29pZ3RpaXZ0d2FuY2lzaXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjU1OTU3MzcsImV4cCI6MTk4MTE3MTczN30.D2ABfLHjs3Tz-CsQfCJhs--fxYcaG5Z0_Juj9CQqVZs"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

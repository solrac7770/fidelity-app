import { createClient } from '@supabase/supabase-js';

// Fallback values for production (Cloudflare Pages) where .env is not available.
// The anon key is safe to expose — Supabase RLS enforces security, not key secrecy.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oasndqrnhhptzvtmxgoc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hc25kcXJuaGhwdHp2dG14Z29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjcxNjEsImV4cCI6MjA5MDY0MzE2MX0.mhFC_X7vjJSYq9Z8sA7lDqTnfCsFUoPJfb6GQDaXpjo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

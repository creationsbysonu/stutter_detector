import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  ((import.meta as { env?: Record<string | number, string | undefined> }).env
    ?.VITE_SUPABASE_URL as string | undefined) ?? "";
const supabaseAnonKey =
  ((import.meta as { env?: Record<string | number, string | undefined> }).env
    ?.VITE_SUPABASE_ANON_KEY as string | undefined) ?? "";

export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (null as unknown as SupabaseClient);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

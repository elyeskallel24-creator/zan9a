import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// "Live mode" = real Supabase keys are present. Otherwise the site runs in
// "demo mode" using built-in sample data so it still looks great before setup.
export const isLive = Boolean(url && key && url.startsWith("http"));

export const supabase = isLive ? createClient(url, key) : null;

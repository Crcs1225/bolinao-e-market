import { createClient } from "@supabase/supabase-js";

// Use import.meta.env for Vite, or process.env for Vue CLI/Webpack with appropriate prefixes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

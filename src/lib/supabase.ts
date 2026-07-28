import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// أضف هذه السطور مؤقتاً للتأكد
console.log("=== SUPABASE CHECK ===");
console.log("URL:", supabaseUrl);
console.log("KEY exists:", !!supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey)
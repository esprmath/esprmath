// src/lib/serverAuth.ts
// التحقق من الطالب في مسارات الخادم عبر جلسته، وتطبق عليه صلاحيات قاعدة البيانات.
import { createClient } from '@supabase/supabase-js';

export async function getRequestUser(req: Request) {
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return null;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: { persistSession: false, autoRefreshToken: false },
        }
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    return error || !user ? null : { supabase, user };
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/** صلاحية فيكتور: نفس الإعداد الذي يتحكم فيه المشرف، والخادم يتحقق منها أيضًا */
export function useAiAllowed(courseId: string) {
    const [isAiAllowed, setIsAiAllowed] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!session?.user) return;
            const { data, error } = await supabase
                .from('user_courses')
                .select('is_ai_allowed')
                .eq('user_id', session.user.id)
                .eq('course_id', courseId)
                .maybeSingle();

            if (!error && data) {
                setIsAiAllowed(data.is_ai_allowed !== false);
            }
        });
    }, [courseId]);

    return isAiAllowed;
}

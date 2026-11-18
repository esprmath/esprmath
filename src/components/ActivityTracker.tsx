'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { setActivityCourse, startActivityTracking } from '@/lib/activity';
import { isDemoCourse } from '@/lib/courseAccess';

/** يشغّل متتبع النشاط داخل صفحات الكورسات، ويحدد الكورس الحالي من الرابط. لا يعرض شيئًا */
export default function ActivityTracker() {
    const pathname = usePathname();

    useEffect(() => startActivityTracking(), []);

    useEffect(() => {
        const course = pathname.match(/^\/workspace\/([^/]+)/)?.[1] ?? null;
        // الكورس النموذجي للتجربة فقط، ما نحسبه
        setActivityCourse(course && !isDemoCourse(course) ? course : null);
    }, [pathname]);

    return null;
}

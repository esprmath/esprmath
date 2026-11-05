'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { checkIsAdmin } from '@/lib/admin';
import { windowStatus } from '@/lib/courseAccess';

type GateResult = { allowed: true } | { allowed: false; message: string; courseId: string };

const NOT_APPROVED = 'هذا المحتوى يتطلب اعتماد الكورس. اطلب الانضمام من الصفحة الرئيسية.';
const NOT_OPEN = 'هذا المحتوى غير متاح حاليًا، وسيُفتح في الوقت المحدد.';

async function checkAccess(pathname: string, userId: string, email?: string): Promise<GateResult> {
    const [, , courseId = '', section = '', item = ''] = pathname.split('/');

    // صفحة الكورس نفسها متاحة لكل مسجل، وهي تعرض حالة كل موديول
    if (!section || (await checkIsAdmin(email))) return { allowed: true };

    const isModule = /^\d+$/.test(section);
    const quizId = section === 'final-review' ? 'final-review' : section === 'quizzes' || section === 'exam-leaks' ? item : '';

    // الطلبات تشتغل مع بعض حتى لا ينتظر الطالب كل واحد بعد الآخر
    const [{ data: enrollment }, { data: mod }, { data: quiz }] = await Promise.all([
        supabase
            .from('user_courses')
            .select('is_approved')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .maybeSingle(),
        isModule
            ? supabase
                .from('course_modules')
                .select('is_open, is_free, opens_at, closes_at')
                .eq('course_id', courseId)
                .eq('module_number', Number(section))
                .maybeSingle()
            : { data: null },
        quizId
            ? supabase
                .from('quiz_settings')
                .select('is_open, opens_at, closes_at')
                .eq('course_id', courseId)
                .eq('quiz_id', quizId)
                .maybeSingle()
            : { data: null },
    ]);
    const isApproved = enrollment?.is_approved === true;

    // موديول: /workspace/101/2
    if (isModule) {
        // الكورسات التي لم تُضف موديولاتها في اللوحة: الأول مجاني والباقي بالاعتماد
        if (!mod) {
            return section === '1' || isApproved ? { allowed: true } : { allowed: false, message: NOT_APPROVED, courseId };
        }
        if (windowStatus(mod) !== 'open') return { allowed: false, message: NOT_OPEN, courseId };
        return mod.is_free || isApproved ? { allowed: true } : { allowed: false, message: NOT_APPROVED, courseId };
    }

    // بقية الأقسام (الاختبارات، الفاينل، بنك الأسئلة) للمعتمدين فقط
    if (!isApproved) return { allowed: false, message: NOT_APPROVED, courseId };

    if (quiz && windowStatus(quiz) !== 'open') return { allowed: false, message: NOT_OPEN, courseId };

    return { allowed: true };
}

const screenStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
    background: '#FFF9E2',
    color: '#2C3531',
    fontWeight: 800,
    textAlign: 'center',
};

const Loading = () => <div style={screenStyle}>جاري التحميل... ⏳</div>;

/**
 * بوابة كل صفحات الكورسات: تتحقق من الدخول والاعتماد ومواعيد الفتح من مكان واحد.
 * المحتوى والأسئلة ما زالت ضمن ملفات المتصفح، فهذه البوابة تمنع الوصول العادي بالرابط،
 * وحماية المحتوى نفسه تحتاج نقله إلى الخادم.
 */
function CourseGate({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [checked, setChecked] = useState<{ pathname: string; result: GateResult } | null>(null);

    useEffect(() => {
        let cancelled = false;
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!session?.user) {
                router.replace('/login');
                return;
            }
            const result = await checkAccess(pathname, session.user.id, session.user.email);
            if (!cancelled) setChecked({ pathname, result });
        });
        return () => {
            cancelled = true;
        };
    }, [pathname, router]);

    if (!checked || checked.pathname !== pathname) return <Loading />;

    if (!checked.result.allowed) {
        return (
            <div style={screenStyle}>
                <div style={{ fontSize: 42 }}>🔒</div>
                <div style={{ maxWidth: 420, lineHeight: 1.6 }}>{checked.result.message}</div>
                <Link href={`/workspace/${checked.result.courseId}`} style={{ color: '#8c5521' }}>
                    → الرجوع لصفحة الكورس
                </Link>
            </div>
        );
    }

    return <>{children}</>;
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    return (
        // الصفحات التي تقرأ رابط الصفحة (useSearchParams) تحتاج Suspense حتى ينجح البناء
        <Suspense fallback={<Loading />}>
            <CourseGate>{children}</CourseGate>
        </Suspense>
    );
}

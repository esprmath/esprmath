'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { isAdminEmail } from '@/lib/admin';
import styles from './admin.module.css';
import type { CourseModule } from '@/lib/courseAccess';
import { Courses, type CourseForm } from './courses';
import { ExamsAndModules, type ExamsActions, type ModuleForm } from './exams';
import {
    AiPanel, Overview, Students, cx,
    type AiLog, type AiSummary, type Course, type Quiz, type StudentRow, type TabId,
} from './sections';

const TABS: Array<{ id: TabId; label: string; icon: string; sub: string }> = [
    { id: 'overview', label: 'نظرة عامة', icon: '📊', sub: 'ملخص المنصة وطلبات الانضمام' },
    { id: 'students', label: 'الطلاب', icon: '🎓', sub: 'البحث والاعتماد وصلاحية فيكتور' },
    { id: 'courses', label: 'الكورسات', icon: '📚', sub: 'إنشاء الكورسات وتعديلها وحذفها' },
    { id: 'exams', label: 'الاختبارات والموديولات', icon: '📝', sub: 'اختر الكورس، ثم افتح وأغلق وجدول موديولاته واختباراته' },
    { id: 'ai', label: 'فيكتور والتكلفة', icon: '🤖', sub: 'الاستخدام والتكلفة والتحكم' },
];

const LOG_DAYS = 62;

const localDayKey = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

function summarizeAi(logs: AiLog[]): AiSummary {
    const now = new Date();
    const todayKey = localDayKey(now);
    const monthKey = todayKey.slice(0, 7);

    const byDay: Record<string, number> = {};
    const usageByUser: Record<string, number> = {};
    const monthUsers: Record<string, { id: string; name: string; count: number; cost: number }> = {};
    let today = 0;
    let month = 0;
    let monthCost = 0;

    logs.forEach((log) => {
        const key = localDayKey(new Date(log.created_at));
        const cost = Number(log.cost) || 0;
        byDay[key] = (byDay[key] ?? 0) + 1;
        if (key === todayKey) today++;
        if (log.user_id) usageByUser[log.user_id] = (usageByUser[log.user_id] ?? 0) + 1;
        if (key.startsWith(monthKey)) {
            month++;
            monthCost += cost;
            if (log.user_id) {
                const user = monthUsers[log.user_id] ??= { id: log.user_id, name: log.student_name || 'طالب', count: 0, cost: 0 };
                user.count++;
                user.cost += cost;
            }
        }
    });

    const daily = Array.from({ length: 14 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (13 - i));
        const key = localDayKey(date);
        return { key, label: `${date.getDate()}/${date.getMonth() + 1}`, count: byDay[key] ?? 0, isToday: key === todayKey };
    });

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return {
        today,
        month,
        monthCost,
        projectedCost: (monthCost / now.getDate()) * daysInMonth,
        avgCost: month ? monthCost / month : 0,
        daily,
        users: Object.values(monthUsers).sort((a, b) => b.count - a.count),
        usageByUser,
    };
}

export default function AdminDashboard() {
    const [access, setAccess] = useState<'checking' | 'allowed' | 'denied'>('checking');
    const [tab, setTab] = useState<TabId>('overview');
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
    const [confirm, setConfirm] = useState<{ title: string; text: string; label: string; danger?: boolean; run: () => void } | null>(null);

    const [students, setStudents] = useState<StudentRow[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [modules, setModules] = useState<CourseModule[]>([]);
    const [modulesReady, setModulesReady] = useState(true);
    const [examsCourseId, setExamsCourseId] = useState('');
    const [logs, setLogs] = useState<AiLog[]>([]);
    const [aiEnabled, setAiEnabled] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);

    const notify = useCallback((text: string, error = false) => {
        setToast({ text, error });
        setTimeout(() => setToast(null), error ? 6000 : 3000);
    }, []);

    const loadAll = useCallback(async () => {
        const since = new Date(Date.now() - LOG_DAYS * 24 * 60 * 60 * 1000).toISOString();
        // بعد تشغيل ملف SQL تصل بيانات الطلاب عبر الدالة المحمية admin_students فقط
        const studentsRpc = await supabase.rpc('admin_students');
        const [studentsRes, coursesRes, quizzesRes, logsRes, settingRes, modulesRes] = await Promise.all([
            studentsRpc.error ? supabase.from('student_profiles_view').select('*') : Promise.resolve(studentsRpc),
            supabase.from('courses').select('id, title, description, is_active, requires_approval').order('id'),
            supabase.from('quiz_settings').select('id, course_id, quiz_id, title, is_open, opens_at, closes_at'),
            supabase.from('ai_logs').select('user_id, student_name, cost, created_at').eq('model_name', 'gpt-4o-mini').gte('created_at', since).order('created_at', { ascending: false }).limit(5000),
            supabase.from('system_settings').select('value').eq('key', 'ai_global_switch').maybeSingle(),
            supabase.from('course_modules').select('*').order('module_number'),
        ]);

        setLoadFailed(Boolean(studentsRes.error || coursesRes.error || quizzesRes.error || logsRes.error));
        setModulesReady(!modulesRes.error);
        if (modulesRes.data) setModules(modulesRes.data);
        if (studentsRes.data) setStudents(studentsRes.data as StudentRow[]);
        if (coursesRes.data) {
            const loaded = coursesRes.data;
            setCourses(loaded);
            setExamsCourseId((current) => (loaded.some((c) => c.id === current) ? current : loaded[0]?.id ?? ''));
        }
        if (quizzesRes.data) setQuizzes(quizzesRes.data);
        if (logsRes.data) setLogs(logsRes.data);
        if (settingRes.data) setAiEnabled(settingRes.data.value === true);
        setLoading(false);
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (isAdminEmail(session?.user?.email)) {
                setAccess('allowed');
                loadAll();
            } else {
                setAccess('denied');
            }
        });
    }, [loadAll]);

    /**
     * ينفذ التعديل ويتأكد أن سجلات تغيرت فعلًا.
     * صلاحيات قاعدة البيانات قد تمنع التعديل بصمت بدون خطأ، فلازم نعد السجلات المتأثرة.
     */
    const applyChange = async (
        change: () => PromiseLike<{ data: unknown[] | null; error: { message: string } | null }>,
        successText: string
    ) => {
        setBusy(true);
        const { data, error } = await change();
        if (error) {
            console.error('[admin]', error.message);
            notify('تعذر تنفيذ العملية، حاول مرة ثانية.', true);
        } else if (!data || data.length === 0) {
            notify('لم يُحفظ التغيير: صلاحيات قاعدة البيانات لم تسمح بتعديل هذا السجل.', true);
        } else {
            notify(successText);
        }
        await loadAll();
        setBusy(false);
    };

    const requests = useMemo(
        () => students.filter((s) => s.user_course_id && s.is_approved === false),
        [students]
    );
    const ai = useMemo(() => summarizeAi(logs), [logs]);

    const approve = (row: StudentRow) => applyChange(
        () => supabase.from('user_courses').update({ is_approved: true }).eq('id', row.user_course_id).select('id'),
        `تم اعتماد ${row.full_name || 'الطالب'} ✓`
    );

    const askReject = (row: StudentRow) => setConfirm({
        title: 'رفض الطلب؟',
        text: `سيُحذف طلب ${row.full_name || 'هذا الطالب'} في Math ${row.course_id}. يقدر يقدم مرة ثانية لاحقًا.`,
        label: 'رفض الطلب',
        danger: true,
        run: () => applyChange(
            () => supabase.from('user_courses').delete().eq('id', row.user_course_id).select('id'),
            'تم رفض الطلب'
        ),
    });

    const askApproveAll = () => setConfirm({
        title: `الموافقة على ${requests.length} طلب؟`,
        text: 'سيحصل كل هؤلاء الطلاب على الوصول الكامل للكورس المسجلين فيه.',
        label: 'موافقة على الكل',
        run: () => applyChange(
            () => supabase.from('user_courses').update({ is_approved: true }).in('id', requests.map((r) => r.user_course_id as number)).select('id'),
            'تم اعتماد كل الطلبات ✓'
        ),
    });

    const askCancelApproval = (row: StudentRow) => setConfirm({
        title: 'إلغاء الاعتماد؟',
        text: `سيرجع ${row.full_name || 'الطالب'} لحالة الانتظار ويفقد الوصول الكامل للكورس.`,
        label: 'إلغاء الاعتماد',
        danger: true,
        run: () => applyChange(
            () => supabase.from('user_courses').update({ is_approved: false }).eq('id', row.user_course_id).select('id'),
            'تم إلغاء الاعتماد'
        ),
    });

    const askRemove = (row: StudentRow) => setConfirm({
        title: 'حذف التسجيل؟',
        text: `سيُحذف تسجيل ${row.full_name || 'الطالب'} في Math ${row.course_id}. حسابه يبقى، لكن لا يمكن استرجاع هذا التسجيل.`,
        label: 'حذف التسجيل',
        danger: true,
        run: () => applyChange(
            () => supabase.from('user_courses').delete().eq('id', row.user_course_id).select('id'),
            'تم حذف التسجيل'
        ),
    });

    const toggleStudentAi = (row: StudentRow) => {
        const next = row.is_ai_allowed === false;
        return applyChange(
            () => supabase.from('user_courses').update({ is_ai_allowed: next }).eq('id', row.user_course_id).select('id'),
            next ? 'تم تفعيل فيكتور للطالب' : 'تم تعطيل فيكتور للطالب'
        );
    };

    const updateCourse = (course: Course, field: 'is_active' | 'requires_approval', value: boolean) => applyChange(
        () => supabase.from('courses').update({ [field]: value }).eq('id', course.id).select('id'),
        'تم حفظ إعداد الكورس ✓'
    );

    const createCourse = async (form: CourseForm) => {
        await applyChange(
            () => supabase.from('courses').insert([{
                ...form,
                is_active: false,
                badge_color: '#FEECD0',
                badge_text_color: '#8c5521',
            }]).select('id'),
            'تم إنشاء الكورس ✓ أضف موديولاته، وهو مخفي عن الطلاب حتى تظهره'
        );
        setExamsCourseId(form.id);
        setTab('exams');
    };

    const saveCourse = (form: CourseForm) => applyChange(
        () => supabase.from('courses').update({
            title: form.title,
            description: form.description,
            requires_approval: form.requires_approval,
        }).eq('id', form.id).select('id'),
        'تم حفظ الكورس ✓'
    );

    const askDeleteCourse = (course: Course, enrolled: number) => {
        if (enrolled > 0) {
            notify(`لا يمكن حذف كورس فيه ${enrolled} طالب. احذف تسجيلاتهم أولًا، أو أخفِ الكورس.`, true);
            return;
        }
        setConfirm({
            title: `حذف ${course.title}؟`,
            text: 'سيُحذف الكورس وكل موديولاته واختباراته نهائيًا، ولا يمكن استرجاعها.',
            label: 'حذف الكورس',
            danger: true,
            run: () => applyChange(async () => {
                const quizzesDeleted = await supabase.from('quiz_settings').delete().eq('course_id', course.id);
                if (quizzesDeleted.error) return { data: null, error: quizzesDeleted.error };
                return supabase.from('courses').delete().eq('id', course.id).select('id');
            }, 'تم حذف الكورس'),
        });
    };

    const updateModule = (mod: CourseModule, values: Partial<CourseModule>, text: string) => applyChange(
        () => supabase.from('course_modules').update(values).eq('id', mod.id).select('id'),
        text
    );

    const examsActions: ExamsActions = {
        toggleModule: (mod) => updateModule(mod, { is_open: !mod.is_open }, mod.is_open ? `تم إغلاق ${mod.title}` : `تم فتح ${mod.title}`),
        toggleModuleFree: (mod) => updateModule(mod, { is_free: !mod.is_free }, mod.is_free ? 'الموديول صار يتطلب اعتمادًا' : 'الموديول صار مجانيًا'),
        scheduleModule: (mod, opensAt, closesAt) => updateModule(mod, { opens_at: opensAt, closes_at: closesAt }, 'تم حفظ الموعد ✓'),
        saveModule: (form: ModuleForm, existing) => existing
            ? updateModule(existing, {
                module_number: form.module_number,
                title: form.title,
                description: form.description,
                chapters: form.chapters,
            }, 'تم حفظ الموديول ✓')
            : applyChange(
                () => supabase.from('course_modules').insert([{ ...form, course_id: examsCourseId }]).select('id'),
                'تمت إضافة الموديول ✓'
            ),
        deleteModule: (mod) => setConfirm({
            title: `حذف ${mod.title}؟`,
            text: 'سيختفي الموديول من صفحة الكورس. محتواه في ملفات الموقع لا يتأثر.',
            label: 'حذف الموديول',
            danger: true,
            run: () => applyChange(() => supabase.from('course_modules').delete().eq('id', mod.id).select('id'), 'تم حذف الموديول'),
        }),
        toggleQuiz: (quiz) => applyChange(
            () => supabase.from('quiz_settings').update({ is_open: !quiz.is_open }).eq('id', quiz.id).select('id'),
            quiz.is_open ? `تم إغلاق ${quiz.title}` : `تم فتح ${quiz.title}`
        ),
        scheduleQuiz: (quiz, opensAt, closesAt) => applyChange(
            () => supabase.from('quiz_settings').update({ opens_at: opensAt, closes_at: closesAt }).eq('id', quiz.id).select('id'),
            'تم حفظ الموعد ✓'
        ),
        renameQuiz: (quiz, title) => applyChange(
            () => supabase.from('quiz_settings').update({ title }).eq('id', quiz.id).select('id'),
            'تم حفظ الاسم ✓'
        ),
        addQuiz: (quiz) => applyChange(
            () => supabase.from('quiz_settings').insert([{ ...quiz, is_open: false }]).select('id'),
            'تمت إضافة الاختبار ✓'
        ),
        deleteQuiz: (quiz) => setConfirm({
            title: `حذف ${quiz.title}؟`,
            text: 'سيختفي الاختبار من صفحة الكورس، وتُحذف إعدادات فتحه ومواعيده.',
            label: 'حذف الاختبار',
            danger: true,
            run: () => applyChange(() => supabase.from('quiz_settings').delete().eq('id', quiz.id).select('id'), 'تم حذف الاختبار'),
        }),
    };

    const moduleCounts = modules.reduce<Record<string, number>>((acc, mod) => {
        acc[mod.course_id] = (acc[mod.course_id] ?? 0) + 1;
        return acc;
    }, {});

    const askToggleAi = () => {
        const change = () => applyChange(
            () => supabase.from('system_settings').update({ value: !aiEnabled }).eq('key', 'ai_global_switch').select('key'),
            aiEnabled ? 'تم إيقاف فيكتور للجميع' : 'تم تشغيل فيكتور ✓'
        );
        if (aiEnabled) {
            setConfirm({
                title: 'إيقاف فيكتور للجميع؟',
                text: 'لن يقدر أي طالب يستخدم الشات حتى تعيد تشغيله.',
                label: 'إيقاف فيكتور',
                danger: true,
                run: change,
            });
        } else {
            change();
        }
    };

    if (access === 'checking') return <div className={styles.center}>جاري التحقق... ⏳</div>;

    if (access === 'denied') {
        return (
            <div className={styles.center}>
                <div style={{ fontSize: 40 }}>🔒</div>
                <div>هذه الصفحة للمشرفين فقط.</div>
                <Link href="/" style={{ color: '#8c5521' }}>الرجوع للرئيسية</Link>
            </div>
        );
    }

    const current = TABS.find((t) => t.id === tab)!;

    return (
        <div className={styles.shell}>
            <aside className={styles.side}>
                <div className={styles.brand}>
                    <div className={styles.brandName}>EsprMath</div>
                    <div className={styles.brandSub}>لوحة التحكم</div>
                </div>
                <nav className={styles.nav} aria-label="أقسام لوحة التحكم">
                    {TABS.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            aria-current={tab === item.id ? 'page' : undefined}
                            onClick={() => setTab(item.id)}
                            className={cx(styles.navBtn, tab === item.id && styles.navActive)}
                        >
                            <span aria-hidden="true">{item.icon}</span>
                            <span>{item.label}</span>
                            {item.id === 'overview' && requests.length > 0 && (
                                <span className={styles.navCount}>{requests.length}</span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className={styles.sideFoot}>
                    <Link href="/" className={styles.backLink}>→ الرجوع للمنصة</Link>
                </div>
            </aside>

            <main className={styles.main}>
                <div className={styles.top}>
                    <div>
                        <h1 className={styles.pageTitle}>{current.label}</h1>
                        <p className={styles.pageSub}>{current.sub}</p>
                    </div>
                    <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={loadAll} disabled={busy}>
                        ↻ تحديث
                    </button>
                </div>

                {loadFailed && (
                    <div className={styles.note} style={{ marginBottom: 12 }}>
                        تعذر تحميل بعض البيانات، فقد تكون الأرقام ناقصة. اضغط تحديث للمحاولة مرة ثانية.
                    </div>
                )}

                {loading ? (
                    <div className={styles.card}><div className={styles.empty}>جاري جلب البيانات... ⏳</div></div>
                ) : (
                    <>
                        {tab === 'overview' && (
                            <Overview
                                students={students}
                                requests={requests}
                                courses={courses}
                                quizzes={quizzes}
                                ai={ai}
                                aiEnabled={aiEnabled}
                                goTo={setTab}
                                busy={busy}
                                onApprove={approve}
                                onReject={askReject}
                                onApproveAll={askApproveAll}
                            />
                        )}
                        {tab === 'students' && (
                            <Students
                                students={students}
                                courses={courses}
                                usage={ai.usageByUser}
                                busy={busy}
                                onToggleAi={toggleStudentAi}
                                onApprove={approve}
                                onCancelApproval={askCancelApproval}
                                onRemove={askRemove}
                            />
                        )}
                        {tab === 'courses' && (
                            <Courses
                                courses={courses}
                                students={students}
                                moduleCounts={moduleCounts}
                                busy={busy}
                                onToggle={updateCourse}
                                onCreate={createCourse}
                                onSave={saveCourse}
                                onDelete={askDeleteCourse}
                                onManage={(id) => {
                                    setExamsCourseId(id);
                                    setTab('exams');
                                }}
                            />
                        )}
                        {tab === 'exams' && (
                            <ExamsAndModules
                                courses={courses}
                                courseId={examsCourseId}
                                setCourseId={setExamsCourseId}
                                modules={modules}
                                quizzes={quizzes}
                                modulesReady={modulesReady}
                                busy={busy}
                                actions={examsActions}
                            />
                        )}
                        {tab === 'ai' && <AiPanel ai={ai} enabled={aiEnabled} busy={busy} onToggle={askToggleAi} />}
                    </>
                )}
            </main>

            {confirm && (
                <div className={styles.overlay}>
                    <div className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
                        <h2 id="confirm-title" className={styles.dialogTitle}>{confirm.title}</h2>
                        <p className={styles.dialogText}>{confirm.text}</p>
                        <div className={styles.dialogActions}>
                            <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => setConfirm(null)}>تراجع</button>
                            <button
                                type="button"
                                className={cx(styles.btn, confirm.danger && styles.btnSolidDanger)}
                                onClick={() => {
                                    confirm.run();
                                    setConfirm(null);
                                }}
                            >
                                {confirm.label}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className={cx(styles.toast, toast.error && styles.toastError)} role="status">{toast.text}</div>
            )}
        </div>
    );
}

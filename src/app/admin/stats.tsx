'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { module1 } from '@/content/101/module-1';
import { module2 } from '@/content/101/module-2';
import styles from './admin.module.css';
import type { Course } from './sections';

interface StudentActivity {
    user_id: string;
    full_name: string | null;
    email: string | null;
    active_seconds: number;
    video_seconds: number;
    days_active: number;
    last_day: string | null;
}

interface IdeaActivity {
    idea_key: string;
    students_opened: number;
    students_completed: number;
    avg_lesson_seconds: number | null;
    median_lesson_seconds: number | null;
    answered_total: number;
    correct_total: number;
    students_no_answer: number;
}

type IdeaSort = 'time' | 'mistakes' | 'ignored';

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(' ');

const hoursMinutes = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} د`;
    return `${Math.floor(minutes / 60)} س ${String(minutes % 60).padStart(2, '0')} د`;
};

const minutesSeconds = (seconds: number | null) => {
    if (!seconds) return '—';
    const total = Math.round(seconds);
    return `${Math.floor(total / 60)} د ${String(total % 60).padStart(2, '0')} ث`;
};

const percent = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : null);

/** أسماء الأفكار من ملفات المحتوى (كورس 101)، لتظهر "1.1 اسم الفكرة" بدل المفتاح */
function ideaLabels(courseId: string): Record<string, string> {
    if (courseId !== '101') return {};
    const labels: Record<string, string> = {};
    for (const chapter of [...module1.chapters, ...module2.chapters]) {
        for (const idea of chapter.ideas) {
            labels[`${chapter.chapterNumber}-${idea.id}`] = `${idea.ideaNumber} ${idea.ideaName}`;
        }
    }
    return labels;
}

export function ActivityStats({ courses }: { courses: Course[] }) {
    const [courseId, setCourseId] = useState(courses[0]?.id ?? '');
    const [days, setDays] = useState(30);
    const [sort, setSort] = useState<IdeaSort>('time');
    const [students, setStudents] = useState<StudentActivity[]>([]);
    const [ideas, setIdeas] = useState<IdeaActivity[]>([]);
    const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'failed'>('loading');

    useEffect(() => {
        if (!courseId) return;
        let cancelled = false;
        setState('loading');

        Promise.all([
            supabase.rpc('admin_activity_students', { p_course: courseId, p_days: days }),
            supabase.rpc('admin_activity_ideas', { p_course: courseId }),
        ]).then(([studentsRes, ideasRes]) => {
            if (cancelled) return;
            const error = studentsRes.error ?? ideasRes.error;
            if (error) {
                // الدالة غير موجودة = ملف SQL ما شُغّل بعد
                setState(/function|schema cache|PGRST202|404/i.test(`${error.message} ${error.code}`) ? 'missing' : 'failed');
                return;
            }
            setStudents((studentsRes.data ?? []) as StudentActivity[]);
            setIdeas((ideasRes.data ?? []) as IdeaActivity[]);
            setState('ready');
        });

        return () => {
            cancelled = true;
        };
    }, [courseId, days]);

    const labels = useMemo(() => ideaLabels(courseId), [courseId]);

    const summary = useMemo(() => {
        const active = students.filter((s) => s.active_seconds > 0);
        const totalSeconds = active.reduce((sum, s) => sum + s.active_seconds, 0);
        const totalDays = active.reduce((sum, s) => sum + s.days_active, 0);

        const completed = ideas.reduce((sum, i) => sum + i.students_completed, 0);
        const weightedTime = ideas.reduce((sum, i) => sum + (i.avg_lesson_seconds ?? 0) * i.students_completed, 0);
        const answered = ideas.reduce((sum, i) => sum + i.answered_total, 0);
        const correct = ideas.reduce((sum, i) => sum + i.correct_total, 0);
        const opened = ideas.reduce((sum, i) => sum + i.students_opened, 0);
        const ignored = ideas.reduce((sum, i) => sum + i.students_no_answer, 0);

        return {
            activeStudents: active.length,
            avgPerStudent: active.length ? totalSeconds / active.length : 0,
            avgPerDay: totalDays ? totalSeconds / totalDays : 0,
            avgLesson: completed ? weightedTime / completed : 0,
            wrongRate: answered ? percent(answered - correct, answered) : null,
            ignoredRate: percent(ignored, opened),
            answered,
        };
    }, [students, ideas]);

    const sortedIdeas = useMemo(() => {
        const wrongOf = (i: IdeaActivity) => (i.answered_total ? 1 - i.correct_total / i.answered_total : -1);
        const ignoredOf = (i: IdeaActivity) => (i.students_opened ? i.students_no_answer / i.students_opened : -1);
        const list = [...ideas];
        if (sort === 'time') list.sort((a, b) => (b.avg_lesson_seconds ?? 0) - (a.avg_lesson_seconds ?? 0));
        if (sort === 'mistakes') list.sort((a, b) => wrongOf(b) - wrongOf(a));
        if (sort === 'ignored') list.sort((a, b) => ignoredOf(b) - ignoredOf(a));
        return list;
    }, [ideas, sort]);

    return (
        <section className={styles.card}>
            <div className={styles.toolbar}>
                <select className={styles.select} aria-label="الكورس" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                    {courses.map((c) => <option key={c.id} value={c.id}>Math {c.id}</option>)}
                </select>
                <select className={styles.select} aria-label="الفترة" value={days} onChange={(e) => setDays(Number(e.target.value))}>
                    <option value={7}>آخر 7 أيام</option>
                    <option value={30}>آخر 30 يوم</option>
                    <option value={90}>آخر 90 يوم</option>
                </select>
            </div>

            <p className={styles.cardSub}>
                وقت التفاعل = التبويب ظاهر، وفيه حركة أو كتابة أو تمرير خلال آخر دقيقتين، أو مقطع شغّال. حسابات المشرفين غير محسوبة.
            </p>

            {state === 'loading' && <div className={styles.empty}>جاري جلب الإحصائيات... ⏳</div>}

            {state === 'missing' && (
                <div className={styles.note}>
                    الإحصائيات ما فُعّلت بعد: شغّل الملف <code>supabase/migrations/20261118_activity_stats.sql</code> في Supabase (SQL Editor)، ثم اضغط تحديث.
                </div>
            )}

            {state === 'failed' && <div className={styles.note}>تعذر جلب الإحصائيات، اضغط تحديث للمحاولة مرة ثانية.</div>}

            {state === 'ready' && (
                <>
                    <div className={styles.kpis}>
                        <div className={styles.kpi}>
                            <span className={styles.kpiLabel}>طلاب تفاعلوا</span>
                            <span className={styles.kpiValue}>{summary.activeStudents}</span>
                            <span className={styles.kpiHint}>من {students.length} مسجل</span>
                        </div>
                        <div className={styles.kpi}>
                            <span className={styles.kpiLabel}>متوسط وقت الطالب</span>
                            <span className={styles.kpiValue}>{summary.activeStudents ? hoursMinutes(summary.avgPerStudent) : '—'}</span>
                            <span className={styles.kpiHint}>
                                {summary.activeStudents ? `${hoursMinutes(summary.avgPerDay)} باليوم الذي يتفاعل فيه` : 'لا توجد بيانات بعد'}
                            </span>
                        </div>
                        <div className={styles.kpi}>
                            <span className={styles.kpiLabel}>متوسط إنهاء الفكرة</span>
                            <span className={styles.kpiValue}>{summary.avgLesson ? minutesSeconds(summary.avgLesson) : '—'}</span>
                            <span className={styles.kpiHint}>من الفتح حتى الإتقان</span>
                        </div>
                        <div className={styles.kpi}>
                            <span className={styles.kpiLabel}>نسبة الأخطاء</span>
                            <span className={styles.kpiValue}>{summary.wrongRate === null ? '—' : `${summary.wrongRate}%`}</span>
                            <span className={styles.kpiHint}>من {summary.answered} إجابة</span>
                        </div>
                        <div className={styles.kpi}>
                            <span className={styles.kpiLabel}>فتحوا ولم يجاوبوا</span>
                            <span className={styles.kpiValue}>{summary.ignoredRate === null ? '—' : `${summary.ignoredRate}%`}</span>
                            <span className={styles.kpiHint}>من فتحات الأفكار</span>
                        </div>
                    </div>

                    <h3 className={styles.cardTitle} style={{ marginTop: 18 }}>الأفكار</h3>
                    <div className={styles.toolbar}>
                        <select className={styles.select} aria-label="ترتيب الأفكار" value={sort} onChange={(e) => setSort(e.target.value as IdeaSort)}>
                            <option value="time">الأطول وقتًا</option>
                            <option value="mistakes">الأكثر أخطاء</option>
                            <option value="ignored">الأكثر تجاهلًا للأسئلة</option>
                        </select>
                    </div>

                    {sortedIdeas.length === 0 ? (
                        <div className={styles.empty}>لا توجد بيانات أفكار بعد. تظهر لما يبدأ الطلاب يحلون.</div>
                    ) : (
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>الفكرة</th>
                                        <th>فتحها</th>
                                        <th>أتقنها</th>
                                        <th>متوسط الوقت</th>
                                        <th>الوسيط</th>
                                        <th>الأخطاء</th>
                                        <th>لم يجاوبوا</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedIdeas.map((idea) => {
                                        const wrong = percent(idea.answered_total - idea.correct_total, idea.answered_total);
                                        const ignored = percent(idea.students_no_answer, idea.students_opened);
                                        return (
                                            <tr key={idea.idea_key}>
                                                <td data-label="الفكرة" dir="auto">{labels[idea.idea_key] ?? idea.idea_key}</td>
                                                <td data-label="فتحها">{idea.students_opened}</td>
                                                <td data-label="أتقنها">{idea.students_completed}</td>
                                                <td data-label="متوسط الوقت">{minutesSeconds(idea.avg_lesson_seconds)}</td>
                                                <td data-label="الوسيط">{minutesSeconds(idea.median_lesson_seconds)}</td>
                                                <td data-label="الأخطاء">
                                                    {wrong === null ? '—' : <span className={cx(styles.pill, wrong >= 50 ? styles.pillBad : wrong >= 30 ? styles.pillWarn : styles.pillGood)}>{wrong}%</span>}
                                                </td>
                                                <td data-label="لم يجاوبوا">{ignored === null ? '—' : `${ignored}%`}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <h3 className={styles.cardTitle} style={{ marginTop: 18 }}>الطلاب</h3>
                    {students.length === 0 ? (
                        <div className={styles.empty}>لا يوجد طلاب مسجلون في هذا الكورس.</div>
                    ) : (
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>الطالب</th>
                                        <th>وقت التفاعل</th>
                                        <th>منه مقاطع</th>
                                        <th>أيام التفاعل</th>
                                        <th>المتوسط باليوم</th>
                                        <th>آخر تفاعل</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s) => (
                                        <tr key={s.user_id}>
                                            <td data-label="الطالب">
                                                <b>{s.full_name || 'طالب'}</b>
                                                {s.email && <div style={{ fontSize: 12, opacity: 0.7 }} dir="ltr">{s.email}</div>}
                                            </td>
                                            <td data-label="وقت التفاعل">{s.active_seconds ? hoursMinutes(s.active_seconds) : '—'}</td>
                                            <td data-label="منه مقاطع">{s.video_seconds ? hoursMinutes(s.video_seconds) : '—'}</td>
                                            <td data-label="أيام التفاعل">{s.days_active || '—'}</td>
                                            <td data-label="المتوسط باليوم">{s.days_active ? hoursMinutes(s.active_seconds / s.days_active) : '—'}</td>
                                            <td data-label="آخر تفاعل">{s.last_day ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

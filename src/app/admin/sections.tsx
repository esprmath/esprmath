'use client';

import { useEffect, useMemo, useState } from 'react';
import { hasQuizPage, windowStatus } from '@/lib/courseAccess';
import styles from './admin.module.css';

export const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(' ');

export interface StudentRow {
    id: string;
    email: string | null;
    full_name: string | null;
    created_at: string | null;
    user_course_id: number | null;
    course_id: string | null;
    is_approved: boolean | null;
    is_ai_allowed: boolean | null;
    exam_date: string | null;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    is_active: boolean;
    requires_approval: boolean;
}

export interface Quiz {
    id: number;
    course_id: string;
    quiz_id: string;
    title: string;
    is_open: boolean;
    opens_at: string | null;
    closes_at: string | null;
}

export interface AiLog {
    user_id: string | null;
    student_name: string | null;
    cost: number | null;
    created_at: string;
}

export interface AiSummary {
    today: number;
    month: number;
    monthCost: number;
    projectedCost: number;
    avgCost: number;
    daily: Array<{ key: string; label: string; count: number; isToday: boolean }>;
    users: Array<{ id: string; name: string; count: number; cost: number }>;
    usageByUser: Record<string, number>;
}

export type TabId = 'overview' | 'students' | 'courses' | 'exams' | 'ai';

const formatMoney = (value: number) => `$${value.toFixed(value < 1 ? 4 : 2)}`;
const formatDate = (value?: string | null) => {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('ar-SA-u-nu-latn', { day: 'numeric', month: 'short', year: 'numeric' });
};
/* ===== عناصر مشتركة ===== */

export function Pill({ tone, children }: { tone: 'good' | 'warn' | 'bad' | 'muted'; children: React.ReactNode }) {
    const toneClass = { good: styles.pillGood, warn: styles.pillWarn, bad: styles.pillBad, muted: styles.pillMuted }[tone];
    return <span className={cx(styles.pill, toneClass)}>{children}</span>;
}

export function Switch({ on, label, onChange, disabled }: { on: boolean; label: string; onChange: () => void; disabled?: boolean }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label={label}
            title={label}
            disabled={disabled}
            onClick={onChange}
            className={cx(styles.switch, on && styles.switchOn)}
        />
    );
}

function Kpi({ label, value, hint, alert, onClick }: { label: string; value: React.ReactNode; hint?: string; alert?: boolean; onClick?: () => void }) {
    const content = (
        <>
            <span className={styles.kpiLabel}>{label}</span>
            <span className={styles.kpiValue}>{value}</span>
            {hint && <span className={styles.kpiHint}>{hint}</span>}
        </>
    );
    return onClick
        ? <button type="button" onClick={onClick} className={cx(styles.kpi, alert && styles.kpiAlert)}>{content}</button>
        : <div className={cx(styles.kpi, alert && styles.kpiAlert)}>{content}</div>;
}

/** طلبات فيكتور اليومية: سلسلة واحدة، فالعنوان يكفي بدون مفتاح ألوان */
function DailyChart({ daily }: { daily: AiSummary['daily'] }) {
    const [hovered, setHovered] = useState<number | null>(null);
    const max = Math.max(...daily.map((d) => d.count), 0);

    if (max === 0) return <div className={styles.empty}>لا توجد طلبات في آخر 14 يومًا.</div>;

    return (
        <div
            className={styles.chart}
            role="img"
            aria-label={`طلبات فيكتور في آخر 14 يومًا: ${daily.map((d) => `${d.label}: ${d.count}`).join('، ')}`}
        >
            <div className={styles.plot} onMouseLeave={() => setHovered(null)}>
                <div className={styles.gridLine} style={{ top: 0 }}>
                    <span className={styles.gridLabel}>{max}</span>
                </div>
                {daily.map((day, i) => (
                    <div key={day.key} className={styles.barSlot} onMouseEnter={() => setHovered(i)} onClick={() => setHovered(i)}>
                        {hovered === i && (
                            <div className={styles.tooltip}>{day.label} · {day.count} طلب</div>
                        )}
                        <div
                            className={cx(styles.bar, day.isToday && styles.barToday)}
                            style={{ height: `${(day.count / max) * 100}%` }}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.axis}>
                {daily.map((day, i) => (
                    <span key={day.key} className={styles.axisLabel}>
                        {i % 3 === 1 || day.isToday ? day.label : ''}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ===== نظرة عامة ===== */

export function Overview({ students, requests, courses, quizzes, ai, aiEnabled, goTo, busy, onApprove, onReject, onApproveAll }: {
    students: StudentRow[];
    requests: StudentRow[];
    courses: Course[];
    quizzes: Quiz[];
    ai: AiSummary;
    aiEnabled: boolean;
    goTo: (tab: TabId) => void;
    busy: boolean;
    onApprove: (row: StudentRow) => void;
    onReject: (row: StudentRow) => void;
    onApproveAll: () => void;
}) {
    const scrollToRequests = () => document.getElementById('join-requests')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const uniqueCount = new Set(students.map((s) => s.id)).size;
    const approvedCount = students.filter((s) => s.is_approved === true).length;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newThisWeek = new Set(
        students.filter((s) => s.created_at && new Date(s.created_at).getTime() >= weekAgo).map((s) => s.id)
    ).size;

    const brokenQuizzes = quizzes.filter((q) => windowStatus(q) === 'open' && !hasQuizPage(q.course_id, q.quiz_id));
    const liveQuizzes = quizzes.filter((q) => windowStatus(q) === 'open');
    const noCourse = new Set(students.filter((s) => !s.course_id).map((s) => s.id)).size;

    const attention: Array<{ icon: string; text: string; tab: TabId }> = [
        ...(!aiEnabled ? [{ icon: '🔴', text: 'فيكتور متوقف عن كل الطلاب حاليًا', tab: 'ai' as TabId }] : []),
        ...brokenQuizzes.map((q) => ({ icon: '⚠️', text: `${q.title} مفتوح لكن أسئلته غير جاهزة`, tab: 'exams' as TabId })),
        ...(noCourse ? [{ icon: '👤', text: `${noCourse} مستخدم لم يسجل في أي كورس`, tab: 'students' as TabId }] : []),
    ];

    const courseStats = courses.map((course) => {
        const rows = students.filter((s) => s.course_id === course.id);
        return {
            ...course,
            approved: rows.filter((r) => r.is_approved === true).length,
            pending: rows.filter((r) => r.is_approved === false).length,
        };
    });
    const courseMax = Math.max(...courseStats.map((c) => c.approved + c.pending), 1);

    // تاريخ اليوم بتوقيت الجهاز، وليس UTC، حتى لا تظهر اختبارات أمس بعد منتصف الليل
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const examCounts = students.reduce<Record<string, number>>((acc, s) => {
        if (s.exam_date && s.exam_date.slice(0, 10) >= todayKey) {
            const key = s.exam_date.slice(0, 10);
            acc[key] = (acc[key] ?? 0) + 1;
        }
        return acc;
    }, {});
    const upcomingExams = Object.entries(examCounts).sort(([a], [b]) => a.localeCompare(b)).slice(0, 4);

    return (
        <>
            <div className={styles.kpis}>
                <Kpi label="الطلاب" value={uniqueCount} hint={`+${newThisWeek} هذا الأسبوع`} onClick={() => goTo('students')} />
                <Kpi
                    label="طلبات الانضمام"
                    value={requests.length}
                    hint={requests.length ? 'تحتاج مراجعتك' : 'لا يوجد شي معلق'}
                    alert={requests.length > 0}
                    onClick={scrollToRequests}
                />
                <Kpi label="تسجيلات معتمدة" value={approvedCount} hint={`في ${courses.length} كورسات`} onClick={() => goTo('courses')} />
                <Kpi label="طلبات فيكتور اليوم" value={ai.today} hint={`${ai.month} هذا الشهر`} onClick={() => goTo('ai')} />
                <Kpi label="تكلفة الشهر" value={formatMoney(ai.monthCost)} hint={`المتوقع ${formatMoney(ai.projectedCost)}`} onClick={() => goTo('ai')} />
            </div>

            <section id="join-requests" className={cx(styles.card, styles.requestsCard)}>
                <div className={styles.sectionHead} style={{ marginBottom: requests.length ? 10 : 0 }}>
                    <div>
                        <h2 className={styles.cardTitle}>طلبات الانضمام</h2>
                        <p className={styles.cardSub} style={{ margin: 0 }}>
                            {requests.length ? `${requests.length} طلب بانتظار موافقتك` : '✨ لا توجد طلبات معلقة حاليًا'}
                        </p>
                    </div>
                    {requests.length > 1 && (
                        <button type="button" className={styles.btn} onClick={onApproveAll} disabled={busy}>✓ موافقة على الكل</button>
                    )}
                </div>
                {requests.length > 0 && (
                    <div className={styles.list}>
                        {requests.map((row) => (
                            <div key={row.user_course_id} className={styles.listItem}>
                                <Who row={row} />
                                <Pill tone="warn">Math {row.course_id}</Pill>
                                <div className={styles.actions}>
                                    <button type="button" className={styles.btn} onClick={() => onApprove(row)} disabled={busy}>✓ موافقة</button>
                                    <button type="button" className={cx(styles.btn, styles.btnDanger)} onClick={() => onReject(row)} disabled={busy}>رفض</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <div className={styles.grid2}>
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>طلبات فيكتور اليومية</h2>
                    <p className={styles.cardSub}>آخر 14 يومًا، واليوم باللون الفاتح</p>
                    <DailyChart daily={ai.daily} />
                </section>

                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>يحتاج انتباهك</h2>
                    <p className={styles.cardSub}>اضغط على أي بند للانتقال إليه</p>
                    <div className={styles.attention}>
                        {attention.length === 0 ? (
                            <div className={cx(styles.attentionItem, styles.attentionOk)}>✓ كل شي تحت السيطرة</div>
                        ) : attention.map((item) => (
                            <button key={item.text} type="button" className={styles.attentionItem} onClick={() => goTo(item.tab)}>
                                <span>{item.icon}</span>
                                <span>{item.text}</span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            <div className={styles.grid2}>
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>الطلاب في كل كورس</h2>
                    <div className={styles.legend} style={{ marginTop: 8 }}>
                        <span><i className={styles.legendDot} />معتمد</span>
                        <span><i className={cx(styles.legendDot, styles.legendDotPending)} />معلق</span>
                    </div>
                    <div className={styles.rows}>
                        {courseStats.map((course) => (
                            <div key={course.id}>
                                <div className={styles.rowHead}>
                                    <span className={styles.rowName}>{course.title} <small>(Math {course.id})</small></span>
                                    <span className={styles.rowValue}>{course.approved} معتمد · {course.pending} معلق</span>
                                </div>
                                <div className={styles.track} style={{ background: 'transparent' }}>
                                    {course.approved > 0 && <span className={styles.fill} style={{ width: `${(course.approved / courseMax) * 100}%`, borderRadius: 4 }} />}
                                    {course.pending > 0 && <span className={cx(styles.fill, styles.fillPending)} style={{ width: `${(course.pending / courseMax) * 100}%`, borderRadius: 4 }} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>الاختبارات والمواعيد</h2>
                    <p className={styles.cardSub}>{liveQuizzes.length} من {quizzes.length} اختبارات مفتوحة الآن</p>
                    {upcomingExams.length === 0 ? (
                        <div className={styles.empty} style={{ padding: 12 }}>لا توجد مواعيد اختبارات قادمة سجلها الطلاب.</div>
                    ) : (
                        <div className={styles.rows}>
                            {upcomingExams.map(([date, count]) => (
                                <div key={date} className={styles.rowHead} style={{ margin: 0 }}>
                                    <span>{formatDate(date)}</span>
                                    <span className={styles.rowValue}>{count} طالب</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

function Who({ row }: { row: StudentRow }) {
    const name = row.full_name?.trim() || 'بدون اسم';
    return (
        <div className={styles.who}>
            <span className={styles.avatar} aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
            <div style={{ minWidth: 0 }}>
                <div className={styles.whoName}>{name}</div>
                <div className={styles.whoEmail}>{row.email || 'لا يوجد إيميل'}</div>
            </div>
        </div>
    );
}

/* ===== الطلاب ===== */

const PAGE_SIZE = 25;

function exportStudentsCsv(rows: StudentRow[]) {
    // العلامة في البداية تحمي من تنفيذ الخلية كمعادلة عند فتح الملف في Excel
    const safe = (value: unknown) => {
        const text = String(value ?? '');
        const guarded = /^[=+\-@]/.test(text) ? `'${text}` : text;
        return `"${guarded.replace(/"/g, '""')}"`;
    };
    const header = ['الاسم', 'الإيميل', 'الكورس', 'الحالة', 'فيكتور', 'موعد الاختبار', 'تاريخ التسجيل'];
    const lines = rows.map((r) => [
        r.full_name,
        r.email,
        r.course_id ? `Math ${r.course_id}` : '',
        !r.course_id ? 'غير مسجل' : r.is_approved ? 'معتمد' : 'معلق',
        r.is_ai_allowed === false ? 'معطل' : 'مفعل',
        r.exam_date,
        r.created_at?.slice(0, 10),
    ].map(safe).join(','));

    const blob = new Blob(['﻿' + [header.map(safe).join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `students-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

export function Students({ students, courses, usage, busy, onToggleAi, onApprove, onCancelApproval, onRemove }: {
    students: StudentRow[];
    courses: Course[];
    usage: Record<string, number>;
    busy: boolean;
    onToggleAi: (row: StudentRow) => void;
    onApprove: (row: StudentRow) => void;
    onCancelApproval: (row: StudentRow) => void;
    onRemove: (row: StudentRow) => void;
}) {
    const [search, setSearch] = useState('');
    const [course, setCourse] = useState('all');
    const [status, setStatus] = useState('all');
    const [ai, setAi] = useState('all');
    const [visible, setVisible] = useState(PAGE_SIZE);

    useEffect(() => setVisible(PAGE_SIZE), [search, course, status, ai]);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return students
            .filter((s) => {
                const matchesSearch = !term || (s.full_name ?? '').toLowerCase().includes(term) || (s.email ?? '').toLowerCase().includes(term);
                const matchesCourse = course === 'all' || s.course_id === course;
                const rowStatus = !s.course_id ? 'none' : s.is_approved ? 'approved' : 'pending';
                const matchesStatus = status === 'all' || rowStatus === status;
                const matchesAi = ai === 'all' || (ai === 'on' ? s.is_ai_allowed !== false : s.is_ai_allowed === false);
                return matchesSearch && matchesCourse && matchesStatus && matchesAi;
            })
            .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''));
    }, [students, search, course, status, ai]);

    return (
        <section className={styles.card}>
            <div className={styles.toolbar}>
                <input
                    type="search"
                    className={cx(styles.input, styles.search)}
                    placeholder="ابحث بالاسم أو الإيميل..."
                    aria-label="بحث في الطلاب"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className={styles.select} aria-label="الكورس" value={course} onChange={(e) => setCourse(e.target.value)}>
                    <option value="all">كل الكورسات</option>
                    {courses.map((c) => <option key={c.id} value={c.id}>Math {c.id}</option>)}
                </select>
                <select className={styles.select} aria-label="الحالة" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="all">كل الحالات</option>
                    <option value="approved">معتمد</option>
                    <option value="pending">معلق</option>
                    <option value="none">غير مسجل</option>
                </select>
                <select className={styles.select} aria-label="فيكتور" value={ai} onChange={(e) => setAi(e.target.value)}>
                    <option value="all">فيكتور: الكل</option>
                    <option value="on">مفعل</option>
                    <option value="off">معطل</option>
                </select>
                <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => exportStudentsCsv(filtered)} disabled={filtered.length === 0}>
                    ⬇ تصدير CSV
                </button>
            </div>
            <p className={styles.cardSub}>{filtered.length} نتيجة</p>

            {filtered.length === 0 ? (
                <div className={styles.empty}>لا يوجد طلاب مطابقون للبحث.</div>
            ) : (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>الطالب</th>
                                <th>الكورس</th>
                                <th>فيكتور</th>
                                <th>موعد الاختبار</th>
                                <th>التسجيل</th>
                                <th>الإدارة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.slice(0, visible).map((row) => (
                                <tr key={`${row.id}-${row.course_id ?? 'none'}`}>
                                    <td data-label=""><Who row={row} /></td>
                                    <td data-label="الكورس">
                                        {row.course_id ? (
                                            <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                                                <b>Math {row.course_id}</b>
                                                <Pill tone={row.is_approved ? 'good' : 'warn'}>{row.is_approved ? 'معتمد' : 'معلق'}</Pill>
                                            </span>
                                        ) : <Pill tone="muted">غير مسجل</Pill>}
                                    </td>
                                    <td data-label="فيكتور">
                                        {row.user_course_id ? (
                                            <div className={styles.aiCell}>
                                                <Switch
                                                    on={row.is_ai_allowed !== false}
                                                    label={`فيكتور للطالب ${row.full_name ?? ''}`}
                                                    onChange={() => onToggleAi(row)}
                                                    disabled={busy}
                                                />
                                                <span>{usage[row.id] ?? 0} طلب</span>
                                            </div>
                                        ) : '—'}
                                    </td>
                                    <td data-label="موعد الاختبار">{formatDate(row.exam_date)}</td>
                                    <td data-label="التسجيل">{formatDate(row.created_at)}</td>
                                    <td data-label="">
                                        {row.user_course_id && (
                                            <div className={styles.actions}>
                                                {row.is_approved ? (
                                                    <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => onCancelApproval(row)} disabled={busy}>إلغاء الاعتماد</button>
                                                ) : (
                                                    <button type="button" className={styles.btn} onClick={() => onApprove(row)} disabled={busy}>✓ اعتماد</button>
                                                )}
                                                <button type="button" className={cx(styles.btn, styles.btnDanger)} onClick={() => onRemove(row)} disabled={busy}>حذف</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filtered.length > visible && (
                <div className={styles.tableFoot}>
                    <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                        عرض المزيد ({filtered.length - visible})
                    </button>
                </div>
            )}
        </section>
    );
}

/* ===== الذكاء الاصطناعي ===== */

export function AiPanel({ ai, enabled, busy, onToggle }: { ai: AiSummary; enabled: boolean; busy: boolean; onToggle: () => void }) {
    const topMax = Math.max(...ai.users.map((u) => u.count), 1);
    return (
        <>
            <div className={cx(styles.switchCard, !enabled && styles.switchCardOff)}>
                <div>
                    <div className={styles.switchTitle}>{enabled ? '🤖 فيكتور يعمل' : '⏸ فيكتور متوقف'}</div>
                    <div className={styles.switchHint}>
                        {enabled ? 'الطلاب المسموح لهم يقدرون يستخدمونه الآن' : 'الخادم يرفض كل الرسائل حتى تعيد تشغيله'}
                    </div>
                </div>
                <Switch on={enabled} label="تشغيل فيكتور لكل المنصة" disabled={busy} onChange={onToggle} />
            </div>

            <div className={styles.kpis}>
                <Kpi label="طلبات اليوم" value={ai.today} />
                <Kpi label="طلبات الشهر" value={ai.month} />
                <Kpi label="تكلفة الشهر" value={formatMoney(ai.monthCost)} hint={`المتوقع ${formatMoney(ai.projectedCost)} بهذا المعدل`} />
                <Kpi label="متوسط تكلفة الطلب" value={formatMoney(ai.avgCost)} />
            </div>

            <div className={styles.grid2}>
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>الطلبات اليومية</h2>
                    <p className={styles.cardSub}>آخر 14 يومًا، واليوم باللون الفاتح</p>
                    <DailyChart daily={ai.daily} />
                </section>

                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>الأكثر استخدامًا هذا الشهر</h2>
                    <p className={styles.cardSub}>الحد لكل طالب 40 رسالة في الساعة</p>
                    {ai.users.length === 0 ? (
                        <div className={styles.empty}>لا توجد سجلات هذا الشهر.</div>
                    ) : (
                        <div className={styles.rows}>
                            {ai.users.slice(0, 6).map((user) => (
                                <div key={user.id}>
                                    <div className={styles.rowHead}>
                                        <span className={styles.rowName}>{user.name}</span>
                                        <span className={styles.rowValue}>{user.count} طلب · {formatMoney(user.cost)}</span>
                                    </div>
                                    <div className={styles.track}>
                                        <span className={styles.fill} style={{ width: `${(user.count / topMax) * 100}%`, borderRadius: 999 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>إعدادات النموذج</h2>
                <div className={styles.setting} style={{ borderTop: 0 }}>
                    <span>النموذج المستخدم</span>
                    <Pill tone="muted">gpt-4o-mini</Pill>
                </div>
                <div className={styles.setting}>
                    <span>التجربة المجانية<span className={styles.settingHint}>غير المسجلين يستخدمون فيكتور في Math 101</span></span>
                    <Pill tone="good">مفعلة</Pill>
                </div>
            </section>
        </>
    );
}

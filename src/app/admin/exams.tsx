'use client';

import { useState } from 'react';
import { hasQuizPage, windowStatus, type CourseModule, type WindowStatus } from '@/lib/courseAccess';
import styles from './admin.module.css';
import { Pill, Switch, cx, type Course, type Quiz } from './sections';

const toLocalInput = (iso: string | null) => {
    if (!iso) return '';
    const date = new Date(iso);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const STATUS_VIEW: Record<WindowStatus, { label: string; tone: 'good' | 'warn' | 'muted' }> = {
    open: { label: 'مفتوح الآن', tone: 'good' },
    scheduled: { label: 'مجدول', tone: 'warn' },
    expired: { label: 'انتهى وقته', tone: 'muted' },
    closed: { label: 'مغلق', tone: 'muted' },
};

/** موعد الفتح والإغلاق، ويعمل مع الموديولات والاختبارات */
function ScheduleEditor({ item, busy, onSave }: {
    item: { opens_at: string | null; closes_at: string | null };
    busy: boolean;
    onSave: (opensAt: string | null, closesAt: string | null) => void;
}) {
    const [opensAt, setOpensAt] = useState(toLocalInput(item.opens_at));
    const [closesAt, setClosesAt] = useState(toLocalInput(item.closes_at));
    const changed = opensAt !== toLocalInput(item.opens_at) || closesAt !== toLocalInput(item.closes_at);
    const invalid = Boolean(opensAt && closesAt && new Date(opensAt) >= new Date(closesAt));

    return (
        <>
            <div className={styles.schedule}>
                <label className={styles.field}>
                    يفتح في
                    <input type="datetime-local" className={styles.input} value={opensAt} onChange={(e) => setOpensAt(e.target.value)} />
                </label>
                <label className={styles.field}>
                    يغلق في
                    <input type="datetime-local" className={styles.input} value={closesAt} onChange={(e) => setClosesAt(e.target.value)} />
                </label>
                <button
                    type="button"
                    className={cx(styles.btn, styles.btnGhost)}
                    disabled={!changed || invalid || busy}
                    onClick={() => onSave(opensAt ? new Date(opensAt).toISOString() : null, closesAt ? new Date(closesAt).toISOString() : null)}
                >
                    حفظ الموعد
                </button>
            </div>
            {invalid && <div className={styles.note}>وقت الإغلاق لازم يكون بعد وقت الفتح.</div>}
        </>
    );
}

export interface ModuleForm {
    module_number: number;
    title: string;
    description: string;
    chapters: string[];
}

function ModuleEditor({ initial, takenNumbers, busy, onSave, onCancel }: {
    initial: ModuleForm;
    takenNumbers: number[];
    busy: boolean;
    onSave: (form: ModuleForm) => void;
    onCancel: () => void;
}) {
    const [number, setNumber] = useState(String(initial.module_number));
    const [title, setTitle] = useState(initial.title);
    const [description, setDescription] = useState(initial.description);
    const [chapters, setChapters] = useState(initial.chapters.join('، '));

    const parsedNumber = Number(number);
    const numberTaken = takenNumbers.includes(parsedNumber);
    const isValid = Number.isInteger(parsedNumber) && parsedNumber > 0 && !numberTaken && title.trim().length > 0;

    return (
        <form
            className={styles.form}
            onSubmit={(e) => {
                e.preventDefault();
                if (!isValid) return;
                onSave({
                    module_number: parsedNumber,
                    title: title.trim(),
                    description: description.trim(),
                    chapters: chapters.split(/[,،]/).map((c) => c.trim()).filter(Boolean),
                });
            }}
        >
            <div className={styles.formGrid}>
                <label className={styles.field} style={{ flex: '0 1 90px' }}>
                    الرقم
                    <input type="number" min={1} className={styles.input} value={number} onChange={(e) => setNumber(e.target.value)} required />
                </label>
                <label className={styles.field} style={{ flex: '1 1 240px' }}>
                    اسم الموديول
                    <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Module 1 - Limits" required />
                </label>
            </div>
            <label className={styles.field}>
                الوصف
                <textarea className={styles.input} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <label className={styles.field}>
                الشباتر (افصل بينها بفاصلة)
                <input className={styles.input} dir="ltr" value={chapters} onChange={(e) => setChapters(e.target.value)} placeholder="1.5, 1.6, 2.1" />
            </label>
            {numberTaken && <div className={styles.note}>هذا الرقم مستخدم لموديول آخر في الكورس.</div>}
            <div className={styles.formActions}>
                <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={onCancel}>إلغاء</button>
                <button type="submit" className={styles.btn} disabled={!isValid || busy}>حفظ</button>
            </div>
        </form>
    );
}

function ModuleCard({ mod, takenNumbers, busy, actions }: {
    mod: CourseModule;
    takenNumbers: number[];
    busy: boolean;
    actions: ExamsActions;
}) {
    const [editing, setEditing] = useState(false);
    const status = STATUS_VIEW[windowStatus(mod)];

    return (
        <section className={styles.card}>
            <div className={styles.quizHead}>
                <div style={{ minWidth: 0 }}>
                    <span className={styles.quizId}>Module {mod.module_number}</span>
                    <h3 className={styles.quizName} dir="auto">{mod.title}</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <Pill tone={status.tone}>{status.label}</Pill>
                    <Switch on={mod.is_open} label={`فتح ${mod.title}`} disabled={busy} onChange={() => actions.toggleModule(mod)} />
                </div>
            </div>

            {editing ? (
                <ModuleEditor
                    initial={mod}
                    takenNumbers={takenNumbers.filter((n) => n !== mod.module_number)}
                    busy={busy}
                    onCancel={() => setEditing(false)}
                    onSave={(form) => {
                        actions.saveModule(form, mod);
                        setEditing(false);
                    }}
                />
            ) : (
                <>
                    {mod.description && <p className={styles.courseDesc} style={{ marginBottom: 6 }}>{mod.description}</p>}
                    {mod.chapters.length > 0 && <p className={styles.quizId} style={{ margin: 0 }}>{mod.chapters.join(' · ')}</p>}

                    <div className={styles.setting} style={{ marginTop: 8 }}>
                        <span>مجاني<span className={styles.settingHint}>يفتحه الطالب بدون اعتماد</span></span>
                        <Switch on={mod.is_free} label="موديول مجاني" disabled={busy} onChange={() => actions.toggleModuleFree(mod)} />
                    </div>

                    <ScheduleEditor
                        key={`${mod.opens_at}-${mod.closes_at}`}
                        item={mod}
                        busy={busy}
                        onSave={(opensAt, closesAt) => actions.scheduleModule(mod, opensAt, closesAt)}
                    />

                    <div className={styles.formActions}>
                        <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => setEditing(true)}>تعديل</button>
                        <button type="button" className={cx(styles.btn, styles.btnDanger)} disabled={busy} onClick={() => actions.deleteModule(mod)}>حذف</button>
                    </div>
                </>
            )}
        </section>
    );
}

function QuizCard({ quiz, busy, actions }: { quiz: Quiz; busy: boolean; actions: ExamsActions }) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(quiz.title);
    const status = STATUS_VIEW[windowStatus(quiz)];

    return (
        <section className={styles.card}>
            <div className={styles.quizHead}>
                <div style={{ minWidth: 0 }}>
                    <span className={styles.quizId}>{quiz.quiz_id}</span>
                    <h3 className={styles.quizName} dir="auto">{quiz.title}</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <Pill tone={status.tone}>{status.label}</Pill>
                    <Switch on={quiz.is_open} label={`فتح ${quiz.title}`} disabled={busy} onChange={() => actions.toggleQuiz(quiz)} />
                </div>
            </div>

            <ScheduleEditor
                key={`${quiz.opens_at}-${quiz.closes_at}`}
                item={quiz}
                busy={busy}
                onSave={(opensAt, closesAt) => actions.scheduleQuiz(quiz, opensAt, closesAt)}
            />

            {!hasQuizPage(quiz.course_id, quiz.quiz_id) && (
                <div className={styles.note}>أسئلة هذا الاختبار غير جاهزة بعد، فسيرى الطالب رسالة "قيد التجهيز".</div>
            )}

            {editing ? (
                <div className={styles.schedule}>
                    <label className={styles.field}>
                        اسم الاختبار
                        <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
                    </label>
                    <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => { setEditing(false); setTitle(quiz.title); }}>إلغاء</button>
                    <button
                        type="button"
                        className={styles.btn}
                        disabled={!title.trim() || busy}
                        onClick={() => { actions.renameQuiz(quiz, title.trim()); setEditing(false); }}
                    >
                        حفظ
                    </button>
                </div>
            ) : (
                <div className={styles.formActions}>
                    <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => setEditing(true)}>تعديل الاسم</button>
                    <button type="button" className={cx(styles.btn, styles.btnDanger)} disabled={busy} onClick={() => actions.deleteQuiz(quiz)}>حذف</button>
                </div>
            )}
        </section>
    );
}

function AddQuiz({ courseId, quizzes, busy, onAdd, onCancel }: {
    courseId: string;
    quizzes: Quiz[];
    busy: boolean;
    onAdd: (quiz: { course_id: string; quiz_id: string; title: string }) => void;
    onCancel: () => void;
}) {
    const nextQuiz = Array.from({ length: 50 }, (_, i) => `quiz-${i + 1}`).find((id) => !quizzes.some((q) => q.quiz_id === id)) ?? 'quiz-new';
    const hasMid = quizzes.some((q) => q.quiz_id === 'midterm');
    const hasFinal = quizzes.some((q) => q.quiz_id === 'final-review');

    const [type, setType] = useState(nextQuiz);
    const defaultTitle = (id: string) => {
        const name = id === 'midterm' ? 'Midterm' : id === 'final-review' ? 'Final Review' : `Quiz ${id.split('-')[1]}`;
        return `${name} - Math ${courseId}`;
    };
    const [title, setTitle] = useState(defaultTitle(nextQuiz));

    return (
        <form
            className={styles.form}
            onSubmit={(e) => {
                e.preventDefault();
                if (title.trim()) onAdd({ course_id: courseId, quiz_id: type, title: title.trim() });
            }}
        >
            <div className={styles.formGrid}>
                <label className={styles.field} style={{ flex: '0 1 180px' }}>
                    النوع
                    <select
                        className={styles.select}
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                            setTitle(defaultTitle(e.target.value));
                        }}
                    >
                        <option value={nextQuiz}>كويز</option>
                        {!hasMid && <option value="midterm">ميد</option>}
                        {!hasFinal && <option value="final-review">مراجعة فاينل</option>}
                    </select>
                </label>
                <label className={styles.field} style={{ flex: '1 1 220px' }}>
                    الاسم
                    <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label>
            </div>
            <div className={styles.formActions}>
                <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={onCancel}>إلغاء</button>
                <button type="submit" className={styles.btn} disabled={busy}>إضافة</button>
            </div>
        </form>
    );
}

export interface ExamsActions {
    toggleModule: (mod: CourseModule) => void;
    toggleModuleFree: (mod: CourseModule) => void;
    scheduleModule: (mod: CourseModule, opensAt: string | null, closesAt: string | null) => void;
    saveModule: (form: ModuleForm, existing?: CourseModule) => void;
    deleteModule: (mod: CourseModule) => void;
    toggleQuiz: (quiz: Quiz) => void;
    scheduleQuiz: (quiz: Quiz, opensAt: string | null, closesAt: string | null) => void;
    renameQuiz: (quiz: Quiz, title: string) => void;
    addQuiz: (quiz: { course_id: string; quiz_id: string; title: string }) => void;
    deleteQuiz: (quiz: Quiz) => void;
}

export function ExamsAndModules({ courses, courseId, setCourseId, modules, quizzes, modulesReady, busy, actions }: {
    courses: Course[];
    courseId: string;
    setCourseId: (id: string) => void;
    modules: CourseModule[];
    quizzes: Quiz[];
    modulesReady: boolean;
    busy: boolean;
    actions: ExamsActions;
}) {
    const [addingModule, setAddingModule] = useState(false);
    const [addingQuiz, setAddingQuiz] = useState(false);

    const courseModules = modules.filter((m) => m.course_id === courseId).sort((a, b) => a.module_number - b.module_number);
    const courseQuizzes = quizzes
        .filter((q) => q.course_id === courseId)
        .sort((a, b) => a.quiz_id.localeCompare(b.quiz_id, undefined, { numeric: true }));
    const takenNumbers = courseModules.map((m) => m.module_number);
    const nextNumber = Math.max(0, ...takenNumbers) + 1;

    return (
        <>
            <div className={styles.segments} role="tablist" aria-label="اختر الكورس">
                {courses.map((course) => (
                    <button
                        key={course.id}
                        type="button"
                        role="tab"
                        aria-selected={courseId === course.id}
                        className={cx(styles.segment, courseId === course.id && styles.segmentActive)}
                        onClick={() => {
                            setCourseId(course.id);
                            setAddingModule(false);
                            setAddingQuiz(false);
                        }}
                    >
                        <strong>Math {course.id}</strong>
                        <span>{course.title}</span>
                    </button>
                ))}
            </div>

            <div className={styles.sectionHead}>
                <h2 className={styles.cardTitle}>الموديولات ({courseModules.length})</h2>
                <button type="button" className={styles.btn} disabled={!modulesReady} onClick={() => setAddingModule((v) => !v)}>
                    ＋ موديول
                </button>
            </div>

            {!modulesReady ? (
                <div className={styles.note} style={{ marginBottom: 14 }}>
                    إدارة الموديولات تعمل بعد تشغيل ملف SQL في Supabase.
                </div>
            ) : (
                <div className={styles.courseGrid} style={{ marginBottom: 18, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))' }}>
                    {addingModule && (
                        <section className={styles.card}>
                            <h3 className={styles.quizName} style={{ marginBottom: 8 }}>موديول جديد</h3>
                            <ModuleEditor
                                initial={{ module_number: nextNumber, title: `Module ${nextNumber} - `, description: '', chapters: [] }}
                                takenNumbers={takenNumbers}
                                busy={busy}
                                onCancel={() => setAddingModule(false)}
                                onSave={(form) => {
                                    actions.saveModule(form);
                                    setAddingModule(false);
                                }}
                            />
                        </section>
                    )}
                    {courseModules.map((mod) => (
                        <ModuleCard key={mod.id} mod={mod} takenNumbers={takenNumbers} busy={busy} actions={actions} />
                    ))}
                    {courseModules.length === 0 && !addingModule && (
                        <div className={styles.card}><div className={styles.empty}>لا توجد موديولات في هذا الكورس بعد.</div></div>
                    )}
                </div>
            )}

            <div className={styles.sectionHead}>
                <h2 className={styles.cardTitle}>الاختبارات ({courseQuizzes.length})</h2>
                <button type="button" className={styles.btn} onClick={() => setAddingQuiz((v) => !v)}>＋ اختبار</button>
            </div>

            <div className={styles.courseGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))' }}>
                {addingQuiz && (
                    <section className={styles.card}>
                        <h3 className={styles.quizName} style={{ marginBottom: 8 }}>اختبار جديد</h3>
                        <AddQuiz
                            courseId={courseId}
                            quizzes={courseQuizzes}
                            busy={busy}
                            onCancel={() => setAddingQuiz(false)}
                            onAdd={(quiz) => {
                                actions.addQuiz(quiz);
                                setAddingQuiz(false);
                            }}
                        />
                    </section>
                )}
                {courseQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} busy={busy} actions={actions} />
                ))}
                {courseQuizzes.length === 0 && !addingQuiz && (
                    <div className={styles.card}><div className={styles.empty}>لا توجد اختبارات في هذا الكورس بعد.</div></div>
                )}
            </div>
        </>
    );
}

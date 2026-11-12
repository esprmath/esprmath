'use client';

import { useState } from 'react';
import styles from './admin.module.css';
import { Pill, Switch, cx, type Course, type StudentRow } from './sections';

export interface CourseForm {
    id: string;
    title: string;
    description: string;
    requires_approval: boolean;
}

function CourseEditor({ initial, takenIds, isNew, busy, onSave, onCancel }: {
    initial: CourseForm;
    takenIds: string[];
    isNew: boolean;
    busy: boolean;
    onSave: (form: CourseForm) => void;
    onCancel: () => void;
}) {
    const [id, setId] = useState(initial.id);
    const [title, setTitle] = useState(initial.title);
    const [description, setDescription] = useState(initial.description);
    const [requiresApproval, setRequiresApproval] = useState(initial.requires_approval);

    const cleanId = id.trim();
    const idInvalid = isNew && !/^[A-Za-z0-9-]{1,20}$/.test(cleanId);
    const idTaken = isNew && takenIds.includes(cleanId);

    return (
        <form
            className={styles.form}
            onSubmit={(e) => {
                e.preventDefault();
                if (idInvalid || idTaken || !title.trim()) return;
                onSave({ id: cleanId, title: title.trim(), description: description.trim(), requires_approval: requiresApproval });
            }}
        >
            <div className={styles.formGrid}>
                <label className={styles.field} style={{ flex: '0 1 130px' }}>
                    رقم الكورس
                    <input className={styles.input} dir="ltr" value={id} disabled={!isNew} onChange={(e) => setId(e.target.value)} placeholder="150" required />
                </label>
                <label className={styles.field} style={{ flex: '1 1 220px' }}>
                    اسم الكورس
                    <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label>
            </div>
            <label className={styles.field}>
                الوصف
                <textarea className={styles.input} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <div className={styles.setting}>
                <span>يتطلب موافقة<span className={styles.settingHint}>إذا أُغلق يدخل الطالب مباشرة بدون طلب</span></span>
                <Switch on={requiresApproval} label="يتطلب موافقة" onChange={() => setRequiresApproval((v) => !v)} />
            </div>
            {isNew && idInvalid && cleanId && <div className={styles.note}>استخدم أرقامًا وحروفًا إنجليزية فقط.</div>}
            {idTaken && <div className={styles.note}>هذا الرقم مستخدم لكورس آخر.</div>}
            <div className={styles.formActions}>
                <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={onCancel}>إلغاء</button>
                <button type="submit" className={styles.btn} disabled={busy || idInvalid || idTaken}>
                    {isNew ? 'إنشاء الكورس' : 'حفظ'}
                </button>
            </div>
        </form>
    );
}

export function Courses({ courses, students, moduleCounts, busy, onToggle, onCreate, onSave, onDelete, onManage }: {
    courses: Course[];
    students: StudentRow[];
    moduleCounts: Record<string, number>;
    busy: boolean;
    onToggle: (course: Course, field: 'is_active' | 'requires_approval', value: boolean) => void;
    onCreate: (form: CourseForm) => void;
    onSave: (form: CourseForm) => void;
    onDelete: (course: Course, enrolled: number) => void;
    onManage: (courseId: string) => void;
}) {
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    return (
        <>
            <div className={styles.sectionHead}>
                <p className={styles.cardSub} style={{ margin: 0 }}>{courses.length} كورسات</p>
                <button type="button" className={styles.btn} onClick={() => setAdding((v) => !v)}>＋ كورس جديد</button>
            </div>

            <div className={styles.courseGrid}>
                {adding && (
                    <section className={styles.card}>
                        <h2 className={styles.quizName} style={{ marginBottom: 8 }}>كورس جديد</h2>
                        <CourseEditor
                            isNew
                            initial={{ id: '', title: '', description: '', requires_approval: true }}
                            takenIds={courses.map((c) => c.id)}
                            busy={busy}
                            onCancel={() => setAdding(false)}
                            onSave={(form) => {
                                onCreate(form);
                                setAdding(false);
                            }}
                        />
                    </section>
                )}

                {courses.map((course) => {
                    const rows = students.filter((s) => s.course_id === course.id);
                    return (
                        <section key={course.id} className={styles.card}>
                            {editingId === course.id ? (
                                <CourseEditor
                                    isNew={false}
                                    initial={course}
                                    takenIds={[]}
                                    busy={busy}
                                    onCancel={() => setEditingId(null)}
                                    onSave={(form) => {
                                        onSave(form);
                                        setEditingId(null);
                                    }}
                                />
                            ) : (
                                <>
                                    <Pill tone={course.is_active ? 'good' : 'muted'}>{course.is_active ? 'ظاهر للطلاب' : 'مخفي عن الطلاب'}</Pill>
                                    <h2 className={styles.courseTitle}>{course.title} <small>(Math {course.id})</small></h2>
                                    <p className={styles.courseDesc}>{course.description}</p>
                                    <div className={styles.stats}>
                                        <div><strong>{rows.filter((r) => r.is_approved === true).length}</strong>معتمد</div>
                                        <div><strong>{rows.filter((r) => r.is_approved === false).length}</strong>معلق</div>
                                        <div><strong>{moduleCounts[course.id] ?? 0}</strong>Module</div>
                                    </div>
                                    <div className={styles.setting}>
                                        <span>إظهار الكورس<span className={styles.settingHint}>يظهر في الصفحة الرئيسية للطلاب</span></span>
                                        <Switch on={course.is_active} label="إظهار الكورس" disabled={busy} onChange={() => onToggle(course, 'is_active', !course.is_active)} />
                                    </div>
                                    <div className={styles.setting}>
                                        <span>يتطلب موافقة<span className={styles.settingHint}>إذا أُغلق يدخل الطالب مباشرة بدون طلب</span></span>
                                        <Switch on={course.requires_approval} label="يتطلب موافقة" disabled={busy} onChange={() => onToggle(course, 'requires_approval', !course.requires_approval)} />
                                    </div>
                                    <div className={styles.formActions}>
                                        <button type="button" className={styles.btn} onClick={() => onManage(course.id)}>الـ Modules والاختبارات</button>
                                        <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => setEditingId(course.id)}>تعديل</button>
                                        <button type="button" className={cx(styles.btn, styles.btnDanger)} disabled={busy} onClick={() => onDelete(course, rows.length)}>حذف</button>
                                    </div>
                                </>
                            )}
                        </section>
                    );
                })}
            </div>
        </>
    );
}

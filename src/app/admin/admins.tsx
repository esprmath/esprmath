'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminErrorText, clearAdminCache, type AdminEntry } from '@/lib/admin';
import styles from './admin.module.css';
import { Pill } from './sections';

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('ar-SA-u-nu-latn', { day: 'numeric', month: 'short', year: 'numeric' });

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** إدارة المشرفين: عرض القائمة، والإضافة بالإيميل، والإزالة */
export function Admins({ notify, askConfirm }: {
    notify: (text: string, error?: boolean) => void;
    askConfirm: (c: { title: string; text: string; label: string; danger?: boolean; run: () => void }) => void;
}) {
    const [admins, setAdmins] = useState<AdminEntry[]>([]);
    const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading');
    const [email, setEmail] = useState('');
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        const { data, error } = await supabase.rpc('admin_list');
        if (error) {
            console.error('[admins]', error.message);
            setState('missing');
            return;
        }
        setAdmins((data ?? []) as AdminEntry[]);
        setState('ready');
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const run = async (fn: 'admin_add' | 'admin_remove', target: string, successText: string) => {
        setBusy(true);
        const { error } = await supabase.rpc(fn, { p_email: target });
        if (error) {
            notify(adminErrorText(error.message), true);
        } else {
            notify(successText);
            clearAdminCache();
            if (fn === 'admin_add') setEmail('');
        }
        await load();
        setBusy(false);
    };

    const add = (e: React.FormEvent) => {
        e.preventDefault();
        const target = email.trim().toLowerCase();
        if (!EMAIL_PATTERN.test(target)) {
            notify('اكتب إيميل صحيح.', true);
            return;
        }
        if (admins.some((a) => a.email.toLowerCase() === target)) {
            notify('هذا الإيميل مشرف من قبل.', true);
            return;
        }
        askConfirm({
            title: 'إضافة مشرف؟',
            text: `${target} سيقدر يدخل لوحة التحكم ويعدّل الكورسات والطلاب، ويضيف ويزيل مشرفين.`,
            label: 'إضافة مشرف',
            run: () => run('admin_add', target, `صار ${target} مشرفًا ✓`),
        });
    };

    const remove = (admin: AdminEntry) => askConfirm({
        title: 'إزالة المشرف؟',
        text: `${admin.email} لن يقدر يدخل لوحة التحكم بعد الآن. حسابه وتسجيلاته تبقى كما هي.`,
        label: 'إزالة',
        danger: true,
        run: () => run('admin_remove', admin.email, `تمت إزالة ${admin.email} من المشرفين`),
    });

    if (state === 'loading') {
        return <div className={styles.card}><div className={styles.empty}>جاري جلب المشرفين... ⏳</div></div>;
    }

    if (state === 'missing') {
        return (
            <div className={styles.note}>
                إدارة المشرفين تحتاج تشغيل ملف <code dir="ltr">supabase/migrations/20261106_manage_admins.sql</code> في
                Supabase › SQL Editor مرة واحدة، ثم اضغط تحديث.
            </div>
        );
    }

    return (
        <>
            <section className={styles.card}>
                <h2 className={styles.cardTitle}>إضافة مشرف</h2>
                <p className={styles.cardSub}>اكتب إيميل حساب مسجل في المنصة. إذا ما عنده حساب، خلّه يسجل أولًا.</p>
                <form onSubmit={add} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <input
                        className={styles.input}
                        type="email"
                        dir="ltr"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ flex: '1 1 240px' }}
                        required
                    />
                    <button type="submit" className={styles.btn} disabled={busy || !email.trim()}>＋ إضافة</button>
                </form>
            </section>

            <section className={styles.card} style={{ marginTop: 16 }}>
                <h2 className={styles.cardTitle}>المشرفون الحاليون</h2>
                <p className={styles.cardSub}>{admins.length} مشرف</p>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>الإيميل</th>
                                <th>أُضيف في</th>
                                <th aria-label="إجراءات" />
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.email}>
                                    <td dir="ltr" style={{ textAlign: 'right' }}>
                                        {admin.email} {admin.is_me && <Pill tone="good">أنت</Pill>}
                                    </td>
                                    <td>{formatDate(admin.created_at)}</td>
                                    <td>
                                        {admin.is_me ? (
                                            <span className={styles.settingHint}>ما تقدر تزيل نفسك</span>
                                        ) : (
                                            <button
                                                type="button"
                                                className={`${styles.btn} ${styles.btnDanger}`}
                                                disabled={busy}
                                                onClick={() => remove(admin)}
                                            >
                                                إزالة
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}

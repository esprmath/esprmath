'use client';

import { useState } from 'react';

// نفس تصميم تقويم «موعد الاختبار» في الشريط العلوي، مع اختيار الوقت.
// القيمة بصيغة الإدخال المحلي «YYYY-MM-DDTHH:mm» أو نص فارغ.

const MONTHS = [
    'يناير (January)', 'فبراير (February)', 'مارس (March)', 'أبريل (April)',
    'مايو (May)', 'يونيو (June)', 'يوليو (July)', 'أغسطس (August)',
    'سبتمبر (September)', 'أكتوبر (October)', 'نوفمبر (November)', 'ديسمبر (December)',
];
const SHORT_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const WEEK_DAYS = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

const pad = (n: number) => String(n).padStart(2, '0');
const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function parse(value: string) {
    const [date = '', time = ''] = value.split('T');
    // بدون موعد سابق نبدأ من 9 الصبح
    if (!time) return { date, hour24: 9, minute: 0 };
    const [h, m] = time.split(':').map(Number);
    return { date, hour24: h || 0, minute: (m || 0) - ((m || 0) % 5) };
}

export function formatDateTime(value: string) {
    if (!value) return '';
    const { date, hour24, minute } = parse(value);
    const [y, mo, d] = date.split('-').map(Number);
    const hour12 = hour24 % 12 || 12;
    return `${d} ${SHORT_MONTHS[mo - 1]} ${y}، ${hour12}:${pad(minute)} ${hour24 < 12 ? 'ص' : 'م'}`;
}

const selectStyle: React.CSSProperties = {
    padding: '6px 8px',
    border: '1px solid #e6dec5',
    borderRadius: '8px',
    background: '#FFF9E2',
    color: '#2C3531',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    cursor: 'pointer',
};

export default function DateTimePicker({ value, onChange, label }: {
    value: string;
    onChange: (value: string) => void;
    label: string;
}) {
    const [open, setOpen] = useState(false);
    const initial = parse(value);
    const [date, setDate] = useState(initial.date);
    const [hour24, setHour24] = useState(initial.hour24);
    const [minute, setMinute] = useState(initial.minute);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = dayKey(today);
    const [view, setView] = useState(() => {
        const base = initial.date ? new Date(`${initial.date}T00:00`) : today;
        return new Date(base.getFullYear(), base.getMonth(), 1);
    });

    function openPicker() {
        const current = parse(value);
        setDate(current.date);
        setHour24(current.hour24);
        setMinute(current.minute);
        const base = current.date ? new Date(`${current.date}T00:00`) : today;
        setView(new Date(base.getFullYear(), base.getMonth(), 1));
        setOpen(true);
    }

    const year = view.getFullYear();
    const month = view.getMonth();
    const days: (string | null)[] = Array(view.getDay()).fill(null);
    for (let d = 1; d <= new Date(year, month + 1, 0).getDate(); d++) days.push(`${year}-${pad(month + 1)}-${pad(d)}`);
    const atCurrentMonth = year === today.getFullYear() && month === today.getMonth();

    const hour12 = hour24 % 12 || 12;
    const isPm = hour24 >= 12;
    const setHour12 = (h: number) => setHour24((h % 12) + (isPm ? 12 : 0));
    const setPm = (pm: boolean) => setHour24((hour24 % 12) + (pm ? 12 : 0));

    function confirm() {
        if (!date) return;
        onChange(`${date}T${pad(hour24)}:${pad(minute)}`);
        setOpen(false);
    }

    return (
        <>
            <button
                type="button"
                onClick={openPicker}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '9px 12px',
                    background: '#ffffff', border: '1px solid #6B5744', borderRadius: '8px',
                    color: value ? '#2C3531' : '#8a8270', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'start',
                }}
            >
                <span aria-hidden="true">📅</span>
                <span>{value ? formatDateTime(value) : 'بدون موعد'}</span>
            </button>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2500, padding: '16px' }}
                >
                    <div
                        role="dialog"
                        aria-label={label}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: '#ffffff', border: '1px solid #6B5744', padding: '20px', borderRadius: '16px', width: '100%', maxWidth: '340px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', color: '#2C3531', textAlign: 'center' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px' }}>📅 {label}</h3>
                            <button type="button" onClick={() => setOpen(false)} aria-label="إغلاق" style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6B5744' }}>✕</button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            <button
                                type="button"
                                aria-label="الشهر السابق"
                                disabled={atCurrentMonth}
                                onClick={() => setView(new Date(year, month - 1, 1))}
                                style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', cursor: atCurrentMonth ? 'not-allowed' : 'pointer', opacity: atCurrentMonth ? 0.4 : 1 }}
                            >
                                ▶
                            </button>
                            <span>{MONTHS[month]} {year}</span>
                            <button
                                type="button"
                                aria-label="الشهر التالي"
                                onClick={() => setView(new Date(year, month + 1, 1))}
                                style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' }}
                            >
                                ◀
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: '#6B5744' }}>
                            {WEEK_DAYS.map((d) => <span key={d}>{d}</span>)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '16px' }}>
                            {days.map((key, idx) => {
                                if (!key) return <div key={idx} />;
                                const isPast = key < todayKey;
                                const isSelected = key === date;
                                const isToday = key === todayKey;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        disabled={isPast}
                                        onClick={() => setDate(key)}
                                        style={{
                                            padding: '8px 0',
                                            backgroundColor: isSelected ? '#8B5E3C' : isToday ? '#FEECD0' : '#f8fafc',
                                            color: isSelected ? '#fff' : isPast ? '#cbd5e1' : '#2C3531',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                            cursor: isPast ? 'not-allowed' : 'pointer',
                                            opacity: isPast ? 0.5 : 1,
                                        }}
                                    >
                                        {Number(key.slice(8))}
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            <span style={{ color: '#6B5744' }}>🕘 الوقت</span>
                            <select aria-label="الساعة" value={hour12} onChange={(e) => setHour12(Number(e.target.value))} style={selectStyle}>
                                {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <span>:</span>
                            <select aria-label="الدقيقة" value={minute} onChange={(e) => setMinute(Number(e.target.value))} style={selectStyle}>
                                {MINUTES.map((m) => <option key={m} value={m}>{pad(m)}</option>)}
                            </select>
                            <select aria-label="صباحًا أو مساءً" value={isPm ? 'pm' : 'am'} onChange={(e) => setPm(e.target.value === 'pm')} style={selectStyle}>
                                <option value="am">ص</option>
                                <option value="pm">م</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                type="button"
                                disabled={!date}
                                onClick={confirm}
                                style={{ flex: 1, padding: '9px', backgroundColor: '#8B5E3C', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: date ? 'pointer' : 'not-allowed', opacity: date ? 1 : 0.5 }}
                            >
                                تم
                            </button>
                            {value && (
                                <button
                                    type="button"
                                    onClick={() => { onChange(''); setOpen(false); }}
                                    style={{ padding: '9px 14px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    بدون موعد
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

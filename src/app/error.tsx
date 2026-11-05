'use client';

import Link from 'next/link';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
    return (
        <main style={{
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
        }}>
            <div style={{ fontSize: 42 }}>⚠️</div>
            <h1 style={{ fontSize: 20, margin: 0 }}>صار خطأ غير متوقع</h1>
            <p style={{ margin: 0, fontWeight: 600 }}>تقدمك محفوظ. جرّب مرة ثانية.</p>
            <button
                type="button"
                onClick={reset}
                style={{ padding: '10px 20px', borderRadius: 8, border: 0, background: '#8c5521', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
            >
                إعادة المحاولة
            </button>
            <Link href="/" style={{ color: '#8c5521' }}>الرجوع للصفحة الرئيسية</Link>
        </main>
    );
}

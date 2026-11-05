'use client';

import Navbar from '@/components/Navbar';

/** إطار صفحات الحساب (الدخول، التسجيل، الاستعادة) بنفس الشكل */
export default function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '60px' }}>
            <Navbar isLoggedIn={false} />
            <div style={{ maxWidth: '440px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e6dec5',
                    borderRadius: '16px',
                    padding: '32px 24px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    textAlign: 'right',
                    color: '#2C3531',
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2C3531', margin: '0 0 8px', textAlign: 'center' }}>{title}</h2>
                    {subtitle && (
                        <p style={{ color: '#4A5550', fontSize: '14px', margin: '0 0 24px', textAlign: 'center', lineHeight: 1.6 }}>{subtitle}</p>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}

export function AuthMessage({ tone, children }: { tone: 'error' | 'success'; children: React.ReactNode }) {
    const colors = tone === 'error'
        ? { background: '#fee2e2', color: '#991b1b' }
        : { background: '#dcfce7', color: '#166534' };
    return (
        <div role={tone === 'error' ? 'alert' : 'status'} style={{ ...colors, padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', lineHeight: 1.6 }}>
            {children}
        </div>
    );
}

export const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#2C3531', marginBottom: '6px' };

export const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e6dec5',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#2C3531',
};

export const fieldStyle: React.CSSProperties = { marginBottom: '16px' };

export function submitStyle(loading: boolean): React.CSSProperties {
    return {
        width: '100%',
        padding: '12px',
        marginTop: '8px',
        backgroundColor: '#DCA27B',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '15px',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        boxShadow: '0 4px 12px rgba(220, 162, 123, 0.3)',
    };
}

export const linkStyle: React.CSSProperties = { color: '#8B5E3C', fontWeight: 'bold', textDecoration: 'none' };

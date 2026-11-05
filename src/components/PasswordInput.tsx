'use client';

import { useState } from 'react';

/** حقل كلمة مرور مع زر إظهار وإخفاء */
export default function PasswordInput({
    value,
    onChange,
    placeholder = '••••••••',
    autoComplete = 'current-password',
    id,
    style,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoComplete?: 'current-password' | 'new-password';
    id?: string;
    style?: React.CSSProperties;
}) {
    const [visible, setVisible] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            <input
                id={id}
                type={visible ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoComplete={autoComplete}
                required
                style={{
                    width: '100%',
                    padding: '10px 14px 10px 44px',
                    borderRadius: '8px',
                    border: '1px solid #e6dec5',
                    backgroundColor: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    color: '#2C3531',
                    direction: 'ltr',
                    textAlign: 'right',
                    ...style,
                }}
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                title={visible ? 'إخفاء' : 'إظهار'}
                style={{
                    position: 'absolute',
                    left: 6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 16,
                    padding: '4px 6px',
                    opacity: visible ? 1 : 0.6,
                }}
            >
                {visible ? '🙈' : '👁'}
            </button>
        </div>
    );
}

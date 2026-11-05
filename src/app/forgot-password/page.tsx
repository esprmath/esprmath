'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { authErrorText } from '@/lib/authErrors'
import AuthCard, { AuthMessage, fieldStyle, inputStyle, labelStyle, linkStyle, submitStyle } from '@/components/AuthCard'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [sentTo, setSentTo] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleResetPassword(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const cleanEmail = email.trim().toLowerCase()
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
            redirectTo: `${window.location.origin}/update-password`,
        })
        setLoading(false)

        if (resetError) {
            setError(authErrorText(resetError))
        } else {
            setSentTo(cleanEmail)
        }
    }

    return (
        <AuthCard title="نسيت كلمة المرور؟" subtitle={sentTo ? undefined : 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.'}>
            {error && <AuthMessage tone="error">{error}</AuthMessage>}

            {sentTo ? (
                <>
                    <AuthMessage tone="success">
                        إذا كان <span dir="ltr">{sentTo}</span> مسجلًا عندنا، بيوصله رابط لتعيين كلمة مرور جديدة.
                    </AuthMessage>
                    <p style={{ fontSize: '13px', color: '#4A5550', textAlign: 'center', lineHeight: 1.7, margin: '0 0 8px' }}>
                        ما وصلك؟ تفقد مجلد Spam، أو{' '}
                        <button type="button" onClick={() => setSentTo('')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', ...linkStyle, fontSize: '13px' }}>
                            أرسل مرة ثانية
                        </button>
                        {' '}بعد دقيقة.
                    </p>
                </>
            ) : (
                <form onSubmit={handleResetPassword}>
                    <div style={{ ...fieldStyle, marginBottom: '20px' }}>
                        <label htmlFor="email" style={labelStyle}>البريد الإلكتروني</label>
                        <input id="email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }} />
                    </div>
                    <button type="submit" disabled={loading} style={submitStyle(loading)}>
                        {loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                    </button>
                </form>
            )}

            <p style={{ margin: '20px 0 0', textAlign: 'center', fontSize: '14px' }}>
                <Link href="/login" style={linkStyle}>العودة لتسجيل الدخول</Link>
            </p>
        </AuthCard>
    )
}

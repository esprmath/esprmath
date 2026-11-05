'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { authErrorText, safeNextPath } from '@/lib/authErrors'
import PasswordInput from '@/components/PasswordInput'
import AuthCard, { AuthMessage, fieldStyle, inputStyle, labelStyle, linkStyle, submitStyle } from '@/components/AuthCard'

/** الصفحة اللي يرجع لها الطالب بعد الدخول، مثل رابط درس فتحه قبل ما يسجل */
const nextPath = () => safeNextPath(new URLSearchParams(window.location.search).get('next'))

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')
    const [unconfirmed, setUnconfirmed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)

    // المسجل دخول يروح مباشرة (ويشمل الراجع من رابط تأكيد البريد)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) window.location.replace(nextPath())
        })
    }, [])

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        setNotice('')
        setUnconfirmed(false)

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
        })

        if (signInError) {
            setError(authErrorText(signInError))
            setUnconfirmed(signInError.code === 'email_not_confirmed' || /not confirmed/i.test(signInError.message))
            setLoading(false)
            return
        }

        window.location.href = nextPath()
    }

    async function resendConfirmation() {
        setResending(true)
        const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email.trim().toLowerCase(),
            options: { emailRedirectTo: `${window.location.origin}/` },
        })
        setResending(false)
        if (resendError) {
            setError(authErrorText(resendError))
        } else {
            setError('')
            setUnconfirmed(false)
            setNotice('أرسلنا رسالة تأكيد جديدة. تفقد بريدك ومجلد Spam.')
        }
    }

    return (
        <AuthCard title="تسجيل الدخول" subtitle="ادخل بياناتك للوصول إلى الكورس والمعلم الذكي">
            {error && (
                <AuthMessage tone="error">
                    {error}
                    {unconfirmed && (
                        <div style={{ marginTop: 10 }}>
                            <button
                                type="button"
                                onClick={resendConfirmation}
                                disabled={resending}
                                style={{ background: '#991b1b', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                {resending ? 'جاري الإرسال...' : 'إرسال رسالة تأكيد جديدة'}
                            </button>
                        </div>
                    )}
                </AuthMessage>
            )}
            {notice && <AuthMessage tone="success">{notice}</AuthMessage>}

            <form onSubmit={handleLogin}>
                <div style={fieldStyle}>
                    <label htmlFor="email" style={labelStyle}>البريد الإلكتروني</label>
                    <input id="email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }} />
                </div>

                <div style={{ ...fieldStyle, marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label htmlFor="password" style={{ ...labelStyle, marginBottom: 0 }}>كلمة المرور</label>
                        <Link href="/forgot-password" style={{ ...linkStyle, fontSize: '12px' }}>نسيت كلمة المرور؟</Link>
                    </div>
                    <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="current-password" />
                </div>

                <button type="submit" disabled={loading} style={submitStyle(loading)}>
                    {loading ? 'جاري الدخول...' : 'دخول'}
                </button>
            </form>

            <p style={{ margin: '20px 0 0', textAlign: 'center', fontSize: '14px', color: '#4A5550' }}>
                ليس لديك حساب؟ <Link href="/signup" style={linkStyle}>إنشاء حساب</Link>
            </p>
        </AuthCard>
    )
}

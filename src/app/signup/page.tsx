'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { authErrorText, MIN_PASSWORD } from '@/lib/authErrors'
import PasswordInput from '@/components/PasswordInput'
import AuthCard, { AuthMessage, fieldStyle, inputStyle, labelStyle, linkStyle, submitStyle } from '@/components/AuthCard'

export default function SignupPage() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<React.ReactNode>('')
    const [sentTo, setSentTo] = useState('')
    const [loading, setLoading] = useState(false)

    // المسجل دخول ما يحتاج هذه الصفحة
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) window.location.replace('/')
        })
    }, [])

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        const cleanEmail = email.trim().toLowerCase()
        if (password.length < MIN_PASSWORD) {
            setError(`كلمة المرور لازم تكون ${MIN_PASSWORD} أحرف على الأقل.`)
            return
        }
        if (password !== confirmPassword) {
            setError('كلمة المرور وتأكيدها غير متطابقين.')
            return
        }

        setLoading(true)
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
                data: { full_name: fullName.trim() },
                emailRedirectTo: `${window.location.origin}/`,
            },
        })
        setLoading(false)

        if (signUpError) {
            setError(authErrorText(signUpError))
            return
        }

        // Supabase يرد بنجاح شكلي إذا كان البريد مسجلًا من قبل، وعلامته أن الحساب بلا هويات
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            setError(
                <>
                    هذا البريد مسجل من قبل.{' '}
                    <Link href="/login" style={{ color: '#991b1b', textDecoration: 'underline' }}>سجّل دخول</Link>
                    {' '}أو{' '}
                    <Link href="/forgot-password" style={{ color: '#991b1b', textDecoration: 'underline' }}>استعد كلمة المرور</Link>.
                </>
            )
            return
        }

        // إذا كان تأكيد البريد مقفلًا في Supabase يدخل مباشرة
        if (data.session) {
            window.location.href = '/'
            return
        }

        setSentTo(cleanEmail)
    }

    if (sentTo) {
        return (
            <AuthCard title="تفقد بريدك 📩">
                <AuthMessage tone="success">
                    أرسلنا رابط تأكيد إلى <span dir="ltr">{sentTo}</span>. افتحه ثم ارجع وسجّل دخول.
                </AuthMessage>
                <p style={{ fontSize: '13px', color: '#4A5550', textAlign: 'center', lineHeight: 1.7, margin: '0 0 16px' }}>
                    ما وصلك شي؟ تفقد مجلد الرسائل غير المرغوبة (Spam). وتقدر تطلب رسالة جديدة من صفحة تسجيل الدخول.
                </p>
                <div style={{ textAlign: 'center' }}>
                    <Link href="/login" style={linkStyle}>الذهاب لتسجيل الدخول</Link>
                </div>
            </AuthCard>
        )
    }

    return (
        <AuthCard title="إنشاء حساب جديد" subtitle="سجل الآن وابدأ رحلتك التعليمية">
            {error && <AuthMessage tone="error">{error}</AuthMessage>}

            <form onSubmit={handleSignup}>
                <div style={fieldStyle}>
                    <label htmlFor="name" style={labelStyle}>الاسم الكامل</label>
                    <input id="name" type="text" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={inputStyle} />
                </div>

                <div style={fieldStyle}>
                    <label htmlFor="email" style={labelStyle}>البريد الإلكتروني</label>
                    <input id="email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }} />
                </div>

                <div style={fieldStyle}>
                    <label htmlFor="password" style={labelStyle}>كلمة المرور ({MIN_PASSWORD} أحرف على الأقل)</label>
                    <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="new-password" />
                </div>

                <div style={fieldStyle}>
                    <label htmlFor="confirm" style={labelStyle}>تأكيد كلمة المرور</label>
                    <PasswordInput id="confirm" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
                </div>

                <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#4A5550', textAlign: 'center', lineHeight: 1.7 }}>
                    بإنشاء حسابك فأنت توافق على <Link href="/terms" target="_blank" style={linkStyle}>الشروط والأحكام</Link>
                </p>

                <button type="submit" disabled={loading} style={submitStyle(loading)}>
                    {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                </button>
            </form>

            <p style={{ margin: '20px 0 0', textAlign: 'center', fontSize: '14px', color: '#4A5550' }}>
                عندك حساب؟ <Link href="/login" style={linkStyle}>سجل دخول</Link>
            </p>
        </AuthCard>
    )
}

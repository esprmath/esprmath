'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { authErrorText, MIN_PASSWORD } from '@/lib/authErrors'
import PasswordInput from '@/components/PasswordInput'
import AuthCard, { AuthMessage, fieldStyle, labelStyle, linkStyle, submitStyle } from '@/components/AuthCard'

const RECOVERY_FLAG = 'esprmath_password_recovery'

/**
 * رابط الاستعادة يجي بعلامة type=recovery في الرابط، ومكتبة Supabase تمسحها بعد ما تقرأ الجلسة.
 * فنقرأها هنا فور تحميل الملف قبل أن تُمسح، حتى نعرف أن الطالب جاء من رابط استعادة
 * وليس مجرد مسجل دخول يحاول يغير كلمة المرور بدون القديمة.
 */
const urlInfo = (() => {
    if (typeof window === 'undefined') return { recovery: false, linkError: false }
    const params = new URLSearchParams(window.location.hash.slice(1) + '&' + window.location.search.slice(1))
    const recovery = params.get('type') === 'recovery'
    try {
        if (recovery) sessionStorage.setItem(RECOVERY_FLAG, '1')
    } catch {
        // التخزين معطل: يكفي ما في الرابط
    }
    return { recovery, linkError: params.has('error') || params.has('error_code') }
})()

const cameFromRecovery = () => {
    if (urlInfo.recovery) return true
    try {
        return sessionStorage.getItem(RECOVERY_FLAG) === '1'
    } catch {
        return false
    }
}

type Status = 'checking' | 'ready' | 'invalid' | 'notRecovery' | 'done'

export default function UpdatePasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<Status>('checking')

    useEffect(() => {
        let settled = false
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                settled = true
                setStatus('ready')
            }
        })

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (settled) return
            if (!session || urlInfo.linkError) setStatus('invalid')
            else setStatus(cameFromRecovery() ? 'ready' : 'notRecovery')
        })

        return () => subscription.unsubscribe()
    }, [])

    async function handleUpdatePassword(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (password.length < MIN_PASSWORD) {
            setError(`كلمة المرور لازم تكون ${MIN_PASSWORD} أحرف على الأقل.`)
            return
        }
        if (password !== confirmPassword) {
            setError('كلمة المرور وتأكيدها غير متطابقين.')
            return
        }

        setLoading(true)
        const { error: updateError } = await supabase.auth.updateUser({ password })

        if (updateError) {
            setError(authErrorText(updateError))
            setLoading(false)
            return
        }

        try {
            sessionStorage.removeItem(RECOVERY_FLAG)
        } catch {
            // لا شيء
        }
        // نسجل الخروج من كل الأجهزة حتى لا تبقى جلسة قديمة مفتوحة عند أحد
        await supabase.auth.signOut({ scope: 'global' })
        setStatus('done')
        setTimeout(() => router.push('/login'), 3000)
    }

    if (status === 'checking') {
        return (
            <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', textAlign: 'center', paddingTop: '100px', fontFamily: 'sans-serif' }}>
                <p style={{ color: '#2C3531', fontWeight: 'bold' }}>جاري التحقق من صلاحية الرابط...</p>
            </div>
        )
    }

    return (
        <AuthCard title="تعيين كلمة مرور جديدة">
            {status === 'invalid' && (
                <AuthMessage tone="error">
                    هذا الرابط غير صالح أو انتهت صلاحيته أو استُخدم من قبل.
                    <div style={{ marginTop: 10 }}>
                        <Link href="/forgot-password" style={{ color: '#991b1b', textDecoration: 'underline' }}>اطلب رابط استعادة جديد</Link>
                    </div>
                </AuthMessage>
            )}

            {status === 'notRecovery' && (
                <AuthMessage tone="error">
                    هذه الصفحة لرابط الاستعادة اللي يوصلك على البريد. لتغيير كلمة المرور وأنت مسجل دخول، افتح القائمة واختر «تغيير كلمة المرور».
                    <div style={{ marginTop: 10 }}>
                        <Link href="/" style={{ color: '#991b1b', textDecoration: 'underline' }}>الرجوع للرئيسية</Link>
                    </div>
                </AuthMessage>
            )}

            {status === 'done' && (
                <AuthMessage tone="success">
                    ✅ تم تحديث كلمة المرور، وسجلنا خروجك من كل الأجهزة. جاري تحويلك لتسجيل الدخول...
                </AuthMessage>
            )}

            {status === 'ready' && (
                <>
                    <p style={{ color: '#4A5550', fontSize: '14px', margin: '0 0 24px', textAlign: 'center' }}>اكتب كلمة المرور الجديدة لحسابك</p>
                    {error && <AuthMessage tone="error">{error}</AuthMessage>}
                    <form onSubmit={handleUpdatePassword}>
                        <div style={fieldStyle}>
                            <label htmlFor="password" style={labelStyle}>كلمة المرور الجديدة ({MIN_PASSWORD} أحرف على الأقل)</label>
                            <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="new-password" />
                        </div>
                        <div style={fieldStyle}>
                            <label htmlFor="confirm" style={labelStyle}>تأكيد كلمة المرور</label>
                            <PasswordInput id="confirm" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
                        </div>
                        <button type="submit" disabled={loading} style={submitStyle(loading)}>
                            {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                        </button>
                    </form>
                </>
            )}

            {status !== 'done' && (
                <p style={{ margin: '20px 0 0', textAlign: 'center', fontSize: '14px' }}>
                    <Link href="/login" style={linkStyle}>العودة لتسجيل الدخول</Link>
                </p>
            )}
        </AuthCard>
    )
}

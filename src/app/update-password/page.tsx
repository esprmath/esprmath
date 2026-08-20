'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function UpdatePasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isValidSession, setIsValidSession] = useState(false)
    const [checking, setChecking] = useState(true)

    // التحقق مما إذا كانت الصفحة مفتوحة عبر رابط استعادة صالح
    useEffect(() => {
        async function checkSession() {
            const { data: { session } } = await supabase.auth.getSession()
            // إذا لم تكن هناك جلسة نشطة، فالرابط غير صالح أو تم استخدامه مسبقاً
            if (!session) {
                setError('هذا الرابط غير صالح أو انتهت صلاحيته أو تم استخدامه مسبقاً.')
            } else {
                setIsValidSession(true)
            }
            setChecking(false)
        }
        checkSession()
    }, [])

    async function handleUpdatePassword(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        // 1. تحديث كلمة المرور
        const { error } = await supabase.auth.updateUser({
            password: password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        // 2. تسجيل الخروج فوراً لإنهاء صلاحية الجلسة بالكامل وإبطال الرابط
        await supabase.auth.signOut()

        // 3. عرض رسالة النجاح والتحويل
        setMessage('✅ تم تحديث كلمة المرور بنجاح! تم تعطيل هذا الرابط ولن يعمل مرة أخرى. جاري تحويلك لتسجيل الدخول...')
        setIsValidSession(false) // منع إظهار نموذج التحديث مرة أخرى إذا حاول الرجوع

        setTimeout(() => {
            router.push('/login')
        }, 3000)
    }

    if (checking) {
        return (
            <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', textAlign: 'center', paddingTop: '100px', fontFamily: 'sans-serif' }}>
                <p style={{ color: '#2C3531', fontWeight: 'bold' }}>جاري التحقق من صلاحية الرابط...</p>
            </div>
        )
    }

    return (
        <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0, paddingBottom: '60px' }}>
            <Navbar isLoggedIn={false} />
            <div style={{ maxWidth: '440px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e6dec5',
                    borderRadius: '16px',
                    padding: '32px 24px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    textAlign: 'right',
                    color: '#2C3531'
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2C3531', marginBottom: '8px', textAlign: 'center' }}>
                        تعيين كلمة مرور جديدة
                    </h2>

                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                            {error}
                            <div style={{ marginTop: '12px' }}>
                                <Link href="/forgot-password" style={{ color: '#991b1b', textDecoration: 'underline' }}>
                                    طلب رابط استعادة جديد
                                </Link>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                            {message}
                        </div>
                    )}

                    {isValidSession && !message && (
                        <>
                            <p style={{ color: '#4A5550', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
                                الرجاء إدخال كلمة المرور الجديدة لحسابك
                            </p>
                            <form onSubmit={handleUpdatePassword}>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#2C3531', marginBottom: '6px' }}>
                                        كلمة المرور الجديدة (6 أحرف على الأقل)
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px 14px',
                                            borderRadius: '8px',
                                            border: '1px solid #e6dec5',
                                            backgroundColor: '#ffffff',
                                            fontSize: '14px',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            color: '#2C3531',
                                            direction: 'ltr',
                                            textAlign: 'right'
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: '#DCA27B',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 4px 12px rgba(220, 162, 123, 0.3)',
                                        transition: 'opacity 0.2s'
                                    }}
                                >
                                    {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                                </button>
                            </form>
                        </>
                    )}

                    <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#4A5550' }}>
                        <p style={{ margin: 0 }}>
                            <Link href="/login" style={{ color: '#DCA27B', fontWeight: 'bold', textDecoration: 'none' }}>
                                العودة لتسجيل الدخول
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
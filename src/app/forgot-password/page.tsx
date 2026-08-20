'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleResetPassword(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        // إرسال رابط إعادة التعيين إلى الإيميل
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`, // يجب إنشاء هذه الصفحة لاحقاً
        })

        if (resetError) {
            setError(resetError.message)
        } else {
            setMessage('✅ تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.')
        }
        setLoading(false)
    }

    return (
        <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <Navbar isLoggedIn={false} />
            <div style={{ maxWidth: '400px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '32px 24px', textAlign: 'right' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>نسيت كلمة المرور؟</h2>
                    <p style={{ fontSize: '14px', color: '#4A5550', textAlign: 'center', marginBottom: '24px' }}>
                        أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
                    </p>

                    {error && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
                    {message && <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{message}</div>}

                    <form onSubmit={handleResetPassword}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '8px', border: '1px solid #e6dec5', boxSizing: 'border-box' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', padding: '12px', backgroundColor: '#DCA27B', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            {loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                        </button>
                    </form>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Link href="/login" style={{ color: '#8B5E3C', fontSize: '14px' }}>العودة لتسجيل الدخول</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
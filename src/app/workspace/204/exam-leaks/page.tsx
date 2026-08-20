'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function ExamLeaksPage() {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        async function checkAuth() {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                const cachedStatus = localStorage.getItem(`course_approved_${session.user.id}_204`)
                setIsAuthorized(cachedStatus === 'true')
            }
            setLoading(false)
        }
        checkAuth()
    }, [])

    // قائمة الكويزات مع مسارات صفحاتها المستقلة
    const examsList = [
        {
            id: 'quiz-1',
            title: 'Quiz 1 - Math 204',
            type: 'كويز 1',
            desc: 'مراجعة شاملة للكويز الأول مع جولتي التدريب والتسريبات.',
            path: '/workspace/204/exam-leaks/quiz-1'
        },
        {
            id: 'quiz-2',
            title: 'Quiz 2 - Math 204',
            type: 'كويز 2',
            desc: 'تجميعات الكويز الثاني وأهم الأفكار المتكررة.',
            path: '/workspace/204/exam-leaks/quiz-2'
        }
    ]

    if (loading) {
        return <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>جاري التحميل... ⏳</div>
    }

    if (!isAuthorized) {
        return (
            <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', color: '#2C3531', fontFamily: 'sans-serif' }}>
                <Navbar isLoggedIn={true} />
                <div style={{ maxWidth: '600px', margin: '80px auto', padding: '30px', background: '#ffffff', borderRadius: '16px', textAlign: 'center', border: '1px solid #e6dec5' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
                    <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>هذا القسم مقفل</h2>
                    <p style={{ color: '#4A5550', marginBottom: '20px' }}>تسريبات الاختبارات السابقة تتطلب اعتماد الكورس للوصول إليه.</p>
                    <Link href="/workspace/204" style={{ background: '#DCA27B', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                        العودة لصفحة الكورس ➔
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', color: '#2C3531', fontFamily: 'sans-serif', paddingBottom: '60px' }}>
            <Navbar isLoggedIn={true} />
            <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                        <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '6px' }}>🔥 تسريبات الاختبارات والكويزات</h1>
                        <p style={{ color: '#4A5550', fontSize: '14px' }}>اختر الكويز للانتقال لصفحته الخاصة وبدء جولات المراجعة الذكية.</p>
                    </div>
                    <Link href="/workspace/204" style={{ textDecoration: 'none', background: '#CDD4B1', color: '#2C3531', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                        ← عودة للكورس
                    </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {examsList.map((exam) => (
                        <div key={exam.id} style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div style={{ flex: 1, minWidth: '260px' }}>
                                <span style={{ background: '#FEECD0', color: '#8c5521', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{exam.type}</span>
                                <h3 style={{ fontSize: '18px', margin: '8px 0', color: '#2C3531' }}>{exam.title}</h3>
                                <p style={{ margin: 0, fontSize: '14px', color: '#4A5550' }}>{exam.desc}</p>
                            </div>
                            <Link
                                href={exam.path}
                                style={{ background: '#DCA27B', color: '#ffffff', textDecoration: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}
                            >
                                دخول الكويز ➔
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
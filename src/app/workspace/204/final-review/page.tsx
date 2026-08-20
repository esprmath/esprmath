'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function FinalReviewPage() {
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

    const finalSections = [
        { title: 'الملخص الذهبي الشامل (Cheat Sheet)', desc: 'أهم القوانين والنظريات لكل الموديولات السبعة في ملف واحد مختصر.', icon: '📜' },
        { title: 'تجميعات الأسئلة المتكررة في الفاينل', desc: 'أكثر الأفكار تكراراً في اختبارات نهاية الفترات السابقة.', icon: '🎯' },
        { title: 'محاكاة اختبار فاينل تجريبي', desc: 'اختبر نفسك بأسئلة شاملة وبوقت محدد لمحاكاة جو الاختبار الحقيقي.', icon: '⏱️' },
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
                    <p style={{ color: '#4A5550', marginBottom: '20px' }}>قسم المراجعة النهائية والفاينل يتطلب اعتماد الكورس للوصول إليه.</p>
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
                        <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '6px' }}>⭐ المراجعة النهائية وتسريبات الفاينل</h1>
                        <p style={{ color: '#4A5550', fontSize: '14px' }}>استعد لاختبار الفاينل بأقوى الملخصات، التدريبات الشاملة، وتسريبات الاختبارات.</p>
                    </div>
                    <Link href="/workspace/204" style={{ textDecoration: 'none', background: '#CDD4B1', color: '#2C3531', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                        ← عودة للكورس
                    </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {finalSections.map((sec, idx) => (
                        <div key={idx} style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ fontSize: '36px', background: '#FEECD0', padding: '14px', borderRadius: '12px' }}>
                                {sec.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: '260px' }}>
                                <h3 style={{ fontSize: '18px', margin: '0 0 6px 0', color: '#2C3531' }}>{sec.title}</h3>
                                <p style={{ margin: 0, fontSize: '14px', color: '#4A5550' }}>{sec.desc}</p>
                            </div>
                            <button
                                onClick={() => alert(`جاري فتح قسم: ${sec.title}`)}
                                style={{ background: '#DCA27B', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                            >
                                الدخول للقسـم ➔
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function WorkspacePage() {
    const router = useRouter()
    const [progressMap, setProgressMap] = useState<{ [key: number]: number }>({
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0
    })

    const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null)
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    // التحقق السريع من الجلسة وحالة الاعتماد المخزنة محلياً لتجنب البطء
    useEffect(() => {
        async function checkLocalSession() {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.user) {
                setIsAuthorized(false)
                setLoading(false)
                return
            }

            const userId = session.user.id
            // التحقق الفوري من حالة الكورس المخزنة محلياً بناءً على تحديث الصفحة الرئيسية
            const cachedStatus = localStorage.getItem(`course_approved_${userId}_101`)
            if (cachedStatus === 'true') {
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }

            setLoading(false)
        }

        checkLocalSession()

        if (typeof window !== 'undefined') {
            const newProgress: { [key: number]: number } = {}
            for (let i = 1; i <= 7; i++) {
                const saved = localStorage.getItem(`module_${i}_progress`)
                newProgress[i] = saved ? parseInt(saved, 10) : 0
            }
            setProgressMap(newProgress)
            localStorage.setItem('last_studied_course', '204')
        }
    }, [])

    const modulesData = [
        { id: 1, title: 'Systems of Linear Equations', desc: 'مقدمة في المعادلات الخطية، المصفوفات، وعمليات الصف البسيطة.', chapters: ['Ch 1.1', 'Ch 1.2', 'Ch 1.3'] },
        { id: 2, title: 'Population Models & Numerical Methods', desc: 'نماذج النمو السكاني (Exponential & Logistic) وطرق الحل العددي (Euler & RK4).', chapters: ['Ch 2.1', 'Ch 2.2'] },
        { id: 3, title: 'Eigenvalues & Diagonalization', desc: 'القيم الذاتية، المتجهات الذاتية، وتقطير المصفوفات.', chapters: ['Ch 6.1', 'Ch 6.2'] },
        { id: 4, title: 'Vector Spaces & Subspaces', desc: 'فضاءات المتجهات، الفضاءات الجزئية، والاستقلال الخطي.', chapters: ['Ch 4.1', 'Ch 4.2', 'Ch 4.3'] },
        { id: 5, title: 'Basis & Dimension', desc: 'أسس الفضاءات المتجهية، الرتبة، البعد، وتغيير الإحداثيات.', chapters: ['Ch 4.4', 'Ch 4.5', 'Ch 4.6'] },
        { id: 6, title: 'Orthogonality & Least Squares', desc: 'التعامد، المتجهات المتعامدة، وأقل المربعات.', chapters: ['Ch 6.1', 'Ch 6.2', 'Ch 6.5'] },
        { id: 7, title: 'Symmetric Matrices & Quadratic Forms', desc: 'المصفوفات المتماثلة والأشكال التربيعية.', chapters: ['Ch 7.1', 'Ch 7.2', 'Ch 7.3'] },
    ]

    // دالة محكمة لمنع الدخول وإيقاف الـ propagation والـ default behavior نهائياً
    const handleModuleClick = (e: React.MouseEvent, modId: number) => {
        if (modId === 1) return // الموديول الأول متاح دائماً

        if (!isAuthorized) {
            e.preventDefault()
            e.stopPropagation()
            setAlertMessage('🔒 هذا الموديول مقفل! الموديول الأول فقط متاح للتجربة المجانية. لفتح كامل الموديولات، يرجى طلب انضمام للكورس من الصفحة الرئيسية بانتظار موافقة المشرف.')
            setShowAlertModal(true)
            return false
        }
    }

    if (loading) {
        return (
            <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: '#4A5550', fontSize: '1rem', fontWeight: 'bold' }}>
                جاري تحميل محتوى الكورس... ⏳
            </div>
        )
    }

    return (
        <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', color: '#2C3531', fontFamily: 'sans-serif', margin: 0, padding: 0, paddingBottom: '60px' }}>
            <Navbar isLoggedIn={true} />

            <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>

                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2C3531', marginBottom: '8px' }}>
                        📚 Course Modules - Math 204
                    </h1>
                    <p style={{ color: '#4A5550', fontSize: '15px' }}>
                        اختر أي Module لبدء استعراض الشباتر، الأفكار، والتدريبات التفاعلية.
                    </p>

                    <div style={{ marginTop: '15px', padding: '10px 14px', borderRadius: '8px', background: isAuthorized ? '#CDD4B1' : '#FEECD0', color: isAuthorized ? '#2C3531' : '#8c5521', fontSize: '0.9rem', fontWeight: 'bold', display: 'inline-block', border: '1px solid #e6dec5' }}>
                        {isAuthorized ? '✅ حسابك معتمد، فالك التوفيق' : '🎁 المعاينة المجانية مفعلة: الموديول الأول متاح، وباقي الموديولات تتطلب موافقة المشرف.'}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {modulesData.map((mod) => {
                        const currentProgress = progressMap[mod.id] || 0
                        const isExpanded = expandedModuleId === mod.id
                        const isLocked = mod.id !== 1 && !isAuthorized

                        return (
                            <div
                                key={mod.id}
                                style={{
                                    background: isLocked ? '#f5f2e6' : '#ffffff',
                                    border: isExpanded && !isLocked ? '2px solid #DCA27B' : '1px solid #e6dec5',
                                    borderRadius: '16px',
                                    padding: '20px 24px',
                                    boxShadow: isExpanded && !isLocked ? '0 8px 20px rgba(220, 162, 123, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.03)',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    flexWrap: 'wrap',
                                    gap: '16px',
                                    cursor: isLocked ? 'not-allowed' : 'pointer',
                                    opacity: isLocked ? 0.8 : 1
                                }}
                                onClick={() => {
                                    if (!isLocked) {
                                        setExpandedModuleId(isExpanded ? null : mod.id)
                                    }
                                }}
                            >
                                <div style={{ flex: 1, minWidth: '280px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{
                                                background: isExpanded && !isLocked ? '#FEECD0' : '#f0ebdc',
                                                color: '#2C3531',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                transition: 'background 0.3s'
                                            }}>
                                                Module {mod.id}
                                            </span>

                                            {mod.id === 1 && !isAuthorized && (
                                                <span style={{ background: '#CDD4B1', color: '#2C3531', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                    مجاني 🎁
                                                </span>
                                            )}

                                            {isLocked && (
                                                <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                    🔒 مقفل
                                                </span>
                                            )}
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2C3531', background: '#CDD4B1', padding: '4px 8px', borderRadius: '6px' }}>
                                            التقدم: {currentProgress}%
                                        </span>
                                    </div>

                                    <h2 style={{ fontSize: '18px', color: isExpanded && !isLocked ? '#DCA27B' : '#2C3531', margin: '6px 0', transition: 'color 0.3s' }}>
                                        {mod.title}
                                    </h2>

                                    <p style={{ margin: '0 0 12px 0', color: '#4A5550', fontSize: '14px' }}>
                                        {mod.desc}
                                    </p>

                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                        {mod.chapters.map((ch, idx) => {
                                            const randomIdeasCount = ((mod.id * 7 + idx * 3) % 4) + 3

                                            return (
                                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span
                                                        style={{
                                                            background: '#FFF9E2',
                                                            color: '#2C3531',
                                                            fontSize: '11px',
                                                            fontWeight: 'bold',
                                                            padding: '4px 10px',
                                                            borderRadius: '20px',
                                                            border: '1px solid #e6dec5',
                                                            display: 'inline-block'
                                                        }}
                                                    >
                                                        📖 {ch}
                                                    </span>

                                                    {isExpanded && !isLocked && (
                                                        <span style={{
                                                            fontSize: '11px',
                                                            color: '#DCA27B',
                                                            fontWeight: 'bold',
                                                            paddingLeft: '6px'
                                                        }}>
                                                            ✨ {randomIdeasCount} أفكار رئيسية
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <Link
                                    href={isLocked ? '#' : `/workspace/101/${mod.id}`}
                                    onClick={(e) => handleModuleClick(e, mod.id)}
                                    style={{
                                        textDecoration: 'none',
                                        backgroundColor: isLocked ? '#94a3b8' : '#DCA27B',
                                        color: '#ffffff',
                                        padding: '10px 20px',
                                        borderRadius: '10px',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        boxShadow: isExpanded && !isLocked ? '0 4px 12px rgba(220, 162, 123, 0.3)' : 'none',
                                        alignSelf: 'center',
                                        cursor: isLocked ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isLocked ? 'Locked 🔒' : 'Start ➔'}
                                </Link>
                            </div>
                        )
                    })}
                </div>

            </div>

            {showAlertModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <div style={{ backgroundColor: '#FFF9E2', border: '1px solid #e6dec5', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', textAlign: 'center', fontFamily: 'sans-serif', color: '#2C3531' }}>
                        <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#2C3531' }}>الموديول مقفل</h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#4A5550', lineHeight: '1.5' }}>{alertMessage}</p>
                        <button
                            type="button"
                            onClick={() => setShowAlertModal(false)}
                            style={{ width: '100%', padding: '10px 16px', backgroundColor: '#DCA27B', color: '#ffffff', border: '1px solid #e6dec5', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                        >
                            حسناً، فهمت 👍
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function CourseWorkspacePage() {
    const params = useParams()
    const courseId = (params?.courseId as string) || '204'

    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    useEffect(() => {
        async function checkApprovalStatus() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setIsAuthorized(false)
                setLoading(false)
                return
            }

            const cacheKey = `course_approved_${user.id}_${courseId}`

            // تحقق من sessionStorage أولاً - يبقى طول الجلسة بدون أي اتصال
            const sessionCache = sessionStorage.getItem(cacheKey)
            if (sessionCache !== null) {
                setIsAuthorized(sessionCache === 'true')
                setLoading(false)
                return
            }

            // اسأل Supabase مرة وحدة فقط
            const { data, error } = await supabase
                .from('user_courses')
                .select('is_approved')
                .eq('user_id', user.id)
                .eq('course_id', courseId)
                .maybeSingle()

            const isApproved = !!(!error && data && data.is_approved === true)

            // خزّن في sessionStorage
            sessionStorage.setItem(cacheKey, isApproved ? 'true' : 'false')

            setIsAuthorized(isApproved)
            setLoading(false)
        }

        checkApprovalStatus()
    }, [courseId])

    const courseData: Record<string, { title: string; code: string; description: string; modules: { id: number; title: string; desc: string }[] }> = {
        '204': {
            title: 'الجبر الخطي',
            code: 'Math204',
            description: 'دراسة المتجهات، المصفوفات، القيم الذاتية، والتحويلات الخطية.',
            modules: [
                { id: 1, title: 'Module 1: Systems of Linear Equations', desc: 'Matrices, Gauss-Jordan elimination, and vectors.' },
                { id: 2, title: 'Module 2: Matrix Algebra & Determinants', desc: 'Inverses, elementary matrices, and Cramer\'s rule.' },
                { id: 3, title: 'Module 3: Eigenvalues & Eigenvectors', desc: 'Characteristic equations, diagonalization, and multiplicities.' }
            ]
        },
        '203': {
            title: 'التفاضل والتكامل المتقدم (كالك 3)',
            code: 'Math203',
            description: 'متجهات الفضاء ثلاثي الأبعاد، الدوال متعدّدة المتغيرات، والتكاملات.',
            modules: [
                { id: 1, title: 'Module 1: 3D Vectors & Space Geometry', desc: 'Vectors, dot/cross products, lines and planes.' },
                { id: 2, title: 'Module 2: Partial Derivatives', desc: 'Limits, continuity, and chain rule.' }
            ]
        }
    }

    const currentCourse = courseData[courseId] || courseData['204']

    const handleModuleClick = (e: React.MouseEvent, modId: number) => {
        if (modId === 1) return

        if (!isAuthorized) {
            e.preventDefault()
            e.stopPropagation()
            setAlertMessage('🔒 هذا الموديول مقفل! الموديول الأول فقط متاح للتجربة المجانية. لفتح كامل الموديولات، يرجى طلب انضمام للكورس من الصفحة الرئيسية بانتظار موافقة المشرف.')
            setShowAlertModal(true)
        }
    }

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'sans-serif', color: '#64748b' }}>جاري تحميل محتوى الكورس... ⏳</div>
    }

    return (
        <>
            <Navbar isLoggedIn={true} />

            <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px', fontFamily: 'sans-serif', paddingBottom: '60px' }}>

                <div style={{ marginBottom: '20px' }}>
                    <Link href="/" style={{ textDecoration: 'none', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', color: '#475569', fontSize: '13px' }}>
                        ⬅️ العودة للرئيسية
                    </Link>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#1e293b' }}>{currentCourse.title}</h1>
                        <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            {currentCourse.code}
                        </span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
                        {currentCourse.description}
                    </p>

                    <div style={{ marginTop: '15px', padding: '10px 14px', borderRadius: '8px', background: isAuthorized ? '#dcfce7' : '#fef3c7', color: isAuthorized ? '#166534' : '#92400e', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        {isAuthorized ? '✅ حسابك معتمد ولديك صلاحية الوصول لكامل موديولات الكورس.' : '🎁 أنت تستعرض المنصة عبر المعاينة المجانية: الموديول الأول متاح، وباقي الموديولات تتطلب موافقة المشرف.'}
                    </div>
                </div>

                <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '16px', fontWeight: 'bold' }}>
                    📚 موديولات الكورس
                </h3>

                <div style={{ display: 'grid', gap: '16px' }}>
                    {currentCourse.modules.map((mod) => {
                        const isLocked = mod.id !== 1 && !isAuthorized

                        return (
                            <div key={mod.id} style={{
                                background: isLocked ? '#f8fafc' : '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '16px',
                                padding: '20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                flexWrap: 'wrap',
                                gap: '15px',
                                opacity: isLocked ? 0.75 : 1
                            }}>
                                <div style={{ flex: 1, minWidth: '250px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>{mod.title}</h4>
                                        {mod.id === 1 && (
                                            <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                مجانًا لتجربة المنصة 🎁
                                            </span>
                                        )}
                                        {isLocked && (
                                            <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                🔒 مقفل
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{mod.desc}</p>
                                </div>
                                <div>
                                    <Link
                                        href={isLocked ? '#' : `/workspace/${courseId}/module/${mod.id}`}
                                        onClick={(e) => handleModuleClick(e, mod.id)}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <button style={{
                                            background: isLocked ? '#94a3b8' : '#4f46e5',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            cursor: isLocked ? 'not-allowed' : 'pointer'
                                        }}>
                                            {isLocked ? 'مقفل 🔒' : mod.id === 1 ? 'جرب الموديول مجاناً ✨' : 'ابدأ الموديول 🚀'}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {showAlertModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: 'center', fontFamily: 'sans-serif' }}>
                        <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1e293b' }}>الموديول مقفل</h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>{alertMessage}</p>
                        <button
                            type="button"
                            onClick={() => setShowAlertModal(false)}
                            style={{ width: '100%', padding: '10px 16px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                        >
                            حسناً، فهمت 👍
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
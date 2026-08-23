'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
export default function WorkspacePage() {
    const router = useRouter()
    const [progressMap, setProgressMap] = useState<{ [key: number]: number }>({
        1: 0, 2: 0, 3: 0, 4: 0
    })
    const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null)
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [quizAccess, setQuizAccess] = useState<Record<string, boolean>>({})
// التحقق من الجلسة + حالة الاعتماد + حالة فتح الاختبارات من Supabase
    useEffect(() => {
        async function checkLocalSession() {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.user) {
                setIsAuthorized(false)
                setQuizAccess({})
                setLoading(false)
                return
            }
            const userId = session.user.id
            const cachedStatus = localStorage.getItem(`course_approved_${userId}_101`)
            const approved = cachedStatus === 'true'
            setIsAuthorized(approved)
// لا نجلب الاختبارات إلا للطالب المعتمد
            if (approved) {
                const { data, error } = await supabase
                    .from('quiz_settings')
                    .select('quiz_id, is_open, opens_at, closes_at')
                    .eq('course_id', '101')
                if (error) {
                    console.error('Error loading quiz settings:', error)
                    setQuizAccess({})
                } else {
                    const now = new Date()
                    const accessMap: Record<string, boolean> = {}
                    ;(data ?? []).forEach((quiz) => {
                        const opensAt = quiz.opens_at ? new Date(quiz.opens_at) : null
                        const closesAt = quiz.closes_at ? new Date(quiz.closes_at) : null
                        const afterOpenTime = !opensAt || now.getTime() >= opensAt.getTime()
                        const beforeCloseTime = !closesAt || now.getTime() <= closesAt.getTime()
                        accessMap[quiz.quiz_id] =
                            quiz.is_open === true &&
                            afterOpenTime &&
                            beforeCloseTime
                    })
                    setQuizAccess(accessMap)
                }
            } else {
                setQuizAccess({})
            }
            setLoading(false)
        }
        checkLocalSession()
        if (typeof window !== 'undefined') {
            const newProgress: { [key: number]: number } = {}
            for (let i = 1; i <= 4; i++) {
                const saved = localStorage.getItem(`module_${i}_progress`)
                newProgress[i] = saved ? parseInt(saved, 10) : 0
            }
            setProgressMap(newProgress)
            localStorage.setItem('last_studied_course', '101')
        }
    }, [])
    const modulesData = [
        {
            id: 1,
            title: 'Module 1 - Limits Foundations',
            desc: 'مراجعة النهايات، الاتصال، المماس ومعدل التغير، والنهايات عند اللانهاية.',
            chapters: [
                { name: 'Ch 1.5', ideaCount: 2 },
                { name: 'Ch 1.6', ideaCount: 2 },
                { name: 'Ch 2.1', ideaCount: 2 },
                { name: 'Ch 1.8', ideaCount: 2 },
                { name: 'Ch 3.4', ideaCount: 2 },
            ]
        },
        {
            id: 2,
            title: 'Module 2 - Applications of Differentiation',
            desc: 'معدلات التغير المرتبطة، القيم العظمى والصغرى، وتطبيقات الهندسة.',
            chapters: [
                { name: 'Ch 2.3', ideaCount: 2 },
                { name: 'Ch 2.4', ideaCount: 2 },
                { name: 'Ch 2.5', ideaCount: 1 },
                { name: 'Ch 2.6', ideaCount: 1 },
                { name: 'Ch 2.7', ideaCount: 1 },

            ]
        },
        {
            id: 3,
            title: 'Module 3 - Advanced Functions & Applications',
            desc: 'الدوال الأسية واللوغاريتمية، الدوال المثلثية العكسية، النمو والاضمحلال، والدوال الزائدية.',
            chapters: [
                { name: 'Ch 6.2', ideaCount: 2 },
                { name: 'Ch 6.4', ideaCount: 1 },
                { name: 'Ch 6.6', ideaCount: 1 },
                { name: 'Ch 6.5', ideaCount: 1 },
                { name: 'Ch 6.7', ideaCount: 1 },
                { name: 'Ch 2.9', ideaCount: 1 },
            ]
        },
        {
            id: 4,
            title: 'Module 4 - L\'Hospital & Optimization',
            desc: 'صيغ عدم التعيين، قاعدة لوبيتال، القيم العظمى والصغرى، وطريقة نيوتن لتقدير الجذور.',
            chapters: [
                { name: 'Ch 6.8', ideaCount: 2 },
                { name: 'Ch 3.1', ideaCount: 2 },
                { name: 'Ch 3.8', ideaCount: 1 },
            ]
        },
    ]
    const courseExams = [
        { id: 'quiz-1', label: 'Q1', title: 'Quiz 1', path: '/workspace/101/exam-leaks/quiz-1' },
        { id: 'quiz-2', label: 'Q2', title: 'Quiz 2', path: '/workspace/101/exam-leaks/quiz-2' },
        { id: 'midterm', label: 'MID', title: 'Midterm', path: '/workspace/101/exam-leaks/midterm' },
        { id: 'quiz-3', label: 'Q3', title: 'Quiz 3', path: '/workspace/101/exam-leaks/quiz-3' },
        { id: 'quiz-4', label: 'Q4', title: 'Quiz 4', path: '/workspace/101/exam-leaks/quiz-4' },
    ]
    const handleExamClick = (exam: typeof courseExams[number]) => {
        if (!isAuthorized) {
            setAlertMessage(`🔒 قسم "${exam.title}" يتطلب اعتماد الكورس أولاً.`)
            setShowAlertModal(true)
            return
        }
        const isOpen = quizAccess[exam.id] === true
        if (!isOpen) {
            setAlertMessage(`🔒 ${exam.title} غير متاح حالياً. سيتم فتحه في الوقت المحدد.`)
            setShowAlertModal(true)
            return
        }
        router.push(exam.path)
    }
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
// دالة خاصة للتعامل مع النقر على أقسام بنك الأسئلة، التسريبات، أو الفاينل إذا كانت تتطلب اعتماداً
    const handleExtraFeatureClick = (e: React.MouseEvent, featureName: string) => {
        if (!isAuthorized) {
            e.preventDefault()
            setAlertMessage(`🔒 قسم "${featureName}" يتطلب اعتماد الكورس أولاً. يرجى طلب الانضمام من الصفحة الرئيسية.`)
            setShowAlertModal(true)
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
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2C3531', marginBottom: '8px' }}>
                        📚 Course Modules - Calculus 101
                    </h1>
                    <p style={{ color: '#4A5550', fontSize: '15px' }}>
                        اختر أي Module لبدء استعراض الشباتر، الأفكار، والتدريبات التفاعلية.
                    </p>
                    <div style={{ marginTop: '15px', padding: '10px 14px', borderRadius: '8px', background: isAuthorized ? '#CDD4B1' : '#FEECD0', color: isAuthorized ? '#2C3531' : '#8c5521', fontSize: '0.9rem', fontWeight: 'bold', display: 'inline-block', border: '1px solid #e6dec5' }}>
                        {isAuthorized ? '✅ حسابك معتمد، فالك التوفيق' : '🎁 المعاينة المجانية مفعلة: الموديول الأول متاح، وباقي الموديولات تتطلب موافقة المشرف.'}
                    </div>
                </div>
                {/* الاختبارات والمراجعات - دوائر فقط */}
                <div style={{
                    marginBottom: '32px',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        fontSize: '20px',
                        marginBottom: '18px',
                        color: '#2C3531'
                    }}>
                        الاختبارات والمراجعات
                    </h2>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '22px',
                        flexWrap: 'wrap'
                    }}>
                        {courseExams.map((exam) => {
                            const isOpen = isAuthorized && quizAccess[exam.id] === true

                            return (
                                <div key={exam.id} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => handleExamClick(exam)}
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            border: isOpen ? '2px solid #DCA27B' : '1px solid #cbd5e1',
                                            background: isOpen ? '#FEECD0' : '#f1f5f9',
                                            color: isOpen ? '#8c5521' : '#64748b',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            position: 'relative'
                                        }}
                                    >
                                        {exam.label}
                                        {!isOpen && <span style={{
                                            position:'absolute',
                                            right:'-5px',
                                            bottom:'-5px',
                                            background:'#fff',
                                            borderRadius:'50%',
                                            fontSize:'10px'
                                        }}>🔒</span>}
                                    </button>

                                    <span style={{
                                        fontSize:'11px',
                                        fontWeight:'bold'
                                    }}>
                                        {exam.id === 'midterm' ? 'Mid' : exam.title}
                                    </span>
                                </div>
                            )
                        })}
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
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            justifyContent: 'flex-start',
                                            direction: 'rtl',
                                            gap: '6px',
                                            marginTop: '14px'
                                        }}
                                    >
                                        {mod.chapters.map((ch, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    gap: '3px',
                                                    minWidth: '58px'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        background: '#ffffff',
                                                        border: '1px solid #e6dec5',
                                                        borderRadius: '12px',
                                                        padding: '4px 9px',
                                                        color: '#2C3531',
                                                        fontSize: '11px',
                                                        fontWeight: 'bold',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    📖 {ch.name}
                                                </div>

                                                {isExpanded && (
                                                    <span
                                                        style={{
                                                            color: '#DCA27B',
                                                            fontSize: '10px',
                                                            fontWeight: 'bold',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                            ✨ {ch.ideaCount !== null
                                                        ? `${ch.ideaCount} أفكار رئيسية`
                                                        : 'العدد لاحقاً'}
                                                        </span>
                                                )}
                                            </div>
                                        ))}
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

                {/* 🏆 قسم الفاينل - يبقى آخر الصفحة ويتحكم به Supabase */}
                <div style={{ marginTop: '32px' }}>
                    {(() => {
                        const isFinalOpen =
                            isAuthorized &&
                            quizAccess['final-review'] === true
                        const handleFinalClick = () => {
                            if (!isAuthorized) {
                                setAlertMessage('🔒 مراجعة الفاينل تتطلب اعتماد الكورس أولاً.')
                                setShowAlertModal(true)
                                return
                            }
                            if (!isFinalOpen) {
                                setAlertMessage('🔒 مراجعة الاختبار النهائي غير متاحة حالياً. سيتم فتحها في الوقت المحدد.')
                                setShowAlertModal(true)
                                return
                            }
                            router.push('/workspace/101/final-review')
                        }
                        return (
                            <div
                                onClick={handleFinalClick}
                                style={{
                                    background: '#ffffff',
                                    border: isFinalOpen ? '2px solid #DCA27B' : '2px solid #cbd5e1',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    boxShadow: isFinalOpen
                                        ? '0 4px 12px rgba(220, 162, 123, 0.15)'
                                        : '0 2px 6px rgba(0, 0, 0, 0.03)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '16px',
                                    transition: 'all 0.3s ease',
                                    cursor: isFinalOpen ? 'pointer' : 'not-allowed',
                                    opacity: isFinalOpen ? 1 : 0.78
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '280px' }}>
                                    <div
                                        style={{
                                            fontSize: '36px',
                                            background: isFinalOpen ? '#FEECD0' : '#f1f5f9',
                                            padding: '14px',
                                            borderRadius: '14px'
                                        }}
                                    >
                                        🏆
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                            <h3 style={{ margin: 0, fontSize: '18px', color: '#2C3531', fontWeight: 'bold' }}>
                                                مراجعة الاختبار النهائي (Final Review)
                                            </h3>
                                            <span
                                                style={{
                                                    background: isFinalOpen ? '#dcfce7' : '#fee2e2',
                                                    color: isFinalOpen ? '#166534' : '#991b1b',
                                                    padding: '2px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {isFinalOpen ? '✅ متاح' : '🔒 مقفل'}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#4A5550' }}>
                                            تجميعات شاملة، نماذج اختبارات نهائية، وملخصات لأهم أفكار المنهج بالكامل.
                                        </p>
                                    </div>
                                </div>
                                <span
                                    style={{
                                        backgroundColor: isFinalOpen ? '#DCA27B' : '#94a3b8',
                                        color: '#ffffff',
                                        padding: '10px 20px',
                                        borderRadius: '10px',
                                        fontWeight: 'bold',
                                        fontSize: '14px'
                                    }}
                                >
                                    {isFinalOpen ? 'ابدأ المراجعة ➔' : 'مقفل 🔒'}
                                </span>
                            </div>
                        )
                    })()}
                </div>
            </div>

            {/* بنك الأسئلة بجانب الفاينل */}
            <div style={{
                background: '#FEECD0',
                border: '1px solid #e6dec5',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer'
            }}
                 onClick={() => router.push('/workspace/101/quesbank/data')}
            >
                <div style={{
                    fontSize:'32px',
                    background:'#ffffff',
                    padding:'12px',
                    borderRadius:'12px'
                }}>
                    ❓
                </div>
                <div>
                    <h3 style={{margin:0, color:'#2C3531'}}>
                        بنك الأسئلة الشامل
                    </h3>
                    <p style={{margin:'6px 0 0', color:'#4A5550', fontSize:'13px'}}>
                        تدرب على أسئلة متنوعة لجميع الشباتر.
                    </p>
                </div>
            </div>

            {showAlertModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <div style={{ backgroundColor: '#FFF9E2', border: '1px solid #e6dec5', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', textAlign: 'center', fontFamily: 'sans-serif', color: '#2C3531' }}>
                        <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#2C3531' }}>غير متاح حالياً</h3>
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

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
            desc: 'النهايات، قوانين النهايات، المماس ومعدل التغير، الاتصال، والنهايات عند اللانهاية.',
            chapters: [
                { name: 'Ch 1.5', title: 'Limit of a function', ideaCount: 2 },
                { name: 'Ch 1.6', title: 'Calculating Limits Using the Limit Laws', ideaCount: 2 },
                { name: 'Ch 2.1', title: 'Tangent, Rate of change, Velocity', ideaCount: 1 },
                { name: 'Ch 1.8', title: 'Continuity', ideaCount: 2 },
                { name: 'Ch 3.4', title: 'Limits at infinity and horizontal asymptotes', ideaCount: 2 },
            ]
        },
        {
            id: 2,
            title: 'Module 2 - Differentiation Rules & Applications',
            desc: 'قواعد الاشتقاق، الدوال المثلثية، قاعدة السلسلة، الاشتقاق الضمني، ومعدلات التغير.',
            chapters: [
                { name: 'Ch 2.3', title: 'Derivative Formulae', ideaCount: 2 },
                { name: 'Ch 2.4', title: 'Derivatives of trigonometric functions', ideaCount: 2 },
                { name: 'Ch 2.5', title: 'Chain Rule', ideaCount: 1 },
                { name: 'Ch 2.6', title: 'Implicit Differentiation', ideaCount: 1 },
                { name: 'Ch 2.7', title: 'Rates of Change in Natural and Social Sciences', ideaCount: 1 },
            ]
        },
        {
            id: 3,
            title: 'Module 3 - Exponential, Logarithmic & Advanced Functions',
            desc: 'الدوال الأسية واللوغاريتمية، الدوال المثلثية العكسية، النمو والاضمحلال، الدوال الزائدية، والتقريب الخطي.',
            chapters: [
                { name: 'Ch 6.2', title: 'Derivative Exponential function', ideaCount: 2 },
                { name: 'Ch 6.4', title: 'Derivative Logarithmic function', ideaCount: 1 },
                { name: 'Ch 6.6', title: 'Inverse Trig Functions', ideaCount: 1 },
                { name: 'Ch 6.5', title: 'Exponential Growth and Decay', ideaCount: 1 },
                { name: 'Ch 6.7', title: 'Hyperbolic functions and their derivatives', ideaCount: 1 },
                { name: 'Ch 2.9', title: 'Linear approximation and differentials', ideaCount: 1 },
            ]
        },
        {
            id: 4,
            title: 'Module 4 - L\'Hospital, Extrema & Newton\'s Method',
            desc: 'صيغ عدم التعيين وقاعدة لوبيتال، القيم العظمى والصغرى، وطريقة نيوتن.',
            chapters: [
                { name: 'Ch 6.8', title: 'Indeterminate Forms and L\'Hospital\'s Rule', ideaCount: 3 },
                { name: 'Ch 3.1', title: 'Maximum and Minimum Values', ideaCount: 3 },
                { name: 'Ch 3.8', title: 'Newton’s Method', ideaCount: 2 },
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

                {/* 🌟 إضافة قسم بنك الأسئلة وتسريبات الاختبارات */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    {/* بطاقة بنك الأسئلة */}
                    <Link
                        href={isAuthorized ? "/workspace/101/question-bank" : "#"}
                        onClick={(e) => handleExtraFeatureClick(e, "بنك الأسئلة")}
                        style={{
                            textDecoration: 'none',
                            background: '#ffffff',
                            border: '1px solid #e6dec5',
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{ fontSize: '32px', background: '#FEECD0', padding: '12px', borderRadius: '12px' }}>
                            ❓
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#2C3531', fontWeight: 'bold' }}>
                                بنك الأسئلة الشامل
                            </h3>
                            <p style={{ margin: 0, fontSize: '13px', color: '#4A5550' }}>
                                تدرب على أسئلة متنوعة ومتوسطة وصعبة لجميع الشباتر.
                            </p>
                        </div>
                    </Link>

                    {/* بطاقة الاختبارات - أزرار مباشرة لكل اختبار */}
                    <div
                        style={{
                            background: '#ffffff',
                            border: '1px solid #e6dec5',
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            transition: 'all 0.3s ease',
                            minWidth: 0
                        }}
                    >
                        <div style={{ fontSize: '32px', background: '#fee2e2', padding: '12px', borderRadius: '12px', flexShrink: 0 }}>
                            🔥
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#2C3531', fontWeight: 'bold' }}>
                                الاختبارات والمراجعات
                            </h3>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: '6px',
                                    width: '100%'
                                }}
                            >
                                {courseExams.map((exam) => {
                                    const isOpen = isAuthorized && quizAccess[exam.id] === true

                                    return (
                                        <div
                                            key={exam.id}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '4px',
                                                flex: '1 1 0',
                                                minWidth: 0
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleExamClick(exam)}
                                                title={isOpen ? `${exam.title} - متاح` : `${exam.title} - مقفل`}
                                                style={{
                                                    width: exam.id === 'midterm' ? '44px' : '38px',
                                                    height: exam.id === 'midterm' ? '44px' : '38px',
                                                    borderRadius: '50%',
                                                    border: isOpen ? '2px solid #DCA27B' : '1px solid #cbd5e1',
                                                    background: isOpen ? '#FEECD0' : '#f1f5f9',
                                                    color: isOpen ? '#8c5521' : '#64748b',
                                                    fontSize: exam.id === 'midterm' ? '10px' : '11px',
                                                    fontWeight: 'bold',
                                                    cursor: isAuthorized && isOpen ? 'pointer' : 'not-allowed',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: 0,
                                                    position: 'relative',
                                                    flexShrink: 0
                                                }}
                                            >
                                                {exam.label}

                                                {!isOpen && (
                                                    <span
                                                        style={{
                                                            position: 'absolute',
                                                            right: '-4px',
                                                            bottom: '-4px',
                                                            width: '17px',
                                                            height: '17px',
                                                            borderRadius: '50%',
                                                            background: '#ffffff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '9px',
                                                            border: '1px solid #e2e8f0'
                                                        }}
                                                    >
                                                        🔒
                                                    </span>
                                                )}
                                            </button>

                                            <span
                                                style={{
                                                    fontSize: '9px',
                                                    color: isOpen ? '#8c5521' : '#64748b',
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {exam.id === 'midterm'
                                                    ? 'Mid'
                                                    : exam.id === 'quiz-1'
                                                        ? 'Quiz 1'
                                                        : exam.id === 'quiz-2'
                                                            ? 'Quiz 2'
                                                            : exam.id === 'quiz-3'
                                                                ? 'Quiz 3'
                                                                : 'Quiz 4'}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
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
                                        {mod.chapters.map((ch, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '4px'
                                                }}
                                            >
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
                                                    title={ch.title}
                                                >
                                                    📖 {ch.name}
                                                </span>

                                                {isExpanded && !isLocked && (
                                                    <span
                                                        style={{
                                                            fontSize: '11px',
                                                            color: '#DCA27B',
                                                            fontWeight: 'bold',
                                                            paddingLeft: '6px'
                                                        }}
                                                    >
                                                        ✨ {ch.ideaCount} {ch.ideaCount === 1 ? 'فكرة رئيسية' : 'أفكار رئيسية'}
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
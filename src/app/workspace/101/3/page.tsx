'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import GlobalTutor from '@/components/GlobalTutor'
import { supabase } from '@/lib/supabase'

export default function Module3Page() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const chapterParam = searchParams.get('chapter') as '6.2' | '6.4' | '6.6' | '6.5' | '6.7' | '2.9' | null
    const ideaParam = searchParams.get('idea')

    // بدون chapter في الرابط = صفحة Module 1 الرئيسية التي تعرض كل الشباتر.
    // مع ?chapter=1.5 مثلاً = نفس الصفحة تعرض Chapter 1.5 فقط.
    const [activeChapter, setActiveChapter] = useState<'6.2' | '6.4' | '6.6' | '6.5' | '6.7' | '2.9'>(chapterParam || '6.2')
    const [activeIdea, setActiveIdea] = useState('idea-1')

    const [completedChapters, setCompletedChapters] = useState<string[]>([])

    const [selected, setSelected] = useState<string | null>(null)
    const [hasAttempted, setHasAttempted] = useState(false)
    const [showSolutionBox, setShowSolutionBox] = useState(false)

    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [isFadingOut, setIsFadingOut] = useState(false)

    const [errorMsg, setErrorMsg] = useState('')
    const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | null>(null)

    const [userId, setUserId] = useState<string | null>(null)
    const [isAiAllowed, setIsAiAllowed] = useState(false)

    // الشباتر والأفكار الخاصة بـ Module 3
    const chaptersData = {
        '6.2': {
            title: '6.2 مشتقة الدالة الأسية (Derivative Exponential function)',
            ideas: [
                { id: 'idea-1', name: 'اشتقاق الدوال الأسية الطبيعية (e^x) والعامة (a^x)' },
                { id: 'idea-2', name: 'حساب نهايات الدوال الأسية عند اللانهاية والصفر' }
            ]
        },
        '6.4': {
            title: '6.4 مشتقة الدالة اللوغاريتمية (Derivative Logarithmic function)',
            ideas: [
                { id: 'idea-1', name: 'اشتقاق الدوال اللوغاريتمية الطبيعية والعامة باستخدام القواعد' }
            ]
        },
        '6.6': {
            title: '6.6 مشتقات الدوال المثلثية العكسية (Inverse Trig Functions)',
            ideas: [
                { id: 'idea-1', name: 'تطبيق قوانين الاشتقاق لدوال المثلثية العكسية (sin^-1, cos^-1, tan^-1)' }
            ]
        },
        '6.5': {
            title: '6.5 النمو الاضمحلال الأسي (Exponential Growth and Decay)',
            ideas: [
                { id: 'idea-1', name: 'حل مسائل النمو السكاني، الاضمحلال الإشعاعي، ونصف العمر' }
            ]
        },
        '6.7': {
            title: '6.7 الدوال الزائدية ومشتقاتها (Hyperbolic functions)',
            ideas: [
                { id: 'idea-1', name: 'حساب مشتقات الدوال الزائدية (sinh, cosh, tanh) وتطبيقاتها' }
            ]
        },
        '2.9': {
            title: '2.9 التقريب الخطي والتفاضلات (Linear approximation)',
            ideas: [
                { id: 'idea-1', name: 'إيجاد التقريب الخطي للدالة وتقدير نسب الأخطاء في القياسات' }
            ]
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('last_studied_module', '3')
            const savedProgress = localStorage.getItem('module_3_completed_items')
            if (savedProgress) setCompletedChapters(JSON.parse(savedProgress))
        }

        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                const currentUserId = session.user.id
                setUserId(currentUserId)

                const { data, error } = await supabase
                    .from('user_courses')
                    .select('is_ai_allowed')
                    .eq('user_id', currentUserId)
                    .eq('course_id', '101')
                    .single()

                if (!error && data) {
                    setIsAiAllowed(data.is_ai_allowed)
                }
            }
        })
    }, [])

    const totalModuleProgress = Math.round((completedChapters.length / 7) * 100)
    const validChapters = ['6.2', '6.4', '6.6', '6.5', '6.7', '2.9'] as const
    const isChapterView = chapterParam !== null && validChapters.includes(chapterParam as any)

    useEffect(() => {
        if (chapterParam && validChapters.includes(chapterParam as any)) {
            setActiveChapter(chapterParam)

            const ideasForChapter = chaptersData[chapterParam].ideas
            const validIdea = ideaParam && ideasForChapter.some(idea => idea.id === ideaParam)
                ? ideaParam
                : 'idea-1'

            setActiveIdea(validIdea)
            setSelected(null)
            setHasAttempted(false)
            setShowSolutionBox(false)
            setErrorMsg('')
        }
    }, [chapterParam, ideaParam])

    function openChapter(chKey: '6.2' | '6.4' | '6.6' | '6.5' | '6.7' | '2.9') {
        router.push(`/workspace/101/3?chapter=${encodeURIComponent(chKey)}`)
    }

    function backToModule() {
        router.push('/workspace/101/3')
    }

    function handleChapterSwitch(chKey: '6.2' | '6.4' | '6.6' | '6.5' | '6.7' | '2.9', ideaId: string) {
        setActiveChapter(chKey)
        setActiveIdea(ideaId)
        setSelected(null)
        setHasAttempted(false)
        setShowSolutionBox(false)
        setErrorMsg('')

        router.push(`/workspace/101/3?chapter=${encodeURIComponent(chKey)}&idea=${encodeURIComponent(ideaId)}`)
    }

    function handleAskAIExample(conceptName: string) {
        const promptText = `Can you give me a clear, step-by-step mathematical example of "${conceptName}" in Calculus, and explain how to solve it?`
        setTutorInitialPrompt(promptText)
    }

    const quizData: Record<string, {
        question: string
        options: string[]
        correct: string
        explanation: string
    }> = {
        '6.2-idea-1': {
            question: 'ما القاعدة الصحيحة لمشتقة e^x ومشتقة a^x؟',
            options: [
                'A) مشتقة e^x هي نفس الدالة، ومشتقة a^x تضرب في ln(a)',
                'B) مشتقة كل دالة أسية تساوي صفراً',
                'C) مشتقة a^x تساوي a فقط'
            ],
            correct: 'A) مشتقة e^x هي نفس الدالة، ومشتقة a^x تضرب في ln(a)',
            explanation: 'مشتقة e^x هي e^x، ومشتقة a^x هي a^x ln(a)، مع قاعدة السلسلة عند الحاجة.'
        },
        '6.2-idea-2': {
            question: 'ما الفكرة الأساسية عند دراسة نهايات الدوال الأسية عند اللانهاية أو الصفر؟',
            options: [
                'A) دراسة السلوك عند المالانهاية والصفر باستخدام الخصائص الأسية',
                'B) اعتبار جميع النهايات الأسية مساوية لواحد',
                'C) استبدال الدالة الأسية بدالة خطية دائماً'
            ],
            correct: 'A) دراسة السلوك عند المالانهاية والصفر باستخدام الخصائص الأسية',
            explanation: 'سلوك الدوال الأسية يعتمد على الأساس وإشارة الأس، لذلك ندرس النمو أو الاقتراب من الصفر وفق الخصائص الأسية.'
        },
        '6.4-idea-1': {
            question: 'ما القاعدة الأساسية لمشتقة ln(x)؟',
            options: [
                'A) مشتقة ln(x) تساوي 1/x مع تطبيق قاعدة السلسلة للدوال المركبة',
                'B) مشتقة ln(x) تساوي x',
                'C) مشتقة ln(x) تساوي e^x'
            ],
            correct: 'A) مشتقة ln(x) تساوي 1/x مع تطبيق قاعدة السلسلة للدوال المركبة',
            explanation: 'مشتقة ln(x) هي 1/x، وإذا كان داخل اللوغاريتم دالة u(x) تصبح المشتقة u\'(x)/u(x).'
        },
        '6.6-idea-1': {
            question: 'كيف تُشتق الدوال المثلثية العكسية؟',
            options: [
                'A) استخدام القواعد الجبرية المعتمدة لكل دالة مثلثية عكسية',
                'B) معاملتها كالدوال المثلثية العادية تماماً',
                'C) مشتقتها تساوي صفراً دائماً'
            ],
            correct: 'A) استخدام القواعد الجبرية المعتمدة لكل دالة مثلثية عكسية',
            explanation: 'لكل دالة مثلثية عكسية قانون مشتقة خاص، ويُدمج مع قاعدة السلسلة عند وجود تركيب.'
        },
        '6.5-idea-1': {
            question: 'ما النموذج الشائع لمسائل النمو والاضمحلال الأسي؟',
            options: [
                'A) تطبيق معادلة النمو أو الاضمحلال y(t) = y_0 * e^(kt)',
                'B) y(t)=y_0+k فقط في جميع المسائل',
                'C) استخدام طريقة نيوتن لكل قيمة'
            ],
            correct: 'A) تطبيق معادلة النمو أو الاضمحلال y(t) = y_0 * e^(kt)',
            explanation: 'النمو والاضمحلال المستمران يوصفان غالباً بالصيغة y(t)=y0 e^(kt)، وتحدد إشارة k نوع السلوك.'
        },
        '6.7-idea-1': {
            question: 'كيف نتعامل مع مشتقات الدوال الزائدية؟',
            options: [
                'A) حساب التفاضل باستخدام قواعد sinh و cosh الأساسية',
                'B) اعتبار sinh و cosh ثوابت',
                'C) استخدام قوانين المثلثات العكسية بدلاً منها'
            ],
            correct: 'A) حساب التفاضل باستخدام قواعد sinh و cosh الأساسية',
            explanation: 'من القواعد الأساسية: مشتقة sinh(x)=cosh(x)، ومشتقة cosh(x)=sinh(x).'
        },
        '2.9-idea-1': {
            question: 'ما الصيغة المستخدمة للتقريب الخطي للدالة قرب x=a؟',
            options: [
                'A) استخدام المماس L(x) = f(a) + f\'(a)(x-a) لتقدير القيم',
                'B) L(x)=f(x)^2 دائماً',
                'C) استخدام متوسط f(a) و f(x) فقط'
            ],
            correct: 'A) استخدام المماس L(x) = f(a) + f\'(a)(x-a) لتقدير القيم',
            explanation: 'التقريب الخطي يستخدم خط المماس عند a لتقدير قيم الدالة القريبة منها.'
        }
    }

    const currentQuiz = quizData[`${activeChapter}-${activeIdea}`]

    function handleQuizVerify() {
        setErrorMsg('')
        setHasAttempted(true)
        setShowSolutionBox(false)

        const currentKey = `${activeChapter}-${activeIdea}`
        const isCorrect = !!currentQuiz && selected === currentQuiz.correct

        if (isCorrect) {
            setIsFadingOut(false)
            setShowSuccessToast(true)

            setTimeout(() => { setIsFadingOut(true) }, 2000)
            setTimeout(() => { setShowSuccessToast(false); setIsFadingOut(false) }, 2500)

            let updatedList = [...completedChapters]
            if (!updatedList.includes(currentKey)) {
                updatedList.push(currentKey)
                setCompletedChapters(updatedList)
                localStorage.setItem('module_3_completed_items', JSON.stringify(updatedList))
            }
        } else {
            setErrorMsg('❌ إجابة خاطئة، حاول مرة أخرى!')
        }
    }

    const currentChapterInfo = chaptersData[activeChapter]
    const currentIdeaObj = currentChapterInfo.ideas.find(i => i.id === activeIdea) || currentChapterInfo.ideas[0]

    return (
        <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', color: '#2C3531', fontFamily: 'sans-serif', margin: 0, padding: 0, paddingBottom: '80px' }}>
            <Navbar isLoggedIn={true} />

            {showSuccessToast && (
                <div style={{
                    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: '#CDD4B1', color: '#2C3531', border: '1px solid #b8c29e',
                    padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    zIndex: 9999, fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px',
                    opacity: isFadingOut ? 0 : 1, transition: 'opacity 0.5s ease-in-out'
                }}>
                    <span>🎉 كفو! حليت صح وتم حفظ تقدمك</span>
                </div>
            )}

            <div style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 20px' }}>

                <div style={{ marginBottom: '16px' }}>
                    <Link href="/workspace/101" style={{ textDecoration: 'none', background: '#FEECD0', border: '1px solid #e6dec5', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', color: '#8c5521', fontSize: '13px' }}>
                        ⬅️ Back to Workspace
                    </Link>
                </div>

                {/* لوحة التقدم العام */}
                <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#DCA27B' }}>
                          📘 Module 3 (تقدم المقرر الإجمالي: {totalModuleProgress}%)
                        </span>
                        <span style={{ fontSize: '12px', color: '#8c5521', fontWeight: 'bold' }}>6 شباتر رئيسية</span>
                    </div>
                    <div style={{ background: '#f0ebdc', borderRadius: '20px', height: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${totalModuleProgress}%`, background: '#CDD4B1', height: '100%', transition: 'width 0.3s' }} />
                    </div>
                </div>

                {/* صفحة Module 3 الرئيسية: تعرض الشباتر فقط */}
                {!isChapterView && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '16px',
                        marginBottom: '20px'
                    }}>
                        {Object.entries(chaptersData).map(([chKey, chVal]) => {
                            const completedIdeas = chVal.ideas.filter(idea =>
                                completedChapters.includes(`${chKey}-${idea.id}`)
                            ).length

                            return (
                                <button
                                    key={chKey}
                                    type="button"
                                    onClick={() => openChapter(chKey as '6.2' | '6.4' | '6.6' | '6.5' | '6.7' | '2.9')}
                                    style={{
                                        width: '100%',
                                        background: '#ffffff',
                                        border: '1px solid #e6dec5',
                                        borderRadius: '14px',
                                        padding: '20px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                        cursor: 'pointer',
                                        textAlign: 'right',
                                        color: '#2C3531'
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '10px' }}>
                                        📖 {chVal.title}
                                    </div>
                                    <div style={{ color: '#8c5521', fontSize: '12px', marginBottom: '12px' }}>
                                        {chVal.ideas.length} أفكار • مكتمل {completedIdeas}/{chVal.ideas.length}
                                    </div>
                                    <div style={{ background: '#f0ebdc', height: '7px', borderRadius: '20px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                width: `${(completedIdeas / chVal.ideas.length) * 100}%`,
                                                background: '#CDD4B1',
                                                height: '100%'
                                            }}
                                        />
                                    </div>
                                    <div style={{ marginTop: '14px', color: '#DCA27B', fontWeight: 'bold', fontSize: '13px' }}>
                                        فتح الشابتر ←
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* داخل الشابتر: لا نعرض بقية الشباتر، فقط أفكار الشابتر الحالي */}
                {isChapterView && (
                    <>
                        <div style={{ marginBottom: '16px' }}>
                            <button
                                type="button"
                                onClick={backToModule}
                                style={{
                                    background: '#FEECD0',
                                    border: '1px solid #e6dec5',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    color: '#8c5521',
                                    fontSize: '13px',
                                    cursor: 'pointer'
                                }}
                            >
                                ⬅️ الرجوع إلى Module 3
                            </button>
                        </div>

                        <div style={{
                            background: '#ffffff',
                            border: '1px solid #e6dec5',
                            borderRadius: '16px',
                            padding: '20px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}>
                            <h2 style={{ margin: '0 0 16px', fontSize: '1.15rem', color: '#2C3531' }}>
                                📖 {currentChapterInfo.title}
                            </h2>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {currentChapterInfo.ideas.map((idea) => {
                                    const isIdeaActive = activeIdea === idea.id
                                    const isCompleted = completedChapters.includes(`${activeChapter}-${idea.id}`)

                                    return (
                                        <button
                                            key={idea.id}
                                            type="button"
                                            onClick={() => handleChapterSwitch(activeChapter, idea.id)}
                                            style={{
                                                padding: '10px 14px',
                                                borderRadius: '8px',
                                                border: '1px solid #e6dec5',
                                                background: isIdeaActive ? '#DCA27B' : '#FFF9E2',
                                                color: isIdeaActive ? '#ffffff' : '#2C3531',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                fontSize: '13px'
                                            }}
                                        >
                                            💡 {idea.name} {isCompleted ? '✅' : ''}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                )}

                {isChapterView && (
                    <>
                        {/* صندوق خطوات الحل (How to Solve) */}
                        <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                                <h3 style={{ margin: 0, color: '#2C3531', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    📖 خطوات الحل الشرحية - ({currentChapterInfo.title} : {currentIdeaObj.name})
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => handleAskAIExample(currentIdeaObj.name)}
                                    style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    ✨ اسأل التوتور مثال إضافي
                                </button>
                            </div>

                            <div style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.7' }}>
                                <ul style={{ margin: 0, paddingRight: '20px' }}>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 1: التحليل الأولي للمفهوم (Core Analysis)</strong><br />
                                        فهم المعطيات الرياضية المرتبطة بـ &quot;{currentIdeaObj.name}&quot; وتحديد الهدف المطلوب بدقة.
                                    </li>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 2: تطبيق القوانين والقواعد الجبرية (Rule Application)</strong><br />
                                        استخدام النظريات المعتمدة في هذا الشابتر للوصول إلى الخطوة قبل الأخيرة.
                                    </li>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 3: استنتاج النتيجة النهائية (Final Solution)</strong><br />
                                        التحقق من صحة الناتج واستيفاء كافة الشروط الرياضية للنظرية.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* فيديو الشرح */}
                        <div style={{ background: '#fff', border: '1px solid #e6dec5', padding: '20px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#2C3531', fontSize: '1rem' }}>📺 فيديو الشرح التوضيحي</h4>
                            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                                <iframe
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                    title="Lesson Explanation"
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>

                        {/* الأسئلة والتدريبات */}
                        <div style={{ background: '#fff', border: '1px solid #e6dec5', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#2C3531', fontSize: '1rem' }}>📝 سؤال تدريبي لتثبيت الفهم</h4>
                            <p style={{ color: '#4A5550', fontWeight: 'bold' }}>
                                {currentQuiz?.question || `سؤال حول: ${currentIdeaObj.name}`}
                            </p>

                            <div style={{ margin: '16px 0' }}>
                                {(currentQuiz?.options || []).map((opt) => (
                                    <label key={opt} style={{ display: 'block', margin: '8px 0', padding: '10px', background: selected === opt ? '#FEECD0' : '#FFF9E2', border: '1px solid #e6dec5', borderRadius: '8px', cursor: 'pointer', color: '#2C3531', fontSize: '13px' }}>
                                        <input
                                            type="radio"
                                            name="opts"
                                            checked={selected === opt}
                                            onChange={() => setSelected(opt)}
                                            style={{ marginRight: '8px' }}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>

                            {errorMsg && (
                                <p style={{ color: '#991b1b', fontWeight: 'bold', marginBottom: '12px', fontSize: '13px' }}>{errorMsg}</p>
                            )}

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <button type="button" onClick={handleQuizVerify} style={{ background: '#DCA27B', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                                    تحقق من الإجابة واحفظ التقدم
                                </button>

                                {hasAttempted && (
                                    <button
                                        type="button"
                                        onClick={() => setShowSolutionBox(!showSolutionBox)}
                                        style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                    >
                                        {showSolutionBox ? 'إخفاء الحل المفصل 🔼' : '🔍 إظهار الحل المفصل'}
                                    </button>
                                )}
                            </div>

                            {showSolutionBox && (
                                <div style={{ marginTop: '20px', background: '#FFF9E2', border: '1px solid #e6dec5', padding: '16px', borderRadius: '12px', color: '#2C3531', lineHeight: '1.7' }}>
                                    <h5 style={{ margin: '0 0 10px 0', color: '#8c5521', fontSize: '1rem' }}>💡 الحل المفصل والشرح:</h5>
                                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{currentQuiz?.explanation}</p>
                                </div>
                            )}
                        </div>

                    </>
                )}

                {isChapterView && (
                    <GlobalTutor
                        currentModule={3}
                        currentChapter={activeChapter as any}
                        currentQuestion={currentIdeaObj.name}
                        initialPrompt={tutorInitialPrompt}
                        isAiAllowed={isAiAllowed}
                    />
                )}

            </div>
        </div>
    )
}
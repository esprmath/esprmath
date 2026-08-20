'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import GlobalTutor from '@/components/GlobalTutor'
import { supabase } from '@/lib/supabase'

export default function Module4Page() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const chapterParam = searchParams.get('chapter') as '6.8' | '3.1' | '3.8' | null
    const ideaParam = searchParams.get('idea')

    // بدون chapter في الرابط = صفحة Module 1 الرئيسية التي تعرض كل الشباتر.
    // مع ?chapter=1.5 مثلاً = نفس الصفحة تعرض Chapter 1.5 فقط.
    const [activeChapter, setActiveChapter] = useState<'6.8' | '3.1' | '3.8'>(chapterParam || '6.8')
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

    // الشباتر والأفكار الخاصة بـ Module 4
    const chaptersData = {
        '6.8': {
            title: '6.8 صيغ عدم التعيين وقاعدة لوبيتال (L\'Hospital\'s Rule)',
            ideas: [
                { id: 'idea-1', name: 'التعرف على صيغ عدم التعيين (0/0) و (∞/∞) وتطبيق قاعدة لوبيتال' },
                { id: 'idea-2', name: 'التعامل مع صيغ عدم التعيين الأخرى (مثل 0*∞ و ∞-∞)' }
            ]
        },
        '3.1': {
            title: '3.1 القيم العظمى والصغرى (Maximum and Minimum Values)',
            ideas: [
                { id: 'idea-1', name: 'تعريف القيم العظمى والصغرى المطلقة والمحلية للدالة' },
                { id: 'idea-2', name: 'إيجاد الأعداد الحرجة (Critical Numbers) للدالة' }
            ]
        },
        '3.8': {
            title: '3.8 طريقة نيوتن (Newton’s Method)',
            ideas: [
                { id: 'idea-1', name: 'استخدام خوارزمية نيوتن-رافسون لتقدير جذور المعادلات وتطبيق الصيغة التكرارية' }
            ]
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('last_studied_module', '4')
            const savedProgress = localStorage.getItem('module_4_completed_items')
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

    const totalModuleProgress = Math.round((completedChapters.length / 5) * 100)
    const validChapters = ['6.8', '3.1', '3.8'] as const
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

    function openChapter(chKey: '6.8' | '3.1' | '3.8') {
        router.push(`/workspace/101/4?chapter=${encodeURIComponent(chKey)}`)
    }

    function backToModule() {
        router.push('/workspace/101/4')
    }

    function handleChapterSwitch(chKey: '6.8' | '3.1' | '3.8', ideaId: string) {
        setActiveChapter(chKey)
        setActiveIdea(ideaId)
        setSelected(null)
        setHasAttempted(false)
        setShowSolutionBox(false)
        setErrorMsg('')

        router.push(`/workspace/101/4?chapter=${encodeURIComponent(chKey)}&idea=${encodeURIComponent(ideaId)}`)
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
        '6.8-idea-1': {
            question: 'متى يمكن تطبيق قاعدة لوبيتال مباشرة على نهاية؟',
            options: [
                'A) اشتقاق البسط والمقام بشكل منفصل لحساب النهاية عند وجود 0/0 أو ∞/∞',
                'B) في أي نهاية حتى لو لم تكن غير معينة',
                'C) عند وجود قيمة ثابتة في البسط فقط'
            ],
            correct: 'A) اشتقاق البسط والمقام بشكل منفصل لحساب النهاية عند وجود 0/0 أو ∞/∞',
            explanation: 'تطبق قاعدة لوبيتال على صورتي عدم التعيين 0/0 و∞/∞ بعد التحقق من الشروط.'
        },
        '6.8-idea-2': {
            question: 'كيف نتعامل مع صورة عدم تعيين مثل 0·∞ أو ∞−∞؟',
            options: [
                'A) إعادة صياغة العمليات الجبرية لتحويلها إلى صور قابلة لتطبيق لوبيتال',
                'B) تطبيق لوبيتال مباشرة دون أي تحويل',
                'C) اعتبار النهاية غير موجودة دائماً'
            ],
            correct: 'A) إعادة صياغة العمليات الجبرية لتحويلها إلى صور قابلة لتطبيق لوبيتال',
            explanation: 'نعيد صياغة هذه الصور إلى كسر ينتج 0/0 أو ∞/∞، ثم نطبق لوبيتال عند تحقق الشروط.'
        },
        '3.1-idea-1': {
            question: 'ما الهدف عند دراسة القيم العظمى والصغرى المطلقة والمحلية؟',
            options: [
                'A) تحديد القمم والقيعان المحلية والمطلقة على النطاق المعرف',
                'B) إيجاد خط التقارب الأفقي فقط',
                'C) حساب النهاية عند الصفر فقط'
            ],
            correct: 'A) تحديد القمم والقيعان المحلية والمطلقة على النطاق المعرف',
            explanation: 'ندرس قيم الدالة ومعلومات المشتقة لتحديد القيم القصوى المحلية أو المطلقة.'
        },
        '3.1-idea-2': {
            question: 'كيف نجد الأعداد الحرجة للدالة؟',
            options: [
                'A) إيجاد النقاط التي تكون فيها المشتقة صفراً أو غير موجودة',
                'B) إيجاد النقاط التي تكون فيها الدالة مساوية لواحد فقط',
                'C) استخدام النهاية عند اللانهاية فقط'
            ],
            correct: 'A) إيجاد النقاط التي تكون فيها المشتقة صفراً أو غير موجودة',
            explanation: 'العدد الحرج يقع في مجال الدالة ويحقق f\'(c)=0 أو تكون المشتقة غير موجودة عنده.'
        },
        '3.8-idea-1': {
            question: 'ما الصيغة التكرارية لطريقة نيوتن؟',
            options: [
                'A) استخدام الصيغة التكرارية x_{n+1} = x_n - f(x_n)/f\'(x_n)',
                'B) x_{n+1}=x_n+f(x_n) فقط',
                'C) x_{n+1}=f\'(x_n) فقط'
            ],
            correct: 'A) استخدام الصيغة التكرارية x_{n+1} = x_n - f(x_n)/f\'(x_n)',
            explanation: 'تبدأ طريقة نيوتن بتخمين أولي ثم تستخدم المماس للحصول على تقريبات متتالية لجذر f(x)=0.'
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
                localStorage.setItem('module_4_completed_items', JSON.stringify(updatedList))
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
                          📘 Module 4 (تقدم المقرر الإجمالي: {totalModuleProgress}%)
                        </span>
                        <span style={{ fontSize: '12px', color: '#8c5521', fontWeight: 'bold' }}>3 شباتر رئيسية</span>
                    </div>
                    <div style={{ background: '#f0ebdc', borderRadius: '20px', height: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${totalModuleProgress}%`, background: '#CDD4B1', height: '100%', transition: 'width 0.3s' }} />
                    </div>
                </div>

                {/* صفحة Module 4 الرئيسية: تعرض الشباتر فقط */}
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
                                    onClick={() => openChapter(chKey as '6.8' | '3.1' | '3.8')}
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
                                ⬅️ الرجوع إلى Module 4
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
                        currentModule={4}
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
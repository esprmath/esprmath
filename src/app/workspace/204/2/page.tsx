'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import GlobalTutor from '@/components/GlobalTutor'
import { supabase } from '@/lib/supabase'

export default function Module2Page() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const chapterParam = searchParams.get('chapter') as '2.3' | '2.4' | '2.5' | '2.6' | '2.7' | null
    const ideaParam = searchParams.get('idea')

    // بدون chapter في الرابط = صفحة Module 1 الرئيسية التي تعرض كل الشباتر.
    // مع ?chapter=1.5 مثلاً = نفس الصفحة تعرض Chapter 1.5 فقط.
    const [activeChapter, setActiveChapter] = useState<'2.3' | '2.4' | '2.5' | '2.6' | '2.7'>(chapterParam || '2.3')
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

    // الشباتر والأفكار الخاصة بـ Module 2
    const chaptersData = {
        '2.3': {
            title: '2.3 قواعد الاشتقاق (Derivative Formulae)',
            ideas: [
                { id: 'idea-1', name: 'قواعد الاشتقاق الأساسية (القوة، الثابت، المجموع، الفرق)' },
                { id: 'idea-2', name: 'قاعدة الضرب وقاعدة القسمة للدوال المركبة والكسرية' }
            ]
        },
        '2.4': {
            title: '2.4 مشتقات الدوال المثلثية (Derivatives of trigonometric functions)',
            ideas: [
                { id: 'idea-1', name: 'حساب مشتقات الدوال المثلثية الست الأساسية' },
                { id: 'idea-2', name: 'دمج مشتقات الدوال المثلثية مع قواعد الضرب والقسمة' }
            ]
        },
        '2.5': {
            title: '2.5 قاعدة السلسلة (Chain Rule)',
            ideas: [
                { id: 'idea-1', name: 'اشتقاق الدوال المركبة (دالة داخل دالة) باستخدام السلسلة' }
            ]
        },
        '2.6': {
            title: '2.6 الاشتقاق الضمني (Implicit Differentiation)',
            ideas: [
                { id: 'idea-1', name: 'إيجاد المشتقة (y\') للدوال المعرفة ضمنياً بالنسبة لـ x' }
            ]
        },
        '2.7': {
            title: '2.7 معدلات التغير في العلوم الطبيعية والاجتماعية (Rates of Change)',
            ideas: [
                { id: 'idea-1', name: 'تطبيق معدلات التغير المرتبطة في المجالات الفيزيائية والاقتصادية' }
            ]
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('last_studied_module', '2')
            const savedProgress = localStorage.getItem('module_2_completed_items')
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
    const validChapters = ['2.3', '2.4', '2.5', '2.6', '2.7'] as const
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

    function openChapter(chKey: '2.3' | '2.4' | '2.5' | '2.6' | '2.7') {
        router.push(`/workspace/101/2?chapter=${encodeURIComponent(chKey)}`)
    }

    function backToModule() {
        router.push('/workspace/101/2')
    }

    function handleChapterSwitch(chKey: '2.3' | '2.4' | '2.5' | '2.6' | '2.7', ideaId: string) {
        setActiveChapter(chKey)
        setActiveIdea(ideaId)
        setSelected(null)
        setHasAttempted(false)
        setShowSolutionBox(false)
        setErrorMsg('')

        router.push(`/workspace/101/2?chapter=${encodeURIComponent(chKey)}&idea=${encodeURIComponent(ideaId)}`)
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
        '2.3-idea-1': {
            question: 'ما القاعدة الأساسية لاشتقاق x^n، وما مشتقة الثابت؟',
            options: [
                'A) تطبيق قاعدة القوة n*x^(n-1) ومشتقة الثابت بصفر',
                'B) مشتقة x^n تساوي x^(n+1) ومشتقة الثابت هي الثابت نفسه',
                'C) نستخدم قاعدة القسمة في جميع الحالات'
            ],
            correct: 'A) تطبيق قاعدة القوة n*x^(n-1) ومشتقة الثابت بصفر',
            explanation: 'قاعدة القوة تعطي n*x^(n-1)، ومشتقة أي ثابت تساوي صفراً.'
        },
        '2.3-idea-2': {
            question: 'ما الفكرة الأساسية في قاعدة الضرب عند اشتقاق حاصل ضرب دالتين؟',
            options: [
                'A) الأولى في مشتقة الثانية + الثانية في مشتقة الأولى (للضرب)',
                'B) نشتق الدالتين ثم نضرب المشتقتين فقط',
                'C) نقسم مشتقة الأولى على مشتقة الثانية'
            ],
            correct: 'A) الأولى في مشتقة الثانية + الثانية في مشتقة الأولى (للضرب)',
            explanation: 'إذا y=uv فإن y\'=u v\' + v u\'. أما الكسور فتستخدم قاعدة القسمة.'
        },
        '2.4-idea-1': {
            question: 'أي عبارة صحيحة عن مشتقات sin(x) و cos(x)؟',
            options: [
                'A) مشتقة sin هي cos ومشتقة cos هي -sin',
                'B) مشتقة sin هي -cos ومشتقة cos هي sin',
                'C) مشتقتهما تساوي صفراً'
            ],
            correct: 'A) مشتقة sin هي cos ومشتقة cos هي -sin',
            explanation: 'من القواعد الأساسية: مشتقة sin(x) هي cos(x)، ومشتقة cos(x) هي -sin(x).'
        },
        '2.4-idea-2': {
            question: 'كيف نتعامل مع دالة مثلثية موجودة داخل حاصل ضرب أو قسمة؟',
            options: [
                'A) تطبيق قواعد الاشتقاق العامة مع الدوال المثلثية بمرونة',
                'B) نشتق الجزء المثلثي فقط ونتجاهل بقية الدالة',
                'C) نحول كل الدوال المثلثية إلى ثوابت'
            ],
            correct: 'A) تطبيق قواعد الاشتقاق العامة مع الدوال المثلثية بمرونة',
            explanation: 'نستخدم مشتقات الدوال المثلثية مع قاعدة الضرب أو القسمة أو السلسلة حسب تركيب الدالة.'
        },
        '2.5-idea-1': {
            question: 'ما الخطوات الصحيحة عند تطبيق قاعدة السلسلة على دالة مركبة؟',
            options: [
                'A) اشتقاق الدالة الخارجية مع إبقاء الداخلية ثم الضرب في مشتقة الداخلية',
                'B) اشتقاق الدالة الداخلية فقط',
                'C) جمع الدالة الخارجية مع الداخلية دون اشتقاق'
            ],
            correct: 'A) اشتقاق الدالة الخارجية مع إبقاء الداخلية ثم الضرب في مشتقة الداخلية',
            explanation: 'قاعدة السلسلة للدالة f(g(x)) هي f\'(g(x))*g\'(x).'
        },
        '2.6-idea-1': {
            question: 'ما الإجراء الأساسي في الاشتقاق الضمني عندما يظهر y في المعادلة؟',
            options: [
                'A) اشتقاق الطرفين بالنسبة لـ x وإضافة y\' عند اشتقاق أي حد يحتوي على y',
                'B) اعتبار y ثابتاً دائماً',
                'C) حذف جميع الحدود التي تحتوي على y'
            ],
            correct: 'A) اشتقاق الطرفين بالنسبة لـ x وإضافة y\' عند اشتقاق أي حد يحتوي على y',
            explanation: 'لأن y دالة في x، فإن اشتقاق حدود تحتوي على y يستلزم ظهور y\'.'
        },
        '2.7-idea-1': {
            question: 'كيف نستخدم المشتقة في مسائل معدلات التغير التطبيقية؟',
            options: [
                'A) استخدام المشتقة كمعدل تغير زمني أو مكاني في التطبيقات العملية',
                'B) استخدام قيمة الدالة الابتدائية فقط',
                'C) تجاهل العلاقة بين المتغيرات'
            ],
            correct: 'A) استخدام المشتقة كمعدل تغير زمني أو مكاني في التطبيقات العملية',
            explanation: 'المشتقة تمثل معدل تغير كمية بالنسبة إلى أخرى، مثل السرعة والتسارع ومعدلات نمو الأحجام.'
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
                localStorage.setItem('module_2_completed_items', JSON.stringify(updatedList))
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
                          📘 Module 2 (تقدم المقرر الإجمالي: {totalModuleProgress}%)
                        </span>
                        <span style={{ fontSize: '12px', color: '#8c5521', fontWeight: 'bold' }}>5 شباتر رئيسية</span>
                    </div>
                    <div style={{ background: '#f0ebdc', borderRadius: '20px', height: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${totalModuleProgress}%`, background: '#CDD4B1', height: '100%', transition: 'width 0.3s' }} />
                    </div>
                </div>

                {/* صفحة Module 2 الرئيسية: تعرض الشباتر فقط */}
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
                                    onClick={() => openChapter(chKey as '2.3' | '2.4' | '2.5' | '2.6' | '2.7')}
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
                                ⬅️ الرجوع إلى Module 2
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
                        currentModule={2}
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
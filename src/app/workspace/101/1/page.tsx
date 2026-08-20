'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import GlobalTutor from '@/components/GlobalTutor'
import { supabase } from '@/lib/supabase'

export default function Module1Page() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const chapterParam = searchParams.get('chapter') as '1.5' | '1.6' | '2.1' | '1.8' | '3.4' | null
    const ideaParam = searchParams.get('idea')

    // بدون chapter في الرابط = صفحة Module 1 الرئيسية التي تعرض كل الشباتر.
    // مع ?chapter=1.5 مثلاً = نفس الصفحة تعرض Chapter 1.5 فقط.
    const [activeChapter, setActiveChapter] = useState<'1.5' | '1.6' | '2.1' | '1.8' | '3.4'>(chapterParam || '1.5')
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

    // الترتيب الدقيق حسب طلبك تماماً: 1.5 -> 1.6 -> 2.1 -> 1.8 -> 3.4
    const chaptersData = {
        '1.5': {
            title: '1.5 نهاية الدالة (Limit of a function)',
            ideas: [
                { id: 'idea-1', name: 'فهم مفهوم النهاية عددياً وبيانياً' },
                { id: 'idea-2', name: 'النهايات من اليمين واليسار ووجود النهاية' }
            ]
        },
        '1.6': {
            title: '1.6 قوانين النهايات (Limit Laws)',
            ideas: [
                { id: 'idea-1', name: 'الخصائص الجبرية والتعويض المباشر' },
                { id: 'idea-2', name: 'معالجة الحالات الصفرية (0/0) بالتحليل' }
            ]
        },
        '2.1': {
            title: '2.1 المماس ومعدل التغير والسرعة',
            ideas: [
                { id: 'idea-1', name: 'ميل المماس ومعدل التغير اللحظي' },
                { id: 'idea-2', name: 'السرعة اللحظية كفكرة أساسية' }
            ]
        },
        '1.8': {
            title: '1.8 الاتصال (Continuity)',
            ideas: [
                { id: 'idea-1', name: 'شروط الاتصال الثلاثة عند نقطة' },
                { id: 'idea-2', name: 'أنواع وأسباب عدم الاتصال' }
            ]
        },
        '3.4': {
            title: '3.4 النهايات عند اللانهاية والمحاذيات',
            ideas: [
                { id: 'idea-1', name: 'سلوك الدوال عند المالانهاية (±∞)' },
                { id: 'idea-2', name: 'إيجاد خطوط التقارب الأفقية' }
            ]
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('last_studied_module', '1')
            const savedProgress = localStorage.getItem('module_1_completed_items')
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

    const totalModuleProgress = Math.round((completedChapters.length / 10) * 100)
    const validChapters = ['1.5', '1.6', '2.1', '1.8', '3.4'] as const
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

    function openChapter(chKey: '1.5' | '1.6' | '2.1' | '1.8' | '3.4') {
        router.push(`/workspace/101/1?chapter=${encodeURIComponent(chKey)}`)
    }

    function backToModule() {
        router.push('/workspace/101/1')
    }

    function handleChapterSwitch(chKey: '1.5' | '1.6' | '2.1' | '1.8' | '3.4', ideaId: string) {
        setActiveChapter(chKey)
        setActiveIdea(ideaId)
        setSelected(null)
        setHasAttempted(false)
        setShowSolutionBox(false)
        setErrorMsg('')

        router.push(`/workspace/101/1?chapter=${encodeURIComponent(chKey)}&idea=${encodeURIComponent(ideaId)}`)
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
        '1.5-idea-1': {
            question: 'ما الطريقة الأساسية لفهم قيمة نهاية الدالة عند اقتراب x من c؟',
            options: [
                'A) مراقبة قيم الدالة عددياً وبيانياً عندما يقترب x من c',
                'B) استخدام قيمة الدالة عند c فقط دون النظر لما حولها',
                'C) افتراض أن النهاية دائماً تساوي صفراً'
            ],
            correct: 'A) مراقبة قيم الدالة عددياً وبيانياً عندما يقترب x من c',
            explanation: 'النهاية تصف سلوك الدالة عندما تقترب x من قيمة معينة، ويمكن تقديرها عددياً أو بيانياً.'
        },
        '1.5-idea-2': {
            question: 'متى توجد النهاية الثنائية للدالة عند نقطة؟',
            options: [
                'A) تتساوى النهاية من اليمين مع النهاية من اليسار (L = R)',
                'B) تكون النهاية من اليمين موجودة فقط',
                'C) تكون قيمة الدالة عند النقطة صفراً'
            ],
            correct: 'A) تتساوى النهاية من اليمين مع النهاية من اليسار (L = R)',
            explanation: 'توجد النهاية الثنائية عندما تكون نهايتا اليمين واليسار موجودتين ومتساويتين.'
        },
        '1.6-idea-1': {
            question: 'ما الخطوة المناسبة أولاً عند حساب نهاية يمكن التعويض فيها مباشرة؟',
            options: [
                'A) التعويض المباشر وتطبيق خصائص الجمع والضرب',
                'B) الضرب بالمرافق دائماً',
                'C) اشتقاق الدالة قبل حساب النهاية'
            ],
            correct: 'A) التعويض المباشر وتطبيق خصائص الجمع والضرب',
            explanation: 'إذا لم ينتج عن التعويض المباشر حالة غير معينة، نستخدم قوانين النهايات والعمليات الجبرية مباشرة.'
        },
        '1.6-idea-2': {
            question: 'إذا أعطى التعويض المباشر الحالة 0/0، فما الأسلوب المناسب؟',
            options: [
                'A) التحليل والتبسيط أو الضرب بالمرافق لإزالة العامل الصفري',
                'B) اعتبار النهاية غير موجودة مباشرة',
                'C) استبدال x بالمالانهاية'
            ],
            correct: 'A) التحليل والتبسيط أو الضرب بالمرافق لإزالة العامل الصفري',
            explanation: 'الحالة 0/0 غير معينة، وغالباً تُزال بالتحليل والاختصار أو بالمرافق في مسائل الجذور.'
        },
        '2.1-idea-1': {
            question: 'كيف نحصل على ميل المماس أو معدل التغير اللحظي باستخدام النهاية؟',
            options: [
                'A) باستخدام قانون النهاية لميل القاطع m = lim (f(x+h)-f(x))/h',
                'B) باستخدام متوسط قيم الدالة فقط',
                'C) بجعل h يساوي 1 دائماً'
            ],
            correct: 'A) باستخدام قانون النهاية لميل القاطع m = lim (f(x+h)-f(x))/h',
            explanation: 'ميل المماس ينتج من نهاية ميل القاطع عندما تقترب الزيادة h من الصفر.'
        },
        '2.1-idea-2': {
            question: 'كيف ترتبط السرعة اللحظية بدالة الموضع؟',
            options: [
                'A) حساب السرعة اللحظية كمشتقة للموضع بالنسبة للزمن',
                'B) ضرب الموضع في الزمن',
                'C) حساب الموضع عند الزمن صفر فقط'
            ],
            correct: 'A) حساب السرعة اللحظية كمشتقة للموضع بالنسبة للزمن',
            explanation: 'السرعة اللحظية هي معدل التغير اللحظي للموضع بالنسبة للزمن.'
        },
        '1.8-idea-1': {
            question: 'ما شروط اتصال f عند x = c؟',
            options: [
                'A) f(c) معرفة، النهاية موجودة، وقيمتهما متساويتان',
                'B) يكفي أن تكون f(c) معرفة فقط',
                'C) يكفي أن تكون النهاية من اليمين موجودة'
            ],
            correct: 'A) f(c) معرفة، النهاية موجودة، وقيمتهما متساويتان',
            explanation: 'الاتصال عند c يتطلب تعريف f(c)، ووجود النهاية عند c، وأن تساوي النهاية قيمة f(c).'
        },
        '1.8-idea-2': {
            question: 'ما الذي نبحث عنه عند دراسة عدم الاتصال؟',
            options: [
                'A) تحديد أنواع الانفصال وعدم الاتصال القابل للإزالة',
                'B) حساب مساحة المنحنى فقط',
                'C) تحويل كل الدوال إلى دوال خطية'
            ],
            correct: 'A) تحديد أنواع الانفصال وعدم الاتصال القابل للإزالة',
            explanation: 'ندرس مواضع وأسباب عدم الاتصال، مثل الثقوب والقفزات وخطوط التقارب الرأسية.'
        },
        '3.4-idea-1': {
            question: 'ما المقصود بالنهايات عند اللانهاية؟',
            options: [
                'A) دراسة سلوك الدالة عندما تقترب x من موجب وسالب مالانهاية',
                'B) إيجاد قيمة الدالة عند x = 0 فقط',
                'C) دراسة النهاية من اليمين عند نقطة محددة فقط'
            ],
            correct: 'A) دراسة سلوك الدالة عندما تقترب x من موجب وسالب مالانهاية',
            explanation: 'النهايات عند اللانهاية تصف السلوك النهائي للدالة عندما تكبر |x| دون حد.'
        },
        '3.4-idea-2': {
            question: 'كيف نحدد خط التقارب الأفقي من النهاية؟',
            options: [
                'A) إذا كانت lim f(x) = L عند ±∞ فإن y = L خط تقارب أفقي',
                'B) إذا كانت f(0) = L فإن x = L خط تقارب أفقي',
                'C) كل دالة لها دائماً خط تقارب أفقي y = 0'
            ],
            correct: 'A) إذا كانت lim f(x) = L عند ±∞ فإن y = L خط تقارب أفقي',
            explanation: 'إذا اقتربت الدالة من قيمة ثابتة L عندما x → ∞ أو x → −∞، فإن y = L يمثل خط تقارب أفقي.'
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
                localStorage.setItem('module_1_completed_items', JSON.stringify(updatedList))
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
                          📘 Module 1 (تقدم المقرر الإجمالي: {totalModuleProgress}%)
                        </span>
                        <span style={{ fontSize: '12px', color: '#8c5521', fontWeight: 'bold' }}>5 شباتر رئيسية</span>
                    </div>
                    <div style={{ background: '#f0ebdc', borderRadius: '20px', height: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${totalModuleProgress}%`, background: '#CDD4B1', height: '100%', transition: 'width 0.3s' }} />
                    </div>
                </div>

                {/* صفحة Module 1 الرئيسية: تعرض الشباتر فقط */}
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
                                    onClick={() => openChapter(chKey as '1.5' | '1.6' | '2.1' | '1.8' | '3.4')}
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
                                ⬅️ الرجوع إلى Module 1
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
                        currentModule={1}
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
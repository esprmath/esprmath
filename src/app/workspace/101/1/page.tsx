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
    // =====================================================
// 📘 CHAPTERS DATA
// كل شابتر مستقل هنا
// عند التعبئة:
// - title = اسم الشابتر
// - ideas = أفكار الشابتر
// =====================================================

    const chaptersData = {

        // =================================================
        // 📖 Chapter 1.5
        // الأفكار + الشرح + رابط الفيديو + السؤال
        // =================================================
        '1.5': {
            title: '1.5 The Concept of a Limit and Infinite Limits',
            ideas: [
                { id: 'idea-1', name: '1.1: The Intuitive Idea of a Limit and Estimating Limits Numerically' },
                { id: 'idea-2', name: '1.2: Estimating Limits Graphically' },
                { id: 'idea-3', name: '1.3: Infinite Limits' },
                { id: 'idea-4', name: '1.4: Vertical Asymptotes' }
            ]
        },

        // =================================================
        // 📖 Chapter 1.6
        // =================================================
        '1.6': {
            title: '1.6 Calculating Limits Using Limit Laws and Algebraic Techniques',
            ideas: [
                { id: 'idea-1', name: '2.1: Applying Basic Limit Laws and the Direct Substitution Property' },
                { id: 'idea-2', name: '2.2: Evaluating Limits of Piecewise Functions' },
                { id: 'idea-3', name: '2.3: The Conjugate Technique for Indeterminate Forms' },
                { id: 'idea-4', name: '2.4: Indirect Limit Evaluation and Handling Unknown Functions' }
            ]
        },

        // =================================================
        // 📖 Chapter 1.8
        // =================================================
        '1.8': {
            title: '1.8 الاتصال وخواص الدوال المتصلة (Continuity)',
            ideas: [
                { id: 'idea-1', name: '3.1: شروط الاتصال عند نقطة والتحقق منها' },
                { id: 'idea-2', name: '3.2: تصنيف أسباب عدم الاتصال (Discontinuity)' },
                { id: 'idea-3', name: '3.3: خواص الجبر للدوال المتصلة وفترات الاتصال' },
                { id: 'idea-4', name: '3.4: اتصال الدوال الجذرية والكسرية المركبة' }
            ]
        },

        // =================================================
        // 📖 Chapter 3.4
        // =================================================
        '3.4': {
            title: '3.4 النهايات عند اللانهاية وخطوط التقارب الأفقية',
            ideas: [
                { id: 'idea-1', name: '4.1: المفهوم الأساسي للنهايات عند اللانهاية للدوال المقلوبة والمثلثية' },
                { id: 'idea-2', name: '4.2: نهايات الدوال النسبية والجذرية عند اللانهاية وتحديد خطوط التقارب الأفقية' },
                { id: 'idea-3', name: '4.3: الضرب بالمرافق عند اللانهاية لحالات (∞ - ∞)' },
                { id: 'idea-4', name: '4.4: النهايات اللانهائية عند اللانهاية (Infinite Limits at Infinity)' }
            ]
        },

        // =================================================
        // 📖 Chapter 2.1
        // =================================================
        '2.1': {
            title: '2.1 المماس ومعدل التغير والسرعة اللحظية',
            ideas: [
                { id: 'idea-1', name: '5.1: ميل خط المماس ومعادلته باستخدام تعريف النهاية' },
                { id: 'idea-2', name: '5.2: التطبيقات الفيزيائية (السرعة اللحظية ومعدل التغير)' }
            ]
        }
    }

    const conceptVideos: Record<string, Record<string, string>> = {
        '1.5': {
            'idea-1': 'https://www.youtube.com/embed/djHhCU1yENQ',
            'idea-2': 'https://www.youtube.com/embed/J9y13Rn9R5k',
            'idea-3': 'https://www.youtube.com/embed/T2_YaOw-g4c',
            'idea-4': 'https://www.youtube.com/embed/o7rjD4v5oN8'
        },
        '1.6': {
            'idea-1': 'https://www.youtube.com/embed/h4RXkKCZcpc',
            'idea-2': 'https://www.youtube.com/embed/27yDQF3NEYo',
            'idea-3': 'https://www.youtube.com/embed/s-7uz1x90ZY',
            'idea-4': 'https://www.youtube.com/embed/Cjyf0zaevuI'
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
            question: 'ما الطريقة الأساسية لفهم قيمة نهاية الدالة عند اقتراب x من c عددياً؟',
            options: [
                'A) مراقبة قيم الدالة في جدول قيم عندما يقترب x من c من اليمين واليسار',
                'B) استخدام قيمة الدالة عند c فقط دون النظر لما حولها',
                'C) افتراض أن النهاية دائماً تساوي صفراً'
            ],
            correct: 'A) مراقبة قيم الدالة في جدول قيم عندما يقترب x من c من اليمين واليسار',
            explanation: 'التقدير العددي للنهاية يتم عن طريق اختيار قيم لـ x تقترب تدريجياً من c وملاحظة سلوك قيم الدالة f(x).'
        },
        '1.5-idea-2': {
            question: 'كيف يتم تقدير النهاية بيانياً من رسم المنحنى؟',
            options: [
                'A) بالنظر إلى القيمة التي تقترب منها y عندما تتحرك x نحو c على المنحنى من الطرفين',
                'B) بمعرفة أعلى نقطة في الرسم البياني فقط (القيمة العظمى)',
                'C) بحساب ميل الخط المستقيم الواصل بين طرفي الرسم'
            ],
            correct: 'A) بالنظر إلى القيمة التي تقترب منها y عندما تتحرك x نحو c على المنحنى من الطرفين',
            explanation: 'التقدير البياني يعتمد على تتبع الرسم لمعرفة قيمة المخرج y عندما يقترب المدخل x من القيمة المطلوبة.'
        },
        '1.5-idea-3': {
            question: 'ماذا تعني النهاية اللانهائية (Infinite Limit) لدالة عندما تقترب x من c؟',
            options: [
                'A) أن قيم الدالة تزداد أو تتناقص بلا حدود (تتوجه نحو موجب أو سالب مالانهاية)',
                'B) أن النهاية تساوي عدداً ثابتاً ومحدوداً تماماً',
                'C) أن الدالة غير معرفة عند أي نقطة في المجال'
            ],
            correct: 'A) أن قيم الدالة تزداد أو تتناقص بلا حدود (تتوجه نحو موجب أو سالب مالانهاية)',
            explanation: 'النهاية اللانهائية تعبر عن حالة ارتفاع أو انخفاض قيم الدالة بشكل غير محدود عندما تقترب x من c.'
        },
        '1.5-idea-4': {
            question: 'متى يقال أن للمنحنى خط تقارب رأسي (Vertical Asymptote) عند x = c؟',
            options: [
                'A) إذا كانت النهاية من اليمين أو اليسار عند c تساوي ∞ أو -∞',
                'B) إذا كانت الدالة متصلة تماماً عند c وقيمتها صفراً',
                'C) إذا كان ميل المماس عند c يساوي واحداً صحيحاً'
            ],
            correct: 'A) إذا كانت النهاية من اليمين أو اليسار عند c تساوي ∞ أو -∞',
            explanation: 'خط التقارب الراسي هو خط رأسي x = c يتقارب معه منحنى الدالة بلا إنهاء عندما تقترب x من c.'
        },
        '1.6-idea-1': {
            question: 'ما الخطوة الأولى المعتمدة لحساب النهاية باستخدام قوانين النهايات والتعويض المباشر؟',
            options: [
                'A) محاولة التعويض المباشر بالقيمة c في الدالة إن كانت معرفة',
                'B) الاشتقاق الفوري للدالة بغض النظر عن شكلها',
                'C) القسمة المطولة على x في جميع الحالات'
            ],
            correct: 'A) محاولة التعويض المباشر بالقيمة c في الدالة إن كانت معرفة',
            explanation: 'التعويض المباشر هو خطوة البداية الأساسية، فإذا نتج عدد حقيقي، فهذه هي قيمة النهاية مباشرة.'
        },
        '1.6-idea-2': {
            question: 'عند حساب نهايات الدوال المعرفة بقواعد متعددة (Piecewise Functions) عند نقطة التشعب، ماذا نشترط؟',
            options: [
                'A) أن تتساوى النهاية من اليمين مع النهاية من اليسار',
                'B) أن نستخدم القاعدة الأولى فقط دائماً',
                'C) أن تكون الدالة قابلة للاشتقاق بلا توقف'
            ],
            correct: 'A) أن تتساوى النهاية من اليمين مع النهاية من اليسار',
            explanation: 'عند نقاط التحول، يجب حساب النهاية اليمنى واليسرى، ولا توجد النهاية إلا بتساويهما.'
        },
        '1.6-idea-3': {
            question: 'متى نلجأ لاستخدام تقنية الضرب بالمرافق (Conjugate Technique) في النهايات؟',
            options: [
                'A) لإزالة حالة عدم التعيين (0/0) الناتجة عن وجود جذور تربيعية',
                'B) للتخلص من الأسس السالبة في الدوال الاسية',
                'C) لحساب مشتقات الدوال المثلثية العكسية'
            ],
            correct: 'A) لإزالة حالة عدم التعيين (0/0) الناتجة عن وجود جذور تربيعية',
            explanation: 'الضرب بالمرافق يساهم في تبسيط البسط أو المقام الذي يحتوي على جذور عبر إزالة الجذر من أحد الطرفين.'
        },
        '1.6-idea-4': {
            question: 'كيف نتعامل مع استنتاج نهايات الدوال المجهولة أو غير المحددة بقاعدة صريحة؟',
            options: [
                'A) باستخدام نظريات الحصر (Squeeze Theorem) أو العلاقات الجبرية المعطاة',
                'B) بفرض أن قيمتها تساوي صفراً دائماً',
                'C) بإهمال الدالة مجهولة القاعدة وحساب بقية الحدود'
            ],
            correct: 'A) باستخدام نظريات الحصر (Squeeze Theorem) أو العلاقات الجبرية المعطاة',
            explanation: 'في حال غياب القاعدة الصريحة، نعتمد على الخواص والمعادلات المرطبة والعلاقات المعطاة بالسؤال.'
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

    const activeEmbedUrl = conceptVideos[activeChapter]?.[activeIdea] || 'https://www.youtube.com/embed/dQw4w9WgXcQ'

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
                                    ✨ اسأل فيكتور مثال إضافي
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
                                    src={activeEmbedUrl}
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
                                            style={{ marginLeft: '10px' }}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>

                            {errorMsg && (
                                <div style={{ color: '#991b1b', background: '#fee2e2', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '12px', fontWeight: 'bold' }}>
                                    {errorMsg}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    onClick={handleQuizVerify}
                                    style={{ background: '#DCA27B', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    تحقق من الإجابة ✅
                                </button>

                                {hasAttempted && (
                                    <button
                                        type="button"
                                        onClick={() => setShowSolutionBox(!showSolutionBox)}
                                        style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                                    >
                                        {showSolutionBox ? 'إخفاء الحل 💡' : 'عرض طريقة الحل 💡'}
                                    </button>
                                )}
                            </div>

                            {showSolutionBox && currentQuiz && (
                                <div style={{ marginTop: '16px', padding: '16px', background: '#FFF9E2', borderRadius: '10px', border: '1px solid #e6dec5' }}>
                                    <h5 style={{ margin: '0 0 6px 0', color: '#2C3531', fontSize: '14px' }}>📌 الشرح التوضيحي للحل:</h5>
                                    <p style={{ margin: 0, color: '#4A5550', fontSize: '13px', lineHeight: '1.6' }}>
                                        {currentQuiz.explanation}
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}

            </div>

            {isAiAllowed && userId && (
                <GlobalTutor
                    initialPrompt={tutorInitialPrompt}
                />
            )}
        </div>
    )
}
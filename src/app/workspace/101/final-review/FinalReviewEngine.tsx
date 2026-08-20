'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import GlobalTutor from '@/components/GlobalTutor'
import { supabase } from '@/lib/supabase'

export type FinalQuestion = {
    id: number
    moduleId: number
    module: string
    chapter: string
    ideaId: string
    level: 'سهل' | 'متوسط' | 'صعب'
    questionName: string
    question: string
    math?: string
    ideaLink: string
    answer: string
    options?: string[]
    correctAnswer?: string
    solutionText?: string
    source?: 'review' | 'leak'
    examId?: 'quiz-1' | 'quiz-2' | 'midterm' | 'quiz-3' | 'quiz-4' | 'final'
    image?: string
}

export type ReviewIdea = {
    key: string
    moduleId: number
    chapter: string
    ideaId: string
    title: string
    reminder: string
    steps: string[]
    exampleQuestion: string
    exampleSolution: string
    checkQuestion: string
    checkOptions: string[]
    correctAnswer: string
    ideaLink: string
}

type Mode = 'normal' | 'leaks'
type View = 'menu' | 'review' | 'practice' | 'mistakes'

type ReadyQuestion = FinalQuestion & {
    options: string[]
    correctAnswer: string
}

type Props = {
    title: string
    subtitle?: string
    modules?: number[]
    mode?: Mode
    examId?: FinalQuestion['examId']
    questions: FinalQuestion[]
    reviewIdeas?: ReviewIdea[]
    videoUrl?: string
    progressKey: string
    mistakesKey: string
    coursePath?: string
}

function isReady(q: FinalQuestion): q is ReadyQuestion {
    return Array.isArray(q.options) && q.options.length > 0 && !!q.correctAnswer
}

function ideaKey(q: Pick<FinalQuestion, 'moduleId' | 'chapter' | 'ideaId'>) {
    return `${q.moduleId}-${q.chapter}-${q.ideaId}`
}

function shuffle<T>(items: T[]) {
    const copy = [...items]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

function onePerIdea(items: ReadyQuestion[]) {
    const groups = new Map<string, ReadyQuestion[]>()

    items.forEach((q) => {
        const key = ideaKey(q)
        groups.set(key, [...(groups.get(key) ?? []), q])
    })

    return shuffle(
        Array.from(groups.values()).map(
            (group) => group[Math.floor(Math.random() * group.length)]
        )
    )
}

const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e6dec5',
    borderRadius: '16px',
    padding: '22px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
}

const primary: React.CSSProperties = {
    background: '#DCA27B',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '9px',
    fontWeight: 'bold',
    cursor: 'pointer'
}

export default function FinalReviewEngine({
                                              title,
                                              subtitle,
                                              modules = [],
                                              mode = 'normal',
                                              examId = 'final',
                                              questions,
                                              reviewIdeas = [],
                                              videoUrl,
                                              progressKey,
                                              mistakesKey,
                                              coursePath = '/workspace/101'
                                          }: Props) {
    const [view, setView] = useState<View>('menu')
    const [reviewIndex, setReviewIndex] = useState(0)
    const [reviewAnswer, setReviewAnswer] = useState('')
    const [reviewChecked, setReviewChecked] = useState(false)
    const [reviewedIdeas, setReviewedIdeas] = useState<string[]>([])

    const [practiceQuestions, setPracticeQuestions] = useState<ReadyQuestion[]>([])
    const [practiceIndex, setPracticeIndex] = useState(0)
    const [practiceAnswer, setPracticeAnswer] = useState('')
    const [practiceChecked, setPracticeChecked] = useState(false)
    const [practiceCorrect, setPracticeCorrect] = useState<boolean | null>(null)
    const [practiceFinished, setPracticeFinished] = useState(false)

    const [mistakes, setMistakes] = useState<ReadyQuestion[]>([])
    const [activeMistake, setActiveMistake] = useState<ReadyQuestion | null>(null)
    const [showMistakeTutor, setShowMistakeTutor] = useState(false)
    const [isAiAllowed, setIsAiAllowed] = useState(false)
    const [isVideoOpen, setIsVideoOpen] = useState(false)

    const pool = useMemo(() => {
        return questions.filter((q) => {
            if (modules.length && !modules.includes(q.moduleId)) return false

            if (mode === 'leaks') {
                return q.source === 'leak' && q.examId === examId
            }

            return q.source !== 'leak'
        })
    }, [questions, modules, mode, examId])

    const readyPool = useMemo(() => pool.filter(isReady), [pool])

    useEffect(() => {
        try {
            const savedProgress = localStorage.getItem(progressKey)
            if (savedProgress) {
                const parsed = JSON.parse(savedProgress)
                setReviewedIdeas(Array.isArray(parsed.reviewedIdeas) ? parsed.reviewedIdeas : [])
            }

            const savedMistakes = localStorage.getItem(mistakesKey)
            if (savedMistakes) setMistakes(JSON.parse(savedMistakes))
        } catch {
            setReviewedIdeas([])
            setMistakes([])
        }
    }, [progressKey, mistakesKey])

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!session?.user) return

            const { data, error } = await supabase
                .from('user_courses')
                .select('is_ai_allowed')
                .eq('user_id', session.user.id)
                .eq('course_id', '101')
                .maybeSingle()

            if (!error && data) {
                setIsAiAllowed(Boolean(data.is_ai_allowed))
            }
        })
    }, [])

    const saveReviewProgress = (next: string[]) => {
        setReviewedIdeas(next)
        localStorage.setItem(
            progressKey,
            JSON.stringify({
                reviewedIdeas: next,
                reviewCompleted: reviewIdeas.length > 0 && next.length >= reviewIdeas.length
            })
        )
    }

    const saveMistakes = (next: ReadyQuestion[]) => {
        setMistakes(next)
        localStorage.setItem(mistakesKey, JSON.stringify(next))
    }

    const startReview = () => {
        setReviewIndex(0)
        setReviewAnswer('')
        setReviewChecked(false)
        setView('review')
    }

    const startPractice = () => {
        setPracticeQuestions(onePerIdea(readyPool))
        setPracticeIndex(0)
        setPracticeAnswer('')
        setPracticeChecked(false)
        setPracticeCorrect(null)
        setPracticeFinished(false)
        setView('practice')
    }

    const nextReviewIdea = () => {
        const current = reviewIdeas[reviewIndex]

        if (current && !reviewedIdeas.includes(current.key)) {
            saveReviewProgress([...reviewedIdeas, current.key])
        }

        if (reviewIndex + 1 < reviewIdeas.length) {
            setReviewIndex((i) => i + 1)
            setReviewAnswer('')
            setReviewChecked(false)
        } else {
            setView('menu')
        }
    }

    const checkPractice = () => {
        const current = practiceQuestions[practiceIndex]
        if (!current || !practiceAnswer) return

        const correct = practiceAnswer === current.correctAnswer
        setPracticeCorrect(correct)
        setPracticeChecked(true)

        if (!correct && !mistakes.some((q) => ideaKey(q) === ideaKey(current))) {
            saveMistakes([...mistakes, current])
        }
    }

    const nextPractice = () => {
        if (practiceIndex + 1 < practiceQuestions.length) {
            setPracticeIndex((i) => i + 1)
            setPracticeAnswer('')
            setPracticeChecked(false)
            setPracticeCorrect(null)
        } else {
            setPracticeFinished(true)
            const old = JSON.parse(localStorage.getItem(progressKey) || '{}')
            localStorage.setItem(
                progressKey,
                JSON.stringify({ ...old, practiceCompleted: true })
            )
        }
    }

    const removeMistake = (item: ReadyQuestion) => {
        const key = ideaKey(item)
        saveMistakes(mistakes.filter((q) => ideaKey(q) !== key))
        setActiveMistake(null)
        setShowMistakeTutor(false)
    }

    const getYoutubeEmbedUrl = (url: string) => {
        try {
            if (url.includes('youtu.be/')) {
                const id = url.split('youtu.be/')[1]?.split(/[?&]/)[0]
                return id ? `https://www.youtube.com/embed/${id}` : ''
            }
            if (url.includes('youtube.com/watch')) {
                const id = new URL(url).searchParams.get('v')
                return id ? `https://www.youtube.com/embed/${id}` : ''
            }
            if (url.includes('youtube.com/shorts/')) {
                const id = url.split('youtube.com/shorts/')[1]?.split(/[?&]/)[0]
                return id ? `https://www.youtube.com/embed/${id}` : ''
            }
            if (url.includes('youtube.com/embed/')) return url
            return url
        } catch {
            return url
        }
    }

    const openVideo = () => {
        if (!videoUrl) {
            alert('رابط المقطع غير مضاف بعد.')
            return
        }
        setIsVideoOpen(true)
    }

    if (activeMistake) {
        return (
            <div style={{ background: '#FFF9E2', minHeight: '100vh' }}>
                <Navbar isLoggedIn={true} />
                <div style={{ maxWidth: '700px', margin: '36px auto', padding: '0 20px' }}>
                    <div style={card}>
                        <div style={{ color: '#8c5521', fontSize: '12px', fontWeight: 'bold' }}>
                            Module {activeMistake.moduleId} • Chapter {activeMistake.chapter}
                        </div>

                        <h2>{activeMistake.questionName}</h2>
                        <p style={{ color: '#4A5550', lineHeight: 1.7 }}>{activeMistake.question}</p>

                        <div style={{ background: '#FFF9E2', padding: '15px', borderRadius: '10px' }}>
                            <strong>الحل:</strong>{' '}
                            {activeMistake.solutionText || activeMistake.answer}
                        </div>

                        <div
                            style={{
                                marginTop: '14px',
                                borderTop: '1px solid #eadfca',
                                paddingTop: '14px'
                            }}
                        >
                            <button
                                onClick={() => setShowMistakeTutor((previous) => !previous)}
                                style={{
                                    background: 'transparent',
                                    color: '#8c5521',
                                    border: 'none',
                                    padding: '7px 2px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                {showMistakeTutor
                                    ? 'إغلاق فيكتور ✕'
                                    : '🤖 اسأل فيكتور (الذكاء الاصطناعي)'}
                            </button>

                            {showMistakeTutor && (
                                <div style={{ marginTop: '10px' }}>
                                    <GlobalTutor
                                        mode="inline"
                                        courseId="101"
                                        currentModule={activeMistake.moduleId}
                                        currentChapter={activeMistake.chapter}
                                        currentQuestion={`السؤال: ${activeMistake.question}

الإجابة الصحيحة: ${activeMistake.correctAnswer}

شرح الحل: ${activeMistake.solutionText || activeMistake.answer}`}
                                        initialPrompt={null}
                                        isAiAllowed={isAiAllowed}
                                    />
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '15px' }}>
                            <button
                                onClick={() => {
                                    setActiveMistake(null)
                                    setShowMistakeTutor(false)
                                }}
                                style={primary}
                            >
                                ← رجوع
                            </button>

                            <Link
                                href={activeMistake.ideaLink}
                                style={{
                                    background: '#CDD4B1',
                                    color: '#2C3531',
                                    textDecoration: 'none',
                                    padding: '10px 14px',
                                    borderRadius: '9px',
                                    fontWeight: 'bold'
                                }}
                            >
                                📖 الرجوع للفكرة
                            </Link>

                            <button
                                onClick={() => removeMistake(activeMistake)}
                                style={{
                                    background: '#fff',
                                    color: '#166534',
                                    border: '1px solid #86efac',
                                    padding: '10px 14px',
                                    borderRadius: '9px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                ✅ أتقنت الفكرة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (view === 'mistakes') {
        return (
            <div style={{ background: '#FFF9E2', minHeight: '100vh' }}>
                <Navbar isLoggedIn={true} />

                <div
                    style={{
                        maxWidth: '900px',
                        margin: '36px auto',
                        padding: '0 20px'
                    }}
                >
                    <div
                        style={{
                            ...card,
                            padding: '24px 28px'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '20px',
                                flexWrap: 'wrap'
                            }}
                        >
                            <div>
                                <h2 style={{ margin: '0 0 5px' }}>📌 مراجعة الأخطاء</h2>
                                <p
                                    style={{
                                        margin: 0,
                                        color: '#4A5550',
                                        fontSize: '13px'
                                    }}
                                >
                                    تبقى الفكرة هنا حتى تضغط «أتقنت الفكرة».
                                </p>
                            </div>

                            <button
                                onClick={() => setView('menu')}
                                style={{
                                    ...primary,
                                    background: '#FEECD0',
                                    color: '#2C3531'
                                }}
                            >
                                ← عودة
                            </button>
                        </div>

                        {mistakes.length === 0 ? (
                            <div
                                style={{
                                    background: '#dcfce7',
                                    color: '#166534',
                                    padding: '18px',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                }}
                            >
                                🎉 لا توجد أخطاء محفوظة.
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '7px'
                                }}
                            >
                                {mistakes.map((item) => (
                                    <div
                                        key={`${ideaKey(item)}-${item.id}`}
                                        style={{
                                            background: '#FFF4DF',
                                            borderRadius: '10px',
                                            padding: '11px 14px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '14px',
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        <div
                                            style={{
                                                flex: 1,
                                                minWidth: '260px',
                                                textAlign: 'right'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    color: '#8c5521',
                                                    fontSize: '11px',
                                                    fontWeight: 'bold',
                                                    marginBottom: '3px'
                                                }}
                                            >
                                                Module {item.moduleId} • Chapter {item.chapter}
                                            </div>

                                            <div
                                                style={{
                                                    fontWeight: 'bold',
                                                    fontSize: '14px',
                                                    lineHeight: 1.45
                                                }}
                                            >
                                                {item.questionName}
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '6px',
                                                alignItems: 'center',
                                                flexWrap: 'wrap'
                                            }}
                                        >
                                            <button
                                                onClick={() => {
                                                    setActiveMistake(item)
                                                    setShowMistakeTutor(false)
                                                }}
                                                style={{
                                                    ...primary,
                                                    padding: '8px 11px',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                💡 مراجعة الحل
                                            </button>

                                            <Link
                                                href={item.ideaLink}
                                                style={{
                                                    background: '#CDD4B1',
                                                    color: '#2C3531',
                                                    textDecoration: 'none',
                                                    padding: '8px 11px',
                                                    borderRadius: '7px',
                                                    fontWeight: 'bold',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                الرجوع للفكرة ➔
                                            </Link>

                                            <button
                                                onClick={() => removeMistake(item)}
                                                style={{
                                                    background: '#fff',
                                                    color: '#166534',
                                                    border: '1px solid #86efac',
                                                    padding: '8px 11px',
                                                    borderRadius: '7px',
                                                    fontWeight: 'bold',
                                                    fontSize: '12px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                أتقنت الفكرة ✅
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    if (view === 'review') {
        const idea = reviewIdeas[reviewIndex]

        if (!idea) {
            return (
                <div style={{ background: '#FFF9E2', minHeight: '100vh' }}>
                    <Navbar isLoggedIn={true} />
                    <div style={{ maxWidth: '650px', margin: '36px auto', padding: '0 20px' }}>
                        <div style={card}>
                            <p>محتوى المراجعة لم يُضف بعد.</p>
                            <button onClick={() => setView('menu')} style={primary}>← رجوع</button>
                        </div>
                    </div>
                </div>
            )
        }

        const correct = reviewAnswer === idea.correctAnswer

        return (
            <div style={{ background: '#FFF9E2', minHeight: '100vh' }}>
                <Navbar isLoggedIn={true} />
                <div style={{ maxWidth: '760px', margin: '36px auto', padding: '0 20px' }}>
                    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <button onClick={() => setView('menu')} style={{ ...primary, background: '#CDD4B1', color: '#2C3531' }}>
                            ← رجوع للجزء
                        </button>
                        <span style={{ color: '#8c5521', fontWeight: 'bold' }}>
              الفكرة {reviewIndex + 1} من {reviewIdeas.length}
            </span>
                    </div>

                    <div style={card}>
                        <div style={{ color: '#8c5521', fontSize: '12px', fontWeight: 'bold' }}>
                            Module {idea.moduleId} • Chapter {idea.chapter}
                        </div>

                        <h2>{idea.title}</h2>

                        <div style={{ background: '#FFF9E2', padding: '15px', borderRadius: '10px', marginBottom: '14px' }}>
                            <strong>⚡ تذكير سريع</strong>
                            <p style={{ lineHeight: 1.8 }}>{idea.reminder}</p>
                        </div>

                        <strong>🧭 طريقة الحل</strong>
                        <ol style={{ lineHeight: 1.9 }}>
                            {idea.steps.map((step) => <li key={step}>{step}</li>)}
                        </ol>

                        <div style={{ background: '#fdfbf7', padding: '15px', borderRadius: '10px', marginBottom: '16px' }}>
                            <strong>✏️ مثال محلول</strong>
                            <p style={{ fontWeight: 'bold' }}>{idea.exampleQuestion}</p>
                            <p style={{ lineHeight: 1.8 }}>{idea.exampleSolution}</p>
                        </div>

                        <strong>🧠 سؤال تنشيط</strong>
                        <p>{idea.checkQuestion}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {idea.checkOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => !reviewChecked && setReviewAnswer(option)}
                                    style={{
                                        background: reviewAnswer === option ? '#FEECD0' : '#fff',
                                        border: '1px solid #e6dec5',
                                        padding: '11px',
                                        borderRadius: '8px',
                                        textAlign: 'right',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        {!reviewChecked ? (
                            <button
                                onClick={() => setReviewChecked(true)}
                                disabled={!reviewAnswer}
                                style={{ ...primary, marginTop: '12px', opacity: reviewAnswer ? 1 : 0.5 }}
                            >
                                تحقق
                            </button>
                        ) : (
                            <div style={{ marginTop: '12px' }}>
                                <div
                                    style={{
                                        background: correct ? '#dcfce7' : '#fee2e2',
                                        color: correct ? '#166534' : '#991b1b',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        marginBottom: '10px'
                                    }}
                                >
                                    {correct ? '✅ ممتاز، تذكرت الفكرة.' : `❌ الإجابة الصحيحة: ${idea.correctAnswer}`}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <button onClick={nextReviewIdea} style={primary}>
                                        {reviewIndex + 1 < reviewIdeas.length ? 'الفكرة التالية ➔' : 'إنهاء المراجعة ✓'}
                                    </button>

                                    <Link
                                        href={idea.ideaLink}
                                        style={{
                                            background: '#CDD4B1',
                                            color: '#2C3531',
                                            textDecoration: 'none',
                                            padding: '10px 14px',
                                            borderRadius: '9px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        📖 نسيت الفكرة؟ راجع شرحها
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <GlobalTutor
                    key={`final-review-${idea.key}`}
                    mode="floating"
                    courseId="101"
                    currentModule={idea.moduleId}
                    currentChapter={idea.chapter}
                    currentQuestion={`الفكرة الحالية: ${idea.title}

تذكير سريع:
${idea.reminder}

طريقة الحل:
${idea.steps.join('\n')}

المثال:
${idea.exampleQuestion}

حل المثال:
${idea.exampleSolution}

سؤال التنشيط:
${idea.checkQuestion}`}
                    initialPrompt={null}
                    isAiAllowed={isAiAllowed}
                />
            </div>
        )
    }

    if (view === 'practice') {
        if (practiceFinished) {
            return (
                <div style={{ background: '#FFF9E2', minHeight: '100vh' }}>
                    <Navbar isLoggedIn={true} />
                    <div style={{ maxWidth: '650px', margin: '36px auto', padding: '0 20px' }}>
                        <div style={card}>
                            <h2>🎉 انتهيت من التدريب</h2>
                            <p>الأخطاء المحفوظة: {mistakes.length}</p>

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button onClick={() => setView('mistakes')} style={primary}>📌 مراجعة الأخطاء</button>
                                <button onClick={() => setView('menu')} style={{ ...primary, background: '#2C3531' }}>العودة للجزء ➔</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        const current = practiceQuestions[practiceIndex]

        if (!current) {
            return (
                <div style={{ background: '#FFF9E2', minHeight: '100vh' }}>
                    <Navbar isLoggedIn={true} />
                    <div style={{ maxWidth: '650px', margin: '36px auto', padding: '0 20px' }}>
                        <div style={card}>
                            <p>لا توجد أسئلة جاهزة لهذا التدريب حالياً.</p>
                            <button onClick={() => setView('menu')} style={primary}>← رجوع</button>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div style={{ background: '#FFF9E2', minHeight: '100vh' }}>
                <Navbar isLoggedIn={true} />
                <div style={{ maxWidth: '700px', margin: '36px auto', padding: '0 20px' }}>
                    <div style={card}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '10px',
                                flexWrap: 'wrap',
                                marginBottom: '8px'
                            }}
                        >
                            <div
                                style={{
                                    color: '#8c5521',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                            >
                                Module {current.moduleId} • Chapter {current.chapter}
                            </div>

                            <button
                                onClick={() => setView('menu')}
                                style={{
                                    background: 'transparent',
                                    color: '#8c5521',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                ✕ الخروج للجزء
                            </button>
                        </div>

                        <p style={{ color: '#4A5550', fontWeight: 'bold' }}>
                            السؤال {practiceIndex + 1} من {practiceQuestions.length}
                        </p>

                        <h2 style={{ fontSize: '19px' }}>{current.question}</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                            {current.options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => !practiceChecked && setPracticeAnswer(option)}
                                    style={{
                                        background: practiceAnswer === option ? '#FEECD0' : '#FFF9E2',
                                        border: '1px solid #e6dec5',
                                        padding: '11px',
                                        borderRadius: '8px',
                                        textAlign: 'right',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        {!practiceChecked ? (
                            <button
                                onClick={checkPractice}
                                disabled={!practiceAnswer}
                                style={{ ...primary, marginTop: '12px', opacity: practiceAnswer ? 1 : 0.5 }}
                            >
                                تحقق من الإجابة
                            </button>
                        ) : (
                            <div style={{ marginTop: '12px' }}>
                                <div
                                    style={{
                                        background: practiceCorrect ? '#dcfce7' : '#fee2e2',
                                        color: practiceCorrect ? '#166534' : '#991b1b',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        marginBottom: '10px'
                                    }}
                                >
                                    {practiceCorrect ? '✅ إجابة صحيحة!' : '❌ إجابة خاطئة!'}
                                </div>

                                <button onClick={nextPractice} style={{ ...primary, background: '#2C3531' }}>
                                    {practiceIndex + 1 < practiceQuestions.length ? 'السؤال التالي ➔' : 'إنهاء التدريب ✓'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ background: '#FFF9E2', minHeight: '100vh', color: '#2C3531' }}>
            <Navbar isLoggedIn={true} />
            <div style={{ maxWidth: '820px', margin: '36px auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div>
                        <h1 style={{ margin: '0 0 6px', fontSize: '25px' }}>{title}</h1>
                        {subtitle && <p style={{ margin: 0, color: '#4A5550' }}>{subtitle}</p>}
                    </div>

                    <Link
                        href={coursePath}
                        style={{
                            background: '#CDD4B1',
                            color: '#2C3531',
                            textDecoration: 'none',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}
                    >
                        ← صفحة الكورس
                    </Link>
                </div>

                {mode === 'normal' ? (
                    <div style={{ display: 'grid', gap: '14px' }}>
                        <div
                            style={{
                                ...card,
                                padding: '20px 22px'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '14px',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'flex-start',
                                        flex: 1,
                                        minWidth: '240px'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '12px',
                                            background: '#FEECD0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '22px',
                                            flexShrink: 0
                                        }}
                                    >
                                        📚
                                    </div>

                                    <div>
                                        <h2
                                            style={{
                                                margin: '0 0 5px',
                                                fontSize: '18px'
                                            }}
                                        >
                                            مراجعة الأفكار
                                        </h2>

                                        <p
                                            style={{
                                                margin: 0,
                                                color: '#4A5550',
                                                fontSize: '13px',
                                                lineHeight: 1.7
                                            }}
                                        >
                                            راجع كل فكرة بسرعة: أهم نقطة، طريقة الحل، مثال، وسؤال تنشيط قبل التدريب.
                                        </p>

                                        <div
                                            style={{
                                                marginTop: '9px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                background: '#FFF9E2',
                                                color: '#8c5521',
                                                borderRadius: '20px',
                                                padding: '4px 9px',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {reviewedIdeas.length > 0
                                                ? `راجعت ${reviewedIdeas.length} فكرة`
                                                : 'مراجعة منظمة فكرة بفكرة'}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={startReview}
                                    style={{
                                        ...primary,
                                        alignSelf: 'center',
                                        minWidth: '135px'
                                    }}
                                >
                                    {reviewedIdeas.length
                                        ? 'أكمل المراجعة ➔'
                                        : 'ابدأ المراجعة ➔'}
                                </button>
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: '12px'
                            }}
                        >
                            <div
                                style={{
                                    ...card,
                                    padding: '17px 18px'
                                }}
                            >
                                <h2 style={{ margin: '0 0 6px', fontSize: '16px' }}>
                                    📝 تدريب الجزء
                                </h2>

                                <p
                                    style={{
                                        color: '#4A5550',
                                        fontSize: '12px',
                                        lineHeight: 1.6,
                                        margin: '0 0 12px'
                                    }}
                                >
                                    سؤال عشوائي من كل فكرة في هذا الجزء.
                                </p>

                                <button
                                    onClick={startPractice}
                                    style={{
                                        ...primary,
                                        background: '#2C3531',
                                        width: '100%'
                                    }}
                                >
                                    ابدأ التدريب ➔
                                </button>
                            </div>

                            <div
                                style={{
                                    ...card,
                                    padding: '17px 18px'
                                }}
                            >
                                <h2 style={{ margin: '0 0 6px', fontSize: '16px' }}>
                                    ▶️ مقطع المراجعة
                                </h2>

                                <p
                                    style={{
                                        color: '#4A5550',
                                        fontSize: '12px',
                                        lineHeight: 1.6,
                                        margin: '0 0 12px'
                                    }}
                                >
                                    شاهد مقطع مراجعة هذا الجزء وحل أهم أفكاره.
                                </p>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        gap: '3px'
                                    }}
                                >
                                    <button
                                        onClick={openVideo}
                                        style={{
                                            background: 'transparent',
                                            color: '#8c5521',
                                            border: 'none',
                                            padding: '8px 2px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            fontSize: '13px'
                                        }}
                                    >
                                        مشاهدة المقطع {isVideoOpen ? '▼' : '▶'}
                                    </button>

                                    {isVideoOpen && (
                                        <span
                                            style={{
                                                color: '#8c5521',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ↓ المقطع بالأسفل
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setView('mistakes')}
                            style={{
                                background: '#fff',
                                color: '#2C3531',
                                padding: '16px 18px',
                                borderRadius: '12px',
                                border: '1px solid #DCA27B',
                                cursor: 'pointer',
                                textAlign: 'right',
                                width: '100%'
                            }}
                        >
                            <strong>📌 مراجعة الأخطاء</strong>
                            <span
                                style={{
                                    float: 'left',
                                    color: '#8c5521',
                                    fontWeight: 'bold'
                                }}
                            >
                {mistakes.length ? `${mistakes.length} أخطاء` : 'لا توجد أخطاء'}
              </span>
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '14px' }}>
                        <div style={card}>
                            <h2 style={{ marginTop: 0, fontSize: '18px' }}>📝 أسئلة التدريب</h2>
                            <p style={{ color: '#4A5550' }}>تسريبات الفاينل فقط.</p>
                            <button onClick={startPractice} style={primary}>ابدأ تدريب التسريبات ➔</button>
                        </div>

                        <div style={card}>
                            <h2 style={{ marginTop: 0, fontSize: '18px' }}>▶️ شرح أسئلة التسريبات</h2>
                            <p style={{ color: '#4A5550' }}>مقطع شرح وحل أسئلة تسريبات الفاينل.</p>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    gap: '3px'
                                }}
                            >
                                <button
                                    onClick={openVideo}
                                    style={{ ...primary, background: '#2C3531' }}
                                >
                                    مشاهدة المقطع {isVideoOpen ? '▼' : '▶'}
                                </button>

                                {isVideoOpen && (
                                    <span
                                        style={{
                                            color: '#8c5521',
                                            fontSize: '11px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        ↓ المقطع بالأسفل
                                    </span>
                                )}
                            </div>
                        </div>

                        <button onClick={() => setView('mistakes')} style={{ ...card, cursor: 'pointer', textAlign: 'right', width: '100%' }}>
                            <strong>📌 مراجعة الأخطاء</strong>
                            <span style={{ float: 'left', color: '#8c5521', fontWeight: 'bold' }}>
                {mistakes.length ? `${mistakes.length} أخطاء` : 'لا توجد أخطاء'}
              </span>
                        </button>
                    </div>
                )}

                {isVideoOpen && videoUrl && (
                    <div style={{ ...card, marginTop: '14px', padding: '12px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '10px'
                        }}>
                            <span></span>
                            <button
                                type="button"
                                onClick={() => setIsVideoOpen(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#8c5521',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '12px'
                                }}
                            >
                                ✕ إغلاق
                            </button>
                        </div>

                        <div style={{
                            position: 'relative',
                            width: '100%',
                            paddingTop: '56.25%',
                            overflow: 'hidden',
                            borderRadius: '10px',
                            background: '#000'
                        }}>
                            <iframe
                                src={getYoutubeEmbedUrl(videoUrl)}
                                title="مقطع المراجعة"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none'
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
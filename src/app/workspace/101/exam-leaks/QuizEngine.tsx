'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import GlobalTutor from '@/components/GlobalTutor'
import { supabase } from '@/lib/supabase'

export type QuizDataQuestion = {
    id: number
    moduleId: number
    module: string
    chapter: string
    ideaId: string
    level: 'سهل' | 'متوسط' | 'صعب'
    questionName: string
    question: string
    math: string
    ideaLink: string
    answer: string

    options?: string[]
    correctAnswer?: string
    solutionText?: string

    source?: 'review' | 'leak'

    examId?:
        | 'quiz-1'
        | 'quiz-2'
        | 'midterm'
        | 'quiz-3'
        | 'quiz-4'
        | 'final'

    image?: string
}

type ReadyQuestion = QuizDataQuestion & {
    options: string[]
    correctAnswer: string
}

type ActiveSection =
    | 'menu'
    | 'review'
    | 'leaks'
    | 'savedMistakes'

type QuizEngineProps = {
    title: string
    questions: QuizDataQuestion[]
    chapters: string[]
    coursePath: string
    savedMistakesKey: string

    reviewVideoUrl?: string
    leaksVideoUrl?: string

    leakExamId?: QuizDataQuestion['examId']
}

function isQuizReady(
    question: QuizDataQuestion
): question is ReadyQuestion {
    return (
        Array.isArray(question.options) &&
        question.options.length > 0 &&
        typeof question.correctAnswer === 'string' &&
        question.correctAnswer.length > 0
    )
}

function ideaKey(question: QuizDataQuestion) {
    return `${question.chapter}-${question.ideaId}`
}

function buildRandomReview(
    questions: ReadyQuestion[]
) {
    const byIdea = new Map<string, ReadyQuestion[]>()

    for (const question of questions) {
        const key = ideaKey(question)

        byIdea.set(
            key,
            [
                ...(byIdea.get(key) ?? []),
                question
            ]
        )
    }

    return Array.from(byIdea.values()).map(
        (group) =>
            group[
                Math.floor(
                    Math.random() * group.length
                )
                ]
    )
}

function shuffleQuestions(
    questions: ReadyQuestion[]
) {
    const copy = [...questions]

    for (
        let index = copy.length - 1;
        index > 0;
        index--
    ) {
        const randomIndex =
            Math.floor(
                Math.random() * (index + 1)
            )

        ;[
            copy[index],
            copy[randomIndex]
        ] = [
            copy[randomIndex],
            copy[index]
        ]
    }

    return copy
}

const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e6dec5',
    borderRadius: '16px',
    padding: '24px',
    boxShadow:
        '0 2px 6px rgba(0,0,0,0.03)'
}

const primaryButton: React.CSSProperties = {
    background: '#DCA27B',
    color: '#fff',
    padding: '11px 14px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer'
}

export default function QuizEngine({
                                       title,
                                       questions,
                                       chapters,
                                       coursePath,
                                       savedMistakesKey,
                                       reviewVideoUrl,
                                       leaksVideoUrl,
                                       leakExamId
                                   }: QuizEngineProps) {
    const allowedQuestions = useMemo(
        () =>
            questions.filter(
                (question) =>
                    chapters.includes(
                        question.chapter
                    )
            ),
        [questions, chapters]
    )

    const reviewPool =
        useMemo<ReadyQuestion[]>(
            () =>
                allowedQuestions.filter(
                    (
                        question
                    ): question is ReadyQuestion =>
                        isQuizReady(
                            question
                        ) &&
                        question.source !==
                        'leak'
                ),
            [allowedQuestions]
        )

    const leakPool =
        useMemo<ReadyQuestion[]>(
            () =>
                allowedQuestions.filter(
                    (
                        question
                    ): question is ReadyQuestion =>
                        isQuizReady(
                            question
                        ) &&
                        question.source ===
                        'leak' &&
                        (
                            !leakExamId ||
                            question.examId ===
                            leakExamId
                        )
                ),
            [
                allowedQuestions,
                leakExamId
            ]
        )

    const [
        currentSection,
        setCurrentSection
    ] =
        useState<ActiveSection>('menu')

    const [
        activeQuestions,
        setActiveQuestions
    ] =
        useState<ReadyQuestion[]>([])

    const [
        currentIndex,
        setCurrentIndex
    ] = useState(0)

    const [
        selectedOption,
        setSelectedOption
    ] = useState('')

    const [
        isSubmitted,
        setIsSubmitted
    ] = useState(false)

    const [
        isCorrect,
        setIsCorrect
    ] =
        useState<boolean | null>(null)

    const [
        wrongItems,
        setWrongItems
    ] =
        useState<ReadyQuestion[]>([])

    const [
        savedMistakes,
        setSavedMistakes
    ] =
        useState<ReadyQuestion[]>([])

    const [
        finished,
        setFinished
    ] = useState(false)

    const [
        viewingErrorItem,
        setViewingErrorItem
    ] =
        useState<ReadyQuestion | null>(
            null
        )

    const [
        showMistakeTutor,
        setShowMistakeTutor
    ] = useState(false)

    const [
        isAiAllowed,
        setIsAiAllowed
    ] = useState(false)

    const [
        activeVideo,
        setActiveVideo
    ] =
        useState<{
            title: string
            url: string
        } | null>(null)

    const currentQuestion =
        activeQuestions[currentIndex]

    useEffect(() => {
        try {
            const saved =
                localStorage.getItem(
                    savedMistakesKey
                )

            if (saved) {
                setSavedMistakes(
                    JSON.parse(saved)
                )
            }
        } catch (error) {
            console.error(
                'Could not load saved mistakes:',
                error
            )
        }
    }, [savedMistakesKey])

    useEffect(() => {
        supabase.auth
            .getSession()
            .then(
                async ({
                           data: { session }
                       }) => {
                    if (
                        !session?.user
                    ) {
                        return
                    }

                    const {
                        data,
                        error
                    } =
                        await supabase
                            .from(
                                'user_courses'
                            )
                            .select(
                                'is_ai_allowed'
                            )
                            .eq(
                                'user_id',
                                session.user.id
                            )
                            .eq(
                                'course_id',
                                '101'
                            )
                            .maybeSingle()

                    if (
                        !error &&
                        data
                    ) {
                        setIsAiAllowed(
                            Boolean(
                                data.is_ai_allowed
                            )
                        )
                    }
                }
            )
    }, [])

    function persistMistakes(
        items: ReadyQuestion[]
    ) {
        setSavedMistakes(items)

        localStorage.setItem(
            savedMistakesKey,
            JSON.stringify(items)
        )
    }

    function saveCurrentWrongItems() {
        if (
            wrongItems.length === 0
        ) {
            return
        }

        const merged = [
            ...savedMistakes
        ]

        for (
            const item of wrongItems
            ) {
            const key =
                ideaKey(item)

            const existingIndex =
                merged.findIndex(
                    (savedItem) =>
                        ideaKey(
                            savedItem
                        ) === key
                )

            if (
                existingIndex >= 0
            ) {
                merged[
                    existingIndex
                    ] = item
            } else {
                merged.push(item)
            }
        }

        persistMistakes(merged)
    }

    function removeSavedMistake(
        item: ReadyQuestion
    ) {
        persistMistakes(
            savedMistakes.filter(
                (savedItem) =>
                    ideaKey(
                        savedItem
                    ) !==
                    ideaKey(item)
            )
        )

        setViewingErrorItem(
            null
        )

        setShowMistakeTutor(
            false
        )
    }

    function resetAttempt() {
        setCurrentIndex(0)
        setSelectedOption('')
        setIsSubmitted(false)
        setIsCorrect(null)
        setWrongItems([])
        setFinished(false)
        setViewingErrorItem(
            null
        )
        setShowMistakeTutor(
            false
        )
    }

    function startReview() {
        setActiveQuestions(
            buildRandomReview(
                reviewPool
            )
        )

        setCurrentSection(
            'review'
        )

        resetAttempt()
    }

    function startLeaks() {
        setActiveQuestions(
            shuffleQuestions(
                leakPool
            )
        )

        setCurrentSection(
            'leaks'
        )

        resetAttempt()
    }

    function backToMenu() {
        setCurrentSection(
            'menu'
        )

        setActiveQuestions([])
        setActiveVideo(null)

        resetAttempt()
    }

    function checkAnswer() {
        if (
            !currentQuestion ||
            !selectedOption
        ) {
            return
        }

        const correct =
            selectedOption ===
            currentQuestion.correctAnswer

        setIsCorrect(correct)
        setIsSubmitted(true)

        if (!correct) {
            setWrongItems(
                (previous) =>
                    previous.some(
                        (item) =>
                            item.id ===
                            currentQuestion.id
                    )
                        ? previous
                        : [
                            ...previous,
                            currentQuestion
                        ]
            )
        }
    }

    function nextQuestion() {
        if (
            currentIndex + 1 <
            activeQuestions.length
        ) {
            setCurrentIndex(
                (index) =>
                    index + 1
            )

            setSelectedOption('')
            setIsSubmitted(false)
            setIsCorrect(null)

            return
        }

        saveCurrentWrongItems()
        setFinished(true)
    }

    function getYoutubeEmbedUrl(
        url: string
    ) {
        try {
            if (
                url.includes(
                    'youtu.be/'
                )
            ) {
                const id =
                    url
                        .split(
                            'youtu.be/'
                        )[1]
                        ?.split(
                            /[?&]/
                        )[0]

                return id
                    ? `https://www.youtube.com/embed/${id}`
                    : ''
            }

            if (
                url.includes(
                    'youtube.com/watch'
                )
            ) {
                const id =
                    new URL(
                        url
                    ).searchParams.get(
                        'v'
                    )

                return id
                    ? `https://www.youtube.com/embed/${id}`
                    : ''
            }

            if (
                url.includes(
                    'youtube.com/shorts/'
                )
            ) {
                const id =
                    url
                        .split(
                            'youtube.com/shorts/'
                        )[1]
                        ?.split(
                            /[?&]/
                        )[0]

                return id
                    ? `https://www.youtube.com/embed/${id}`
                    : ''
            }

            if (
                url.includes(
                    'youtube.com/embed/'
                )
            ) {
                return url
            }

            return url
        } catch {
            return url
        }
    }

    function openVideo(
        url?: string,
        title = 'شرح المقطع'
    ) {
        if (
            !url ||
            url.includes(
                'ضع-رابط'
            )
        ) {
            alert(
                'رابط المقطع غير مضاف حتى الآن.'
            )
            return
        }

        setActiveVideo({
            title,
            url
        })
    }

    if (viewingErrorItem) {
        return (
            <main
                style={{
                    background:
                        '#FFF9E2',
                    minHeight:
                        '100vh'
                }}
            >
                <Navbar
                    isLoggedIn={
                        true
                    }
                />

                <div
                    style={{
                        padding:
                            '40px 20px'
                    }}
                >
                    <div
                        style={{
                            ...cardStyle,
                            maxWidth:
                                '650px',
                            margin:
                                '0 auto'
                        }}
                    >
                        <h2
                            style={{
                                color:
                                    '#2C3531'
                            }}
                        >
                            {
                                viewingErrorItem.questionName
                            }
                        </h2>

                        <p
                            style={{
                                color:
                                    '#4A5550',
                                fontWeight:
                                    'bold'
                            }}
                        >
                            {
                                viewingErrorItem.question
                            }
                        </p>

                        <div
                            style={{
                                background:
                                    '#FFF9E2',
                                padding:
                                    '15px',
                                borderRadius:
                                    '8px',
                                lineHeight:
                                    1.8
                            }}
                        >
                            <strong>
                                شرح الحل:
                            </strong>{' '}
                            {viewingErrorItem.solutionText ||
                                viewingErrorItem.answer}
                        </div>

                        <div
                            style={{
                                marginTop:
                                    '14px',
                                borderTop:
                                    '1px solid #eadfca',
                                paddingTop:
                                    '14px'
                            }}
                        >
                            <button
                                onClick={() =>
                                    setShowMistakeTutor(
                                        (
                                            previous
                                        ) =>
                                            !previous
                                    )
                                }
                                style={{
                                    background:
                                        'transparent',
                                    color:
                                        '#8c5521',
                                    border:
                                        'none',
                                    padding:
                                        '7px 2px',
                                    fontWeight:
                                        'bold',
                                    cursor:
                                        'pointer',
                                    fontSize:
                                        '13px'
                                }}
                            >
                                {showMistakeTutor
                                    ? 'إغلاق فيكتور ✕'
                                    : '🤖 اسأل فيكتور (الذكاء الاصطناعي)'}
                            </button>

                            {showMistakeTutor && (
                                <div
                                    style={{
                                        marginTop:
                                            '10px'
                                    }}
                                >
                                    <GlobalTutor
                                        mode="inline"
                                        courseId="101"
                                        currentModule={
                                            viewingErrorItem.moduleId
                                        }
                                        currentChapter={
                                            viewingErrorItem.chapter
                                        }
                                        currentQuestion={`السؤال: ${viewingErrorItem.question}

الإجابة الصحيحة: ${viewingErrorItem.correctAnswer}

شرح الحل: ${viewingErrorItem.solutionText || viewingErrorItem.answer}`}
                                        initialPrompt={
                                            null
                                        }
                                        isAiAllowed={
                                            isAiAllowed
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        <div
                            style={{
                                display:
                                    'flex',
                                gap: '8px',
                                flexWrap:
                                    'wrap',
                                marginTop:
                                    '18px'
                            }}
                        >
                            <button
                                onClick={() => {
                                    setViewingErrorItem(
                                        null
                                    )
                                    setShowMistakeTutor(
                                        false
                                    )
                                }}
                                style={
                                    primaryButton
                                }
                            >
                                ← رجوع
                            </button>

                            <Link
                                href={
                                    viewingErrorItem.ideaLink
                                }
                                style={{
                                    background:
                                        '#CDD4B1',
                                    color:
                                        '#2C3531',
                                    padding:
                                        '10px 14px',
                                    borderRadius:
                                        '8px',
                                    textDecoration:
                                        'none',
                                    fontWeight:
                                        'bold'
                                }}
                            >
                                الرجوع
                                للفكرة ➔
                            </Link>

                            <button
                                onClick={() =>
                                    removeSavedMistake(
                                        viewingErrorItem
                                    )
                                }
                                style={{
                                    background:
                                        '#fff',
                                    color:
                                        '#166534',
                                    border:
                                        '1px solid #86efac',
                                    padding:
                                        '10px 14px',
                                    borderRadius:
                                        '8px',
                                    fontWeight:
                                        'bold',
                                    cursor:
                                        'pointer'
                                }}
                            >
                                ✅ أتقنت
                                الفكرة
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (
        currentSection ===
        'savedMistakes'
    ) {
        return (
            <main
                style={{
                    background:
                        '#FFF9E2',
                    minHeight:
                        '100vh'
                }}
            >
                <Navbar
                    isLoggedIn={
                        true
                    }
                />

                <div
                    style={{
                        padding:
                            '32px 20px'
                    }}
                >
                    <div
                        style={{
                            ...cardStyle,
                            maxWidth:
                                '900px',
                            margin:
                                '0 auto',
                            padding:
                                '24px 28px'
                        }}
                    >
                        <div
                            style={{
                                display:
                                    'flex',
                                justifyContent:
                                    'space-between',
                                gap: '12px',
                                alignItems:
                                    'center',
                                marginBottom:
                                    '20px',
                                flexWrap:
                                    'wrap'
                            }}
                        >
                            <div>
                                <h2
                                    style={{
                                        margin:
                                            '0 0 5px',
                                        color:
                                            '#2C3531'
                                    }}
                                >
                                    📌 أخطائي
                                    المحفوظة
                                </h2>

                                <p
                                    style={{
                                        margin:
                                            0,
                                        color:
                                            '#4A5550',
                                        fontSize:
                                            '13px'
                                    }}
                                >
                                    تبقى
                                    الفكرة هنا
                                    حتى تضغط
                                    «أتقنت
                                    الفكرة».
                                </p>
                            </div>

                            <button
                                onClick={
                                    backToMenu
                                }
                                style={{
                                    ...primaryButton,
                                    background:
                                        '#FEECD0',
                                    color:
                                        '#2C3531'
                                }}
                            >
                                ← عودة
                            </button>
                        </div>

                        {savedMistakes.length ===
                        0 ? (
                            <div
                                style={{
                                    background:
                                        '#f0fdf4',
                                    color:
                                        '#166534',
                                    padding:
                                        '20px',
                                    borderRadius:
                                        '10px',
                                    textAlign:
                                        'center',
                                    fontWeight:
                                        'bold'
                                }}
                            >
                                🎉 ما عندك
                                أخطاء
                                محفوظة
                                حالياً.
                            </div>
                        ) : (
                            <div
                                style={{
                                    display:
                                        'flex',
                                    flexDirection:
                                        'column',
                                    gap: '7px'
                                }}
                            >
                                {savedMistakes.map(
                                    (
                                        item
                                    ) => (
                                        <div
                                            key={`${ideaKey(
                                                item
                                            )}-${item.id}`}
                                            style={{
                                                background:
                                                    '#FFF4DF',
                                                borderRadius:
                                                    '10px',
                                                padding:
                                                    '11px 14px',
                                                display:
                                                    'flex',
                                                justifyContent:
                                                    'space-between',
                                                alignItems:
                                                    'center',
                                                gap: '14px',
                                                flexWrap:
                                                    'wrap'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    flex:
                                                        1,
                                                    minWidth:
                                                        '260px'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize:
                                                            '11px',
                                                        color:
                                                            '#8c5521',
                                                        fontWeight:
                                                            'bold'
                                                    }}
                                                >
                                                    Chapter{' '}
                                                    {
                                                        item.chapter
                                                    }{' '}
                                                    |{' '}
                                                    {
                                                        item.ideaId
                                                    }
                                                </div>

                                                <div
                                                    style={{
                                                        fontWeight:
                                                            'bold',
                                                        fontSize:
                                                            '14px'
                                                    }}
                                                >
                                                    {
                                                        item.questionName
                                                    }
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    display:
                                                        'flex',
                                                    gap:
                                                        '6px',
                                                    flexWrap:
                                                        'wrap'
                                                }}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setViewingErrorItem(
                                                            item
                                                        )
                                                        setShowMistakeTutor(
                                                            false
                                                        )
                                                    }}
                                                    style={{
                                                        ...primaryButton,
                                                        padding:
                                                            '8px 11px',
                                                        fontSize:
                                                            '12px'
                                                    }}
                                                >
                                                    💡
                                                    مراجعة
                                                    الحل
                                                </button>

                                                <Link
                                                    href={
                                                        item.ideaLink
                                                    }
                                                    style={{
                                                        background:
                                                            '#CDD4B1',
                                                        color:
                                                            '#2C3531',
                                                        padding:
                                                            '8px 11px',
                                                        borderRadius:
                                                            '7px',
                                                        textDecoration:
                                                            'none',
                                                        fontWeight:
                                                            'bold',
                                                        fontSize:
                                                            '12px'
                                                    }}
                                                >
                                                    الرجوع
                                                    للفكرة
                                                    ➔
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        removeSavedMistake(
                                                            item
                                                        )
                                                    }
                                                    style={{
                                                        background:
                                                            '#fff',
                                                        color:
                                                            '#166534',
                                                        border:
                                                            '1px solid #86efac',
                                                        padding:
                                                            '8px 11px',
                                                        borderRadius:
                                                            '7px',
                                                        fontWeight:
                                                            'bold',
                                                        fontSize:
                                                            '12px',
                                                        cursor:
                                                            'pointer'
                                                    }}
                                                >
                                                    أتقنت
                                                    الفكرة
                                                    ✅
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        )
    }

    if (finished) {
        return (
            <main
                style={{
                    background:
                        '#FFF9E2',
                    minHeight:
                        '100vh'
                }}
            >
                <Navbar
                    isLoggedIn={
                        true
                    }
                />

                <div
                    style={{
                        padding:
                            '40px 20px'
                    }}
                >
                    <div
                        style={{
                            ...cardStyle,
                            maxWidth:
                                '650px',
                            margin:
                                '0 auto'
                        }}
                    >
                        <h2>
                            {currentSection ===
                            'leaks'
                                ? '🔥 انتهيت من تدريب التسريبات!'
                                : '🎉 انتهيت من المراجعة!'}
                        </h2>

                        <p>
                            {wrongItems.length ===
                            0
                                ? 'رائع! لم تخطئ في أي سؤال.'
                                : `لديك ${wrongItems.length} أسئلة تحتاج مراجعة.`}
                        </p>

                        <div
                            style={{
                                display:
                                    'flex',
                                flexDirection:
                                    'column',
                                gap: '10px'
                            }}
                        >
                            {savedMistakes.length >
                                0 && (
                                    <button
                                        onClick={() => {
                                            setFinished(
                                                false
                                            )

                                            setCurrentSection(
                                                'savedMistakes'
                                            )
                                        }}
                                        style={{
                                            ...primaryButton,
                                            background:
                                                '#CDD4B1',
                                            color:
                                                '#2C3531'
                                        }}
                                    >
                                        📌 فتح
                                        أخطائي
                                        المحفوظة
                                    </button>
                                )}

                            <button
                                onClick={
                                    backToMenu
                                }
                                style={
                                    primaryButton
                                }
                            >
                                العودة
                                لقائمة
                                الاختبار
                                ➔
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (
        currentSection ===
        'menu'
    ) {
        return (
            <main
                style={{
                    background:
                        '#FFF9E2',
                    minHeight:
                        '100vh'
                }}
            >
                <Navbar
                    isLoggedIn={
                        true
                    }
                />

                <div
                    style={{
                        padding:
                            '40px 20px'
                    }}
                >
                    <div
                        style={{
                            ...cardStyle,
                            maxWidth:
                                '650px',
                            margin:
                                '0 auto'
                        }}
                    >
                        <div
                            style={{
                                display:
                                    'flex',
                                justifyContent:
                                    'space-between',
                                alignItems:
                                    'center',
                                gap: '12px',
                                marginBottom:
                                    '20px'
                            }}
                        >
                            <h1
                                style={{
                                    margin:
                                        0,
                                    fontSize:
                                        '22px'
                                }}
                            >
                                🎯 {title}
                            </h1>

                            <Link
                                href={
                                    coursePath
                                }
                                style={{
                                    background:
                                        '#CDD4B1',
                                    color:
                                        '#2C3531',
                                    padding:
                                        '8px 12px',
                                    borderRadius:
                                        '8px',
                                    textDecoration:
                                        'none',
                                    fontWeight:
                                        'bold',
                                    fontSize:
                                        '13px'
                                }}
                            >
                                ← صفحة
                                الكورس
                            </Link>
                        </div>

                        <div
                            style={{
                                display:
                                    'flex',
                                flexDirection:
                                    'column',
                                gap: '12px'
                            }}
                        >
                            <section
                                style={{
                                    background:
                                        '#fff',
                                    border:
                                        '1px solid #eadfca',
                                    borderRadius:
                                        '14px',
                                    padding:
                                        '18px 20px'
                                }}
                            >
                                <h3>
                                    🎯 مراجعة
                                    الاختبار
                                </h3>

                                <p>
                                    سؤال
                                    عشوائي من
                                    كل فكرة.
                                </p>

                                <button
                                    onClick={
                                        startReview
                                    }
                                    disabled={
                                        reviewPool.length ===
                                        0
                                    }
                                    style={{
                                        ...primaryButton,
                                        opacity:
                                            reviewPool.length ===
                                            0
                                                ? 0.5
                                                : 1
                                    }}
                                >
                                    ابدأ
                                    مراجعة
                                    جديدة
                                    ➔
                                </button>

                                <div
                                    style={{
                                        marginTop:
                                            '5px'
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            openVideo(
                                                reviewVideoUrl,
                                                'شرح مراجعة الاختبار'
                                            )
                                        }
                                        style={{
                                            background:
                                                'transparent',
                                            color:
                                                '#8c5521',
                                            border:
                                                'none',
                                            fontWeight:
                                                'bold',
                                            cursor:
                                                'pointer'
                                        }}
                                    >
                                        مشاهدة
                                        شرح
                                        المراجعة{' '}
                                        {activeVideo?.title ===
                                        'شرح مراجعة الاختبار'
                                            ? '▼'
                                            : '▶'}
                                    </button>

                                    {activeVideo?.title ===
                                        'شرح مراجعة الاختبار' && (
                                            <div
                                                style={{
                                                    fontSize:
                                                        '11px',
                                                    color:
                                                        '#8c5521',
                                                    fontWeight:
                                                        'bold'
                                                }}
                                            >
                                                ↓ المقطع
                                                مفتوح
                                                بالأسفل
                                            </div>
                                        )}
                                </div>
                            </section>

                            <section
                                style={{
                                    background:
                                        '#fff',
                                    border:
                                        '1px solid #eadfca',
                                    borderRadius:
                                        '14px',
                                    padding:
                                        '18px 20px'
                                }}
                            >
                                <h3>
                                    🔥 تسريبات
                                    الاختبارات
                                    السابقة
                                </h3>

                                <p>
                                    تسريبات
                                    الاختبار
                                    الحالي فقط.
                                </p>

                                <button
                                    onClick={
                                        startLeaks
                                    }
                                    disabled={
                                        leakPool.length ===
                                        0
                                    }
                                    style={{
                                        ...primaryButton,
                                        opacity:
                                            leakPool.length ===
                                            0
                                                ? 0.5
                                                : 1
                                    }}
                                >
                                    ابدأ
                                    تدريب
                                    التسريبات
                                    ➔
                                </button>

                                <div
                                    style={{
                                        marginTop:
                                            '5px'
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            openVideo(
                                                leaksVideoUrl,
                                                'شرح تسريبات الاختبار'
                                            )
                                        }
                                        style={{
                                            background:
                                                'transparent',
                                            color:
                                                '#8c3f21',
                                            border:
                                                'none',
                                            fontWeight:
                                                'bold',
                                            cursor:
                                                'pointer'
                                        }}
                                    >
                                        مشاهدة
                                        شرح
                                        التسريبات{' '}
                                        {activeVideo?.title ===
                                        'شرح تسريبات الاختبار'
                                            ? '▼'
                                            : '▶'}
                                    </button>

                                    {activeVideo?.title ===
                                        'شرح تسريبات الاختبار' && (
                                            <div
                                                style={{
                                                    fontSize:
                                                        '11px',
                                                    color:
                                                        '#8c3f21',
                                                    fontWeight:
                                                        'bold'
                                                }}
                                            >
                                                ↓ المقطع
                                                مفتوح
                                                بالأسفل
                                            </div>
                                        )}
                                </div>
                            </section>

                            <button
                                onClick={() =>
                                    setCurrentSection(
                                        'savedMistakes'
                                    )
                                }
                                style={{
                                    background:
                                        '#fff',
                                    color:
                                        '#2C3531',
                                    padding:
                                        '18px 20px',
                                    borderRadius:
                                        '14px',
                                    border:
                                        '1px solid #eadfca',
                                    cursor:
                                        'pointer'
                                }}
                            >
                                📌 أخطائي
                                المحفوظة
                                {savedMistakes.length >
                                0
                                    ? ` (${savedMistakes.length})`
                                    : ''}
                            </button>

                            {activeVideo && (
                                <div
                                    style={{
                                        marginTop:
                                            '4px',
                                        background:
                                            '#ffffff',
                                        border:
                                            '1px solid #eadfca',
                                        borderRadius:
                                            '14px',
                                        padding:
                                            '12px'
                                    }}
                                >
                                    <div
                                        style={{
                                            display:
                                                'flex',
                                            justifyContent:
                                                'space-between',
                                            alignItems:
                                                'center',
                                            marginBottom:
                                                '10px'
                                        }}
                                    >
                                        <strong>
                                            🎥{' '}
                                            {
                                                activeVideo.title
                                            }
                                        </strong>

                                        <button
                                            onClick={() =>
                                                setActiveVideo(
                                                    null
                                                )
                                            }
                                            style={{
                                                background:
                                                    'transparent',
                                                border:
                                                    'none',
                                                cursor:
                                                    'pointer'
                                            }}
                                        >
                                            ✕ إغلاق
                                        </button>
                                    </div>

                                    <div
                                        style={{
                                            position:
                                                'relative',
                                            width:
                                                '100%',
                                            paddingTop:
                                                '56.25%',
                                            background:
                                                '#000',
                                            borderRadius:
                                                '10px',
                                            overflow:
                                                'hidden'
                                        }}
                                    >
                                        <iframe
                                            src={getYoutubeEmbedUrl(
                                                activeVideo.url
                                            )}
                                            title={
                                                activeVideo.title
                                            }
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            style={{
                                                position:
                                                    'absolute',
                                                inset:
                                                    0,
                                                width:
                                                    '100%',
                                                height:
                                                    '100%',
                                                border:
                                                    'none'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (!currentQuestion) {
        return (
            <main
                style={{
                    background:
                        '#FFF9E2',
                    minHeight:
                        '100vh'
                }}
            >
                <Navbar
                    isLoggedIn={
                        true
                    }
                />

                <div
                    style={{
                        padding:
                            '40px 20px'
                    }}
                >
                    <div
                        style={{
                            ...cardStyle,
                            maxWidth:
                                '650px',
                            margin:
                                '0 auto',
                            textAlign:
                                'center'
                        }}
                    >
                        <p>
                            لا توجد
                            أسئلة جاهزة
                            لهذا القسم
                            حالياً.
                        </p>

                        <button
                            onClick={
                                backToMenu
                            }
                            style={
                                primaryButton
                            }
                        >
                            ← عودة
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main
            style={{
                background:
                    '#FFF9E2',
                minHeight:
                    '100vh'
            }}
        >
            <Navbar
                isLoggedIn={
                    true
                }
            />

            <div
                style={{
                    padding:
                        '40px 20px'
                }}
            >
                <div
                    style={{
                        ...cardStyle,
                        maxWidth:
                            '650px',
                        margin:
                            '0 auto'
                    }}
                >
                    <div
                        style={{
                            display:
                                'flex',
                            justifyContent:
                                'space-between',
                            gap: '8px',
                            flexWrap:
                                'wrap',
                            marginBottom:
                                '14px'
                        }}
                    >
                        <div>
                            Chapter{' '}
                            {
                                currentQuestion.chapter
                            }{' '}
                            |{' '}
                            {
                                currentQuestion.ideaId
                            }
                        </div>

                        <button
                            onClick={
                                backToMenu
                            }
                            style={{
                                background:
                                    'none',
                                border:
                                    'none',
                                cursor:
                                    'pointer'
                            }}
                        >
                            ✕ الخروج
                            للقائمة
                        </button>
                    </div>

                    <p>
                        السؤال{' '}
                        {currentIndex +
                            1}{' '}
                        من{' '}
                        {
                            activeQuestions.length
                        }
                    </p>

                    <h2>
                        {
                            currentQuestion.question
                        }
                    </h2>

                    {currentQuestion.image && (
                        <img
                            src={
                                currentQuestion.image
                            }
                            alt="Question"
                            style={{
                                maxWidth:
                                    '100%'
                            }}
                        />
                    )}

                    <div
                        style={{
                            display:
                                'flex',
                            flexDirection:
                                'column',
                            gap: '10px'
                        }}
                    >
                        {currentQuestion.options.map(
                            (
                                option
                            ) => (
                                <button
                                    key={
                                        option
                                    }
                                    onClick={() =>
                                        !isSubmitted &&
                                        setSelectedOption(
                                            option
                                        )
                                    }
                                    style={{
                                        background:
                                            selectedOption ===
                                            option
                                                ? '#DCA27B'
                                                : '#FFF9E2',
                                        color:
                                            selectedOption ===
                                            option
                                                ? '#fff'
                                                : '#2C3531',
                                        padding:
                                            '12px',
                                        borderRadius:
                                            '8px',
                                        border:
                                            '1px solid #e6dec5'
                                    }}
                                >
                                    {
                                        option
                                    }
                                </button>
                            )
                        )}

                        {!isSubmitted ? (
                            <button
                                onClick={
                                    checkAnswer
                                }
                                disabled={
                                    !selectedOption
                                }
                                style={{
                                    ...primaryButton,
                                    marginTop:
                                        '8px',
                                    opacity:
                                        selectedOption
                                            ? 1
                                            : 0.5
                                }}
                            >
                                تحقق من
                                الإجابة
                            </button>
                        ) : (
                            <>
                                <div
                                    style={{
                                        marginTop:
                                            '8px',
                                        padding:
                                            '14px',
                                        borderRadius:
                                            '8px',
                                        background:
                                            isCorrect
                                                ? '#d1fae5'
                                                : '#fee2e2'
                                    }}
                                >
                                    {isCorrect
                                        ? '✅ إجابة صحيحة!'
                                        : '❌ إجابة خاطئة!'}
                                </div>

                                <button
                                    onClick={
                                        nextQuestion
                                    }
                                    style={{
                                        ...primaryButton,
                                        background:
                                            '#2C3531'
                                    }}
                                >
                                    {currentIndex +
                                    1 <
                                    activeQuestions.length
                                        ? 'السؤال التالي ➔'
                                        : 'إنهاء ➔'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
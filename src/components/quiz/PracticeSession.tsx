'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import GlobalTutor from '@/components/GlobalTutor';
import { createQuestion, ideaHref, type QuizIdea, type QuizQuestion } from '@/lib/quiz/engine';
import { describeQuestionForTutor } from '@/lib/questions/tutorContext';
import { QuestionCard, Solution } from './QuestionCard';
import s from './Quiz.module.css';

interface PracticeSessionProps {
    title: string;
    ideas: QuizIdea[];
    courseId: string;
    quizId: string;
    isAiAllowed: boolean;
    onResult: (question: QuizQuestion, isCorrect: boolean) => void;
    onExit: () => void;
}

/** جلسة مراجعة: الخطأ يوضّح الحل، ثم ترجع الفكرة مرة ثانية بسؤال جديد في آخر الجلسة */
export default function PracticeSession({ title, ideas, courseId, quizId, isAiAllowed, onResult, onExit }: PracticeSessionProps) {
    const shownIds = useRef(new Set<string>());
    const makeQuestion = (idea: QuizIdea) => {
        const question = createQuestion(idea, shownIds.current);
        shownIds.current.add(question.questionId);
        return question;
    };

    const [queue, setQueue] = useState(ideas);
    const [position, setPosition] = useState(0);
    const [question, setQuestion] = useState(() => makeQuestion(ideas[0]));
    const [selected, setSelected] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [willRetry, setWillRetry] = useState(false);
    const [firstTryWrong, setFirstTryWrong] = useState<QuizIdea[]>([]);
    const [finished, setFinished] = useState(false);

    const isCorrect = selected === question.correctAnswer;

    function check() {
        setSubmitted(true);
        onResult(question, isCorrect);

        const alreadyRetried = firstTryWrong.includes(question.idea);
        if (!isCorrect && !alreadyRetried) {
            setFirstTryWrong((previous) => [...previous, question.idea]);
            setQueue((previous) => [...previous, question.idea]);
            setWillRetry(true);
        }
    }

    function next() {
        if (position + 1 >= queue.length) {
            setFinished(true);
            window.scrollTo({ top: 0 });
            return;
        }
        setQuestion(makeQuestion(queue[position + 1]));
        setPosition(position + 1);
        setSelected('');
        setSubmitted(false);
        setWillRetry(false);
        window.scrollTo({ top: 0 });
    }

    if (finished) {
        return (
            <div className={s.card}>
                <h2 className={s.heading}>🎉 خلصت الجلسة</h2>
                <p className={s.muted}>
                    {firstTryWrong.length === 0
                        ? `حللت كل الأفكار من أول محاولة (${ideas.length} من ${ideas.length}).`
                        : `حللت ${ideas.length - firstTryWrong.length} من ${ideas.length} من أول محاولة.`}
                </p>

                {firstTryWrong.length > 0 && (
                    <div className={s.ideaLinks}>
                        <strong>أفكار تستاهل تراجع شرحها:</strong>
                        {firstTryWrong.map((idea) => (
                            <Link key={idea.key} href={ideaHref(courseId, idea)} className={s.ideaLink}>
                                {idea.ideaNumber} {idea.ideaName} ←
                            </Link>
                        ))}
                    </div>
                )}

                <button type="button" className={s.primaryBtn} onClick={onExit}>الرجوع لخريطة الأفكار</button>
            </div>
        );
    }

    const chatKey = `quiz-${quizId}-${question.idea.key}`;

    return (
        <div className={s.card}>
            <div className={s.sessionHead}>
                <div>
                    <div className={s.eyebrow}>{title} · السؤال {position + 1} من {queue.length}</div>
                    <div className={s.ideaTitle} dir="auto">{question.idea.ideaNumber} {question.idea.ideaName}</div>
                </div>
                <button type="button" className={s.ghostBtn} onClick={onExit}>✕ خروج</button>
            </div>

            <div className={s.bar}><span style={{ width: `${(position / queue.length) * 100}%` }} /></div>

            <QuestionCard question={question} selected={selected} onSelect={setSelected} revealed={submitted} />

            {!submitted ? (
                <button type="button" className={s.primaryBtn} onClick={check} disabled={!selected}>تحقق من الإجابة</button>
            ) : (
                <>
                    <div className={isCorrect ? s.feedbackCorrect : s.feedbackWrong}>
                        {isCorrect ? '✓ إجابة صحيحة' : '✕ إجابة خاطئة'}
                        {willRetry && <div className={s.feedbackNote}>بيرجع لك سؤال جديد على هذي الفكرة في آخر الجلسة.</div>}
                    </div>
                    <Solution question={question} />
                    <button type="button" className={s.primaryBtn} onClick={next}>
                        {position + 1 < queue.length ? 'السؤال التالي ←' : 'إنهاء الجلسة ←'}
                    </button>
                </>
            )}

            <GlobalTutor
                key={chatKey}
                courseId={courseId}
                isAiAllowed={isAiAllowed}
                currentModule={Number(question.idea.moduleNumber) || 1}
                currentChapter={question.idea.chapter}
                currentIdea={{ id: question.idea.ideaId, name: `فكرة ${question.idea.ideaNumber}: ${question.idea.ideaName}` }}
                currentQuestion={describeQuestionForTutor({
                    questionText: question.questionText,
                    math: question.math,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    steps: question.steps,
                    explanation: question.explanation,
                    hasGraph: Boolean(question.image),
                })}
                chatKey={chatKey}
            />
        </div>
    );
}

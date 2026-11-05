'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createQuestion, ideaHref, pickMockIdeas, type QuizIdea, type QuizQuestion } from '@/lib/quiz/engine';
import { QuestionCard, Solution } from './QuestionCard';
import s from './Quiz.module.css';

interface MockExamProps {
    ideas: QuizIdea[];
    questionCount: number;
    minutes: number;
    courseId: string;
    onResult: (question: QuizQuestion, isCorrect: boolean) => void;
    onOpenMistakes: () => void;
    onExit: () => void;
}

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(' ');

const formatTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

/** اختبار تجريبي: وقت محدد، بدون فيكتور، والنتيجة والحلول تظهر بعد التسليم */
export default function MockExam({ ideas, questionCount, minutes, courseId, onResult, onOpenMistakes, onExit }: MockExamProps) {
    const [questions] = useState(() => pickMockIdeas(ideas, questionCount).map((idea) => createQuestion(idea)));
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [index, setIndex] = useState(0);
    const [startedAt] = useState(() => Date.now());
    const [now, setNow] = useState(startedAt);
    const [finishedAt, setFinishedAt] = useState<number | null>(null);
    const submittedRef = useRef(false);

    const total = minutes * 60;
    const elapsed = Math.floor((now - startedAt) / 1000);
    const remaining = Math.max(0, total - elapsed);
    const answeredCount = Object.keys(answers).length;

    // الوقت يُحسب من ساعة الجهاز، فلا يتأثر إذا انتقل الطالب لتبويب آخر
    useEffect(() => {
        if (finishedAt !== null) return;
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, [finishedAt]);

    function submit() {
        if (submittedRef.current) return;
        submittedRef.current = true;
        questions.forEach((question, i) => onResult(question, answers[i] === question.correctAnswer));
        setFinishedAt(Date.now());
        window.scrollTo({ top: 0 });
    }

    useEffect(() => {
        if (remaining === 0) submit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remaining]);

    function confirmSubmit() {
        const left = questions.length - answeredCount;
        if (left === 0 || window.confirm(`باقي ${left} بدون إجابة، وتنحسب خطأ. تسلّم الاختبار؟`)) submit();
    }

    function confirmExit() {
        if (window.confirm('إذا خرجت الآن تضيع إجاباتك في هذا الاختبار. تخرج؟')) onExit();
    }

    if (finishedAt !== null) {
        const results = questions.map((question, i) => ({ question, answer: answers[i] ?? '', correct: answers[i] === question.correctAnswer }));
        const score = results.filter((r) => r.correct).length;
        const usedSeconds = Math.min(total, Math.floor((finishedAt - startedAt) / 1000));
        const weak = results.filter((r) => !r.correct);

        return (
            <div className={s.card}>
                <div className={s.score}>{score} / {questions.length}</div>
                <p className={s.scoreNote}>الوقت المستخدم {formatTime(usedSeconds)} من {formatTime(total)}</p>

                {weak.length > 0 && (
                    <div className={s.ideaLinks}>
                        <strong>راجع شرح هذه الأفكار:</strong>
                        {weak.map(({ question }) => (
                            <Link key={question.idea.key} href={ideaHref(courseId, question.idea)} className={s.ideaLink}>
                                {question.idea.ideaNumber} {question.idea.ideaName} ←
                            </Link>
                        ))}
                    </div>
                )}

                <h3 className={s.subheading}>الأسئلة والحلول</h3>
                {results.map(({ question, answer, correct }, i) => (
                    <details key={question.questionId} className={s.review} open={!correct}>
                        <summary dir="auto">
                            {correct ? '✓' : '✕'} السؤال {i + 1}: {question.idea.ideaName}
                            {!answer && ' (بدون إجابة)'}
                        </summary>
                        <QuestionCard question={question} selected={answer} revealed />
                        <Solution question={question} />
                    </details>
                ))}

                <div className={s.actions}>
                    {weak.length > 0 && <button type="button" className={s.primaryBtn} onClick={onOpenMistakes}>راجع أخطائي</button>}
                    <button type="button" className={s.secondaryBtn} onClick={onExit}>الرجوع لخريطة الأفكار</button>
                </div>
            </div>
        );
    }

    const question: QuizQuestion = questions[index];

    return (
        <div className={s.card}>
            <div className={s.sessionHead}>
                <div>
                    <div className={s.eyebrow}>اختبار تجريبي · أجبت {answeredCount} من {questions.length}</div>
                    <div className={cx(s.timer, remaining <= 60 && s.timerLow)} role="timer">⏱ {formatTime(remaining)}</div>
                </div>
                <button type="button" className={s.ghostBtn} onClick={confirmExit}>✕ خروج</button>
            </div>

            <div className={s.dots}>
                {questions.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`السؤال ${i + 1}`}
                        aria-current={i === index}
                        className={cx(s.dot, answers[i] && s.dotAnswered, i === index && s.dotActive)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <QuestionCard
                key={question.questionId}
                question={question}
                selected={answers[index] ?? ''}
                onSelect={(option) => setAnswers((previous) => ({ ...previous, [index]: option }))}
                revealed={false}
            />

            <div className={s.actions}>
                <button type="button" className={s.secondaryBtn} disabled={index === 0} onClick={() => setIndex(index - 1)}>→ السابق</button>
                {index + 1 < questions.length && (
                    <button type="button" className={s.secondaryBtn} onClick={() => setIndex(index + 1)}>التالي ←</button>
                )}
                <button type="button" className={s.primaryBtn} onClick={confirmSubmit}>تسليم الاختبار</button>
            </div>
        </div>
    );
}

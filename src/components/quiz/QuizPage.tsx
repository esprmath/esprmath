'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAiAllowed } from '@/components/useAiAllowed';
import type { QuizContent } from '@/types/math';
import { buildQuizIdeas, mistakesStorageKey, parseMistakes, updateMistakes, type QuizIdea, type QuizQuestion } from '@/lib/quiz/engine';
import { loadIdeaProgress, recordIdeaResult, type IdeaProgressMap } from '@/lib/questions/mastery';
import QuizHome from './QuizHome';
import PracticeSession from './PracticeSession';
import MockExam from './MockExam';
import s from './Quiz.module.css';

type Screen =
    | { name: 'home' }
    | { name: 'practice'; title: string; ideas: QuizIdea[]; runId: number }
    | { name: 'mock'; runId: number };

/** نظام الكويز لكل الكورسات. إعدادات كل كويز تصله من src/content */
export default function QuizPage({ content }: { content: QuizContent }) {
    const { courseId, quizId } = content;
    const isAiAllowed = useAiAllowed(courseId);
    const ideas = useMemo(() => buildQuizIdeas(content.chapters, content.extraQuestions), [content]);
    const storageKey = mistakesStorageKey(courseId, quizId);

    const [screen, setScreen] = useState<Screen>({ name: 'home' });
    const [progress, setProgress] = useState<IdeaProgressMap>({});
    const [mistakes, setMistakes] = useState<string[]>([]);
    const mistakesRef = useRef<string[]>([]);
    const runId = useRef(0);

    useEffect(() => {
        setProgress(loadIdeaProgress(courseId));
        const saved = parseMistakes(localStorage.getItem(storageKey));
        mistakesRef.current = saved;
        setMistakes(saved);
    }, [courseId, storageKey]);

    // كل نتيجة تُحفظ مباشرة، فلا تضيع إذا خرج الطالب قبل نهاية الجلسة
    function handleResult(question: QuizQuestion, isCorrect: boolean) {
        setProgress(recordIdeaResult(courseId, question.idea.masteryKey, question.questionId, isCorrect));

        const updated = updateMistakes(mistakesRef.current, question.idea.key, isCorrect);
        mistakesRef.current = updated;
        setMistakes(updated);
        try {
            localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {
            // إذا امتلأت مساحة المتصفح يستمر الطالب، لكن الأخطاء لا تُحفظ
        }
    }

    function open(next: Screen) {
        setScreen(next);
        window.scrollTo({ top: 0 });
    }

    const startPractice = (title: string, practiceIdeas: QuizIdea[]) =>
        open({ name: 'practice', title, ideas: practiceIdeas, runId: ++runId.current });

    const mistakeIdeas = ideas.filter((idea) => mistakes.includes(idea.key));
    const pastExamIdeas = ideas.filter((idea) => content.pastExamIdeas.includes(idea.key));
    const backHome = () => open({ name: 'home' });

    return (
        <main className={s.page}>
            <Navbar isLoggedIn={true} />
            <div className={s.container}>
                {screen.name === 'home' && (
                    <QuizHome
                        title={content.title}
                        coursePath={`/workspace/${courseId}`}
                        ideas={ideas}
                        progress={progress}
                        mistakesCount={mistakeIdeas.length}
                        pastExamCount={pastExamIdeas.length}
                        pastExamVideoUrl={content.pastExamVideoUrl}
                        mockQuestionCount={content.mockQuestionCount}
                        mockMinutes={content.mockMinutes}
                        onStartIdeas={startPractice}
                        onStartPastExam={() => startPractice('جاءت في اختبارات سابقة', pastExamIdeas)}
                        onStartMistakes={() => startPractice('راجع أخطائي', mistakeIdeas)}
                        onStartMock={() => open({ name: 'mock', runId: ++runId.current })}
                    />
                )}

                {screen.name === 'practice' && (
                    <PracticeSession
                        key={screen.runId}
                        title={screen.title}
                        ideas={screen.ideas}
                        courseId={courseId}
                        quizId={quizId}
                        isAiAllowed={isAiAllowed}
                        onResult={handleResult}
                        onExit={backHome}
                    />
                )}

                {screen.name === 'mock' && (
                    <MockExam
                        key={screen.runId}
                        ideas={ideas}
                        questionCount={content.mockQuestionCount}
                        minutes={content.mockMinutes}
                        courseId={courseId}
                        onResult={handleResult}
                        onOpenMistakes={() => startPractice('راجع أخطائي', ideas.filter((idea) => mistakesRef.current.includes(idea.key)))}
                        onExit={backHome}
                    />
                )}
            </div>
        </main>
    );
}

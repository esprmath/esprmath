'use client';

import QuizPage from '@/components/quiz/QuizPage';
import { demoQuiz1 } from '@/content/demo/quiz-1';

export default function Page() {
    return <QuizPage content={demoQuiz1} />;
}

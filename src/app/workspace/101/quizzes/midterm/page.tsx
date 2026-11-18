'use client';

import QuizPage from '@/components/quiz/QuizPage';
import { midterm } from '@/content/101/midterm';

export default function Page() {
    return <QuizPage content={midterm} />;
}

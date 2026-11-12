// ════════════════════════════════════════════════════════════
// الكورس النموذجي · Quiz 1
// نموذج توضيحي لشكل الكويزات، من Chapter الكورس النموذجي فقط
// ════════════════════════════════════════════════════════════
import type { QuizContent } from '@/types/math';
import { demoModule1 } from './module-1';

export const demoQuiz1: QuizContent = {
    courseId: 'demo',
    quizId: 'quiz-1',
    title: 'Quiz 1 - نموذج',
    chapters: demoModule1.chapters,
    extraQuestions: demoModule1.extraQuestions,
    // فكرة جاءت في اختبارات سابقة، بصيغة "رقم الـ Chapter-رقم الفكرة"
    pastExamIdeas: ['1.6-1.2'],
    mockQuestionCount: 4,
    mockMinutes: 10,
};

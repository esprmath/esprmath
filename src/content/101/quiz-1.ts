// ════════════════════════════════════════════════════════════
// Math 101 · Quiz 1
// هذا الملف لإعدادات الكويز فقط. الشاشات في components/quiz
// ════════════════════════════════════════════════════════════
import type { QuizContent } from '@/types/math';
import { module1 } from './module-1';

export const quiz1: QuizContent = {
    courseId: '101',
    // نفس quiz_id في لوحة التحكم، وعليه تتحدد مواعيد فتح الكويز
    quizId: 'quiz-1',
    title: 'Quiz 1 - Math 101',

    // 📚 الشباتر الداخلة في الكويز: جلسات المراجعة تتكوّن من أفكارها
    chapters: module1.chapters,
    extraQuestions: module1.extraQuestions,

    // 📝 أفكار جاءت في اختبارات سابقة، بصيغة "رقم الشابتر-رقم الفكرة"
    pastExamIdeas: ['1.5-1.2', '1.5-1.4', '2.1-3.1', '1.8-4.1', '3.4-5.1'],

    // 🎬 مقطع شرح الاختبارات السابقة: الصق رابط يوتيوب، أو احذف السطر إذا لا يوجد مقطع
    pastExamVideoUrl: 'https://youtu.be/SH8Mw7mWB4s?si=qUm2GkXS1pwR2DtY',

    // ⏱️ الاختبار التجريبي: عدد الأسئلة والوقت بالدقائق
    mockQuestionCount: 7,
    mockMinutes: 25,
};

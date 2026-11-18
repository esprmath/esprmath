// ════════════════════════════════════════════════════════════
// Math 101 · Midterm
// هذا الملف لإعدادات الميد فقط. الشاشات في components/quiz
// ════════════════════════════════════════════════════════════
import type { QuizContent } from '@/types/math';
import { module1 } from './module-1';
import { module2 } from './module-2';

export const midterm: QuizContent = {
    courseId: '101',
    // نفس quiz_id في لوحة التحكم، وعليه تتحدد مواعيد فتح الميد
    quizId: 'midterm',
    title: 'Midterm - Math 101',

    // 📚 الميد يشمل الـ Module 1 و 2
    chapters: [...module1.chapters, ...module2.chapters],
    extraQuestions: [...module1.extraQuestions, ...module2.extraQuestions],

    // 📝 أفكار جاءت في اختبارات سابقة، بصيغة "رقم الـ Chapter-رقم الفكرة"، مثل: ['1.5-1.2', '2.3-3.1']
    // فارغة حتى تُحدَّد، وما دامت فارغة يختفي مسار "جاءت في اختبارات سابقة" من الشاشة
    pastExamIdeas: [],

    // 🎬 مقطع شرح الاختبارات السابقة: الصق رابط يوتيوب بين العلامتين، أو اتركه محذوفًا
    // pastExamVideoUrl: '',

    // 🛣️ الأفكار تُقسم على 3 مراجعات متساوية (11 فكرة لكل مراجعة)، والطالب يختار منها من الطريق
    reviewParts: 3,

    // ⏱️ الاختبار التجريبي: سؤال من كل Chapter، والوقت بالدقائق
    mockQuestionCount: 10,
    mockMinutes: 35,
};

// ════════════════════════════════════════════════════════════
// Math 101 · Final Review (شكل مبدئي)
// هذا الملف لإعدادات مراجعة الفاينل فقط. الشاشات في components/quiz
// ════════════════════════════════════════════════════════════
import type { QuizContent } from '@/types/math';
import { module1 } from './module-1';
import { module2 } from './module-2';

export const finalReview: QuizContent = {
    courseId: '101',
    // نفس quiz_id في لوحة التحكم، وعليه تتحدد مواعيد فتح مراجعة الفاينل
    quizId: 'final-review',
    title: 'Final Review - Math 101',

    // 📚 المتوفر الآن Module 1 و 2 فقط. أضف module3 و module4 هنا لما يجهز محتواهم، والمراجعات تتقسم تلقائيًا
    chapters: [...module1.chapters, ...module2.chapters],
    extraQuestions: [...module1.extraQuestions, ...module2.extraQuestions],

    // 📝 أفكار جاءت في اختبارات سابقة، بصيغة "رقم الـ Chapter-رقم الفكرة". فارغة حتى تُحدَّد، وما دامت فارغة يختفي المسار
    pastExamIdeas: [],
    // pastExamVideoUrl: '',

    // 🛣️ الأفكار تُقسم على 4 مراجعات متساوية، والطريق على اليسار وبطاقات الاختبارات على اليمين
    reviewParts: 4,
    sideLayout: true,

    // ⏱️ التجريبي الكامل (لمن عنده وقت). الأرقام مبدئية وتتعدل
    mockQuestionCount: 25,
    mockMinutes: 90,

    // ⚡ التجريبي السريع (لمن وقته ضيق). الأرقام مبدئية وتتعدل
    quickMock: { questionCount: 10, minutes: 20 },
};

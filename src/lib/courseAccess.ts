// src/lib/courseAccess.ts
// قواعد الفتح المشتركة بين صفحة الكورس ولوحة التحكم.

export interface CourseModule {
    id: number;
    course_id: string;
    module_number: number;
    title: string;
    description: string;
    chapters: string[];
    is_open: boolean;
    is_free: boolean;
    opens_at: string | null;
    closes_at: string | null;
}

export type WindowStatus = 'open' | 'scheduled' | 'expired' | 'closed';

export function windowStatus(item: { is_open: boolean; opens_at: string | null; closes_at: string | null }): WindowStatus {
    if (!item.is_open) return 'closed';
    const now = Date.now();
    if (item.opens_at && now < new Date(item.opens_at).getTime()) return 'scheduled';
    if (item.closes_at && now > new Date(item.closes_at).getTime()) return 'expired';
    return 'open';
}

// الاختبارات التي لها صفحة جاهزة في الموقع
const QUIZ_PAGES: Record<string, string[]> = {
    '101': ['quiz-1', 'final-review'],
};

export const hasQuizPage = (courseId: string, quizId: string) => QUIZ_PAGES[courseId]?.includes(quizId) ?? false;

export const quizPath = (courseId: string, quizId: string) =>
    quizId === 'final-review' ? `/workspace/${courseId}/final-review` : `/workspace/${courseId}/quizzes/${quizId}`;

// تُستخدم إذا لم يُشغَّل ملف SQL بعد، حتى لا تفرغ صفحة الكورس
export const FALLBACK_MODULES: Record<string, Omit<CourseModule, 'id' | 'course_id' | 'opens_at' | 'closes_at'>[]> = {
    '101': [
        { module_number: 1, title: 'Module 1 - Limits Foundations', description: 'مراجعة النهايات، الاتصال، المماس ومعدل التغير، والنهايات عند اللانهاية.', chapters: ['1.5', '1.6', '2.1', '1.8', '3.4'], is_open: true, is_free: true },
        { module_number: 2, title: 'Module 2 - Applications of Differentiation', description: 'معدلات التغير المرتبطة، القيم العظمى والصغرى، وتطبيقات الهندسة.', chapters: ['2.3', '2.4', '2.5', '2.6', '2.7'], is_open: false, is_free: false },
        { module_number: 3, title: 'Module 3 - Advanced Functions & Applications', description: 'الدوال الأسية واللوغاريتمية، الدوال المثلثية العكسية، النمو والاضمحلال، والدوال الزائدية.', chapters: ['6.2', '6.4', '6.6', '6.5', '6.7', '2.9'], is_open: false, is_free: false },
        { module_number: 4, title: "Module 4 - L'Hospital & Optimization", description: 'صيغ عدم التعيين، قاعدة لوبيتال، القيم العظمى والصغرى، وطريقة نيوتن لتقدير الجذور.', chapters: ['6.8', '3.1', '3.8'], is_open: false, is_free: false },
    ],
    '203': [
        { module_number: 1, title: 'Module 1: 3D Vectors & Space Geometry', description: 'Vectors, dot/cross products, lines and planes.', chapters: [], is_open: false, is_free: false },
        { module_number: 2, title: 'Module 2: Partial Derivatives', description: 'Limits, continuity, and chain rule.', chapters: [], is_open: false, is_free: false },
    ],
};

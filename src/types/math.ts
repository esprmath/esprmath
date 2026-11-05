// types/math.ts

// ✅ 1. استيراد النوع الجديد من النظام الذي بنيناه
import type { QuestionItem } from '@/lib/questions/types';

export interface TheoreticalStep {
    stepTitle: string;
    stepDescription: string;
}

export interface PracticeQuestion {
    questionText: string;
    mathExpression?: string;
    graphImage?: string;
    customQuestionImage?: string;
    options: string[];
    correctAnswer: string;
    questionExplanation?: string;
    subQuestions?: PracticeQuestion[]; 
}

export interface Idea {
    id: string;
    ideaNumber: string;
    ideaName: string;
    theoreticalSteps: TheoreticalStep[];
    videoUrl: string;
    practiceQuestion?: PracticeQuestion;
    subQuestions?: PracticeQuestion[];
    additionalQuestions?: PracticeQuestion[];
    
    // ✅ 2. الإضافة الوحيدة: خاصية اختيارية للنظام الجديد
    // إذا وُجدت، سنستخدم النظام الجديد. إذا لم توجد، سيعمل النظام القديم كما هو.
    questions?: QuestionItem[]; 
}

export interface ChapterData {
    moduleNumber: string;
    chapterNumber: string;
    chapterTitle: string;
    ideas: Idea[];
}

/** سؤال ثابت في صفحة الأسئلة الإضافية، مربوط بفكرته */
export interface ExtraQuestion extends PracticeQuestion {
    meta: {
        moduleNumber: string;
        chapterNumber: string;
        ideaNumber: string;
        ideaName: string;
        ideaAnchorId: string; // id الفكرة، يُستخدم لزر الرجوع إليها
    };
}

/** كل ما يحتاجه نظام الكويز لعرض كويز كامل */
export interface QuizContent {
    courseId: string;
    quizId: string;
    title: string;
    chapters: ChapterData[];
    extraQuestions: ExtraQuestion[];
    /** أفكار جاءت في اختبارات سابقة، بصيغة "رقم الشابتر-رقم الفكرة" مثل "1.5-1.2" */
    pastExamIdeas: string[];
    pastExamVideoUrl?: string;
    mockQuestionCount: number;
    mockMinutes: number;
}

/** كل ما يحتاجه قالب الموديول لعرض موديول كامل */
export interface ModuleContent {
    courseId: string;
    moduleNumber: string;
    title: string;
    chapters: ChapterData[];
    extraQuestions: ExtraQuestion[];
}
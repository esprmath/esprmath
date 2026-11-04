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
// types/math.ts

export interface TheoreticalStep {
    stepTitle: string;
    stepDescription: string;
}

export interface PracticeQuestion {
    questionText: string;
    mathExpression?: string;
    graphImage?: string;
    options: string[];
    correctAnswer: string;
    questionExplanation?: string;
    subQuestions?: PracticeQuestion[]; // 👈 أضفنا هذا السطر هنا ليدعم الأسئلة الفرعية المركبة
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
}

export interface ChapterData {
    moduleNumber: string;
    chapterNumber: string;
    chapterTitle: string;
    ideas: Idea[];
}
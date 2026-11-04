// src/lib/questions/tutorContext.ts
// يحوّل السؤال المعروض إلى نص يصل لفيكتور حتى يعرف ما أمام الطالب.

interface TutorQuestion {
    questionText?: string;
    partText?: string;
    math?: string;
    options?: string[];
    correctAnswer?: string;
    steps?: { text: string; math?: string }[];
    explanation?: string;
    hasGraph?: boolean;
}

export function describeQuestionForTutor(q: TutorQuestion): string {
    const solution = q.steps?.length
        ? q.steps.map((s, i) => `${i + 1}. ${s.text}${s.math ? ` $${s.math}$` : ''}`).join('\n')
        : q.explanation;

    return [
        q.questionText && `نص السؤال: ${q.questionText}`,
        q.partText && `الجزء الحالي: ${q.partText}`,
        q.math && `المعادلة: $${q.math}$`,
        q.hasGraph && 'السؤال يعتمد على رسم بياني لا تراه. إذا احتجت قراءة منه، اطلب من الطالب وصفه.',
        q.options?.length && `الخيارات:\n${q.options.join('\n')}`,
        q.correctAnswer && `الجواب الصحيح: ${q.correctAnswer}`,
        solution && `طريقة الحل:\n${solution}`,
    ].filter(Boolean).join('\n');
}

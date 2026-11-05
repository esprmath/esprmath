// src/lib/quiz/engine.ts
// منطق الكويز بدون أي شاشات: الأفكار، توليد الأسئلة، اختيار أسئلة الاختبار التجريبي، والأخطاء.
import type { ChapterData, ExtraQuestion } from '@/types/math';
import { buildAdditionalQuestions, generateFromTemplate } from '../questions/additional';

export interface QuizIdea {
    key: string; // "رقم الشابتر-رقم الفكرة"
    masteryKey: string; // مفتاح الإتقان: "رقم الشابتر-id الفكرة"
    moduleNumber: string;
    chapter: string;
    ideaId: string;
    ideaNumber: string;
    ideaName: string;
    base: any;
}

export interface QuizQuestion {
    idea: QuizIdea;
    questionId: string;
    questionText: string;
    math: string;
    image?: string;
    options: string[];
    mathOptionIds?: string[];
    correctAnswer: string;
    steps?: { text: string; math?: string }[];
    explanation?: string;
}

export function buildQuizIdeas(chapters: ChapterData[], extraQuestions: ExtraQuestion[]): QuizIdea[] {
    return buildAdditionalQuestions(chapters, extraQuestions).map((base) => {
        const { moduleNumber, chapterNumber, ideaNumber, ideaName, ideaAnchorId } = base.meta;
        return {
            key: `${chapterNumber}-${ideaNumber}`,
            masteryKey: `${chapterNumber}-${ideaAnchorId}`,
            moduleNumber,
            chapter: chapterNumber,
            ideaId: ideaAnchorId,
            ideaNumber,
            ideaName,
            base,
        };
    });
}

export const ideaHref = (courseId: string, idea: QuizIdea) =>
    `/workspace/${courseId}/${idea.moduleNumber}?chapter=${encodeURIComponent(idea.chapter)}&idea=${encodeURIComponent(idea.ideaId)}`;

/** ينشئ سؤالًا جديدًا للفكرة، ويتجنب الأسئلة التي ظهرت للطالب في نفس الجلسة قدر الإمكان */
export function createQuestion(idea: QuizIdea, shownIds: Set<string> = new Set()): QuizQuestion {
    const { base } = idea;

    if (base.templateId) {
        const generated = generateFromTemplate(base, shownIds);
        return {
            idea,
            questionId: generated.generatedKey,
            questionText: generated.questionText,
            math: generated.mathExpression ?? '',
            options: generated.options,
            mathOptionIds: generated.mathOptionIds,
            correctAnswer: generated.correctAnswer,
            steps: generated.steps,
        };
    }

    // سؤال ثابت له أجزاء، مثل سؤال الرسم: جزء واحد في كل مرة
    const parts: any[] = base.subQuestions ?? [];
    if (parts.length > 0) {
        const partId = (i: number) => `${idea.key}:part-${i}`;
        const fresh = parts.map((_, i) => i).filter((i) => !shownIds.has(partId(i)));
        const pool = fresh.length > 0 ? fresh : parts.map((_, i) => i);
        const index = pool[Math.floor(Math.random() * pool.length)];
        const part = parts[index];
        return {
            idea,
            questionId: partId(index),
            questionText: `${base.questionText}\n${part.questionText}`,
            math: part.mathExpression ?? base.mathExpression ?? '',
            image: base.graphImage,
            options: part.options,
            correctAnswer: part.correctAnswer,
            explanation: part.questionExplanation,
        };
    }

    return {
        idea,
        questionId: `${idea.key}:static`,
        questionText: base.questionText,
        math: base.mathExpression ?? '',
        image: base.graphImage,
        options: base.options,
        correctAnswer: base.correctAnswer,
        explanation: base.questionExplanation,
    };
}

function shuffle<T>(items: T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/** يختار أفكارًا مختلفة موزعة على الشباتر: فكرة من كل شابتر بالتناوب حتى يكتمل العدد */
export function pickMockIdeas(ideas: QuizIdea[], count: number): QuizIdea[] {
    const groups = new Map<string, QuizIdea[]>();
    for (const idea of shuffle(ideas)) {
        groups.set(idea.chapter, [...(groups.get(idea.chapter) ?? []), idea]);
    }

    const queues = shuffle([...groups.values()]);
    const picked: QuizIdea[] = [];
    while (picked.length < count && queues.some((queue) => queue.length > 0)) {
        for (const queue of queues) {
            const idea = queue.shift();
            if (idea && picked.length < count) picked.push(idea);
        }
    }

    // نرتبها حسب ترتيب الأفكار في المقرر، مثل ورقة الاختبار
    return picked.sort((a, b) => ideas.indexOf(a) - ideas.indexOf(b));
}

// ===== الأخطاء المحفوظة =====

export const mistakesStorageKey = (courseId: string, quizId: string) =>
    `math${courseId}_${quizId.replace('-', '')}_saved_mistakes`;

/** يقرأ الأخطاء المحفوظة. النسخة القديمة كانت تحفظ السؤال كاملًا، فنأخذ منه الشابتر والفكرة */
export function parseMistakes(saved: string | null): string[] {
    try {
        const items: unknown = JSON.parse(saved ?? '[]');
        if (!Array.isArray(items)) return [];
        const keys = items.map((item) => {
            if (typeof item === 'string') return item;
            return item?.chapter && item?.ideaId ? `${item.chapter}-${item.ideaId}` : null;
        });
        return [...new Set(keys.filter((key): key is string => key !== null))];
    } catch {
        return [];
    }
}

/** الإجابة الخاطئة تضيف الفكرة للأخطاء، والصحيحة على سؤال جديد تزيلها */
export function updateMistakes(mistakes: string[], ideaKey: string, isCorrect: boolean): string[] {
    const others = mistakes.filter((key) => key !== ideaKey);
    return isCorrect ? others : [...others, ideaKey];
}

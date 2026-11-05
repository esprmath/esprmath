// src/lib/quiz/engine.test.ts
import { describe, expect, it } from 'vitest';
import { buildQuizIdeas, createQuestion, mistakesStorageKey, parseMistakes, pickMockIdeas, updateMistakes } from './engine';
import { quiz1 } from '../../content/101/quiz-1';

const ideas = buildQuizIdeas(quiz1.chapters, quiz1.extraQuestions);

describe('الأسئلة', () => {
    it.each(ideas.map((idea) => [idea.key, idea] as const))('الفكرة %s تولّد سؤالًا صالحًا', (_, idea) => {
        for (let i = 0; i < 30; i++) {
            const question = createQuestion(idea);
            expect(question.questionText.trim()).not.toBe('');
            expect(question.options.length).toBeGreaterThanOrEqual(2);
            expect(new Set(question.options).size).toBe(question.options.length);
            expect(question.options).toContain(question.correctAnswer);
            // لا يكفي عرض الجواب: لازم يكون للطالب شرح
            expect(Boolean(question.steps?.length || question.explanation), question.questionId).toBe(true);
        }
    });

    it('سؤال الأجزاء لا يكرر جزءًا ظهر في الجلسة', () => {
        const graphIdea = ideas.find((idea) => idea.key === '1.5-1.2')!;
        const shown = new Set<string>();
        for (let i = 0; i < 6; i++) {
            const { questionId } = createQuestion(graphIdea, shown);
            expect(shown.has(questionId)).toBe(false);
            shown.add(questionId);
        }
    });
});

describe('الاختبار التجريبي', () => {
    it('يختار العدد المطلوب من أفكار مختلفة وبترتيب المقرر', () => {
        for (let i = 0; i < 100; i++) {
            const picked = pickMockIdeas(ideas, quiz1.mockQuestionCount);
            expect(picked).toHaveLength(quiz1.mockQuestionCount);
            expect(new Set(picked).size).toBe(picked.length);
            const positions = picked.map((idea) => ideas.indexOf(idea));
            expect(positions).toEqual([...positions].sort((a, b) => a - b));
        }
    });

    it('يوزع الأسئلة على كل الشباتر', () => {
        const chapterCount = new Set(ideas.map((idea) => idea.chapter)).size;
        for (let i = 0; i < 100; i++) {
            const chapters = pickMockIdeas(ideas, quiz1.mockQuestionCount).map((idea) => idea.chapter);
            expect(new Set(chapters).size).toBe(chapterCount);
            const counts = [...new Set(chapters)].map((c) => chapters.filter((x) => x === c).length);
            expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
        }
    });

    it('لا يتعطل إذا كان العدد أكبر من الأفكار', () => {
        expect(pickMockIdeas(ideas.slice(0, 3), 7)).toHaveLength(3);
        expect(pickMockIdeas([], 7)).toEqual([]);
    });
});

describe('الأخطاء', () => {
    it('المفتاح يبقى كما كان حتى لا يفقد الطلاب أخطاءهم', () => {
        expect(mistakesStorageKey('101', 'quiz-1')).toBe('math101_quiz1_saved_mistakes');
    });

    it('يقرأ النسخة القديمة والجديدة والبيانات التالفة', () => {
        expect(parseMistakes(JSON.stringify([{ chapter: '1.5', ideaId: '1.2', question: 'x' }, '1.6-2.1']))).toEqual(['1.5-1.2', '1.6-2.1']);
        expect(parseMistakes(null)).toEqual([]);
        expect(parseMistakes('{broken')).toEqual([]);
        expect(parseMistakes('{"a":1}')).toEqual([]);
    });

    it('الخطأ يضيف الفكرة والصح يزيلها', () => {
        expect(updateMistakes([], 'a', false)).toEqual(['a']);
        expect(updateMistakes(['a'], 'a', false)).toEqual(['a']);
        expect(updateMistakes(['a', 'b'], 'a', true)).toEqual(['b']);
    });
});

describe('إعدادات الكويز', () => {
    it('أفكار الاختبارات السابقة موجودة في الشباتر', () => {
        const keys = ideas.map((idea) => idea.key);
        expect(quiz1.pastExamIdeas.filter((key) => !keys.includes(key))).toEqual([]);
    });
});

// src/content/content.test.ts
// يفحص ملفات المحتوى بالأمر: npm test
import katex from 'katex';
import { describe, expect, it } from 'vitest';
import { toEmbedUrl } from '../lib/video';
import { hasTemplate } from '../lib/questions/templates/registry';
import { module1 as math101Module1 } from './101/module-1';
import { module2 as math101Module2 } from './101/module-2';
import { demoModule1 } from './demo/module-1';

/** عند إضافة موديول جديد، أضفه هنا */
const ALL_MODULES = [math101Module1, math101Module2, demoModule1];

// مقطع مؤقت استُخدم سابقًا مكان الروابط الحقيقية
const PLACEHOLDER_VIDEO = 'dQw4w9WgXcQ';

const IDEA_CARD_TITLES = ['💡 الفكرة', '🔍 تعرف السؤال لما', '🪜 طريقة الحل', '⚠️ انتبه'];

const duplicates = (values: string[]) => values.filter((value, i) => values.indexOf(value) !== i);

describe.each(ALL_MODULES.map((m) => [`Math ${m.courseId} · الموديول ${m.moduleNumber}`, m] as const))('%s', (_, mod) => {
    it('أرقام الشباتر غير مكررة، وكل شابتر يتبع هذا الموديول', () => {
        expect(duplicates(mod.chapters.map((c) => c.chapterNumber))).toEqual([]);
        for (const chapter of mod.chapters) {
            expect(chapter.moduleNumber, chapter.chapterNumber).toBe(mod.moduleNumber);
        }
    });

    describe.each(mod.chapters.map((c) => [c.chapterNumber, c] as const))('الشابتر %s', (_, chapter) => {
        it('فيه عنوان وأفكار بدون تكرار', () => {
            expect(chapter.chapterTitle.trim()).not.toBe('');
            expect(chapter.ideas.length).toBeGreaterThan(0);
            expect(duplicates(chapter.ideas.map((i) => i.id))).toEqual([]);
            expect(duplicates(chapter.ideas.map((i) => i.ideaNumber))).toEqual([]);
        });

        it.each(chapter.ideas.map((i) => [i.ideaNumber, i] as const))('الفكرة %s مكتملة', (_, idea) => {
            expect(idea.ideaName.trim()).not.toBe('');
            expect(idea.theoreticalSteps.length, 'لا يوجد شرح نظري').toBeGreaterThan(0);
            for (const step of idea.theoreticalSteps) {
                expect(step.stepTitle.trim()).not.toBe('');
                expect(step.stepDescription.trim()).not.toBe('');
            }

            // بطاقة الفكرة لها نفس الأجزاء الأربعة، وطريقة الحل من خطوتين إلى أربع
            expect(idea.theoreticalSteps.map((step) => step.stepTitle)).toEqual(IDEA_CARD_TITLES);
            const methodSteps = idea.theoreticalSteps[2].stepDescription.split('\n');
            expect(methodSteps.length).toBeGreaterThanOrEqual(2);
            expect(methodSteps.length).toBeLessThanOrEqual(4);

            // كل معادلة بين علامتي $ لازم تكون صالحة، وكل علامة لها ما يقابلها
            for (const step of idea.theoreticalSteps) {
                const quoted = step.stepDescription.split('"').filter((_, i) => i % 2 === 1);
                expect(quoted.filter((text) => text.includes('$')), 'لا تضع معادلة داخل علامتي تنصيص').toEqual([]);
                const parts = step.stepDescription.split('$');
                expect(parts.length % 2, `علامة $ ناقصة: ${step.stepDescription}`).toBe(1);
                for (const math of parts.filter((_, i) => i % 2 === 1)) {
                    expect(() => katex.renderToString(math, { throwOnError: true, strict: 'ignore' }), math).not.toThrow();
                }
            }

            if (idea.videoUrl) {
                expect(toEmbedUrl(idea.videoUrl), `رابط المقطع غير صحيح: ${idea.videoUrl}`).not.toBeNull();
                expect(idea.videoUrl).not.toContain(PLACEHOLDER_VIDEO);
            }

            for (const item of idea.questions ?? []) {
                if ('templateId' in item) {
                    expect(hasTemplate(item.templateId), `قالب غير موجود: ${item.templateId}`).toBe(true);
                }
            }
        });
    });

    it('الأفكار بدون قالب لها سؤال في صفحة الأسئلة الإضافية', () => {
        const missing = mod.chapters.flatMap((chapter) =>
            chapter.ideas
                .filter((idea) => !(idea.questions ?? []).some((item) => 'templateId' in item))
                .filter((idea) => !mod.extraQuestions.some((q) => q.meta.chapterNumber === chapter.chapterNumber && q.meta.ideaNumber === idea.ideaNumber))
                .map((idea) => `${chapter.chapterNumber}: ${idea.ideaNumber}`)
        );
        expect(missing).toEqual([]);
    });

    it('الأسئلة الإضافية مربوطة بفكرة موجودة', () => {
        for (const { meta } of mod.extraQuestions) {
            const chapter = mod.chapters.find((c) => c.chapterNumber === meta.chapterNumber);
            const idea = chapter?.ideas.find((i) => i.id === meta.ideaAnchorId);
            expect(idea?.ideaNumber, `${meta.chapterNumber}/${meta.ideaAnchorId}`).toBe(meta.ideaNumber);
        }
    });
});

describe('toEmbedUrl', () => {
    const embed = 'https://www.youtube.com/embed/h4RXkKCZcpc';

    it.each([
        embed,
        'https://www.youtube.com/watch?v=h4RXkKCZcpc',
        'https://youtube.com/watch?list=abc&v=h4RXkKCZcpc&t=10',
        'https://youtu.be/h4RXkKCZcpc?si=abc',
        'https://m.youtube.com/watch?v=h4RXkKCZcpc',
        'https://www.youtube.com/shorts/h4RXkKCZcpc',
    ])('يقبل %s', (url) => {
        expect(toEmbedUrl(url)).toBe(embed);
    });

    it.each(['ضع-رابط', 'https://example.com/video', 'https://evil.com/youtu.be/h4RXkKCZcpc'])('يرفض %s', (url) => {
        expect(toEmbedUrl(url)).toBeNull();
    });
});

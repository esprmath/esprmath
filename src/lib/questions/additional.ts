// src/lib/questions/additional.ts
import type { ChapterData } from '@/types/math';
import { generateOne, questionKey } from './engine/generator';

const MAX_UNIQUE_TRIES = 20;

/**
 * يبني قائمة التدريب من بيانات الشباتر: سؤال واحد لكل فكرة.
 * تستخدمها الأسئلة الإضافية والكويزات.
 * - الفكرة التي لها قالب: سؤال يتولد من نفس قالبها.
 * - الفكرة بدون قالب (مثل أسئلة الرسم): أول سؤال ثابت لها من `staticQuestions`.
 */
export function buildAdditionalQuestions(chapters: ChapterData[], staticQuestions: any[]): any[] {
    return chapters.flatMap((chapter) =>
        chapter.ideas.flatMap((idea: any) => {
            const template = (idea.questions ?? []).find((item: any) => 'templateId' in item);

            if (template) {
                return [{
                    meta: {
                        moduleNumber: chapter.moduleNumber,
                        chapterNumber: chapter.chapterNumber,
                        ideaNumber: idea.ideaNumber,
                        ideaName: idea.ideaName,
                        ideaAnchorId: idea.id,
                    },
                    templateId: template.templateId,
                    variablesOverride: template.variablesOverride,
                    questionText: '',
                    options: [],
                    correctAnswer: '',
                }];
            }

            const fallback = staticQuestions.find(
                (q) => q.meta?.chapterNumber === chapter.chapterNumber && q.meta?.ideaNumber === idea.ideaNumber
            );
            return fallback ? [fallback] : [];
        })
    );
}

/**
 * يولّد سؤالًا عشوائيًا من قالب الفكرة، ويتجنب الأسئلة الظاهرة حاليًا.
 * القوالب ذات الحالات القليلة قد تكرر سؤالًا إذا لم يتوفر غيره.
 */
export function generateFromTemplate(baseQ: any, excludedKeys: Set<string> = new Set()) {
    const config = { templateId: baseQ.templateId, variablesOverride: baseQ.variablesOverride };
    let generated = generateOne(config, Math.floor(Math.random() * 1e9));
    for (let t = 1; t < MAX_UNIQUE_TRIES && excludedKeys.has(questionKey(generated)); t++) {
        generated = generateOne(config, Math.floor(Math.random() * 1e9));
    }

    const correct = generated.options.find((o) => o.id === generated.correctId);
    return {
        ...baseQ,
        generatedKey: questionKey(generated),
        questionText: generated.questionText,
        mathExpression: generated.mathExpression,
        options: generated.options.map((o) => `${o.id}) ${o.text}`),
        mathOptionIds: generated.options.filter((o) => o.math).map((o) => o.id),
        correctAnswer: `${generated.correctId}) ${correct?.text}`,
        steps: generated.steps,
    };
}

// src/lib/questions/legacy.ts
import type { PracticeQuestion } from '@/types/math';
import type {
  StaticQuestion,
  QuestionGroup,
  Option,
  OptionId,
  ExplanationStep,
} from './types';

const IDS: OptionId[] = ['A', 'B', 'C', 'D'];
const stripLetter = (s: string) => s.replace(/^[A-D]\)\s*/, '');

const SYMBOLS: [RegExp, string][] = [
  [/\\infty/g, '∞'], [/\\geq?\b/g, '≥'], [/\\leq?\b/g, '≤'],
  [/\\neq/g, '≠'], [/\\cup/g, '∪'], [/\\to\b/g, '→'], [/\\cdot/g, '·'],
];
const unTex = (s: string) => SYMBOLS.reduce((t, [re, sym]) => t.replace(re, sym), s);

const toSteps = (text?: string): ExplanationStep[] | undefined => {
  const lines = text?.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines?.length ? lines.map((l) => ({ text: unTex(l) })) : undefined;
};

function toStatic(p: PracticeQuestion, stableId: string): StaticQuestion {
  const opts = p.options.slice(0, 4);
  const options: Option[] = opts.map((raw, i) => {
    let text = stripLetter(raw);
    // تنظيف أوامر \text لتظهر بشكل طبيعي، مع الإبقاء على math: true إذا كان هناك رموز أخرى
    const hasMath = text.includes('\\');
    if (hasMath) {
      text = text.replace(/\\text\{/g, '').replace(/\}/g, '');
    }
    
    return { id: IDS[i], text, math: hasMath };
  });

  // البحث في المصفوفة المقصوصة مع إزالة المسافات الزائدة لضمان المطابقة
  const idx = opts.findIndex((o) => o.trim() === p.correctAnswer.trim());
  if (idx === -1 && process.env.NODE_ENV !== 'production') {
    console.warn(`[legacy] ${stableId}: correctAnswer لا يطابق أي خيار. المتوقع: "${p.correctAnswer}"`);
  }

  return {
    kind: 'static',
    stableId,
    questionText: p.questionText,
    mathExpression: p.mathExpression,
    graphImage: p.graphImage,
    options,
    correctId: IDS[Math.max(idx, 0)],
    steps: toSteps(p.questionExplanation),
  };
}

export function legacyToItems(pq: PracticeQuestion, key: string): (StaticQuestion | QuestionGroup)[] {
  const subs = pq.subQuestions;
  
  if (subs && subs.length > 0) {
    return [
      {
        kind: 'group',
        stableId: `${key}:legacy-group`,
        questionText: pq.questionText,
        mathExpression: pq.mathExpression,
        graphImage: pq.graphImage,
        parts: subs.map((s, i) => toStatic(s, `${key}:legacy-part-${i}`)),
      },
    ];
  }
  
  return [toStatic(pq, `${key}:legacy-single`)];
}
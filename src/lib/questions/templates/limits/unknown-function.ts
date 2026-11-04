// src/lib/questions/templates/limits/unknown-function.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept, DNE } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 1, max: 5, integer: true },  // نقطة الاقتراب
  { name: 'A', min: 2, max: 10, integer: true }, // نهاية الدالة المجهولة (الإجابة الصحيحة)
  { name: 'L', min: 2, max: 8, integer: true },  // قيمة نهاية الكسر المعطاة
];

function generate(v: Record<string, number>): TemplateOutput {
  const { a, A, L } = v;

  const correct = `${A}`;
  const fMinusA = `f(x) ${A >= 0 ? '-' : '+'} ${Math.abs(A)}`;
  const xMinusA = `x - ${a}`;

  const given = `\\lim_{x \\to ${a}} \\frac{${fMinusA}}{${xMinusA}} = ${L}`;

  const distractors = uniqueExcept(
    [`${L}`, `${A + L}`, `${A - L}`, `${-A}`, `${A + 1}`, `${A - 1}`, '0', DNE],
    correct
  );

  return {
    questionText: 'بناءً على المعطى التالي، أوجد قيمة النهاية المطلوبة:',
    mathExpression: `${given} \\;\\Longrightarrow\\; \\lim_{x \\to ${a}} f(x) = \\,?`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      { text: 'نلاحظ أن مقام الكسر يؤول إلى الصفر عندما', math: `x \\to ${a}` },
      {
        text: 'بما أن نهاية الكسر موجودة، نكتب البسط كحاصل ضرب:',
        math: `${fMinusA} = \\frac{${fMinusA}}{${xMinusA}} \\cdot (${xMinusA})`,
      },
      {
        text: 'نأخذ النهاية للطرفين:',
        math: `\\lim_{x \\to ${a}} (${fMinusA}) = ${L} \\cdot 0 = 0`,
      },
      { text: 'ومنه نستنتج أن:', math: `\\lim_{x \\to ${a}} f(x) = ${A}` },
    ],
  };
}

export const unknownFunctionTemplate: QuestionTemplate = {
  id: 'limits:unknown-function',
  name: 'إيجاد نهاية دالة مجهولة',
  type: 'limits',
  difficulty: 'medium',
  variables,
  generate,
};
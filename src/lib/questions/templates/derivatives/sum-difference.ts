// src/lib/questions/templates/derivatives/sum-difference.ts
// شكلان من شابتر 2.3: Q-17 (كسر مقامه x) و Q-15 (فك القوس ثم الاشتقاق)
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept } from '../utils';
import { poly } from './helpers';

const variables: VariableDefinition[] = [
  { name: 'form', min: 0, max: 1, integer: true },
  { name: 'a', min: 2, max: 9, integer: true }, // معامل x^p
  { name: 'b', min: 1, max: 5, integer: true }, // معامل x^(p+1)
  { name: 'p', min: 2, max: 3, integer: true }, // القوة الأصغر في البسط
];

const result = (terms: [number, number][]) => `f'(x) = ${poly(terms)}`;

/** مثل Q-17: f(x) = (3x² + x³) / x */
function fractionForm(a: number, b: number, p: number): TemplateOutput {
  const q = p + 1;
  const correct = result([[a * (p - 1), p - 2], [b * (q - 1), q - 2]]);

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `f(x) = \\frac{${poly([[a, p], [b, q]])}}{x}`,
    correct,
    distractors: uniqueExcept(
      [
        result([[a * p, p - 1], [b * q, q - 1]]),             // اشتقاق البسط وإهمال المقام
        result([[a * p, p - 2], [b * q, q - 2]]),             // اشتقاق البسط ثم القسمة على x
        result([[a * (p - 1), p - 2], [b * (q - 1), q - 1]]), // نسيان إنقاص قوة الحد الثاني
        result([[a * (p - 1), p - 1], [b * (q - 1), q - 2]]),
        result([[a, p - 2], [b, q - 2]]),                     // نسيان إنزال القوة
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نبسّط أولًا: نقسم كل حد على المقام:', math: `f(x) = ${poly([[a, p - 1], [b, q - 1]])}` },
      { text: 'نشتق كل حد لوحده ونجمع الناتج (Sum Rule):', math: correct },
    ],
  };
}

/** مثل Q-15: f(x) = x³(x + 3) */
function expandForm(a: number, p: number): TemplateOutput {
  const k = p + 1; // القوة 3 أو 4
  const correct = result([[k + 1, k], [a * k, k - 1]]);

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `f(x) = x^{${k}}(x + ${a})`,
    correct,
    distractors: uniqueExcept(
      [
        result([[k, k - 1]]),                 // ضرب المشتقتين u'v'
        result([[k + 1, k], [a, k - 1]]),     // نسيان إنزال القوة في الحد الثاني
        result([[k, k], [a * k, k - 1]]),     // نسيان إنزال القوة في الحد الأول
        result([[k + 1, k + 1], [a * k, k]]), // نسيان إنقاص القوة
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نفك القوس أولًا:', math: `f(x) = ${poly([[1, k + 1], [a, k]])}` },
      { text: 'نشتق كل حد لوحده ونجمع الناتج (Sum Rule):', math: correct },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  return v.form === 0 ? fractionForm(v.a, v.b, v.p) : expandForm(v.a, v.p);
}

export const sumDifferenceTemplate: QuestionTemplate = {
  id: 'derivatives:sum-difference',
  name: 'قاعدتا المجموع والفرق',
  type: 'derivative',
  difficulty: 'easy',
  variables,
  generate,
};

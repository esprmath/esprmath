// src/lib/questions/templates/derivatives/general-power.ts
// ثلاثة أشكال من شابتر 2.5: Ex 3 (قوة)، و Ex 1 (جذر)، و Ex 5 (كسر مرفوع لقوة)
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept } from '../utils';
import { monomial } from './helpers';

const variables: VariableDefinition[] = [
  { name: 'form', min: 0, max: 2, integer: true },
  { name: 'n', min: 2, max: 5, integer: true },  // قوة x داخل القوس
  { name: 'm', min: 3, max: 12, integer: true }, // قوة القوس
  { name: 'c', min: 1, max: 9, integer: true },  // الثابت داخل القوس
  { name: 'sign', min: 0, max: 1, integer: true },
];

/** مثل Ex 3: y = (x³ - 1)^100 */
function powerForm(n: number, m: number, c: number, sign: number): TemplateOutput {
  const inner = `x^{${n}} ${sign === 1 ? '+' : '-'} ${c}`;
  const inside = monomial(n, n - 1);
  const answer = (coef: number, xPower: number, power: number) =>
    `y' = ${monomial(coef, xPower)}(${inner})^{${power}}`;
  const correct = answer(m * n, n - 1, m - 1);

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `y = (${inner})^{${m}}`,
    correct,
    distractors: uniqueExcept(
      [
        `y' = ${m}(${inner})^{${m - 1}}`,  // نسيان مشتقة ما داخل القوس
        answer(m * n, n - 1, m),           // نسيان إنقاص قوة القوس
        answer(n, n - 1, m - 1),           // نسيان إنزال قوة القوس
        answer(m, n - 1, m - 1),           // نسيان إنزال قوة x
        answer(m * n, n, m - 1),           // نسيان إنقاص قوة x
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'ننزل القوة وننقصها 1، ونترك ما داخل القوس كما هو:', math: `${m}(${inner})^{${m - 1}}` },
      { text: 'نضرب في مشتقة ما داخل القوس (Chain Rule):', math: `y' = ${m}(${inner})^{${m - 1}} \\cdot ${inside}` },
      { text: 'نبسّط المعاملات:', math: correct },
    ],
  };
}

/** مثل Ex 1: F(x) = √(x² + 1) */
function rootForm(n: number, c: number): TemplateOutput {
  const coef = n; // معامل x² داخل الجذر
  const inner = `${monomial(coef, 2)} + ${c}`;
  const root = `\\sqrt{${inner}}`;
  const answer = (num: string, bottom: string) => `F'(x) = \\frac{${num}}{${bottom}}`;
  const correct = answer(monomial(coef, 1), root);

  return {
    questionText: 'Find the derivative:',
    mathExpression: `F(x) = ${root}`,
    correct,
    distractors: uniqueExcept(
      [
        answer('1', `2${root}`),                     // نسيان مشتقة ما داخل الجذر
        answer(monomial(2 * coef, 1), root),         // نسيان 2 في المقام
        answer(monomial(coef, 1), `2${root}`),       // نسيان اختصار 2
        answer(monomial(coef, 1), inner),            // فقدان الجذر
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نكتب الجذر كقوة:', math: `F(x) = (${inner})^{\\frac{1}{2}}` },
      {
        text: 'ننزل القوة وننقصها 1، ونضرب في مشتقة الداخل:',
        math: `F'(x) = \\frac{1}{2}(${inner})^{-\\frac{1}{2}} \\cdot ${monomial(2 * coef, 1)}`,
      },
      { text: 'نبسّط:', math: correct },
    ],
  };
}

/** مثل Ex 5: g(t) = ((t - 2) / (2t + 1))^9 */
function fractionForm(n: number, m: number, c: number): TemplateOutput {
  const a = c;
  const den = `${n}t + 1`;
  const fraction = `\\frac{t - ${a}}{${den}}`;
  const top = 1 + n * a; // بسط مشتقة الكسر
  const coefficient = m * top;
  const answer = (k: number, p: number, bottom = `(${den})^{2}`) =>
    `g'(t) = \\frac{${k}}{${bottom}}\\left(${fraction}\\right)^{${p}}`;
  const correct = answer(coefficient, m - 1);

  return {
    questionText: 'Find the derivative of the function:',
    mathExpression: `g(t) = \\left(${fraction}\\right)^{${m}}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(m, m - 1),               // نسيان بسط مشتقة الكسر
        answer(coefficient, m),         // نسيان إنقاص القوة
        answer(top, m - 1),             // نسيان إنزال القوة
        answer(coefficient, m - 1, den), // نسيان تربيع المقام
        answer(m * (1 - n * a), m - 1), // خطأ إشارة في Quotient Rule
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      {
        text: 'ننزل القوة وننقصها 1، ثم نضرب في مشتقة الكسر:',
        math: `g'(t) = ${m}\\left(${fraction}\\right)^{${m - 1}} \\cdot \\frac{(${den}) - (t - ${a})(${n})}{(${den})^{2}}`,
      },
      { text: 'نبسّط بسط مشتقة الكسر:', math: `(${den}) - (t - ${a})(${n}) = ${top}` },
      { text: 'نضرب المعاملات:', math: correct },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  const { form, n, m, c, sign } = v;
  if (form === 0) return powerForm(n, m, c, sign);
  if (form === 1) return rootForm(n, c);
  return fractionForm(n, m, c);
}

export const generalPowerTemplate: QuestionTemplate = {
  id: 'derivatives:general-power',
  name: 'قاعدة السلسلة مع القوى',
  type: 'derivative',
  difficulty: 'medium',
  variables,
  generate,
};

// src/lib/questions/templates/derivatives/power-rules.ts
// ثلاثة أشكال من شابتر 2.3: Q-1 (4x + 7)، و Q-7 (قوى كسرية وسالبة)، و Q-13 (كسر وجذر)
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, uniqueExcept } from '../utils';
import { coefText, monomial } from './helpers';

const variables: VariableDefinition[] = [
  { name: 'form', min: 0, max: 2, integer: true }, // أي شكل من الأسئلة يظهر
  { name: 'a', min: 1, max: 6, integer: true },
  { name: 'n', min: 3, max: 5, integer: true },
  { name: 'b', min: 1, max: 9, integer: true },    // الثابت في الشكل الأول
];

/** مثل Q-1: g(x) = 4x + 7 */
function polynomialForm(a: number, b: number): TemplateOutput {
  const e = 1; // نفس صيغة Q-1: حد خطي وثابت
  const coef = a + 1; // حتى لا يكون المعامل 1
  const answer = (body: string) => `g'(x) = ${body}`;
  const correct = answer(monomial(coef * e, e - 1));

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `g(x) = ${monomial(coef, e)} + ${b}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(monomial(coef, e)),                        // إبقاء الدالة بدون اشتقاق
        answer(`${monomial(coef * e, e - 1)} + ${b}`),    // نسيان أن مشتقة الثابت صفر
        answer(monomial(coef * e, e)),                    // نسيان إنقاص القوة
        answer('0'),
        answer(`${b}`),
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'مشتقة الثابت (Constant) صفر:', math: `(${b})' = 0` },
      { text: 'ننزل القوة ونطرح منها 1، والمعامل يبقى (Constant Multiple):', math: correct },
    ],
  };
}

/** مثل Q-7: f(x) = x^(3/2) + x^(-3) */
function fractionalForm(a: number, n: number): TemplateOutput {
  const p = 2 * (((a - 1) % 3) + 1) + 1; // 3 أو 5 أو 7
  const power = frac(p, 2)!;
  const powerAfter = frac(p - 2, 2)!;
  const answer = (coef: string, first: string, sign: '+' | '-', k: number, second: number) =>
    `f'(x) = ${coef}x^{${first}} ${sign} ${k}x^{${second}}`;
  const correct = answer(power, powerAfter, '-', n, -n - 1);

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `f(x) = x^{${power}} + x^{-${n}}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(power, powerAfter, '+', n, -n - 1), // نسيان إشارة القوة السالبة
        answer(power, powerAfter, '-', n, -n + 1), // إنقاص القوة السالبة بالاتجاه الخطأ
        answer(power, power, '-', n, -n - 1),      // عدم طرح 1 من القوة الكسرية
        answer(powerAfter, powerAfter, '-', n, -n - 1),
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'ننزل القوة ونطرح منها 1 في كل حد (Power Rule):', math: `f'(x) = ${power}x^{${power} - 1} - ${n}x^{-${n} - 1}` },
      { text: 'نبسّط القوى:', math: correct },
    ],
  };
}

/** مثل Q-13: g(x) = 1/√x + ⁴√x */
function radicalForm(a: number, n: number): TemplateOutput {
  const coefFirst = coefText(frac(-a, 2)!);
  const coefFirstWrongSign = coefText(frac(a, 2)!);
  const coefRoot = frac(1, n)!;
  const rootPower = frac(1, n)!;
  const rootResult = frac(1 - n, n)!;

  const answer = (first: string, firstPower: string, rootCoef: string, power: string) =>
    `g'(x) = ${first}x^{${firstPower}} + ${rootCoef}x^{${power}}`;

  const correct = answer(coefFirst, '-\\frac{3}{2}', coefRoot, rootResult);

  const distractors = uniqueExcept(
    [
      answer(coefFirstWrongSign, '-\\frac{3}{2}', coefRoot, rootResult), // نسيان إشارة القوة السالبة
      answer(coefFirst, '-\\frac{1}{2}', coefRoot, rootResult),          // عدم طرح 1 من القوة
      answer(coefFirst, '-\\frac{3}{2}', coefRoot, rootPower),           // عدم طرح 1 من قوة الجذر
      answer(coefFirst, '-\\frac{3}{2}', `${n}`, rootResult),            // استخدام n بدل 1/n
      answer(coefFirstWrongSign, '\\frac{1}{2}', coefRoot, rootResult),
    ],
    correct
  );

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `g(x) = \\frac{${a}}{\\sqrt{x}} + \\sqrt[${n}]{x}`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      {
        text: 'نحوّل الجذور والكسور إلى قوى:',
        math: `g(x) = ${coefText(String(a))}x^{-\\frac{1}{2}} + x^{${rootPower}}`,
      },
      { text: 'ننزل القوة ونطرح منها 1 (Power Rule):', math: correct },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  if (v.form === 0) return polynomialForm(v.a, v.b);
  if (v.form === 1) return fractionalForm(v.a, v.n);
  return radicalForm(v.a, v.n);
}

export const powerRulesTemplate: QuestionTemplate = {
  id: 'derivatives:power-rules',
  name: 'قواعد الثابت والقوة والمعامل',
  type: 'derivative',
  difficulty: 'easy',
  variables,
  generate,
};

// src/lib/questions/templates/limits/vertical-asymptote.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, uniqueExcept, DNE } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 2, max: 5, integer: true }, // الجذر الموجب (مثل 2, 3, 4, 5)
  // تُضاف آخر القائمة حتى لا تتغير أرقام الأسئلة القديمة: 0 = الشكل الأصلي، 1 = مثل Q-38
  { name: 'form', min: 0, max: 1, integer: true },
  { name: 'q', min: 2, max: 3, integer: true },
  { name: 'c', min: 1, max: 9, integer: true },
];

/** مثل Q-38: y = (x² + 1) / (3x - 2x²) */
function factorForm(p: number, q: number, c: number): TemplateOutput {
  const second = frac(p, q)!;
  const answer = (first: string, other: string) => `x = ${first} \\text{ و } x = ${other}`;
  const correct = answer('0', second);

  return {
    questionText: 'Find the vertical asymptotes of the function using limits:',
    mathExpression: `y = \\frac{x^{2} + ${c}}{${p}x - ${q}x^{2}}`,
    correct,
    distractors: uniqueExcept(
      [
        `x = ${second}`,                 // نسيان x = 0
        'x = 0',                         // نسيان العامل الثاني
        answer('0', frac(q, p)!),        // قلب الكسر عند الحل
        answer('0', frac(-p, q)!),       // خطأ إشارة
        `x = \\pm ${c}`,
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نساوي المقام بالصفر ونأخذ x عاملًا مشتركًا:', math: `x(${p} - ${q}x) = 0` },
      { text: 'نحل لكل عامل:', math: `x = 0 \\quad \\text{or} \\quad x = ${second}` },
      {
        text: `البسط موجب دائمًا (x² + ${c} > 0)، والمقام يقترب من الصفر عند النقطتين، فالنهاية من كل جهة ±∞:`,
        math: `\\lim_{x \\to 0^{+}} y = \\infty, \\quad \\lim_{x \\to 0^{-}} y = -\\infty`,
      },
      { text: 'إذن خطوط التقارب الرأسية هي:', math: correct },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  if (v.form === 1) return factorForm(v.a, v.q, v.c);
  return originalForm(v);
}

function originalForm(v: Record<string, number>): TemplateOutput {
  const { a } = v;
  const aSquared = a * a;

  const mathExpr = `y = \\frac{1}{x^2 - ${aSquared}}`;
  const correct = `x = ${a} \\text{ و } x = -${a}`;

  const distractors = uniqueExcept([
    `x = ${aSquared} \\text{ و } x = -${aSquared}`, // خطأ شائع: استخدام المربع بدلاً من الجذر
    `x = ${a}`, // خطأ: نسيان الجذر السالب
    `x = -${a}`, // خطأ: نسيان الجذر الموجب
    DNE,
    `x = 0`
  ], correct);

  return {
    questionText: "أوجد معادلتي خطي التقارب الرأسيين للدالة التالية:",
    mathExpression: mathExpr,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      { text: "نساوي المقام بالصفر:", math: `x^2 - ${aSquared} = 0` },
      { text: "نحل المعادلة (فرق بين مربعين):", math: `x^2 = ${aSquared} \\implies x = \\pm ${a}` },
      { text: "نتأكد بالنهاية: البسط 1 والمقام يقترب من الصفر، فالنهاية لا نهائية:", math: `\\lim_{x \\to ${a}^{+}} \\frac{1}{x^2 - ${aSquared}} = \\infty` },
      { text: "إذن خطوط التقارب الرأسية هي:", math: `x = ${a} \\text{ و } x = -${a}` }
    ]
  };
}

export const verticalAsymptoteTemplate: QuestionTemplate = {
  id: 'limits:vertical-asymptote',
  name: 'إيجاد خطوط التقارب الرأسية',
  type: 'limits',
  difficulty: 'easy',
  variables,
  generate,
};
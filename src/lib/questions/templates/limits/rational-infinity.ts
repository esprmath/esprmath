// src/lib/questions/templates/limits/rational-infinity.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, uniqueExcept, DNE } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 1, max: 5, integer: true }, // معامل البسط
  { name: 'b', min: 2, max: 6, integer: true }, // معامل المقام
  { name: 'n', min: 1, max: 3, integer: true }, // الأس المشترك
  // تُضاف آخر القائمة حتى لا تتغير أرقام الأسئلة القديمة: 0 = الشكل الأصلي، 1 = مثل Ex 4
  { name: 'form', min: 0, max: 1, integer: true },
  { name: 'negInf', min: 0, max: 1, integer: true },
];

const pow = (n: number) => (n === 1 ? 'x' : `x^{${n}}`);

const NON_SQUARES = [2, 3, 5, 6, 7];

/** مثل Ex 4: f(x) = √(2x² + 1) / (3x - 5) */
function radicalForm(a: number, b: number, n: number, neg: boolean): TemplateOutput {
  const p = NON_SQUARES[a - 1];
  const c = n + 2; // الثابت في المقام
  const inf = neg ? '-\\infty' : '\\infty';
  const value = `\\frac{\\sqrt{${p}}}{${b}}`;
  const correct = `y = ${neg ? '-' : ''}${value}`;

  return {
    questionText: `Find the horizontal asymptote of the graph as x → ${neg ? '-∞' : '∞'}, using limits:`,
    mathExpression: `f(x) = \\frac{\\sqrt{${p}x^{2} + 1}}{${b}x - ${c}}`,
    correct,
    distractors: uniqueExcept(
      [
        `y = ${neg ? '' : '-'}${value}`,   // خطأ الإشارة عند x → -∞
        `y = ${frac(neg ? -p : p, b)}`,    // نسيان الجذر
        `y = ${neg ? '-' : ''}\\frac{1}{${b}}`,
        'y = 0',
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      {
        text: neg
          ? 'نقسم على x. وعندما x → -∞ تكون x سالبة، فـ √(x²) = -x:'
          : 'نقسم البسط والمقام على x، وداخل الجذر على x²:',
        math: `\\lim_{x \\to ${inf}} \\frac{${neg ? '-' : ''}\\sqrt{${p} + \\frac{1}{x^{2}}}}{${b} - \\frac{${c}}{x}}`,
      },
      { text: 'الكسور تؤول إلى الصفر، فيبقى:', math: `${neg ? '-' : ''}${value}` },
      { text: 'إذن خط التقارب الأفقي:', math: correct },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  if (v.form === 1) return radicalForm(v.a, v.b, v.n, v.negInf === 1);
  return originalForm(v);
}

function originalForm(v: Record<string, number>): TemplateOutput {
  const { a, b, n } = v;

  const coefA = a === 1 ? '' : `${a}`;
  // الحد الأدنى درجة في البسط هو x^(n-1) (للأس 1 يصبح ثابتًا) حتى لا يندمج مع الحد الرئيسي
  const low = n === 1 ? '1' : pow(n - 1);

  const correct = frac(a, b)!;
  const raw = `\\frac{${a}}{${b}}`;

  const distractors = uniqueExcept(
    [
      frac(b, a),
      '0',
      '\\infty',
      `${a}`,
      `${b}`,
      frac(a + 1, b),
      frac(a, b + 1),
      frac(-a, b),
      DNE,
    ],
    correct
  );

  return {
    questionText: 'Evaluate the following limit to find the horizontal asymptote:',
    mathExpression: `\\lim_{x \\to \\infty} \\frac{${coefA}${pow(n)} + ${low}}{${b}${pow(n)} + 1}`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      { text: 'نقسم البسط والمقام على أعلى قوة لـ x:', math: pow(n) },
      {
        text: 'بعد القسمة:',
        math: `\\lim_{x \\to \\infty} \\frac{${a} + \\frac{1}{x}}{${b} + \\frac{1}{${pow(n)}}}`,
      },
      {
        text: 'عندما x → ∞ تؤول الكسور إلى الصفر، فيتبقى نسبة المعاملات الرئيسية:',
        math: `${raw}${correct === raw ? '' : ` = ${correct}`}`,
      },
    ],
  };
}

export const rationalInfinityTemplate: QuestionTemplate = {
  id: 'limits:rational-infinity',
  name: 'نهايات الدوال الكسرية والخطوط المحاذية الأفقية',
  type: 'limits',
  difficulty: 'medium',
  variables,
  generate,
};
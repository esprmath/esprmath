// src/lib/questions/templates/limits/rational-infinity.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, uniqueExcept, DNE } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 1, max: 5, integer: true }, // معامل البسط
  { name: 'b', min: 2, max: 6, integer: true }, // معامل المقام
  { name: 'n', min: 1, max: 3, integer: true }, // الأس المشترك
];

const pow = (n: number) => (n === 1 ? 'x' : `x^{${n}}`);

function generate(v: Record<string, number>): TemplateOutput {
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
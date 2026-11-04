// src/lib/questions/templates/limits/direct-substitution.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, linear, uniqueExcept, DNE } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: -3, max: 3, exclude: [0], integer: true }, // نقطة الاقتراب
  { name: 'A', min: 1, max: 5, integer: true },                // معامل x في البسط
  { name: 'B', min: -5, max: 5, integer: true },               // الحد الثابت في البسط
  { name: 'C', min: 1, max: 3, integer: true },                // معامل x في المقام
  { name: 'D', min: 1, max: 5, integer: true },                // الحد الثابت في المقام
];

/** مثال: subst(2, -1, -3, -7) => "2(-3) - 1 = -7" */
function subst(coef: number, k: number, a: number, result: number): string {
  const head = coef === 1 ? `${a}` : `${coef}(${a})`;
  const tail = k === 0 ? '' : ` ${k > 0 ? '+' : '-'} ${Math.abs(k)}`;
  return `${head}${tail} = ${result}`;
}

function generate(v: Record<string, number>): TemplateOutput {
  const { a, A, B, C, D } = v;

  const num = A * a + B;
  const den = C * a + D; // لا يساوي صفرًا (constraint)

  const correct = frac(num, den)!;

  const distractors = uniqueExcept(
    [
      frac(den, num),
      frac(num, den + 1),
      frac(num, den - 1),
      frac(num + 1, den),
      frac(num - 1, den),
      frac(num * 2, den),
      frac(num, den * 2),
      frac(-num, den),
      '0',
      '1',
      '-1',
      '2',
      '-2',
      DNE,
    ],
    correct
  );

  // لا نعرض كسرًا مقامه 1 (مثل \frac{-7}{1})
  const raw = `\\frac{${num}}{${den}}`;
  const finalMath = den === 1 ? correct : raw === correct ? raw : `${raw} = ${correct}`;

  return {
    questionText: 'أوجد قيمة النهاية التالية باستخدام التعويض المباشر:',
    mathExpression: `\\lim_{x \\to ${a}} \\frac{${linear(A, B)}}{${linear(C, D)}}`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      { text: 'بما أن التعويض المباشر لا يعطي حالة عدم تعيين (0/0)، نعوض بـ', math: `x = ${a}` },
      { text: 'في البسط:', math: subst(A, B, a, num) },
      { text: 'في المقام:', math: subst(C, D, a, den) },
      { text: 'إذن النهاية تساوي:', math: finalMath },
    ],
  };
}

export const directSubstitutionTemplate: QuestionTemplate = {
  id: 'limits:direct-substitution',
  name: 'التعويض المباشر (دوال كسرية)',
  type: 'limits',
  difficulty: 'easy',
  variables,
  constraint: (v) => v.C * v.a + v.D !== 0,
  generate,
};
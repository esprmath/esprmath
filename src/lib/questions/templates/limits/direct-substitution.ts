// src/lib/questions/templates/limits/direct-substitution.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, linear, uniqueExcept, DNE } from '../utils';
import { poly } from '../derivatives/helpers';

const variables: VariableDefinition[] = [
  { name: 'a', min: -3, max: 3, exclude: [0], integer: true }, // نقطة الاقتراب
  { name: 'A', min: 1, max: 5, integer: true },                // معامل x في البسط
  { name: 'B', min: -5, max: 5, integer: true },               // الحد الثابت في البسط
  { name: 'C', min: 1, max: 3, integer: true },                // معامل x في المقام
  { name: 'D', min: 1, max: 5, integer: true },                // الحد الثابت في المقام
  // يُضاف آخر القائمة حتى لا تتغير أرقام الأسئلة القديمة: 0 = الشكل الأصلي، 1 = مثل Ex 2(a)
  { name: 'form', min: 0, max: 1, integer: true },
];

/** مثل Ex 2(a): lim (x → 5) (2x² - 3x + 4) */
function polynomialForm(a: number, A: number, B: number, D: number): TemplateOutput {
  const b = B === 0 ? -1 : B;
  const expr = poly([[A + 1, 2], [b, 1], [D, 0]]);
  const value = (A + 1) * a * a + b * a + D;
  const wrongSign = (A + 1) * a * a - b * a + D;

  return {
    questionText: 'Evaluate the limit and justify each step:',
    mathExpression: `\\lim_{x \\to ${a}} (${expr})`,
    correct: `${value}`,
    distractors: uniqueExcept(
      [
        `${wrongSign}`,                         // خطأ إشارة عند تعويض العدد السالب
        `${(A + 1) * 2 * a + b * a + D}`,       // ضرب بدل التربيع
        `${(A + 1) * a * a + b * a}`,           // نسيان الثابت
        `${value + 1}`,
        `${value - 1}`,
        DNE,
      ],
      `${value}`
    ),
    optionFormat: 'math',
    steps: [
      {
        text: 'نوزّع النهاية على الحدود بقوانين النهايات (Limit Laws):',
        math: `${A + 1}\\left(\\lim_{x \\to ${a}} x\\right)^{2} ${b > 0 ? '+' : '-'} ${Math.abs(b)}\\lim_{x \\to ${a}} x + ${D}`,
      },
      { text: 'نعوّض قيمة x:', math: `${A + 1}(${a})^{2} ${b > 0 ? '+' : '-'} ${Math.abs(b)}(${a}) + ${D} = ${value}` },
    ],
  };
}

/** مثال: subst(2, -1, -3, -7) => "2(-3) - 1 = -7" */
function subst(coef: number, k: number, a: number, result: number): string {
  const head = coef === 1 ? `${a}` : `${coef}(${a})`;
  const tail = k === 0 ? '' : ` ${k > 0 ? '+' : '-'} ${Math.abs(k)}`;
  return `${head}${tail} = ${result}`;
}

function generate(v: Record<string, number>): TemplateOutput {
  if (v.form === 1) return polynomialForm(v.a, v.A, v.B, v.D);
  return originalForm(v);
}

function originalForm(v: Record<string, number>): TemplateOutput {
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
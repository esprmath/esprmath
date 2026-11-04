// src/lib/questions/templates/limits/conjugate-infinity.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, uniqueExcept, DNE } from '../utils';

// b و c موجبان دائمًا (القالب مكتوب على هذا الأساس)
const variables: VariableDefinition[] = [
  { name: 'b', min: 2, max: 8, integer: true },
  { name: 'c', min: 5, max: 20, integer: true },
];

function generate(v: Record<string, number>): TemplateOutput {
  const { b, c } = v;

  // lim (√(x² + bx + c) − x) = b/2
  const correct = frac(b, 2)!;
  const raw = `\\frac{${b}}{2}`;

  const radicand = `x^2 + ${b}x + ${c}`;
  const root = `\\sqrt{${radicand}}`;

  const distractors = uniqueExcept(
    [
      '0',
      `${b}`,
      `${c}`,
      frac(c, 2),
      frac(b, 4),
      frac(b + 1, 2),
      frac(b - 1, 2),
      '\\infty',
      '-\\infty',
      DNE,
    ],
    correct
  );

  return {
    questionText: 'Compute the limit using the conjugate technique:',
    mathExpression: `\\lim_{x \\to \\infty} \\left(${root} - x\\right)`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      { text: 'التعويض المباشر يعطي صيغة غير معينة:', math: '\\infty - \\infty' },
      {
        text: 'نضرب ونقسم في مرافق المقدار:',
        math: `\\frac{(${root} - x)(${root} + x)}{${root} + x}`,
      },
      {
        text: 'بفرق المربعين يصبح البسط:',
        math: `(${radicand}) - x^2 = ${b}x + ${c}`,
      },
      {
        text: 'نقسم البسط والمقام على x (مع x > 0):',
        math: `\\lim_{x \\to \\infty} \\frac{${b} + \\frac{${c}}{x}}{\\sqrt{1 + \\frac{${b}}{x} + \\frac{${c}}{x^2}} + 1}`,
      },
      {
        text: 'عندما x → ∞ تؤول الكسور إلى الصفر، فيتبقى:',
        math: `\\frac{${b}}{1 + 1} = ${raw}${correct === raw ? '' : ` = ${correct}`}`,
      },
    ],
  };
}

export const conjugateInfinityTemplate: QuestionTemplate = {
  id: 'limits:conjugate-infinity',
  name: 'تقنية المرافق عند اللانهاية',
  type: 'limits',
  difficulty: 'hard',
  variables,
  generate,
};
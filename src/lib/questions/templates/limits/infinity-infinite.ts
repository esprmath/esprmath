// src/lib/questions/templates/limits/infinity-infinite.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, linear, uniqueExcept, DNE } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 1, max: 5, integer: true },       // معامل x² في البسط
  { name: 'b', min: 1, max: 5, integer: true },       // معامل x في المقام
  { name: 'denSign', min: 0, max: 1, integer: true }, // 0 → المقام موجب، 1 → المقام سالب
];

function generate(v: Record<string, number>): TemplateOutput {
  const { a, b, denSign } = v;
  const sgn = denSign === 1 ? -1 : 1;
  const sb = sgn * b; // معامل x في المقام بإشارته

  const correct = sgn < 0 ? '-\\infty' : '\\infty';
  const coefA = a === 1 ? '' : `${a}`;

  const distractors = uniqueExcept(
    [
      sgn < 0 ? '\\infty' : '-\\infty', // الإشارة المعاكسة
      '0',
      frac(a, sb),
      frac(a, b),
      frac(-a, b),
      `${a}`,
      `${sb}`,
      DNE,
    ],
    correct
  );

  return {
    questionText: 'Find the infinite limit at infinity:',
    mathExpression: `\\lim_{x \\to \\infty} \\frac{${coefA}x^2 + x}{${linear(sb, 1)}}`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      {
        text: 'درجة البسط (2) أكبر من درجة المقام (1)، فالنهاية لا تؤول إلى عدد محدد:',
        math: '2 > 1',
      },
      {
        text: 'نقسم البسط والمقام على x:',
        math: `\\lim_{x \\to \\infty} \\frac{${coefA}x + 1}{${sb} + \\frac{1}{x}}`,
      },
      {
        text: 'البسط يؤول إلى ما لا نهاية، والمقام يؤول إلى الثابت:',
        math: `${sb}`,
      },
      {
        text: `قسمة كمية تؤول إلى ما لا نهاية على عدد ${sgn < 0 ? 'سالب' : 'موجب'} تعطي:`,
        math: correct,
      },
    ],
  };
}

export const infinityInfiniteTemplate: QuestionTemplate = {
  id: 'limits:infinity-infinite',
  name: 'النهايات اللانهائية عند اللانهاية',
  type: 'limits',
  difficulty: 'medium',
  variables,
  generate,
};
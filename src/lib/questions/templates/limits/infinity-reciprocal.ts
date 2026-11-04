// src/lib/questions/templates/limits/infinity-reciprocal.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept, DNE } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'k', min: 1, max: 9, integer: true },        // البسط الثابت
  { name: 'n', min: 1, max: 4, integer: true },        // الأس في المقام
  { name: 'isNegInf', min: 0, max: 1, integer: true }, // 0 → ∞ ، 1 → −∞
];

function generate(v: Record<string, number>): TemplateOutput {
  const { k, n } = v;
  const neg = v.isNegInf === 1;
  const inf = neg ? '-\\infty' : '\\infty';
  const xn = n === 1 ? 'x' : `x^{${n}}`;

  const correct = '0';

  const distractors = uniqueExcept(
    ['\\infty', '-\\infty', `${k}`, `-${k}`, '1', DNE],
    correct
  );

  return {
    questionText: 'Find the limit:',
    mathExpression: `\\lim_{x \\to ${inf}} \\frac{${k}}{${xn}}`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      {
        text: `عندما x تؤول إلى ${neg ? 'سالب ما لا نهاية' : 'ما لا نهاية'}، تكبر القيمة المطلقة للمقام بلا حدود:`,
        math: `|${xn}| \\to \\infty`,
      },
      {
        text: 'قسمة عدد ثابت على كمية قيمتها المطلقة تكبر بلا حدود تؤول إلى الصفر:',
        math: `\\lim_{x \\to ${inf}} \\frac{${k}}{${xn}} = 0`,
      },
    ],
  };
}

export const infinityReciprocalTemplate: QuestionTemplate = {
  id: 'limits:infinity-reciprocal',
  name: 'النهايات البسيطة عند اللانهاية (دوال مقلوبة)',
  type: 'limits',
  difficulty: 'easy',
  variables,
  generate,
};
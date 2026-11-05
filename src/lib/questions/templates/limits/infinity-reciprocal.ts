// src/lib/questions/templates/limits/infinity-reciprocal.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept, DNE } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'k', min: 1, max: 9, integer: true },        // البسط الثابت
  { name: 'n', min: 1, max: 4, integer: true },        // الأس في المقام
  { name: 'isNegInf', min: 0, max: 1, integer: true }, // 0 → ∞ ، 1 → −∞
  // يُضاف آخر القائمة حتى لا تتغير أرقام الأسئلة القديمة: 0 = الشكل الأصلي، 1 = مثل Q-23
  { name: 'form', min: 0, max: 1, integer: true },
];

/** مثل Q-23: lim (x → ∞) cos x */
function trigForm(k: number, n: number, neg: boolean): TemplateOutput {
  const fn = n % 2 === 0 ? '\\cos' : '\\sin';
  const coef = k === 1 ? '' : `${k}`;
  const inf = neg ? '-\\infty' : '\\infty';
  const correct = DNE;

  return {
    questionText: 'Find the limit or show that it does not exist:',
    mathExpression: `\\lim_{x \\to ${inf}} ${coef}${fn} x`,
    correct,
    distractors: uniqueExcept(['0', `${k}`, `-${k}`, '\\infty', '1'], correct),
    optionFormat: 'math',
    steps: [
      { text: `${fn === '\\cos' ? 'cos' : 'sin'} x تتذبذب بين -1 و 1 مهما كبرت x، ولا تستقر على عدد واحد:`, math: `-${k} \\le ${coef}${fn} x \\le ${k}` },
      { text: 'لا توجد قيمة واحدة تقترب منها الدالة، فالنهاية غير موجودة:', math: DNE },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  if (v.form === 1) return trigForm(v.k, v.n, v.isNegInf === 1);
  return originalForm(v);
}

function originalForm(v: Record<string, number>): TemplateOutput {
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
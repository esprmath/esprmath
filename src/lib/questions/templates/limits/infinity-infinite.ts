// src/lib/questions/templates/limits/infinity-infinite.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, linear, uniqueExcept, DNE } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 1, max: 5, integer: true },       // معامل x² في البسط
  { name: 'b', min: 1, max: 5, integer: true },       // معامل x في المقام
  { name: 'denSign', min: 0, max: 1, integer: true }, // 0 → المقام موجب، 1 → المقام سالب
  // يُضاف آخر القائمة حتى لا تتغير أرقام الأسئلة القديمة: 0 = الشكل الأصلي، 1 = مثل Q-21
  { name: 'form', min: 0, max: 1, integer: true },
];

/** مثل Q-21: lim (x → -∞) (2x⁵ - x) / (x⁴ + 3) */
function negativeInfinityForm(a: number, b: number, denSign: number): TemplateOutput {
  const n = (b % 3) + 2; // قوة المقام 2 إلى 4
  const sgn = denSign === 1 ? -1 : 1;
  const coef = sgn * (a + 1);
  // أعلى حدين يختصران إلى coef·x، و x → -∞
  const correct = coef > 0 ? '-\\infty' : '\\infty';
  const lead = `${coef}x^{${n + 1}}`;

  return {
    questionText: 'Find the limit or show that it does not exist:',
    mathExpression: `\\lim_{x \\to -\\infty} \\frac{${lead} - x}{x^{${n}} + ${b + 1}}`,
    correct,
    distractors: uniqueExcept([coef > 0 ? '\\infty' : '-\\infty', '0', `${coef}`, DNE], correct),
    optionFormat: 'math',
    steps: [
      { text: `درجة البسط (${n + 1}) أكبر من درجة المقام (${n})، فالنهاية لا نهائية:`, math: `${n + 1} > ${n}` },
      { text: 'نأخذ أعلى حد في البسط والمقام ونختصرهما:', math: `\\lim_{x \\to -\\infty} \\frac{${lead}}{x^{${n}}} = \\lim_{x \\to -\\infty} ${coef}x` },
      { text: `نعوّض x → -∞، والمعامل ${coef > 0 ? 'الموجب' : 'السالب'} يحدد الإشارة:`, math: correct },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  if (v.form === 1) return negativeInfinityForm(v.a, v.b, v.denSign);
  return originalForm(v);
}

function originalForm(v: Record<string, number>): TemplateOutput {
  const { a, b, denSign } = v;
  const sgn = denSign === 1 ? -1 : 1;
  const sb = sgn * b; // معامل x في المقام بإشارته

  const correct = sgn < 0 ? '-\\infty' : '\\infty';
  const coefA = a === 1 ? '' : `${a}`;
  // ناتج اختصار أعلى حدين: a x² / (sb x)
  const ratio = frac(a, sb);
  const linearTerm = ratio === '1' ? 'x' : ratio === '-1' ? '-x' : `${ratio}x`;

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
        text: 'نأخذ أعلى حد في البسط والمقام:',
        math: `\\lim_{x \\to \\infty} \\frac{${coefA}x^2}{${linear(sb, 0)}}`,
      },
      {
        text: 'نختصرهما:',
        math: `\\lim_{x \\to \\infty} ${linearTerm}`,
      },
      {
        text: `نعوض x → ∞، والمعامل ${sgn < 0 ? 'السالب' : 'الموجب'} يحدد الإشارة:`,
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
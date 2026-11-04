// src/lib/questions/templates/derivatives/tangent-limit.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, uniqueExcept } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 1, max: 4, integer: true },    // الإحداثي x للنقطة
  { name: 'yVal', min: 1, max: 5, integer: true }, // الإحداثي y للنقطة
];

/** معادلة مستقيم بالميل num/den والثابت c، مثل: y = -\frac{3}{2}x + 6 */
function line(num: number, den: number, c: number): string | null {
  const s = frac(num, den);
  if (s === null) return null;
  const slopeX = s === '0' ? '' : s === '1' ? 'x' : s === '-1' ? '-x' : `${s}x`;
  if (slopeX === '') return `y = ${c}`;
  if (c === 0) return `y = ${slopeX}`;
  return `y = ${slopeX} ${c > 0 ? '+' : '-'} ${Math.abs(c)}`;
}

function generate(v: Record<string, number>): TemplateOutput {
  const { a, yVal: y } = v;
  const k = a * y; // المنحنى y = k/x يمر بالنقطة (a, y)
  const yx = `${y === 1 ? '' : y}x`; // y·x بدون المعامل 1

  // الميل m = -k/a² = -y/a ، والثابت c = y - m·a = 2y
  const slope = frac(-y, a)!;
  const slopeMul = slope === '-1' ? '-' : slope;
  const c = 2 * y;
  const correct = line(-y, a, c)!;

  const distractors = uniqueExcept(
    [
      line(y, a, c),   // إشارة الميل خاطئة
      line(-y, a, -c), // إشارة الثابت خاطئة
      line(-y, a, y),  // نسيان مضاعفة الثابت
      line(-y, a, 0),  // نسيان الثابت
      line(-y, 1, c),  // عدم القسمة على a في الميل
      line(-1, a, c),
      line(y, 1, c),
    ],
    correct
  );

  const factor = `${y === 1 ? '-' : `-${y}`}(x - ${a})`;
  const rawSlope = `\\frac{-${y}}{${a}}`;

  return {
    questionText: 'Find an equation of the tangent line to the curve at the given point:',
    mathExpression: `y = \\frac{${k}}{x}, \\quad \\text{at point } (${a}, ${y})`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      {
        text: 'أولاً: نجد الميل بتعريف النهاية:',
        math: `m = \\lim_{x \\to ${a}} \\frac{\\frac{${k}}{x} - ${y}}{x - ${a}}`,
      },
      {
        text: 'نوحّد المقامات في البسط:',
        math: `m = \\lim_{x \\to ${a}} \\frac{${k} - ${yx}}{x(x - ${a})}`,
      },
      {
        text: 'نخرج عاملاً مشتركاً من البسط ونختصر:',
        math: `m = \\lim_{x \\to ${a}} \\frac{${factor}}{x(x - ${a})} = \\lim_{x \\to ${a}} \\frac{-${y}}{x}`,
      },
      {
        text: 'بالتعويض المباشر نجد الميل:',
        math: a === 1 ? `m = ${slope}` : `m = ${rawSlope} = ${slope}`,
      },
      {
        text: 'ثانياً: نكتب معادلة المماس بصيغة الميل والنقطة:',
        math: `y - ${y} = ${slopeMul}(x - ${a})`,
      },
      { text: 'بفك الأقواس والترتيب نحصل على المعادلة النهائية:', math: correct },
    ],
  };
}

export const tangentLimitTemplate: QuestionTemplate = {
  id: 'derivatives:tangent-limit',
  name: 'إيجاد معادلة المماس باستخدام تعريف النهاية',
  type: 'derivative',
  difficulty: 'medium',
  variables,
  generate,
};
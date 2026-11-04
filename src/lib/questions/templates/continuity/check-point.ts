// src/lib/questions/templates/continuity/check-point.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { linear, uniqueExcept } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 1, max: 3, integer: true }, // نقطة الاقتراب
  { name: 'k', min: 2, max: 4, integer: true }, // ناتج الجذر (لضمان مربع كامل)
  { name: 'B', min: 1, max: 3, integer: true }, // معامل x داخل الجذر
  { name: 'A', min: 1, max: 3, integer: true }, // المعامل الخارجي للجذر
];

const coef = (n: number) => (n === 1 ? '' : `${n}`);

function generate(v: Record<string, number>): TemplateOutput {
  const { a, k, B, A } = v;

  // B*a + C = k^2
  const C = k * k - B * a;
  const val = A * k;

  const radicand = linear(B, C);
  const atA = `${B === 1 ? a : `${B}(${a})`}${C === 0 ? '' : ` ${C > 0 ? '+' : '-'} ${Math.abs(C)}`}`;
  const tail = A === 1 ? `${k}` : `${A} \\cdot ${k} = ${val}`;

  const lim = `\\lim_{x \\to ${a}} p(x)`;
  const correct = `\\text{Continuous: } p(${a}) = ${lim} = ${val}`;

  const distractors = uniqueExcept(
    [
      `\\text{Discontinuous: } ${lim} \\neq p(${a})`,
      `\\text{Discontinuous: } p(${a}) \\text{ is undefined}`,
      `\\text{Discontinuous: the limit does not exist}`,
      `\\text{Continuous: } p(${a}) = ${lim} = ${val + 1}`,
      `\\text{Continuous: } p(${a}) = ${lim} = ${val - 1}`,
      `\\text{Continuous: } p(${a}) = ${lim} = ${k}`,
      `\\text{Continuous only at } x = 0`,
    ],
    correct
  );

  return {
    questionText: `Use the definition of continuity to verify if the function is continuous at the number a = ${a}:`,
    mathExpression: `p(x) = ${coef(A)}\\sqrt{${radicand}}, \\quad a = ${a}`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      {
        text: 'أولاً: نجد قيمة الدالة عند النقطة:',
        math: `p(${a}) = ${coef(A)}\\sqrt{${atA}} = ${coef(A)}\\sqrt{${k * k}} = ${tail}`,
      },
      {
        text: 'ثانياً: الدالة الجذرية متصلة عند هذه النقطة (ما تحت الجذر موجب)، فنحسب النهاية بالتعويض المباشر:',
        math: `${lim} = ${val}`,
      },
      {
        text: 'ثالثاً: قيمة الدالة تساوي النهاية، فالدالة متصلة عند هذه النقطة:',
        math: `p(${a}) = ${lim} = ${val}`,
      },
    ],
  };
}

export const checkPointTemplate: QuestionTemplate = {
  id: 'continuity:check-point',
  name: 'فحص شروط الاتصال عند نقطة',
  type: 'continuity',
  difficulty: 'easy',
  variables,
  generate,
};
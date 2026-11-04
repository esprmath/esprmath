// src/lib/questions/templates/continuity/rational-discontinuity.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { linear, uniqueExcept } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 2, max: 5, integer: true },  // نقطة عدم الاتصال
  { name: 'b', min: -4, max: 4, integer: true }, // الجذر الآخر للبسط
];

/** x^2 - (sum)x + prod بدون أشكال قبيحة (1x أو 0x أو + 0) */
function quadratic(sum: number, prod: number): string {
  const parts = ['x^2'];
  if (sum !== 0) parts.push(`${sum > 0 ? '-' : '+'} ${Math.abs(sum) === 1 ? '' : Math.abs(sum)}x`);
  if (prod !== 0) parts.push(`${prod > 0 ? '+' : '-'} ${Math.abs(prod)}`);
  return parts.join(' ');
}

function generate(v: Record<string, number>): TemplateOutput {
  const { a, b } = v;

  const numExpr = quadratic(a + b, a * b);
  const den = linear(1, -a);
  const other = linear(1, -b);
  const factored = b === 0 ? `x(${den})` : `(${den})(${other})`;

  const correct = `x = ${a}`;

  const distractors = uniqueExcept(
    [
      `x = ${-a}`,
      `x = ${b}`,
      `x = ${-b}`,
      b !== a ? `x = ${a} \\text{ and } x = ${b}` : null,
      `x = 0`,
      `\\text{Continuous everywhere}`,
    ],
    correct
  );

  return {
    questionText: 'Determine the value(s) of x where the function is discontinuous:',
    mathExpression: `f(x) = \\frac{${numExpr}}{${den}}`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      { text: 'نحلل البسط:', math: `${numExpr} = ${factored}` },
      { text: 'الدالة غير معرّفة عندما يساوي المقام صفراً:', math: `${den} = 0 \\implies x = ${a}` },
      { text: 'وبعد الاختصار تصبح الدالة:', math: `f(x) = ${other}, \\quad x \\neq ${a}` },
      {
        text: 'البسط يساوي صفراً أيضاً عند هذه النقطة، فهو عدم اتصال قابل للإزالة (Removable)، والدالة غير متصلة عند:',
        math: `x = ${a}`,
      },
    ],
  };
}

export const rationalDiscontinuityTemplate: QuestionTemplate = {
  id: 'continuity:rational-discontinuity',
  name: 'إيجاد نقاط عدم الاتصال (دوال كسرية)',
  type: 'continuity',
  difficulty: 'medium',
  variables,
  generate,
};
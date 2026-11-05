// src/lib/questions/templates/continuity/rational-discontinuity.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { linear, uniqueExcept } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 2, max: 5, integer: true },  // نقطة عدم الاتصال
  { name: 'b', min: -4, max: 4, integer: true }, // الجذر الآخر للبسط
  // يُضاف آخر القائمة حتى لا تتغير أرقام الأسئلة القديمة: 0 = الشكل الأصلي، 1 = مثل Q-23
  { name: 'form', min: 0, max: 1, integer: true },
];

/** مثل Q-23: cos x إذا x < 0، و 0 عند x = 0، و 1 - x² إذا x > 0 */
function piecewiseForm(a: number, b: number): TemplateOutput {
  const value = b === 1 ? 0 : b; // قيمة الدالة عند 0، لا تساوي النهاية 1
  const right = `1 - ${a === 1 ? '' : a}x^{2}`;
  const correct = `\\lim_{x \\to 0} f(x) = 1 \\neq f(0) = ${value}`;

  return {
    questionText: 'Explain why the function is discontinuous at the given number a = 0:',
    mathExpression: `f(x) = \\begin{cases} \\cos x, & x < 0 \\\\ ${value}, & x = 0 \\\\ ${right}, & x > 0 \\end{cases}`,
    correct,
    distractors: uniqueExcept(
      [
        `f(0) \\text{ is undefined}`,
        `\\lim_{x \\to 0} f(x) \\text{ does not exist}`,             // خطأ في حساب الجهتين
        `\\lim_{x \\to 0} f(x) = ${value} \\neq f(0) = 1`,           // قلب القيمتين
        `\\lim_{x \\to 0^{-}} f(x) = 0 \\neq \\lim_{x \\to 0^{+}} f(x) = 1`, // اعتبار cos 0 = 0
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'أولاً: f(0) معرفة:', math: `f(0) = ${value}` },
      { text: 'ثانياً: النهاية من اليسار ومن اليمين:', math: `\\lim_{x \\to 0^{-}} \\cos x = 1, \\quad \\lim_{x \\to 0^{+}} (${right}) = 1` },
      { text: 'الجهتان متساويتان، فالنهاية موجودة وتساوي 1:', math: `\\lim_{x \\to 0} f(x) = 1` },
      { text: 'ثالثاً: النهاية لا تساوي قيمة الدالة، فالدالة غير متصلة عند 0:', math: correct },
    ],
  };
}

/** x^2 - (sum)x + prod بدون أشكال قبيحة (1x أو 0x أو + 0) */
function quadratic(sum: number, prod: number): string {
  const parts = ['x^2'];
  if (sum !== 0) parts.push(`${sum > 0 ? '-' : '+'} ${Math.abs(sum) === 1 ? '' : Math.abs(sum)}x`);
  if (prod !== 0) parts.push(`${prod > 0 ? '+' : '-'} ${Math.abs(prod)}`);
  return parts.join(' ');
}

function generate(v: Record<string, number>): TemplateOutput {
  if (v.form === 1) return piecewiseForm(v.a, v.b);
  return originalForm(v);
}

function originalForm(v: Record<string, number>): TemplateOutput {
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
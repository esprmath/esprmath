// src/lib/questions/templates/continuity/check-point.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { linear, uniqueExcept } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 1, max: 3, integer: true }, // نقطة الاقتراب
  { name: 'k', min: 2, max: 4, integer: true }, // ناتج الجذر (لضمان مربع كامل)
  { name: 'B', min: 1, max: 3, integer: true }, // معامل x داخل الجذر
  { name: 'A', min: 1, max: 3, integer: true }, // المعامل الخارجي للجذر
  // يُضاف آخر القائمة حتى لا تتغير أرقام الأسئلة القديمة: 0 = الشكل الأصلي، 1 = مثل Q-13
  { name: 'form', min: 0, max: 1, integer: true },
];

const coef = (n: number) => (n === 1 ? '' : `${n}`);

/** مثل Q-13: f(x) = 3x² + (x + 2)⁵ عند a = -1 */
function polynomialForm(a: number, k: number, A: number): TemplateOutput {
  const point = -a;
  const shift = a + 1; // (point + shift) = 1 فيبقى الحساب سهلًا مثل السؤال الأصلي
  const n = k + 1;     // 3 إلى 5
  const c = A + 1;     // 2 إلى 4
  const val = c * a * a + 1;
  const lim = `\\lim_{x \\to ${point}} f(x)`;
  const correct = `\\text{Continuous: } f(${point}) = ${lim} = ${val}`;

  return {
    questionText: `Use the definition of continuity and the properties of limits to show that the function is continuous at the given number a = ${point}:`,
    mathExpression: `f(x) = ${c}x^{2} + (x + ${shift})^{${n}}, \\quad a = ${point}`,
    correct,
    distractors: uniqueExcept(
      [
        `\\text{Discontinuous: } ${lim} \\neq f(${point})`,
        `\\text{Discontinuous: } f(${point}) \\text{ is undefined}`,
        `\\text{Continuous: } f(${point}) = ${lim} = ${val - 2}`, // خطأ إشارة عند تربيع العدد السالب
        `\\text{Continuous: } f(${point}) = ${lim} = ${c * a * a}`, // نسيان القوس
        `\\text{Discontinuous: the limit does not exist}`,
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'أولاً: f(a) معرفة:', math: `f(${point}) = ${c}(${point})^{2} + (${point} + ${shift})^{${n}} = ${c * a * a} + 1 = ${val}` },
      { text: 'ثانياً: كثيرة الحدود نهايتها بالتعويض المباشر، فالنهاية موجودة:', math: `${lim} = ${val}` },
      { text: 'ثالثاً: النهاية تساوي قيمة الدالة، فالدالة متصلة عند هذه النقطة:', math: `f(${point}) = ${lim} = ${val}` },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  if (v.form === 1) return polynomialForm(v.a, v.k, v.A);
  return originalForm(v);
}

function originalForm(v: Record<string, number>): TemplateOutput {
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
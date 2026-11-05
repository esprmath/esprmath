// src/lib/questions/templates/derivatives/quotient-rule.ts
// ثلاثة أشكال من شابتر 2.3: Q-35 (خطي على خطي) و Q-40 (جذور) و Q-51 (كسر داخل كسر)
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { linear, uniqueExcept } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'form', min: 0, max: 2, integer: true },
  { name: 'a', min: 2, max: 9, integer: true },
  { name: 'b', min: 2, max: 5, integer: true },
  { name: 'c', min: 2, max: 7, integer: true },
  { name: 'd', min: 1, max: 5, integer: true },
];

/** مثل Q-35: g(t) = (3 - 2t) / (5t + 1) */
function linearForm(a: number, b: number, c: number, d: number): TemplateOutput {
  const den = linear(c, d, 't');
  const answer = (num: number, power = 2) =>
    `g'(t) = \\frac{${num}}{${power === 1 ? `${den}` : `(${den})^{${power}}`}}`;
  const num = -(b * d + a * c);
  const correct = answer(num);

  return {
    questionText: 'Use the Quotient Rule to find the derivative:',
    mathExpression: `g(t) = \\frac{${a} - ${b}t}{${den}}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(b * d + a * c),  // قلب ترتيب الطرح في القانون
        answer(a * c - b * d),  // عدم توزيع الناقص على القوس
        answer(b * d - a * c),
        answer(num, 1),         // نسيان تربيع المقام
        answer(-b * d),         // نسيان الجزء uv'
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نسمي البسط u والمقام v ونشتق كل واحد:', math: `u' = -${b}, \\quad v' = ${c}` },
      {
        text: 'نعوّض في القاعدة (u\'v - uv\') / v²:',
        math: `g'(t) = \\frac{(-${b})(${den}) - (${a} - ${b}t)(${c})}{(${den})^{2}}`,
      },
      { text: 'نفك البسط ونترك المقام كما هو:', math: correct },
    ],
  };
}

/** مثل Q-40: y = √x / (√x + 1) */
function radicalForm(d: number): TemplateOutput {
  const root = '\\sqrt{x}';
  const den = `${root} + ${d}`;
  const answer = (num: string, bottom: string) => `y' = \\frac{${num}}{${bottom}}`;
  const correct = answer(`${d}`, `2${root}(${den})^{2}`);

  return {
    questionText: 'Use the Quotient Rule to find the derivative:',
    mathExpression: `y = \\frac{${root}}{${den}}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(`-${d}`, `2${root}(${den})^{2}`),   // قلب ترتيب الطرح
        answer(`${d}`, `(${den})^{2}`),            // نسيان 2√x من المشتقة
        answer(`${d}`, `2${root}(${den})`),        // نسيان تربيع المقام
        answer('1', `2${root}(${den})^{2}`),       // إهمال الثابت في البسط
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نسمي البسط u والمقام v ونشتق كل واحد:', math: `u' = v' = \\frac{1}{2${root}}` },
      {
        text: 'نعوّض في القاعدة (u\'v - uv\') / v²:',
        math: `y' = \\frac{\\frac{1}{2${root}}(${den}) - ${root} \\cdot \\frac{1}{2${root}}}{(${den})^{2}}`,
      },
      {
        text: 'نفك البسط: يختصر 1/2 مع -1/2 ويبقى:',
        math: correct,
      },
    ],
  };
}

/** مثل Q-51: f(x) = x / (x + c/x) */
function nestedForm(a: number): TemplateOutput {
  const den = `x^{2} + ${a}`;
  const answer = (num: string, bottom: string) => `f'(x) = \\frac{${num}}{${bottom}}`;
  const correct = answer(`${2 * a}x`, `(${den})^{2}`);

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `f(x) = \\frac{x}{x + \\frac{${a}}{x}}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(`-${2 * a}x`, `(${den})^{2}`), // قلب ترتيب الطرح
        answer(`${2 * a}x`, den),             // نسيان تربيع المقام
        answer(`${a}x`, `(${den})^{2}`),      // نسيان 2 من مشتقة x²
        answer('2x', `(${den})^{2}`),         // إهمال الثابت
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نبسّط الكسر أولًا: نوحّد مقام الأسفل ثم نقلبه:', math: `f(x) = \\frac{x^{2}}{${den}}` },
      {
        text: 'نعوّض في Quotient Rule:',
        math: `f'(x) = \\frac{2x(${den}) - x^{2}(2x)}{(${den})^{2}}`,
      },
      { text: 'نفك البسط ونختصر:', math: correct },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  if (v.form === 0) return linearForm(v.a, v.b, v.c, v.d);
  if (v.form === 1) return radicalForm(v.d);
  return nestedForm(v.a);
}

export const quotientRuleTemplate: QuestionTemplate = {
  id: 'derivatives:quotient-rule',
  name: 'قاعدة القسمة',
  type: 'derivative',
  difficulty: 'medium',
  variables,
  generate,
};

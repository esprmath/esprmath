// src/lib/questions/templates/derivatives/product-rule.ts
// شكلان من شابتر 2.3: Q-30 (كثيرتا حدود) و Q-32 (جذور)
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept } from '../utils';
import { poly } from './helpers';

const variables: VariableDefinition[] = [
  { name: 'form', min: 0, max: 1, integer: true },
  { name: 'a', min: 2, max: 10, integer: true },
  { name: 'b', min: 1, max: 9, integer: true },
  { name: 'c', min: 1, max: 5, integer: true },
  { name: 'd', min: 1, max: 5, integer: true },
];

/** مثل Q-30: y = (10x² + 7x - 2)(2 - x²) */
function polynomialForm(a: number, b: number, c: number, d: number): TemplateOutput {
  const u = poly([[a, 2], [b, 1], [-c, 0]]);
  const vText = `${d} - x^{2}`;
  const du = poly([[2 * a, 1], [b, 0]]);
  const result = (terms: [number, number][]) => `y' = ${poly(terms)}`;

  // (2ax + b)(d - x²) + (ax² + bx - c)(-2x)
  const correct = result([[-4 * a, 3], [-3 * b, 2], [2 * a * d + 2 * c, 1], [b * d, 0]]);

  return {
    questionText: 'Use the Product Rule to find the derivative:',
    mathExpression: `y = (${u})(${vText})`,
    correct,
    distractors: uniqueExcept(
      [
        result([[-4 * a, 2], [-2 * b, 1]]),                                // ضرب المشتقتين u'v'
        result([[-4 * a, 3], [-3 * b, 2], [2 * a * d - 2 * c, 1], [b * d, 0]]), // خطأ إشارة في توزيع الحد الثابت
        result([[-2 * a, 3], [-b, 2], [2 * a * d, 1], [b * d, 0]]),        // نسيان الجزء uv'
        result([[4 * a, 3], [3 * b, 2], [-2 * a * d - 2 * c, 1], [-b * d, 0]]), // عكس كل الإشارات
        result([[-4 * a, 3], [-b, 2], [2 * a * d + 2 * c, 1], [b * d, 0]]), // خطأ جمع الحدود المتشابهة
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نسمي الدالتين u و v ونشتق كل واحدة:', math: `u' = ${du}, \\quad v' = -2x` },
      { text: 'نعوّض في القاعدة u\'v + uv\':', math: `y' = (${du})(${vText}) + (${u})(-2x)` },
      { text: 'نفك الأقواس ونجمع الحدود المتشابهة (Like Terms):', math: correct },
    ],
  };
}

/** مثل Q-32: g(x) = √x(x + 2√x) */
function radicalForm(a: number): TemplateOutput {
  const k = a; // معامل الجذر داخل القوس
  const root = '\\sqrt{x}';
  const answer = (coef: string, c: number) => `g'(x) = ${coef}${root} + ${c}`;
  const correct = answer('\\frac{3}{2}', k);

  return {
    questionText: 'Use the Product Rule to find the derivative:',
    mathExpression: `g(x) = ${root}(x + ${k}${root})`,
    correct,
    distractors: uniqueExcept(
      [
        answer('\\frac{1}{2}', k),      // نسيان الجزء uv'
        answer('\\frac{3}{2}', 2 * k),  // عدم اختصار 2 في المقام
        answer('\\frac{3}{2}', k + 1),
        answer('3', k),                 // عدم القسمة على 2
        answer('\\frac{1}{2}', k + 1),
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      {
        text: 'نسمي u و v ونشتق كل واحدة:',
        math: `u' = \\frac{1}{2${root}}, \\quad v' = 1 + \\frac{${k}}{2${root}}`,
      },
      {
        text: 'نعوّض في القاعدة u\'v + uv\':',
        math: `g'(x) = \\frac{1}{2${root}}(x + ${k}${root}) + ${root}\\left(1 + \\frac{${k}}{2${root}}\\right)`,
      },
      {
        text: 'نفك الأقواس ونجمع الحدود المتشابهة (Like Terms):',
        math: correct,
      },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  return v.form === 0 ? polynomialForm(v.a, v.b, v.c, v.d) : radicalForm(v.a);
}

export const productRuleTemplate: QuestionTemplate = {
  id: 'derivatives:product-rule',
  name: 'قاعدة الضرب',
  type: 'derivative',
  difficulty: 'medium',
  variables,
  generate,
};

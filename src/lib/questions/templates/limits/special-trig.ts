// src/lib/questions/templates/limits/special-trig.ts
// ثلاثة أشكال من شابتر 2.4: Q-45 و Q-48 و Q-55
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, uniqueExcept, DNE } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'form', min: 0, max: 2, integer: true },
  { name: 'a', min: 2, max: 9, integer: true },
  { name: 'b', min: 2, max: 9, integer: true },
];

const LIMIT = '\\lim_{x \\to 0}';

/** مثل Q-45: lim sin(5x) / (3x) */
function ratioForm(a: number, b: number): TemplateOutput {
  const correct = frac(a, b)!;
  return {
    questionText: 'Find the limit:',
    mathExpression: `${LIMIT} \\frac{\\sin(${a}x)}{${b}x}`,
    correct,
    distractors: uniqueExcept([frac(b, a), '1', '0', `${a}`, `${b}`, `${a * b}`, DNE], correct),
    optionFormat: 'math',
    steps: [
      {
        text: `نجعل المقام نفس زاوية sin بالضرب في ${a}/${a}:`,
        math: `${LIMIT} \\frac{\\sin(${a}x)}{${b}x} \\cdot \\frac{${a}}{${a}} = \\frac{${a}}{${b}} ${LIMIT} \\frac{\\sin(${a}x)}{${a}x}`,
      },
      { text: 'النهاية الخاصة تساوي 1، فيبقى:', math: `\\frac{${a}}{${b}} \\cdot 1 = ${correct}` },
    ],
  };
}

/** مثل Q-48: lim sin²(3x) / x */
function squaredForm(a: number, b: number): TemplateOutput {
  const correct = '0';
  return {
    questionText: 'Find the limit:',
    mathExpression: `${LIMIT} \\frac{\\sin^{2}(${a}x)}{${b}x}`,
    correct,
    distractors: uniqueExcept([frac(a, b), '1', frac(a * a, b), `${a}`, DNE], correct),
    optionFormat: 'math',
    steps: [
      {
        text: 'نفصل sin² إلى حاصل ضرب، ونجهز الكسر ليطابق القاعدة:',
        math: `${LIMIT} \\sin(${a}x) \\cdot \\frac{\\sin(${a}x)}{${a}x} \\cdot \\frac{${a}}{${b}}`,
      },
      { text: 'الكسر يساوي 1، و sin(0) يساوي 0:', math: `0 \\cdot 1 \\cdot ${frac(a, b)} = 0` },
    ],
  };
}

/** مثل Q-55: lim sin θ / (θ + tan θ) */
function tanForm(a: number): TemplateOutput {
  const lim = '\\lim_{\\theta \\to 0}';
  const correct = frac(1, a + 1)!;
  return {
    questionText: 'Find the limit:',
    mathExpression: `${lim} \\frac{\\sin \\theta}{\\theta + ${a} \\tan \\theta}`,
    correct,
    distractors: uniqueExcept([frac(1, a), '1', '0', `${a + 1}`, frac(1, 2), DNE], correct),
    optionFormat: 'math',
    steps: [
      {
        text: 'نقسم البسط والمقام على sin θ:',
        math: `${lim} \\frac{1}{\\frac{\\theta}{\\sin \\theta} + \\frac{${a} \\tan \\theta}{\\sin \\theta}}`,
      },
      {
        text: 'نكتب tan θ / sin θ = 1 / cos θ:',
        math: `${lim} \\frac{1}{\\frac{\\theta}{\\sin \\theta} + \\frac{${a}}{\\cos \\theta}}`,
      },
      { text: 'θ / sin θ تساوي 1، و cos 0 يساوي 1:', math: `\\frac{1}{1 + ${a}} = ${correct}` },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  const { form, a, b } = v;
  if (form === 0) return ratioForm(a, b);
  if (form === 1) return squaredForm(a, b);
  return tanForm(a);
}

export const specialTrigTemplate: QuestionTemplate = {
  id: 'limits:special-trig',
  name: 'النهايات المثلثية الخاصة عند الصفر',
  type: 'limits',
  difficulty: 'medium',
  variables,
  constraint: (v) => v.a !== v.b,
  generate,
};

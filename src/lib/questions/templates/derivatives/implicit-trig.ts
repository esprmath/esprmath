// src/lib/questions/templates/derivatives/implicit-trig.ts
// مثل Q-11 و Example 3 و Q-22 في شابتر 2.6
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept } from '../utils';
import { monomial } from './helpers';

const variables: VariableDefinition[] = [
  { name: 'kind', min: 0, max: 2, integer: true }, // 0: sin x + cos y  1: sin(x + y)  2: g(x)
  { name: 'a', min: 2, max: 7, integer: true },
  { name: 'b', min: 2, max: 7, integer: true },
];

/** sin x + cos y = ax - by */
function linearForm(a: number, b: number): TemplateOutput {
  const answer = (num: string, den: string) => `y' = \\frac{${num}}{${den}}`;
  const correct = answer(`${a} - \\cos x`, `${b} - \\sin y`);
  return {
    questionText: 'Find dy/dx by implicit differentiation:',
    mathExpression: `\\sin x + \\cos y = ${a}x - ${b}y`,
    correct,
    distractors: uniqueExcept(
      [
        answer(`${a} - \\cos x`, `${b} + \\sin y`), // خطأ إشارة مشتقة cos y
        answer(`${a} + \\cos x`, `${b} - \\sin y`),
        answer(`\\cos x - ${a}`, `${b} - \\sin y`),
        answer(`${a} - \\cos x`, '-\\sin y'),       // نسيان حد y' في الطرف الأيمن
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: "نشتق الطرفين. مشتقة cos y تضرب في y':", math: `\\cos x - (\\sin y)y' = ${a} - ${b}y'` },
      { text: "نجمع حدود y' في طرف:", math: `y'(${b} - \\sin y) = ${a} - \\cos x` },
      { text: 'نقسم على القوس:', math: correct },
    ],
  };
}

/** sin(x + y) = a y² cos x */
function angleForm(a: number): TemplateOutput {
  const answer = (num: string, den: string) => `y' = \\frac{${num}}{${den}}`;
  const ay2 = monomial(a, 2, 'y');
  const twoAy = monomial(2 * a, 1, 'y');
  const correct = answer(`-\\cos(x + y) - ${ay2} \\sin x`, `\\cos(x + y) - ${twoAy} \\cos x`);
  return {
    questionText: "Find y' by implicit differentiation:",
    mathExpression: `\\sin(x + y) = ${ay2} \\cos x`,
    correct,
    distractors: uniqueExcept(
      [
        answer(`\\cos(x + y) - ${ay2} \\sin x`, `\\cos(x + y) - ${twoAy} \\cos x`), // نسيان نقل cos(x+y)
        answer(`-\\cos(x + y) + ${ay2} \\sin x`, `\\cos(x + y) - ${twoAy} \\cos x`), // خطأ إشارة مشتقة cos x
        answer(`-${ay2} \\sin x`, `\\cos(x + y) - ${twoAy} \\cos x`),               // زاوية بدون (1 + y')
        answer(`-\\cos(x + y) - ${ay2} \\sin x`, `\\cos(x + y) + ${twoAy} \\cos x`),
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      {
        text: "الزاوية فيها y فنضرب في (1 + y')، والطرف الأيمن حاصل ضرب:",
        math: `(1 + y')\\cos(x + y) = ${twoAy}y' \\cos x - ${ay2} \\sin x`,
      },
      {
        text: "نجمع حدود y' في طرف:",
        math: `y'(\\cos(x + y) - ${twoAy} \\cos x) = -\\cos(x + y) - ${ay2} \\sin x`,
      },
      { text: 'نقسم على القوس:', math: correct },
    ],
  };
}

/** g(x) + a x sin g(x) = x² + b x */
function functionForm(a: number, b: number): TemplateOutput {
  const correct = `g'(0) = ${b}`;
  const given = `g(x) + ${a}x \\sin g(x) = x^{2} + ${b}x`;
  return {
    questionText: "Find g'(0):",
    mathExpression: given,
    correct,
    distractors: uniqueExcept(
      [`g'(0) = 0`, `g'(0) = ${a + b}`, `g'(0) = -${b}`, `g'(0) = ${a}`, `g'(0) = ${b - a}`],
      correct
    ),
    optionFormat: 'math',
    steps: [
      {
        text: 'نشتق الطرفين، والحد الأوسط حاصل ضرب:',
        math: `g'(x) + ${a} \\sin g(x) + ${a}x g'(x) \\cos g(x) = 2x + ${b}`,
      },
      { text: 'نعوّض x = 0، فيختفي الحد الذي فيه x:', math: `g'(0) + ${a} \\sin g(0) = ${b}` },
      { text: 'من المعادلة الأصلية عند x = 0 نجد g(0):', math: 'g(0) = 0' },
      { text: 'و sin 0 = 0، فيبقى:', math: correct },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  const { kind, a, b } = v;
  if (kind === 0) return linearForm(a, b);
  if (kind === 1) return angleForm(a);
  return functionForm(a, b);
}

export const implicitTrigTemplate: QuestionTemplate = {
  id: 'derivatives:implicit-trig',
  name: 'الاشتقاق الضمني مع الدوال المثلثية',
  type: 'derivative',
  difficulty: 'hard',
  variables,
  constraint: (v) => v.a !== v.b,
  generate,
};

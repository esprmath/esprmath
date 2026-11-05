// src/lib/questions/templates/derivatives/electric-current.ts
// مثل Q-19 في شابتر 2.7: Q(t) = t³ - 2t² + 6t + 2
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, uniqueExcept } from '../utils';
import { poly } from './helpers';

const variables: VariableDefinition[] = [
  { name: 'a', min: 1, max: 5, integer: true },
  { name: 'b', min: 3, max: 12, integer: true },
  { name: 'c', min: 1, max: 9, integer: true },
  { name: 'T', min: 1, max: 4, integer: true }, // الزمن المطلوب في الفقرة (a)
];

function generate(v: Record<string, number>): TemplateOutput {
  const { a, b, c, T } = v;

  const q = poly([[1, 3], [-a, 2], [b, 1], [c, 0]], 't');
  const current = poly([[3, 2], [-2 * a, 1], [b, 0]], 't');
  const value = 3 * T * T - 2 * a * T + b;
  const lowest = frac(a, 3)!;

  const answer = (i: number, time: string) =>
    `\\text{(a) } ${i}\\ \\text{A},\\quad \\text{(b) } t = ${time}\\ \\text{s}`;

  const correct = answer(value, lowest);

  const distractors = uniqueExcept(
    [
      answer(T ** 3 - a * T * T + b * T + c, lowest), // تعويض Q بدل مشتقتها
      answer(value, frac(2 * a, 3)!),                 // حل خاطئ لمعادلة dI/dt = 0
      answer(value, frac(a, 6)!),
      answer(6 * T - 2 * a, lowest),                  // استخدام dI/dt بدل I
      answer(value + c, lowest),                      // إبقاء الثابت في المشتقة
    ],
    correct
  );

  return {
    questionText: `The quantity of charge Q in coulombs that has passed through a point in a wire up to time t (in seconds) is given below. (a) Find the current when t = ${T} s. (b) At what time is the current lowest?`,
    mathExpression: `Q(t) = ${q}`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      { text: 'التيار مشتقة الشحنة:', math: `I = \\frac{dQ}{dt} = ${current}` },
      { text: 'الفقرة (a): نعوّض الزمن:', math: `I(${T}) = 3(${T})^{2} - ${2 * a}(${T}) + ${b} = ${value}\\ \\text{A}` },
      {
        text: 'الفقرة (b): أقل قيمة عندما dI/dt = 0:',
        math: `${poly([[6, 1], [-2 * a, 0]], 't')} = 0 \\Rightarrow t = ${lowest}\\ \\text{s}`,
      },
    ],
  };
}

export const electricCurrentTemplate: QuestionTemplate = {
  id: 'derivatives:electric-current',
  name: 'الشحنة والتيار الكهربائي',
  type: 'derivative',
  difficulty: 'medium',
  variables,
  constraint: (v) => 3 * v.b > v.a * v.a, // التيار موجب في كل الأوقات
  generate,
};

// src/lib/questions/templates/derivatives/torricelli.ts
// شكلان من Q-18 في شابتر 2.7: المعدل عند زمن معين، ومتى يكون الأسرع والأبطأ
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept } from '../utils';
import { round2 } from './helpers';

const DRAIN_TIMES = [16, 24, 40, 80];

const variables: VariableDefinition[] = [
  { name: 'form', min: 0, max: 1, integer: true },
  { name: 'timeIndex', min: 0, max: 3, integer: true }, // زمن التفريغ T
  { name: 'k', min: 1, max: 10, integer: true },        // السعة = 25k × T
  { name: 'part', min: 1, max: 7, integer: true },      // الزمن المطلوب = part/8 من T
];

/** الأسرع والأبطأ */
function extremesForm(V0: number, T: number, slope: number): TemplateOutput {
  const answer = (fast: number, slow: number) =>
    `\\text{fastest: } t = ${fast},\\quad \\text{slowest: } t = ${slow}`;
  const correct = answer(0, T);

  return {
    questionText: `A tank holds ${V0} gallons of water, which drains from the bottom in ${T} minutes. Torricelli's Law gives the volume V remaining after t minutes. At what time is the water flowing out the fastest? The slowest?`,
    mathExpression: `V = ${V0}\\left(1 - \\frac{t}{${T}}\\right)^{2}, \\quad 0 \\le t \\le ${T}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(T, 0),         // عكس الأسرع والأبطأ
        answer(T / 2, T),
        answer(0, T / 2),
        answer(T / 2, 0),
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نشتق V لنجد معدل التفريغ:', math: `\\frac{dV}{dt} = -${slope}\\left(1 - \\frac{t}{${T}}\\right)` },
      { text: 'مقدار المعدل أكبر ما يكون عند بداية التفريغ:', math: `t = 0 \\Rightarrow -${slope}\\ \\text{gal/min}` },
      { text: 'وأصغر ما يكون عند نهاية التفريغ:', math: `t = ${T} \\Rightarrow 0\\ \\text{gal/min}` },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  const { form, timeIndex, k, part } = v;
  const T = DRAIN_TIMES[timeIndex];
  const V0 = 25 * k * T;
  const t = (part * T) / 8;
  const slope = (2 * V0) / T; // 2V0/T

  if (form === 1) return extremesForm(V0, T, slope);

  const remaining = 1 - t / T;
  const answer = (value: number) => `${round2(value)}\\ \\text{gal/min}`;
  const correct = answer(-slope * remaining);

  const distractors = uniqueExcept(
    [
      answer(slope * remaining),            // نسيان إشارة مشتقة القوس
      answer(-2 * V0 * remaining),          // نسيان الضرب في مشتقة القوس
      answer((-slope * remaining) / 2),     // نسيان إنزال القوة 2
      answer(-slope),                       // نسيان تعويض الزمن
      answer(-slope * (t / T)),             // تعويض 1 - t/T بدل t/T
    ],
    correct
  );

  return {
    questionText: `A tank holds ${V0} gallons of water, which drains from the bottom in ${T} minutes. Torricelli's Law gives the volume V remaining after t minutes. Find the rate at which water is draining after ${t} minutes.`,
    mathExpression: `V = ${V0}\\left(1 - \\frac{t}{${T}}\\right)^{2}, \\quad 0 \\le t \\le ${T}`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      {
        text: 'نشتق V بقاعدة السلسلة (Chain Rule):',
        math: `\\frac{dV}{dt} = ${V0}(2)\\left(1 - \\frac{t}{${T}}\\right)\\left(-\\frac{1}{${T}}\\right)`,
      },
      { text: 'نضرب المعاملات:', math: `\\frac{dV}{dt} = -${slope}\\left(1 - \\frac{t}{${T}}\\right)` },
      {
        text: 'نعوّض الزمن. والإشارة السالبة تعني أن الماء ينقص:',
        math: `-${slope}\\left(1 - \\frac{${t}}{${T}}\\right) = ${correct}`,
      },
    ],
  };
}

export const torricelliTemplate: QuestionTemplate = {
  id: 'derivatives:torricelli',
  name: 'معدل تفريغ الخزان (قانون تورشيلي)',
  type: 'derivative',
  difficulty: 'medium',
  variables,
  generate,
};

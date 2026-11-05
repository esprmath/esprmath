// src/lib/questions/templates/derivatives/particle-motion.ts
// شكلان من Example 1 في شابتر 2.7: s = t³ - 6t² + 9t
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept } from '../utils';
import { poly } from './helpers';

const variables: VariableDefinition[] = [
  { name: 'form', min: 0, max: 1, integer: true },
  { name: 'p', min: 1, max: 4, integer: true }, // أول لحظة وقوف
  { name: 'q', min: 2, max: 7, integer: true }, // ثاني لحظة وقوف
  { name: 'T', min: 2, max: 6, integer: true }, // الزمن المطلوب في شكل السرعة
];

/** (c) و (d): متى يقف الجسم، ومتى يتحرك للأمام */
function directionForm(p: number, q: number, s: string, vel: string): TemplateOutput {
  const sum = p + q;
  const product = p * q;
  const answer = (rest: string, forward: string) =>
    `\\text{(a) } ${rest},\\quad \\text{(b) } ${forward}`;
  const rest = `t = ${p}, ${q}`;
  const outside = `t < ${p} \\text{ or } t > ${q}`;
  const between = `${p} < t < ${q}`;

  const correct = answer(rest, outside);

  return {
    questionText: 'The position of a particle is given by the equation below, where t is in seconds and s in meters. (a) When is the particle at rest? (b) When is it moving forward?',
    mathExpression: `s = ${s}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(rest, between),                     // عكس منطقة الإشارة الموجبة
        answer(`t = 0, ${sum}`, outside),          // جمع الجذرين بدل إيجادهما
        answer(`t = ${product}`, outside),
        answer(`t = ${p}`, `t > ${p}`),            // نسيان الجذر الثاني
        answer(`t = ${q}`, `t > ${q}`),
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'السرعة مشتقة الموقع:', math: `v(t) = \\frac{ds}{dt} = ${vel}` },
      { text: 'الفقرة (a): الجسم واقف عندما v(t) = 0:', math: `3(t - ${p})(t - ${q}) = 0 \\Rightarrow ${rest}` },
      { text: 'الفقرة (b): يتحرك للأمام عندما v(t) > 0، ومن جدول الإشارة:', math: outside },
    ],
  };
}

/** (a) و (b): السرعة عند أي زمن وبعد زمن محدد */
function velocityForm(p: number, q: number, T: number, s: string, vel: string): TemplateOutput {
  const sum = p + q;
  const product = p * q;
  const value = 3 * T * T - 3 * sum * T + 3 * product;
  const position = T ** 3 - (3 * sum * T * T) / 2 + 3 * product * T;
  const answer = (velocity: string, at: number) =>
    `\\text{(a) } v(t) = ${velocity},\\quad \\text{(b) } v(${T}) = ${at}\\ \\text{m/s}`;
  const correct = answer(vel, value);

  return {
    questionText: `The position of a particle is given by the equation below, where t is in seconds and s in meters. (a) Find the velocity at time t. (b) What is the velocity after ${T} s?`,
    mathExpression: `s = ${s}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(vel, position),                                       // تعويض الموقع بدل السرعة
        answer(vel, value + 3),
        answer(poly([[3, 2], [-3 * sum, 1]], 't'), value - 3 * product), // إهمال الحد الثالث
        answer(poly([[3, 2], [3 * sum, 1], [3 * product, 0]], 't'), 3 * T * T + 3 * sum * T + 3 * product), // خطأ في الإشارة
        answer(s, position),                                         // عدم الاشتقاق
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'السرعة مشتقة الموقع:', math: `v(t) = \\frac{ds}{dt} = ${vel}` },
      { text: 'نعوّض الزمن المطلوب:', math: `v(${T}) = ${value}\\ \\text{m/s}` },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  const { form, p, q, T } = v;
  const sum = p + q; // زوجي دائمًا حتى تبقى معاملات s أعدادًا صحيحة
  const product = p * q;
  const s = poly([[1, 3], [(-3 * sum) / 2, 2], [3 * product, 1]], 't');
  const vel = poly([[3, 2], [-3 * sum, 1], [3 * product, 0]], 't');

  return form === 0 ? directionForm(p, q, s, vel) : velocityForm(p, q, T, s, vel);
}

export const particleMotionTemplate: QuestionTemplate = {
  id: 'derivatives:particle-motion',
  name: 'حركة جسيم على خط مستقيم',
  type: 'derivative',
  difficulty: 'medium',
  variables,
  constraint: (v) => v.p < v.q && (v.p + v.q) % 2 === 0,
  generate,
};

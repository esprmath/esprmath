// src/lib/questions/templates/derivatives/instantaneous-velocity.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept } from '../utils';

const G = 9.8;

const variables: VariableDefinition[] = [
  { name: 't', min: 2, max: 5, integer: true }, // زمن الفقرة (a)
  { name: 'm', min: 3, max: 7, integer: true }, // زمن السقوط الكلي (يحدد الارتفاع)
];

/** تقريب لتجنب أخطاء الفاصلة العائمة (مثل 9.8 × 3 = 29.400000000000002) */
const r = (x: number) => Number(x.toFixed(2));

const answer = (a: number, b: number) =>
  `\\text{(a) } ${a}\\ \\text{m/s},\\quad \\text{(b) } ${b}\\ \\text{m/s}`;

function generate(v: Record<string, number>): TemplateOutput {
  const { t, m } = v;

  const vT = r(G * t);        // (a) السرعة بعد t ثانية
  const vImpact = r(G * m);   // (b) السرعة عند الاصطدام (زمن السقوط = m ثانية)
  const h = r(4.9 * m * m);   // الارتفاع

  const correct = answer(vT, vImpact);

  const distractors = uniqueExcept(
    [
      answer(vImpact, vT),
      answer(r(vT + G), vImpact),
      answer(vT, r(vImpact + G)),
      answer(r(G * (t + 1)), vImpact),
      answer(r(4.9 * t * t), vImpact), // خطأ: استخدام معادلة الموقع بدل السرعة
      answer(vT, r(vImpact - G)),
      answer(vT, h),                   // خطأ: اعتبار الارتفاع هو السرعة
    ],
    correct
  );

  return {
    questionText: `A ball is dropped from an upper observation deck, ${h} m above the ground. (a) What is the velocity of the ball after ${t} seconds? (b) How fast is the ball traveling when it hits the ground?`,
    mathExpression: `h = ${h}\\ \\text{m}, \\quad g = ${G}\\ \\text{m/s}^2`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      {
        text: 'الفقرة (a): السرعة اللحظية للجسم الساقط تساوي g × t:',
        math: `v(${t}) = ${G} \\times ${t} = ${vT}\\ \\text{m/s}`,
      },
      {
        text: 'الفقرة (b): السرعة لحظة الاصطدام بالأرض:',
        math: `v = \\sqrt{2gh} = \\sqrt{2 \\times ${G} \\times ${h}}`,
      },
      {
        text: 'نحسب ما تحت الجذر:',
        math: `v = \\sqrt{${r(2 * G * h)}} = ${vImpact}\\ \\text{m/s}`,
      },
    ],
  };
}

export const instantaneousVelocityTemplate: QuestionTemplate = {
  id: 'derivatives:instantaneous-velocity',
  name: 'التطبيقات الفيزيائية (السرعة اللحظية)',
  type: 'derivative',
  difficulty: 'medium',
  variables,
  constraint: (v) => v.t < v.m, // الجسم لازم ما يكون وصل الأرض قبل الزمن t
  generate,
};
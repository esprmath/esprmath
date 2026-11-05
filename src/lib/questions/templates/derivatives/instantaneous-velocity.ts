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

  const vT = r(-G * t);       // (a) السرعة المتجهة بعد t ثانية: سالبة لأن الجسم نازل، مثل المقطع
  const vImpact = r(-G * m);  // السرعة المتجهة عند الاصطدام (زمن السقوط = m ثانية)
  const speed = r(G * m);     // (b) "How fast" تسأل عن مقدار السرعة، فتكون موجبة
  const h = r(4.9 * m * m);   // الارتفاع

  const correct = answer(vT, speed);

  // المقطع يكتب سرعة الاصطدام بالسالب، فلا نضع قيمة سالبة في (b) حتى لا تكون فخًا لمن تبعه
  const distractors = uniqueExcept(
    [
      answer(r(G * t), speed),         // خطأ: نسيان إشارة السرعة في (a)
      answer(vImpact, r(G * t)),       // خطأ: تبديل الزمنين
      answer(r(vT - G), speed),
      answer(vT, r(speed + G)),
      answer(r(-4.9 * t * t), speed),  // خطأ: استخدام معادلة الموقع بدل السرعة
      answer(vT, r(speed - G)),
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
        text: 'ابنِ دالة الموقع: dropped تعني أن السرعة الابتدائية صفر:',
        math: `s(t) = ${h} - 4.9t^2`,
      },
      {
        text: 'احسب الميل بالنهاية:',
        math: `v(a) = \\lim_{t \\to a} \\frac{s(t) - s(a)}{t - a} = \\lim_{t \\to a} \\frac{-4.9(t^2 - a^2)}{t - a} = \\lim_{t \\to a} -4.9(t + a) = -9.8a`,
      },
      {
        text: 'الفقرة (a): عوّض الزمن المطلوب:',
        math: `v(${t}) = -9.8(${t}) = ${vT}\\ \\text{m/s}`,
      },
      {
        text: 'الفقرة (b): للاصطدام، حل s(t) = 0 لإيجاد الزمن:',
        math: `${h} - 4.9t^2 = 0 \\Rightarrow t = ${m}\\ \\text{s}`,
      },
      {
        text: 'عوّض الزمن. How fast تسأل عن مقدار السرعة، فنأخذ القيمة الموجبة:',
        math: `v(${m}) = -9.8(${m}) = ${vImpact} \\Rightarrow |v| = ${speed}\\ \\text{m/s}`,
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
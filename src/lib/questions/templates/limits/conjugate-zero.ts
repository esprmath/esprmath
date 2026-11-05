// src/lib/questions/templates/limits/conjugate-zero.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, linear, uniqueExcept, DNE } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 1, max: 4, integer: true },
  { name: 'm', min: 1, max: 5, integer: true },
  { name: 'targetRoot', min: 2, max: 4, integer: true },
  { name: 'flipNum', min: 0, max: 1, integer: true }, // 1 → البسط: t − √
  { name: 'flipDen', min: 0, max: 1, integer: true }, // 1 → المقام: a − x
  // يُضاف آخر القائمة حتى لا تتغير أرقام الأسئلة القديمة: 0 = الشكل الأصلي، 1 = مثل Q-27
  { name: 'form', min: 0, max: 1, integer: true },
];

/** مثل Q-27: lim (t → 0) (√(1 + t) - √(1 - t)) / t */
function twoRootsForm(m: number, k: number): TemplateOutput {
  const mt = m === 1 ? 't' : `${m}t`;
  const plus = `\\sqrt{${k * k} + ${mt}}`;
  const minus = `\\sqrt{${k * k} - ${mt}}`;
  const correct = frac(m, k)!;

  return {
    questionText: 'Evaluate the limit, if it exists:',
    mathExpression: `\\lim_{t \\to 0} \\frac{${plus} - ${minus}}{t}`,
    correct,
    distractors: uniqueExcept(
      [frac(m, 2 * k), frac(2 * m, k), frac(k, m), '0', '1', frac(-m, k), DNE],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'بالتعويض المباشر نحصل على صيغة غير معينة:', math: '\\frac{0}{0}' },
      { text: 'نضرب البسط والمقام في المرافق (Conjugate):', math: `${plus} + ${minus}` },
      {
        text: 'بفرق المربعين يصبح البسط:',
        math: `(${k * k} + ${mt}) - (${k * k} - ${mt}) = ${2 * m === 1 ? '' : 2 * m}t`,
      },
      { text: 'نختصر t:', math: `\\lim_{t \\to 0} \\frac{${2 * m}}{${plus} + ${minus}}` },
      { text: 'نعوّض t = 0:', math: `\\frac{${2 * m}}{${k} + ${k}} = ${correct}` },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  if (v.form === 1) return twoRootsForm(v.m, v.targetRoot);
  return originalForm(v);
}

function originalForm(v: Record<string, number>): TemplateOutput {
  const { a, m, targetRoot: t } = v;
  const flipNum = v.flipNum === 1;
  const flipDen = v.flipDen === 1;

  const c = t * t - m * a;
  const radicand = linear(m, c);
  const root = `\\sqrt{${radicand}}`;
  const xMinusA = linear(1, -a);
  const factor = `${m === 1 ? '' : m}(${xMinusA})`;

  const numLatex = flipNum ? `${t} - ${root}` : `${root} - ${t}`;
  const denLatex = flipDen ? `${a} - x` : xMinusA;

  // قلب واحد فقط (بسط أو مقام) يعكس الإشارة، والقلبان معًا يلغيان بعض
  const sign = (flipNum ? -1 : 1) * (flipDen ? -1 : 1);
  const neg = sign < 0 ? '-' : '';
  const num = sign * m;
  const den = 2 * t;
  const correct = frac(num, den)!;

  const distractors = uniqueExcept(
    [
      frac(-num, den), // خطأ الإشارة (الأشهر)
      frac(den, num),
      frac(-den, num),
      frac(num + 1, den),
      frac(num - 1, den),
      frac(num, den + 1),
      frac(num, den - 1),
      frac(num * 2, den),
      frac(num, den * 2),
      '0',
      '1',
      '-1',
      '2',
      '-2',
      DNE,
    ],
    correct
  );

  return {
    questionText: 'أوجد قيمة النهاية التالية باستخدام طريقة المرافق:',
    mathExpression: `\\lim_{x \\to ${a}} \\frac{${numLatex}}{${denLatex}}`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      { text: 'بالتعويض المباشر نحصل على صيغة غير معينة:', math: '\\frac{0}{0}' },
      {
        text: 'نضرب البسط والمقام في مرافق البسط:',
        math: flipNum ? `${t} + ${root}` : `${root} + ${t}`,
      },
      {
        text: 'البسط بعد التبسيط (فرق مربعين):',
        math: flipNum
          ? `${t * t} - (${radicand}) = -${factor}`
          : `${radicand} - ${t * t} = ${factor}`,
      },
      ...(flipDen
        ? [{ text: 'نخرج إشارة سالبة من المقام:', math: `${a} - x = -(${xMinusA})` }]
        : []),
      { text: 'نختصر العامل المشترك:', math: `${neg}\\frac{${m}}{${root} + ${t}}` },
      {
        text: `بالتعويض بـ x = ${a} يصبح الجذر ${t}، والناتج النهائي:`,
        math: `${neg}\\frac{${m}}{${t} + ${t}} = ${correct}`,
      },
    ],
  };
}

export const conjugateZeroTemplate: QuestionTemplate = {
  id: 'limits:conjugate-zero',
  name: 'طريقة المرافق (حالة 0/0)',
  type: 'limits',
  difficulty: 'medium',
  variables,
  generate,
};
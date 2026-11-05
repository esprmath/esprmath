// src/lib/questions/templates/derivatives/cube-volume.ts
// شكلان من Q-12 في شابتر 2.7: قيمة dV/dx ومعناها
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'form', min: 0, max: 1, integer: true },
  { name: 'a', min: 2, max: 12, integer: true }, // طول الضلع بالمليمتر
];

function generate(v: Record<string, number>): TemplateOutput {
  const { form, a } = v;
  const unit = form === 0 ? '\\ \\text{mm}^{3}/\\text{mm}' : '\\ \\text{mm}^{3}';
  const answer = (value: number) => `${value}${unit}`;
  const correct = answer(3 * a * a);

  const distractors = uniqueExcept(
    [
      answer(a * a * a),     // حساب الحجم بدل المشتقة
      answer(3 * a),         // نسيان التربيع
      answer(2 * a),
      answer(a * a),         // نسيان إنزال القوة
      answer(6 * a),         // الاشتقاق مرتين
    ],
    correct
  );

  const steps = [
    { text: 'نكتب قانون حجم المكعب ونشتق:', math: `V = x^{3} \\Rightarrow \\frac{dV}{dx} = 3x^{2}` },
    { text: 'نعوّض طول الضلع:', math: `\\frac{dV}{dx} = 3(${a})^{2} = ${3 * a * a}\\ \\text{mm}^{3}/\\text{mm}` },
    { text: `المعنى: عند الضلع ${a} mm، يزيد الحجم تقريبًا ${3 * a * a} mm³ لكل زيادة 1 mm في الضلع.` },
  ];

  if (form === 1) {
    return {
      questionText: `A crystal grows in the shape of a cube with side length x. Use dV/dx to estimate how much the volume increases when x grows from ${a} mm to ${a + 1} mm.`,
      mathExpression: `V = x^{3}`,
      correct,
      distractors,
      optionFormat: 'math',
      steps,
    };
  }

  return {
    questionText: `A crystal grows in the shape of a cube. If V is the volume of the cube with side length x, calculate dV/dx when x = ${a} mm.`,
    mathExpression: `V = x^{3}, \\quad x = ${a}\\ \\text{mm}`,
    correct,
    distractors,
    optionFormat: 'math',
    steps,
  };
}

export const cubeVolumeTemplate: QuestionTemplate = {
  id: 'derivatives:cube-volume',
  name: 'معدل تغير حجم المكعب',
  type: 'derivative',
  difficulty: 'easy',
  variables,
  generate,
};

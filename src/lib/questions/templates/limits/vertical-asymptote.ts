// src/lib/questions/templates/limits/vertical-asymptote.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept, DNE } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 2, max: 5, integer: true }, // الجذر الموجب (مثل 2, 3, 4, 5)
];

function generate(v: Record<string, number>): TemplateOutput {
  const { a } = v;
  const aSquared = a * a;

  const mathExpr = `y = \\frac{1}{x^2 - ${aSquared}}`;
  const correct = `x = ${a} \\text{ و } x = -${a}`;

  const distractors = uniqueExcept([
    `x = ${aSquared} \\text{ و } x = -${aSquared}`, // خطأ شائع: استخدام المربع بدلاً من الجذر
    `x = ${a}`, // خطأ: نسيان الجذر السالب
    `x = -${a}`, // خطأ: نسيان الجذر الموجب
    DNE,
    `x = 0`
  ], correct);

  return {
    questionText: "أوجد معادلتي خطي التقارب الرأسيين للدالة التالية:",
    mathExpression: mathExpr,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      { text: "نساوي المقام بالصفر لإيجاد نقاط عدم التعيين:", math: `x^2 - ${aSquared} = 0` },
      { text: "نحل المعادلة (فرق بين مربعين):", math: `x^2 = ${aSquared} \\implies x = \\pm ${a}` },
      { text: "إذن خطوط التقارب الرأسية هي:", math: `x = ${a} \\text{ و } x = -${a}` }
    ]
  };
}

export const verticalAsymptoteTemplate: QuestionTemplate = {
  id: 'limits:vertical-asymptote',
  name: 'إيجاد خطوط التقارب الرأسية',
  type: 'limits',
  difficulty: 'easy',
  variables,
  generate,
};
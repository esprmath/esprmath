// src/lib/questions/templates/continuity/unknown-value.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, uniqueExcept } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 1, max: 4, integer: true },
  { name: 'gA', min: 2, max: 6, integer: true }, // g(a)
  { name: 'c1', min: 2, max: 5, integer: true }, // معامل f(x)
  { name: 'fA', min: 2, max: 6, integer: true }, // الإجابة الصحيحة f(a)
];

function generate(v: Record<string, number>): TemplateOutput {
  const { a, gA, c1, fA } = v;
  const factor = c1 + gA;
  const L = fA * factor; // يضمن أن القسمة صحيحة

  const given = `g(${a}) = ${gA}, \\quad \\lim_{x \\to ${a}} \\left[ ${c1}f(x) + f(x)g(x) \\right] = ${L}`;
  const correct = `f(${a}) = ${fA}`;

  const byC1 = frac(L, c1); // خطأ: تجاهل g
  const byG = frac(L, gA);  // خطأ: تجاهل المعامل c1

  const distractors = uniqueExcept(
    [
      `f(${a}) = ${L}`,
      `f(${a}) = ${gA}`,
      byC1 === null ? null : `f(${a}) = ${byC1}`,
      byG === null ? null : `f(${a}) = ${byG}`,
      `f(${a}) = ${fA + 1}`,
      `f(${a}) = ${fA - 1}`,
      `f(${a}) = 0`,
    ],
    correct
  );

  return {
    questionText: `Suppose f and g are continuous functions such that the following holds. Find f(${a}):`,
    mathExpression: given,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      {
        text: 'بما أن f و g متصلتان، نعوض مباشرة في النهاية:',
        math: `${c1}f(${a}) + f(${a})g(${a}) = ${L}`,
      },
      { text: 'نعوض بقيمة g(a):', math: `${c1}f(${a}) + ${gA}f(${a}) = ${L}` },
      { text: 'نجمع المعاملات:', math: `${factor}f(${a}) = ${L}` },
      { text: 'نقسم على المعامل:', math: `f(${a}) = \\frac{${L}}{${factor}} = ${fA}` },
    ],
  };
}

export const unknownValueTemplate: QuestionTemplate = {
  id: 'continuity:unknown-value',
  name: 'إيجاد قيمة دالة مجهولة باستخدام خصائص الاتصال',
  type: 'continuity',
  difficulty: 'medium',
  variables,
  generate,
};
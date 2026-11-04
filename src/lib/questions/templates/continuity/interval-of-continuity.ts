// src/lib/questions/templates/continuity/interval-of-continuity.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'rootVal', min: 3, max: 6, integer: true }, // القيمة التي يساويها الجذر عند عدم الاتصال
  { name: 'diff', min: 1, max: 4, integer: true },    // نقطتا عدم الاتصال ±diff
];

function generate(v: Record<string, number>): TemplateOutput {
  const { rootVal: r, diff: d } = v;
  const c = r * r - d * d; // موجب دائمًا بسبب constraint

  const base = `\\text{Continuous for all } x`;
  const correct = `${base} \\text{ except } x = \\pm ${d}`;

  const distractors = uniqueExcept(
    [
      `${base} \\text{ except } x = \\pm ${r}`,
      `${base} \\text{ except } x = ${d}`,
      `${base} \\text{ except } x = -${d}`,
      `${base} \\text{ except } x = \\pm ${d * d}`,
      `${base} \\text{ except } x = \\pm ${c}`,
      `${base} \\text{ except } x = 0`,
      `\\text{Continuous everywhere on } (-\\infty, \\infty)`,
      `\\text{Continuous only at } x = 0`,
    ],
    correct
  );

  return {
    questionText: 'Where is the following function continuous?',
    mathExpression: `F(x) = \\frac{1}{\\sqrt{x^2 + ${c}} - ${r}}`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      {
        text: 'ما تحت الجذر موجب دائماً، فالدالة معرّفة لكل x إلا حيث يتصفّر المقام:',
        math: `x^2 + ${c} > 0`,
      },
      { text: 'نساوي المقام بالصفر:', math: `\\sqrt{x^2 + ${c}} - ${r} = 0` },
      { text: 'ننقل الثابت للطرف الآخر:', math: `\\sqrt{x^2 + ${c}} = ${r}` },
      { text: 'نربع الطرفين:', math: `x^2 + ${c} = ${r * r} \\implies x^2 = ${d * d}` },
      { text: 'إذن نقاط عدم الاتصال هي:', math: `x = \\pm ${d}` },
      { text: 'والدالة متصلة في كل الأعداد الحقيقية ما عدا هاتين النقطتين.' },
    ],
  };
}

export const intervalOfContinuityTemplate: QuestionTemplate = {
  id: 'continuity:interval-of-continuity',
  name: 'إيجاد فترات الاتصال للدوال المركبة',
  type: 'continuity',
  difficulty: 'medium',
  variables,
  constraint: (v) => v.rootVal > v.diff, // يضمن أن x^2 + c موجب دائماً
  generate,
};
// src/lib/questions/templates/derivatives/implicit-cubic.ts
// شكلان من شابتر 2.6: Ex 2 (x³ + y³ = 6xy)، و Ex 1 (الاشتقاق ثم المماس للدائرة)
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { frac, uniqueExcept } from '../utils';
import { monomial } from './helpers';

const variables: VariableDefinition[] = [
  { name: 'form', min: 0, max: 1, integer: true },
  { name: 'c', min: 1, max: 6, integer: true }, // المعامل الأيمن = 3c حتى يختصر الناتج على 3
];

// نقاط صحيحة على دائرة نصف قطرها r
const CIRCLE_POINTS: [number, number, number][] = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 12, 13],
  [12, 5, 13],
];

/** مثل Ex 2: x³ + y³ = 6xy */
function cubicForm(c: number): TemplateOutput {
  const k = 3 * c;
  const cy = monomial(c, 1, 'y');
  const cx = monomial(c, 1, 'x');
  const answer = (num: string, den: string) => `y' = \\frac{${num}}{${den}}`;
  const correct = answer(`${cy} - x^{2}`, `y^{2} - ${cx}`);

  return {
    questionText: "Find y' by implicit differentiation:",
    mathExpression: `x^{3} + y^{3} = ${k}xy`,
    correct,
    distractors: uniqueExcept(
      [
        answer(`x^{2} - ${cy}`, `y^{2} - ${cx}`), // خطأ إشارة عند نقل الحدود
        answer(`${cy} + x^{2}`, `y^{2} + ${cx}`), // عدم تغيير الإشارة عند النقل
        answer(`-x^{2}`, 'y^{2}'),                // إهمال مشتقة الضرب xy
        answer(`${cy} - x^{2}`, 'y^{2}'),         // نسيان y' في مشتقة xy
        answer(`${cx} - y^{2}`, `x^{2} - ${cy}`), // عكس x و y
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      {
        text: "نشتق الطرفين. كل حد فيه y يضرب في y'، و xy حاصل ضرب:",
        math: `3x^{2} + 3y^{2}y' = ${k}(y + xy')`,
      },
      { text: "نضع حدود y' في طرف والباقي في الطرف الثاني:", math: `3y^{2}y' - ${k}xy' = ${k}y - 3x^{2}` },
      { text: "نأخذ y' عاملًا مشتركًا (Factor):", math: `y'(3y^{2} - ${k}x) = ${k}y - 3x^{2}` },
      { text: 'نقسم ونختصر على 3:', math: correct },
    ],
  };
}

/** مثل Ex 1b: مماس x² + y² = 25 عند (3, 4) */
function tangentForm(c: number): TemplateOutput {
  const [x0, y0, r] = CIRCLE_POINTS[(c - 1) % CIRCLE_POINTS.length];
  const answer = (a: number, b: number, k: number) => `${a}x + ${b}y = ${k}`;
  const correct = answer(x0, y0, r * r);
  const slope = frac(-x0, y0)!;

  return {
    questionText: `Find an equation of the tangent to the circle at the point (${x0}, ${y0}):`,
    mathExpression: `x^{2} + y^{2} = ${r * r}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(y0, x0, r * r),                 // عكس الميل
        answer(x0, y0, r),                     // استخدام r بدل r²
        `${x0}x - ${y0}y = ${x0 * x0 - y0 * y0}`, // نسيان إشارة الميل
        answer(x0, y0, x0 + y0),               // خطأ في جمع الثابت
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نشتق ضمنيًا:', math: `\\frac{dy}{dx} = -\\frac{x}{y}` },
      { text: 'نعوّض النقطة لنجد الميل:', math: `m = ${slope}` },
      { text: 'نكتب المعادلة بصيغة Point-Slope:', math: `y - ${y0} = ${slope}(x - ${x0})` },
      { text: 'نرتبها:', math: correct },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  return v.form === 0 ? cubicForm(v.c) : tangentForm(v.c);
}

export const implicitCubicTemplate: QuestionTemplate = {
  id: 'derivatives:implicit-cubic',
  name: 'الاشتقاق الضمني',
  type: 'derivative',
  difficulty: 'medium',
  variables,
  generate,
};

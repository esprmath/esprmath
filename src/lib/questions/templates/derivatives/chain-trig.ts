// src/lib/questions/templates/derivatives/chain-trig.ts
// سبعة أشكال من مقطع 3.2: Ex 2(a)، و sin⁵(3x⁴)، و Ex 8، و Q-26، و Q-29، و Q-34، و Q-37
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept } from '../utils';
import { monomial } from './helpers';

const variables: VariableDefinition[] = [
  { name: 'form', min: 0, max: 6, integer: true },
  { name: 'kind', min: 0, max: 2, integer: true }, // sin أو cos أو tan
  { name: 'm', min: 2, max: 5, integer: true },    // قوة الدالة
  { name: 'a', min: 2, max: 5, integer: true },    // معامل الزاوية
  { name: 'n', min: 2, max: 4, integer: true },    // قوة x في الزاوية
];

const TRIG = [
  { fn: '\\sin', deriv: (angle: string) => `\\cos(${angle})`, negative: false },
  { fn: '\\cos', deriv: (angle: string) => `\\sin(${angle})`, negative: true },
  { fn: '\\tan', deriv: (angle: string) => `\\sec^{2}(${angle})`, negative: false },
];

/** مثل المثال المكتوب: y = sin⁵(3x⁴) */
function powerFunctionAngleForm(kind: number, m: number, a: number, n: number): TemplateOutput {
  const { fn, deriv, negative } = TRIG[kind];

  const angle = monomial(a, n);
  const dAngle = monomial(a * n, n - 1);
  const dFn = deriv(angle);
  const power = (p: number) => (p === 1 ? `${fn}(${angle})` : `${fn}^{${p}}(${angle})`);
  const sign = negative ? '-' : '';
  const wrongSign = negative ? '' : '-';

  const answer = (coef: number, xPower: number, p: number, signText = sign) =>
    `y' = ${signText}${monomial(coef, xPower)} ${power(p)} ${dFn}`;

  const correct = answer(m * a * n, n - 1, m - 1);

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `y = ${fn}^{${m}}(${angle})`,
    correct,
    distractors: uniqueExcept(
      [
        `y' = ${sign}${m} ${power(m - 1)} ${dFn}`,   // نسيان مشتقة الزاوية
        answer(a * n, n - 1, m - 1),                  // نسيان إنزال القوة
        answer(m * a * n, n - 1, m - 1, wrongSign),   // خطأ إشارة مشتقة الدالة
        answer(m * a * n, n - 1, m),                  // نسيان إنقاص القوة
        `y' = ${sign}${monomial(m * a * n, n - 1)} ${dFn}`, // نسيان الدالة المرفوعة
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'Power: ننزل القوة وننقصها 1:', math: `${m} ${power(m - 1)}` },
      { text: 'Function: نشتق الدالة ونترك الزاوية كما هي:', math: `${sign}${dFn}` },
      { text: 'Angle: نضرب في مشتقة الزاوية:', math: dAngle },
      { text: 'نجمع الثلاثة ونبسّط المعاملات:', math: correct },
    ],
  };
}

/** مثل Ex 8: y = √(sec x³) */
function rootSecForm(n: number): TemplateOutput {
  const angle = `x^{${n}}`;
  const secRoot = `\\sqrt{\\sec(${angle})}`;
  const answer = (coef: string, power: number, body: string) => `y' = ${coef}${monomial(1, power)} ${body}`;
  const coef = n % 2 === 0 ? `${n / 2}` : `\\frac{${n}}{2}`;
  const coefText = coef === '1' ? '' : coef;
  const correct = answer(coefText, n - 1, `${secRoot} \\tan(${angle})`);

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `y = ${secRoot}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(coefText, n - 1, `\\sec(${angle}) \\tan(${angle})`), // فقدان الجذر
        answer(`${n}`, n - 1, `${secRoot} \\tan(${angle})`),        // نسيان 1/2
        `y' = \\frac{1}{2} ${secRoot} \\tan(${angle})`,             // نسيان مشتقة الزاوية
        answer(coefText, n - 1, `${secRoot} \\sec^{2}(${angle})`),  // خطأ في مشتقة sec
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نكتب الجذر كقوة:', math: `y = (\\sec ${angle})^{\\frac{1}{2}}` },
      {
        text: 'Power ثم Function ثم Angle:',
        math: `y' = \\frac{1}{2}(\\sec ${angle})^{-\\frac{1}{2}} \\cdot \\sec ${angle} \\tan ${angle} \\cdot ${monomial(n, n - 1)}`,
      },
      { text: 'نبسّط:', math: correct },
    ],
  };
}

/** مثل Q-29: y = cos(sec 4x) */
function nestedForm(a: number): TemplateOutput {
  const k = a + 2; // 4 إلى 7
  const inner = `\\sec ${k}x`;
  // بدون أقواس حول الزاوية حتى لا يتجاوز الخيار عرض الجوال
  const answer = (sign: string, coef: string, first: string) =>
    `y' = ${sign}${coef} ${first} \\sec ${k}x \\tan ${k}x`;
  const correct = answer('-', `${k}`, `\\sin(${inner})`);

  return {
    questionText: 'Find the derivative of the function:',
    mathExpression: `y = \\cos(${inner})`,
    correct,
    distractors: uniqueExcept(
      [
        answer('', `${k}`, `\\sin(${inner})`),  // نسيان إشارة مشتقة cos
        answer('-', '', `\\sin(${inner})`),     // نسيان مشتقة الزاوية الداخلية
        answer('-', `${k}`, `\\cos(${inner})`), // عدم اشتقاق cos
        `y' = -${k} \\sin(${inner})`,           // نسيان مشتقة sec
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نشتق الخارج: مشتقة cos ونترك الزاوية كما هي:', math: `-\\sin(${inner})` },
      { text: 'نضرب في مشتقة sec:', math: `\\sec ${k}x \\tan ${k}x` },
      { text: 'نضرب في مشتقة الزاوية الأخيرة:', math: `${k}` },
      { text: 'نجمع الثلاثة:', math: correct },
    ],
  };
}

/** مثل Q-34: y = x sin(1/x) */
function productForm(a: number): TemplateOutput {
  const frac = `\\frac{${a}}{x}`;
  const answer = (sign: '+' | '-') => `y' = \\sin\\left(${frac}\\right) ${sign} ${frac} \\cos\\left(${frac}\\right)`;
  const correct = answer('-');

  return {
    questionText: 'Find the derivative of the function:',
    mathExpression: `y = x \\sin\\left(${frac}\\right)`,
    correct,
    distractors: uniqueExcept(
      [
        answer('+'),                                     // نسيان إشارة مشتقة a/x
        `y' = \\sin\\left(${frac}\\right) + x \\cos\\left(${frac}\\right)`, // نسيان مشتقة الزاوية
        `y' = \\cos\\left(${frac}\\right)`,              // إهمال Product Rule
        `y' = \\sin\\left(${frac}\\right) - ${a}x \\cos\\left(${frac}\\right)`,
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نكتب الزاوية كقوة سالبة:', math: `y = x \\sin(${a}x^{-1})` },
      {
        text: 'Product Rule، ومشتقة الزاوية تأتي من Chain Rule:',
        math: `y' = \\sin\\left(${frac}\\right) + x \\cos\\left(${frac}\\right)(-${a}x^{-2})`,
      },
      { text: 'نبسّط:', math: correct },
    ],
  };
}

/** مثل Q-37: F(t) = tan √(1 + t²) */
function tanRootForm(c: number): TemplateOutput {
  const root = `\\sqrt{${c} + t^{2}}`;
  const answer = (num: string, bottom: string) => `F'(t) = \\frac{${num}}{${bottom}}`;
  const correct = answer(`t \\sec^{2}(${root})`, root);

  return {
    questionText: 'Find the derivative of the function:',
    mathExpression: `F(t) = \\tan(${root})`,
    correct,
    distractors: uniqueExcept(
      [
        answer(`\\sec^{2}(${root})`, `2${root}`),   // نسيان مشتقة t²
        answer(`t \\tan(${root})`, root),           // عدم اشتقاق tan
        answer(`2t \\sec^{2}(${root})`, root),      // نسيان 2 في مقام مشتقة الجذر
        answer(`t \\sec(${root})`, root),
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'Function: مشتقة tan هي sec²، والزاوية كما هي:', math: `\\sec^{2}(${root})` },
      { text: 'Angle: نضرب في مشتقة الجذر:', math: `\\frac{2t}{2${root}}` },
      { text: 'نختصر 2:', math: correct },
    ],
  };
}

/** مثل Ex 2(a): y = sin(x²) */
function angleForm(kind: number, a: number, n: number): TemplateOutput {
  const { fn, deriv, negative } = TRIG[kind === 2 ? 0 : kind]; // sin أو cos مثل المثال
  const angle = monomial(a, n);
  const dFn = deriv(angle);
  const sign = negative ? '-' : '';
  const answer = (signText: string, coef: string, body: string) => `y' = ${signText}${coef} ${body}`;
  const coef = monomial(a * n, n - 1);
  const correct = answer(sign, coef, dFn);

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `y = ${fn}(${angle})`,
    correct,
    distractors: uniqueExcept(
      [
        `y' = ${sign}${dFn}`,                               // نسيان مشتقة الزاوية
        answer(negative ? '' : '-', coef, dFn),             // خطأ إشارة مشتقة الدالة
        answer(sign, coef, `${fn}(${angle})`),              // عدم اشتقاق الدالة
        answer(sign, '', deriv(monomial(a * n, n - 1))),    // اشتقاق الزاوية داخل الدالة
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'Function: نشتق الدالة ونترك الزاوية كما هي:', math: `${sign}${dFn}` },
      { text: 'Angle: نضرب في مشتقة الزاوية:', math: correct },
    ],
  };
}

/** مثل Q-26: s(t) = √((1 + sin t) / (1 + cos t)) */
function rootQuotientForm(a: number): TemplateOutput {
  const k = a - 1; // 1 مثل السؤال الأصلي، أو 2 إلى 4
  const c = k === 1 ? '' : `${k}`;
  const top = `${k} + \\sin t`;
  const bottom = `${k} + \\cos t`;
  const num = `${c}\\sin t + ${c}\\cos t + 1`;
  const answer = (n: string, root: string, two = '2') =>
    `s'(t) = \\frac{${n}}{${two}(${bottom})^{2}}${root}`;
  const rootDown = `\\sqrt{\\frac{${bottom}}{${top}}}`;
  const rootUp = `\\sqrt{\\frac{${top}}{${bottom}}}`;
  const correct = answer(num, rootDown);

  return {
    questionText: 'Find the derivative of the function:',
    mathExpression: `s(t) = \\sqrt{\\frac{${top}}{${bottom}}}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(num, rootUp),                       // قلب الكسر بعد القوة -1/2
        answer(`-${c}\\sin t - ${c}\\cos t - 1`, rootDown), // قلب ترتيب الطرح في Quotient Rule
        answer(num, rootDown, ''),                 // نسيان 1/2
        answer(`${c}\\cos t - ${c}\\sin t`, rootDown), // خطأ في مشتقة cos
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      {
        text: 'نكتب الجذر كقوة 1/2، ثم ننزلها ونضرب في مشتقة الكسر (Quotient Rule):',
        math: `s'(t) = \\frac{1}{2}\\left(\\frac{${top}}{${bottom}}\\right)^{-\\frac{1}{2}} \\cdot \\frac{\\cos t(${bottom}) - (${top})(-\\sin t)}{(${bottom})^{2}}`,
      },
      { text: 'نبسّط البسط بالمتطابقة sin²t + cos²t = 1:', math: `\\cos t(${bottom}) + \\sin t(${top}) = ${num}` },
      { text: 'القوة -1/2 تقلب الكسر تحت الجذر:', math: correct },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  const { form, kind, m, a, n } = v;
  if (form === 0) return powerFunctionAngleForm(kind, m, a, n);
  if (form === 1) return rootSecForm(n);
  if (form === 2) return nestedForm(a);
  if (form === 3) return productForm(a);
  if (form === 4) return tanRootForm(a);
  if (form === 5) return angleForm(kind, a, n);
  return rootQuotientForm(a);
}

export const chainTrigTemplate: QuestionTemplate = {
  id: 'derivatives:chain-trig',
  name: 'قاعدة السلسلة مع الدوال المثلثية',
  type: 'derivative',
  difficulty: 'medium',
  variables,
  generate,
};

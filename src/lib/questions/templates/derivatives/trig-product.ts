// src/lib/questions/templates/derivatives/trig-product.ts
// خمسة أشكال من شابتر 2.4: Q-1 (جمع)، Q-5 (ضرب)، Q-9 (قوس في sin)، Q-15 و Q-17 (قسمة)
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept } from '../utils';
import { monomial } from './helpers';

const variables: VariableDefinition[] = [
  { name: 'form', min: 0, max: 4, integer: true },
  { name: 'a', min: 1, max: 5, integer: true },    // المعامل
  { name: 'n', min: 2, max: 5, integer: true },    // قوة θ
];

const TH = '\\theta';

// شكل الضرب مثل Q-5 تمامًا: قوة θ مضروبة في sin θ
const SIN = { fn: `\\sin ${TH}`, deriv: `\\cos ${TH}`, negative: false };

/** مثل Q-1: f(x) = 3 sin x - 2 cos x */
function sumForm(a: number, b: number): TemplateOutput {
  const p = a + 1;
  const n = b === p ? b + 1 : b; // معاملان مختلفان حتى لا يساوي خيار خاطئ الإجابة
  const answer = (first: string, sign: '+' | '-', second: string) => `f'(x) = ${p} ${first} ${sign} ${n} ${second}`;
  const correct = answer('\\cos x', '+', '\\sin x');

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `f(x) = ${p} \\sin x - ${n} \\cos x`,
    correct,
    distractors: uniqueExcept(
      [
        answer('\\cos x', '-', '\\sin x'), // نسيان أن مشتقة cos سالبة
        answer('\\sin x', '+', '\\cos x'), // عدم اشتقاق الدوال
        answer('\\sin x', '-', '\\cos x'),
        `f'(x) = -${p} \\cos x + ${n} \\sin x`,
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نشتق كل حد لوحده، والمعامل يبقى كما هو:', math: `f'(x) = ${p}(\\cos x) - ${n}(-\\sin x)` },
      { text: 'نبسّط الإشارات:', math: correct },
    ],
  };
}

/** مثل Q-5: h(θ) = θ² sin θ */
function productForm(a: number, n: number): TemplateOutput {
  const { fn, deriv, negative } = SIN;

  const u = monomial(a, n, TH);
  const du = monomial(a * n, n - 1, TH);
  const dv = `${negative ? '-' : ''}${deriv}`;

  const answer = (first: string, sign: '+' | '-', second: string) => `h'(${TH}) = ${first} ${sign} ${second}`;
  const correct = answer(`${du} ${fn}`, negative ? '-' : '+', `${u} ${deriv}`);

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `h(${TH}) = ${u} ${fn}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(`${du} ${fn}`, negative ? '+' : '-', `${u} ${deriv}`), // خطأ إشارة مشتقة الدالة المثلثية
        answer(`${du} ${fn}`, negative ? '-' : '+', `${u} ${fn}`),    // عدم اشتقاق الدالة المثلثية
        `h'(${TH}) = ${negative ? '-' : ''}${du} ${deriv}`,           // ضرب المشتقتين u'v'
        answer(`${u} ${fn}`, negative ? '-' : '+', `${u} ${deriv}`),  // عدم اشتقاق القوة
        answer(`${monomial(a * n, n, TH)} ${fn}`, negative ? '-' : '+', `${u} ${deriv}`), // نسيان إنقاص القوة
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'حاصل ضرب دالتين، فنسمي u و v ونشتق كل واحدة:', math: `u' = ${du}, \\quad v' = ${dv}` },
      { text: 'نعوّض في Product Rule:', math: correct },
    ],
  };
}

/** مثل Q-9: f(θ) = (θ - cos θ) sin θ */
function bracketForm(a: number): TemplateOutput {
  const inner = `${TH} - ${a === 1 ? '' : a}\\cos ${TH}`;
  const du = `1 + ${a === 1 ? '' : a}\\sin ${TH}`;
  const answer = (sign: '+' | '-', c: string, trig: string) =>
    `f'(${TH}) = \\sin ${TH} + ${TH} \\cos ${TH} ${sign} ${c}${trig}`;
  const coef = a === 1 ? '' : `${a}`;
  const correct = answer('-', coef, `\\cos(2${TH})`);

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `f(${TH}) = (${inner}) \\sin ${TH}`,
    correct,
    distractors: uniqueExcept(
      [
        answer('+', coef, `\\cos(2${TH})`),      // خطأ إشارة مشتقة cos
        answer('-', coef, `\\sin(2${TH})`),      // خطأ في المتطابقة
        answer('+', coef, `\\sin(2${TH})`),
        `f'(${TH}) = \\sin ${TH} + ${TH} \\cos ${TH}`, // إهمال حدود sin² و cos²
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      { text: 'نسمي القوس u و sin θ هي v، ونعوّض في Product Rule:', math: `f'(${TH}) = (${du}) \\sin ${TH} + (${inner}) \\cos ${TH}` },
      { text: 'نستخدم المتطابقة cos²θ - sin²θ = cos 2θ ونبسّط:', math: correct },
    ],
  };
}

/** مثل Q-15: y = x / (2 - tan x) */
function tanQuotientForm(a: number): TemplateOutput {
  const c = a + 1;
  const den = `${c} - \\tan x`;
  const answer = (num: string, bottom = `(${den})^{2}`) => `y' = \\frac{${num}}{${bottom}}`;
  const correct = answer(`${den} + x \\sec^{2} x`);

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `y = \\frac{x}{${den}}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(`${den} - x \\sec^{2} x`),   // عدم توزيع الناقص على مشتقة المقام
        answer(`${den} + x \\sec x \\tan x`), // خطأ في مشتقة tan
        answer(`${den} + x \\sec^{2} x`, den), // نسيان تربيع المقام
        answer('x \\sec^{2} x'),            // إهمال الجزء u'v
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      {
        text: 'نعوّض في Quotient Rule، ومشتقة tan x هي sec²x:',
        math: `y' = \\frac{(1)(${den}) - x(-\\sec^{2} x)}{(${den})^{2}}`,
      },
      { text: 'نبسّط البسط:', math: correct },
    ],
  };
}

/** مثل Q-17: f(w) = (1 + sec w) / (1 - sec w) */
function secQuotientForm(a: number): TemplateOutput {
  const c = a === 1 ? '' : `${a}`;
  const top = `1 + ${c}\\sec w`;
  const den = `1 - ${c}\\sec w`;
  const answer = (num: string, bottom = `(${den})^{2}`) => `f'(w) = \\frac{${num}}{${bottom}}`;
  const correct = answer(`${2 * a} \\sec w \\tan w`);

  return {
    questionText: 'Differentiate the function:',
    mathExpression: `f(w) = \\frac{${top}}{${den}}`,
    correct,
    distractors: uniqueExcept(
      [
        answer(`-${2 * a} \\sec w \\tan w`),        // قلب ترتيب الطرح
        answer(`${2 * a} \\sec w \\tan w`, den),    // نسيان تربيع المقام
        answer(`${2 * a} \\sec^{2} w`),             // خطأ في مشتقة sec
        answer(`${a} \\sec w \\tan w`),             // جمع الحدين خطأ
      ],
      correct
    ),
    optionFormat: 'math',
    steps: [
      {
        text: 'نعوّض في Quotient Rule، ومشتقة sec w هي sec w tan w:',
        math: `f'(w) = \\frac{${c}\\sec w \\tan w(${den}) - (${top})(-${c}\\sec w \\tan w)}{(${den})^{2}}`,
      },
      { text: 'نفك البسط: حدود sec²w tan w تختصر ويبقى:', math: correct },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  const { form, a, n } = v;
  if (form === 0) return sumForm(a, n);
  if (form === 1) return productForm(a, n);
  if (form === 2) return bracketForm(a);
  if (form === 3) return tanQuotientForm(a);
  return secQuotientForm(a);
}

export const trigProductTemplate: QuestionTemplate = {
  id: 'derivatives:trig-product',
  name: 'مشتقات الدوال المثلثية',
  type: 'derivative',
  difficulty: 'medium',
  variables,
  generate,
};

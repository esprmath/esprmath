  // lib/questions/templates/limits/rational-sign.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';

/**
 * lim (x → b⁺ أو b⁻)  a / (x − b)
 * إشارة النهاية = إشارة البسط × إشارة المقام:
 *   من اليمين: (x − b) > 0      من اليسار: (x − b) < 0
 * تنبيه: ترتيب المتغيرات جزء من الـ seed، لا تغيّره بعد نشر الأسئلة.
 */
const variables: VariableDefinition[] = [
  { name: 'numerator', min: -9, max: 9, exclude: [0], integer: true },
  { name: 'asymptote', min: -5, max: 5, integer: true },
  { name: 'direction', min: 0, max: 1, integer: true }, // 0 = يسار⁻ ، 1 = يمين⁺
  // يُضاف آخر القائمة حتى لا تتغير أرقام الأسئلة القديمة: 0 = الشكل الأصلي، 1 = مثل Q-31
  { name: 'form', min: 0, max: 1, integer: true },
];

/** x − b بدون أشكال قبيحة مثل x - -3 */
const xMinus = (b: number) => (b === 0 ? 'x' : b > 0 ? `x - ${b}` : `x + ${-b}`);
const inf = (positive: boolean) => (positive ? '\\infty' : '-\\infty');

/** مثل Q-31: lim (x → -2⁺) (x - 1) / (x²(x + 2)) */
function productDenominatorForm(a: number, b: number, right: boolean): TemplateOutput {
  const p = b - a; // البسط x - p قيمته a عند x = b
  const positive = (a > 0) === right; // x² موجب، فالإشارة من البسط و (x - b)
  const denom = b === 0 ? 'x^{3}' : `x^{2}(${xMinus(b)})`;
  const sideText = right ? 'اليمين' : 'اليسار';

  return {
    questionText: 'Determine the infinite limit:',
    mathExpression: `\\lim_{x \\to ${b}^{${right ? '+' : '-'}}} \\frac{${xMinus(p)}}{${denom}}`,
    correct: inf(positive),
    distractors: ['0', `${a}`, inf(!positive)],
    steps: [
      { text: 'بالتعويض المباشر: البسط عدد غير الصفر والمقام يقترب من الصفر:', math: `\\frac{${a}}{0^{${right ? '+' : '-'}}}` },
      {
        text: `نعوّض عددًا قريبًا من ${b} من جهة ${sideText}: x² موجب، و (${xMinus(b)}) ${right ? 'موجب' : 'سالب'} وصغير جدًا:`,
        math: `${b === 0 ? 'x^{3}' : `x^{2}(${xMinus(b)})`} ${right ? '>' : '<'} 0`,
      },
      {
        text: `البسط ${a > 0 ? 'موجب' : 'سالب'}، فناتج القسمة ${positive ? 'موجب' : 'سالب'} ويكبر بلا حدود:`,
        math: inf(positive),
      },
    ],
  };
}

function generate(v: Record<string, number>): TemplateOutput {
  if (v.form === 1) return productDenominatorForm(v.numerator, v.asymptote, v.direction === 1);
  return originalForm(v);
}

function originalForm(v: Record<string, number>): TemplateOutput {
  const { numerator: a, asymptote: b, direction } = v;
  const right = direction === 1;
  const positive = (a > 0) === right; // سالب÷سالب أو موجب÷موجب = موجب

  const sideText = right ? 'اليمين' : 'اليسار';
  const denom = xMinus(b);

  return {
    questionText: 'أوجد النهاية التالية:',
    mathExpression: `\\lim_{x \\to ${b}^{${right ? '+' : '-'}}} \\frac{${a}}{${denom}}`,

    correct: inf(positive),
    distractors: ['0', `${a}`, inf(!positive)],

    steps: [
      {
        text: `عندما تقترب x من ${b} من جهة ${sideText} تكون x ${right ? 'أكبر' : 'أصغر'} من ${b}، فالمقام ${right ? 'موجب' : 'سالب'} ويقترب من الصفر:`,
        math: `${denom} ${right ? '>' : '<'} 0`,
      },
      {
        text: `والبسط عدد ${a > 0 ? 'موجب' : 'سالب'}:`,
        math: `${a} ${a > 0 ? '>' : '<'} 0`,
      },
      {
        text: `فناتج القسمة ${positive ? 'موجب' : 'سالب'} ويكبر بلا حدود، إذن النهاية:`,
        math: inf(positive),
      },
    ],
  };
}

export const rationalSignTemplate: QuestionTemplate = {
  id: 'limits:rational-sign',
  name: 'نهاية لدالة كسرية بسيطة',
  type: 'limits',
  difficulty: 'easy',
  variables,
  generate,
};
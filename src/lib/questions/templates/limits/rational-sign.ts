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
];

/** x − b بدون أشكال قبيحة مثل x - -3 */
const xMinus = (b: number) => (b === 0 ? 'x' : b > 0 ? `x - ${b}` : `x + ${-b}`);
const inf = (positive: boolean) => (positive ? '\\infty' : '-\\infty');

function generate(v: Record<string, number>): TemplateOutput {
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
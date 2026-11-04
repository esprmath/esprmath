// src/lib/questions/templates/limits/numerical-table.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept, DNE } from '../utils';

/**
 * تقدير النهاية من جدول قيم قريبة من النقطة من الجهتين.
 * قيم الجدول تقترب من a + b من اليسار، ومن اليمين نفسها أو a + b + 2 (النهاية غير موجودة).
 * تنبيه: ترتيب المتغيرات جزء من الـ seed، لا تغيّره بعد نشر الأسئلة.
 */
const variables: VariableDefinition[] = [
  { name: 'a', min: 1, max: 6, integer: true },
  { name: 'b', min: 1, max: 6, integer: true },
  { name: 'mode', min: 0, max: 3, integer: true }, // 3 = الجهتان مختلفتان
];

const fmt = (n: number) => String(Number(n.toFixed(2)));

function generate(v: Record<string, number>): TemplateOutput {
  const { a, b, mode } = v;
  const jump = mode === 3 ? 2 : 0;
  const leftLimit = a + b;
  const rightLimit = a + b + jump;

  const xs = [a - 0.1, a - 0.01, a + 0.01, a + 0.1];
  const ys = [xs[0] + b, xs[1] + b, xs[2] + b + jump, xs[3] + b + jump];

  // جدول عمودي حتى يظهر كاملًا على شاشة الجوال
  const rows = xs.map((x, i) => `${fmt(x)} & ${fmt(ys[i])}`).join(' \\\\ ');
  const table = `\\begin{array}{c|c} x & f(x) \\\\ \\hline ${rows} \\end{array}`;

  const correct = jump === 0 ? `${leftLimit}` : DNE;

  return {
    questionText: 'استخدم الجدول لتقدير قيمة النهاية التالية:',
    mathExpression: `\\lim_{x \\to ${a}} f(x) \\qquad ${table}`,
    correct,
    distractors: uniqueExcept(
      [DNE, `${leftLimit}`, `${rightLimit}`, `${a}`, `${b}`, `${leftLimit + 1}`, `${leftLimit - 1}`],
      correct
    ),
    steps: [
      {
        text: `من جهة اليسار (x أصغر من ${a}) تقترب قيم الدالة من:`,
        math: `\\lim_{x \\to ${a}^{-}} f(x) = ${leftLimit}`,
      },
      {
        text: `ومن جهة اليمين (x أكبر من ${a}) تقترب من:`,
        math: `\\lim_{x \\to ${a}^{+}} f(x) = ${rightLimit}`,
      },
      jump === 0
        ? { text: 'الجهتان تقتربان من نفس العدد، إذن النهاية موجودة وتساوي:', math: `${leftLimit}` }
        : { text: 'الجهتان تقتربان من عددين مختلفين، إذن النهاية غير موجودة:', math: DNE },
    ],
  };
}

export const numericalTableTemplate: QuestionTemplate = {
  id: 'limits:numerical-table',
  name: 'تقدير النهاية من جدول قيم',
  type: 'limits',
  difficulty: 'easy',
  variables,
  generate,
};

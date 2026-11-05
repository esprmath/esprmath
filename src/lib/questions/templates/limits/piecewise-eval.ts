// src/lib/questions/templates/limits/piecewise-eval.ts
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { linear, uniqueExcept, DNE } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'a', min: 1, max: 4, integer: true },
  { name: 'm1', min: 1, max: 4, integer: true },
  { name: 'c1', min: -5, max: 5, integer: true },
  { name: 'm2', min: 1, max: 4, integer: true },
  { name: 'willExist', min: 0, max: 1, integer: true },
  // يُضاف آخر القائمة حتى لا تتغير أرقام الأسئلة القديمة: 0 = الشكل الأصلي، 1 = مثل Ex 9
  { name: 'form', min: 0, max: 1, integer: true },
];

/** مثل Ex 9: √(x - 4) إذا x > 4، و 8 - 2x إذا x < 4 */
function rootForm(v: Record<string, number>): TemplateOutput {
  const a = v.a + 2; // 3 إلى 6
  const m = v.m1;
  const shift = v.willExist === 1 ? 0 : v.m2; // قيمة الجهة اليسرى عند a
  const left = linear(-m, m * a + shift);
  const exists = shift === 0;
  const correct = exists ? '0' : DNE;

  return {
    questionText: `Determine whether the limit exists as x approaches ${a}:`,
    mathExpression: `f(x) = \\begin{cases} \\sqrt{x - ${a}}, & x > ${a} \\\\ ${left}, & x < ${a} \\end{cases}`,
    correct,
    distractors: uniqueExcept(['0', `${shift}`, `${-shift}`, `${a}`, `\\sqrt{${a}}`, '1', DNE], correct),
    optionFormat: 'math',
    steps: [
      { text: `من اليمين (x > ${a}) نعوّض في الجذر:`, math: `\\lim_{x \\to ${a}^{+}} \\sqrt{x - ${a}} = \\sqrt{0} = 0` },
      { text: `من اليسار (x < ${a}) نعوّض في القاعدة الثانية:`, math: `\\lim_{x \\to ${a}^{-}} (${left}) = ${shift}` },
      exists
        ? { text: 'الجهتان متساويتان، فالنهاية موجودة:', math: `\\lim_{x \\to ${a}} f(x) = 0` }
        : { text: 'الجهتان مختلفتان، فالنهاية غير موجودة:', math: `0 \\neq ${shift} \\Rightarrow \\text{DNE}` },
    ],
  };
}

/** ثوابت القالب (مصدّرة لاستخدامها في الاختبار) */
export function buildPiecewise(v: Record<string, number>) {
  const { a, m1, c1, m2, willExist } = v;
  const leftLimit = m1 * a + c1;
  const c2 = leftLimit - m2 * a + (willExist === 1 ? 0 : 2);
  const rightLimit = m2 * a + c2;
  return { a, m1, c1, m2, c2, leftLimit, rightLimit, exists: leftLimit === rightLimit };
}

/** مثال: calc(2, 1, 3, 7) => "2(3) + 1 = 7" */
function calc(m: number, c: number, a: number, result: number): string {
  const head = m === 1 ? `${a}` : `${m}(${a})`;
  const tail = c === 0 ? '' : ` ${c > 0 ? '+' : '-'} ${Math.abs(c)}`;
  const expr = `${head}${tail}`;
  return expr === String(result) ? expr : `${expr} = ${result}`;
}

function generate(v: Record<string, number>): TemplateOutput {
  if (v.form === 1) return rootForm(v);
  return originalForm(v);
}

function originalForm(v: Record<string, number>): TemplateOutput {
  const { a, m1, c1, m2, c2, leftLimit, rightLimit, exists } = buildPiecewise(v);

  const left = linear(m1, c1);
  const right = linear(m2, c2);

  const correct = exists ? `${leftLimit}` : DNE;

  const distractors = uniqueExcept(
    [
      `${leftLimit}`,
      `${rightLimit}`,
      `${leftLimit + 1}`,
      `${leftLimit - 1}`,
      `${leftLimit + 2}`,
      `${leftLimit - 2}`,
      `${rightLimit + 1}`,
      `${rightLimit - 1}`,
      `${leftLimit + rightLimit}`,
      `${leftLimit - rightLimit}`,
      `${-leftLimit}`,
      '0',
      '1',
      '-1',
      DNE,
    ],
    correct
  );

  return {
    questionText: `أوجد قيمة النهاية عندما x تقترب من ${a} (أو بيّن أنها غير موجودة):`,
    mathExpression: `f(x) = \\begin{cases} ${left}, & x < ${a} \\\\ ${right}, & x > ${a} \\end{cases}`,
    correct,
    distractors,
    optionFormat: 'math',
    steps: [
      {
        text: `نحسب النهاية من اليسار (x < ${a}):`,
        math: `\\lim_{x \\to ${a}^{-}} (${left}) = ${calc(m1, c1, a, leftLimit)}`,
      },
      {
        text: `نحسب النهاية من اليمين (x > ${a}):`,
        math: `\\lim_{x \\to ${a}^{+}} (${right}) = ${calc(m2, c2, a, rightLimit)}`,
      },
      exists
        ? {
            text: 'النهاية من اليسار تساوي النهاية من اليمين، فالنهاية الكلية موجودة:',
            math: `\\lim_{x \\to ${a}} f(x) = ${leftLimit}`,
          }
        : {
            text: 'النهاية من اليسار لا تساوي النهاية من اليمين، فالنهاية الكلية غير موجودة:',
            math: `${leftLimit} \\neq ${rightLimit} \\Rightarrow \\text{DNE}`,
          },
    ],
  };
}

export const piecewiseEvalTemplate: QuestionTemplate = {
  id: 'limits:piecewise-eval',
  name: 'نهاية الدوال متعددة التعريف',
  type: 'limits',
  difficulty: 'medium',
  variables,
  generate,
};
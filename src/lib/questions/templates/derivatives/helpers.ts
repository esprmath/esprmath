// src/lib/questions/templates/derivatives/helpers.ts
// أدوات كتابة الحدود بصيغة LaTeX لقوالب الاشتقاق

/** معامل قبل متغير: 1 يختفي و -1 تبقى إشارته */
export const coefText = (coef: string) => (coef === '1' ? '' : coef === '-1' ? '-' : coef);

/** حد واحد مثل 3x^2. القوة 0 ترجع المعامل فقط، والمعامل 0 يرجع نصًا فارغًا */
export function monomial(coef: number, power: number, v = 'x'): string {
  if (coef === 0) return '';
  if (power === 0) return `${coef}`;
  const base = power === 1 ? v : `${v}^{${power}}`;
  return `${coefText(String(coef))}${base}`;
}

/** كثيرة حدود من أزواج [معامل، قوة] بالترتيب المعطى، مثل poly([[3,2],[-1,0]]) => 3x^{2} - 1 */
export function poly(terms: [number, number][], v = 'x'): string {
  const parts = terms.filter(([coef]) => coef !== 0);
  if (parts.length === 0) return '0';
  return parts.reduce((out, [coef, power], i) => {
    if (i === 0) return monomial(coef, power, v);
    return `${out} ${coef > 0 ? '+' : '-'} ${monomial(Math.abs(coef), power, v)}`;
  }, '');
}

/** تقريب لتجنب أخطاء الفاصلة العائمة */
export const round2 = (x: number) => Number(x.toFixed(2));

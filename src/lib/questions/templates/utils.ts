// src/lib/questions/templates/utils.ts   (ملف جديد)

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

export const DNE = '\\text{DNE}';

/** كسر مبسط بصيغة LaTeX، الإشارة خارج الكسر. يرجع null إذا المقام صفر */
export function frac(num: number, den: number): string | null {
  if (den === 0) return null;
  if (num === 0) return '0';
  const g = gcd(Math.abs(num), Math.abs(den));
  let n = num / g;
  let d = den / g;
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  return d === 1 ? `${sign}${abs}` : `${sign}\\frac{${abs}}{${d}}`;
}

/** صيغة خطية: linear(2, -3) => "2x - 3" ، linear(1, 0) => "x" */
export function linear(coef: number, c: number, v = 'x'): string {
  const term = coef === 1 ? v : coef === -1 ? `-${v}` : `${coef}${v}`;
  return c === 0 ? term : `${term} ${c > 0 ? '+' : '-'} ${Math.abs(c)}`;
}

/** مشتتات فريدة، بدون null وبدون الإجابة الصحيحة */
export function uniqueExcept(values: (string | null)[], correct: string): string[] {
  const out: string[] = [];
  for (const v of values) {
    if (v !== null && v !== correct && !out.includes(v)) out.push(v);
  }
  return out;
}
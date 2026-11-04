// lib/questions/engine/rng.ts
import type { VariableDefinition } from '../types';

function hashString(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

/** Mulberry32: نفس الـ seed يعطي نفس التسلسل دائمًا */
export class SeededRNG {
  private state: number;

  constructor(seed: string | number) {
    this.state = typeof seed === 'string' ? hashString(seed) : seed >>> 0;
  }

  /** كسر بين 0 (شامل) و 1 (غير شامل) */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** عدد صحيح بين min و max (شاملين) */
  nextInt(min: number, max: number): number {
    if (min > max) throw new Error(`nextInt: min (${min}) أكبر من max (${max})`);
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** عدد كسري بين min و max بمنزلتين عشريتين */
  nextFloat(min: number, max: number): number {
    const v = Math.round((this.next() * (max - min) + min) * 100) / 100;
    return Math.min(Math.max(v, min), max);
  }

  pick<T>(items: readonly T[]): T {
    return items[this.nextInt(0, items.length - 1)];
  }

  /** خلط Fisher-Yates بنفس الـ seed (لا يغيّر المصفوفة الأصلية) */
  shuffle<T>(items: readonly T[]): T[] {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

/** seed مختلف لكل قالب حتى لو تساوى الرقم */
export const makeRng = (templateId: string, seed: number) =>
  new SeededRNG(`${templateId}:${seed}`);

export function generateVariable(rng: SeededRNG, def: VariableDefinition): number {
  const { name, min, max } = def;
  const exclude = def.exclude ?? [];

  if (def.integer !== false) {
    const ex = [...new Set(exclude)]
      .filter(e => Number.isInteger(e) && e >= min && e <= max)
      .sort((a, b) => a - b);

    const count = max - min + 1 - ex.length;
    if (count <= 0) {
      throw new Error(`المتغير "${name}": لا توجد قيم متاحة بين ${min} و ${max} بعد الاستبعاد.`);
    }

    let v = min + rng.nextInt(0, count - 1);
    for (const e of ex) if (v >= e) v++; // نزيح فوق كل قيمة مستبعدة
    return v;
  }

  for (let i = 0; i < 100; i++) {
    const v = rng.nextFloat(min, max);
    if (!exclude.includes(v)) return v;
  }
  throw new Error(`المتغير "${name}": فشل إيجاد قيمة كسرية غير مستبعدة.`);
}

/** يولّد كل متغيرات القالب بترتيبها (الترتيب ثابت = نتيجة ثابتة) */
export function generateVariables(
  rng: SeededRNG,
  defs: VariableDefinition[]
): Record<string, number> {
  return Object.fromEntries(defs.map(d => [d.name, generateVariable(rng, d)]));
}
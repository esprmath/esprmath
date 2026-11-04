// src/lib/questions/engine/distractor.ts
import type { SeededRNG } from './rng';
import type { Option, OptionId } from '../types';

const OPTION_IDS: OptionId[] = ['A', 'B', 'C', 'D'];
export const norm = (s: string) => s.replace(/\s+/g, '');

export interface DistractorConfig {
  correct: string;
  distractors?: string[];
  count?: number; // الافتراضي 4
  math?: boolean; // الافتراضي true
}

/** يبني الخيارات ويرجع correctId مباشرة (بدون بحث ثانٍ) */
export function buildOptions(
  rng: SeededRNG,
  { correct, distractors = [], count = 4, math = true }: DistractorConfig
): { options: Option[]; correctId: OptionId } {
  const size = Math.min(count, OPTION_IDS.length);

  // مشتتات فريدة وغير مطابقة للصحيحة
  const seen = new Set([norm(correct)]);
  const pool: string[] = [];
  for (const d of distractors) {
    const key = norm(d);
    if (!seen.has(key)) {
      seen.add(key);
      pool.push(d);
    }
  }

  if (pool.length < size - 1) {
    throw new Error(`مشتتات غير كافية: المتاح ${pool.length} والمطلوب ${size - 1}.`);
  }

  // لو زادت المشتتات نختار منها عشوائيًا بنفس الـ seed
  const picked = rng.shuffle(pool).slice(0, size - 1);
  const texts = rng.shuffle([correct, ...picked]);

  const options: Option[] = texts.map((text, i) => ({ id: OPTION_IDS[i], text, math }));
  return { options, correctId: OPTION_IDS[texts.indexOf(correct)] };
}
// src/lib/questions/engine/generator.ts
import { makeRng, generateVariables } from './rng';
import { buildOptions } from './distractor';
import { getTemplate } from '../templates/registry';
import type { TemplateConfig, GeneratedQuestion, VariableDefinition } from '../types';

const MAX_CONSTRAINT_TRIES = 50;

/** هوية السؤال بدون الخيارات: نفس القالب + نفس النص + نفس المعادلة */
export const questionKey = (q: GeneratedQuestion) =>
  `${q.templateId}|${q.questionText}|${q.mathExpression ?? ''}`;

function applyOverrides(
  defs: VariableDefinition[],
  overrides: TemplateConfig['variablesOverride']
): VariableDefinition[] {
  return defs.map(d => {
    const o = overrides?.[d.name];
    return o
      ? {
          ...d,
          min: o.min ?? d.min,
          max: o.max ?? d.max,
          exclude: o.exclude ?? d.exclude,
          integer: o.integer ?? d.integer,
        }
      : d;
  });
}

/**
 * سؤال واحد من seed واحد.
 * ترتيب استدعاءات الـ rng ثابت: المتغيرات ← constraint ← المشتتات والخلط.
 */
export function generateOne(config: TemplateConfig, seed: number): GeneratedQuestion {
  const template = getTemplate(config.templateId);
  const stableId = `${template.id}:${seed}`;

  try {
    const defs = applyOverrides(template.variables, config.variablesOverride);
    const rng = makeRng(template.id, seed);

    let vars = generateVariables(rng, defs);
    for (let t = 1; template.constraint && !template.constraint(vars); t++) {
      if (t >= MAX_CONSTRAINT_TRIES) {
        throw new Error(`constraint لم يتحقق بعد ${MAX_CONSTRAINT_TRIES} محاولة`);
      }
      vars = generateVariables(rng, defs);
    }

    const out = template.generate(vars);
    const { options, correctId } = buildOptions(rng, {
      correct: out.correct,
      distractors: out.distractors,
      math: (out.optionFormat ?? 'math') === 'math',
    });

    return {
      kind: 'generated',
      stableId,
      templateId: template.id,
      seed,
      questionText: out.questionText,
      mathExpression: out.mathExpression,
      options,
      correctId,
      steps: out.steps,
    };
  } catch (e) {
    throw new Error(`[Generator] ${stableId}: ${e instanceof Error ? e.message : String(e)}`);
  }
}

/**
 * عدة أسئلة بدون تكرار داخل المجموعة، ومع تجنّب الأسئلة في `exclude` (أسئلة الجولة السابقة).
 * إذا كان القالب صغيرًا ولا يكفي، نسمح بتكرار قديم، لكن لا نكرر داخل نفس المجموعة.
 */
export function generateMany(
  config: TemplateConfig,
  baseSeed: number,
  exclude: ReadonlySet<string> = new Set()
): GeneratedQuestion[] {
  const count = Math.max(1, config.count ?? 1);
  const maxAttempts = count * 30;
  const result: GeneratedQuestion[] = [];
  const inSet = new Set<string>();

  const fill = (blocked: ReadonlySet<string>, from: number) => {
    for (let attempt = from; result.length < count && attempt < from + maxAttempts; attempt++) {
      const q = generateOne(config, baseSeed * 100000 + attempt);
      const key = questionKey(q);
      if (inSet.has(key) || blocked.has(key)) continue;
      inSet.add(key);
      result.push(q);
    }
  };

  fill(exclude, 0);
  if (result.length < count) fill(new Set(), maxAttempts);

  if (process.env.NODE_ENV !== 'production' && result.length < count) {
    console.warn(`[Generator] ${config.templateId}: طُلب ${count} وتوفر ${result.length} فقط (حالات القالب قليلة).`);
  }
  return result;
}
// src/lib/questions/templates/registry.ts
import type { QuestionTemplate } from '../types';

// === Limits ===
import { numericalTableTemplate } from './limits/numerical-table';
import { rationalSignTemplate } from './limits/rational-sign';
import { conjugateZeroTemplate } from './limits/conjugate-zero';
import { directSubstitutionTemplate } from './limits/direct-substitution';
import { unknownFunctionTemplate } from './limits/unknown-function';
import { piecewiseEvalTemplate } from './limits/piecewise-eval';
import { verticalAsymptoteTemplate } from './limits/vertical-asymptote';
// 🆕 إضافات جديدة لشابتر 3.4
import { infinityReciprocalTemplate } from './limits/infinity-reciprocal';
import { rationalInfinityTemplate } from './limits/rational-infinity';
import { conjugateInfinityTemplate } from './limits/conjugate-infinity';
import { infinityInfiniteTemplate } from './limits/infinity-infinite';

// === Continuity ===
import { checkPointTemplate } from './continuity/check-point';
import { intervalOfContinuityTemplate } from './continuity/interval-of-continuity';
import { rationalDiscontinuityTemplate } from './continuity/rational-discontinuity';
import { unknownValueTemplate } from './continuity/unknown-value';

// === Derivatives ===
import { tangentLimitTemplate } from './derivatives/tangent-limit';
import { instantaneousVelocityTemplate } from './derivatives/instantaneous-velocity';

// === الموديول الثاني ===
import { powerRulesTemplate } from './derivatives/power-rules';
import { sumDifferenceTemplate } from './derivatives/sum-difference';
import { productRuleTemplate } from './derivatives/product-rule';
import { quotientRuleTemplate } from './derivatives/quotient-rule';
import { trigProductTemplate } from './derivatives/trig-product';
import { trigProofTemplate } from './derivatives/trig-proof';
import { specialTrigTemplate } from './limits/special-trig';
import { generalPowerTemplate } from './derivatives/general-power';
import { chainTrigTemplate } from './derivatives/chain-trig';
import { implicitCubicTemplate } from './derivatives/implicit-cubic';
import { implicitTrigTemplate } from './derivatives/implicit-trig';
import { particleMotionTemplate } from './derivatives/particle-motion';
import { cubeVolumeTemplate } from './derivatives/cube-volume';
import { torricelliTemplate } from './derivatives/torricelli';
import { electricCurrentTemplate } from './derivatives/electric-current';

export type TemplateId =
  | 'limits:numerical-table'
  | 'limits:rational-sign'
  | 'limits:conjugate-zero'
  | 'limits:direct-substitution'
  | 'limits:unknown-function'
  | 'limits:piecewise-eval'
  | 'limits:vertical-asymptote'
  | 'limits:infinity-reciprocal'         // 🆕
  | 'limits:rational-infinity'           // 🆕
  | 'limits:conjugate-infinity'          // 🆕
  | 'limits:infinity-infinite'           // 🆕
  | 'continuity:check-point'
  | 'continuity:interval-of-continuity'
  | 'continuity:rational-discontinuity'
  | 'continuity:unknown-value'
  | 'derivatives:tangent-limit'
  | 'derivatives:instantaneous-velocity'
  | 'derivatives:power-rules'
  | 'derivatives:sum-difference'
  | 'derivatives:product-rule'
  | 'derivatives:quotient-rule'
  | 'derivatives:trig-product'
  | 'derivatives:trig-proof'
  | 'limits:special-trig'
  | 'derivatives:general-power'
  | 'derivatives:chain-trig'
  | 'derivatives:implicit-cubic'
  | 'derivatives:implicit-trig'
  | 'derivatives:particle-motion'
  | 'derivatives:cube-volume'
  | 'derivatives:torricelli'
  | 'derivatives:electric-current';

export const TEMPLATE_REGISTRY: Record<TemplateId, QuestionTemplate> = {
  'limits:numerical-table': numericalTableTemplate,
  'limits:rational-sign': rationalSignTemplate,
  'limits:conjugate-zero': conjugateZeroTemplate,
  'limits:direct-substitution': directSubstitutionTemplate,
  'limits:unknown-function': unknownFunctionTemplate,
  'limits:piecewise-eval': piecewiseEvalTemplate,
  'limits:vertical-asymptote': verticalAsymptoteTemplate,
  'limits:infinity-reciprocal': infinityReciprocalTemplate,         // 🆕
  'limits:rational-infinity': rationalInfinityTemplate,             // 🆕
  'limits:conjugate-infinity': conjugateInfinityTemplate,           // 🆕
  'limits:infinity-infinite': infinityInfiniteTemplate,             // 🆕
  'continuity:check-point': checkPointTemplate,
  'continuity:interval-of-continuity': intervalOfContinuityTemplate,
  'continuity:rational-discontinuity': rationalDiscontinuityTemplate,
  'continuity:unknown-value': unknownValueTemplate,
  'derivatives:tangent-limit': tangentLimitTemplate,
  'derivatives:instantaneous-velocity': instantaneousVelocityTemplate,
  'derivatives:power-rules': powerRulesTemplate,
  'derivatives:sum-difference': sumDifferenceTemplate,
  'derivatives:product-rule': productRuleTemplate,
  'derivatives:quotient-rule': quotientRuleTemplate,
  'derivatives:trig-product': trigProductTemplate,
  'derivatives:trig-proof': trigProofTemplate,
  'limits:special-trig': specialTrigTemplate,
  'derivatives:general-power': generalPowerTemplate,
  'derivatives:chain-trig': chainTrigTemplate,
  'derivatives:implicit-cubic': implicitCubicTemplate,
  'derivatives:implicit-trig': implicitTrigTemplate,
  'derivatives:particle-motion': particleMotionTemplate,
  'derivatives:cube-volume': cubeVolumeTemplate,
  'derivatives:torricelli': torricelliTemplate,
  'derivatives:electric-current': electricCurrentTemplate,
};

export function hasTemplate(id: string): id is TemplateId {
  return Object.hasOwn(TEMPLATE_REGISTRY, id);
}

export function getTemplate(id: TemplateId): QuestionTemplate {
  if (!hasTemplate(id)) {
    throw new Error(`[Registry] القالب غير موجود: "${id}". سجّله في registry.ts`);
  }
  return TEMPLATE_REGISTRY[id];
}

export function getAllTemplates(): QuestionTemplate[] {
  return Object.values(TEMPLATE_REGISTRY);
}
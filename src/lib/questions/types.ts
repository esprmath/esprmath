// lib/questions/types.ts
import type { TemplateId } from './templates/registry';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type OptionId = 'A' | 'B' | 'C' | 'D';

export interface VariableDefinition {
  name: string;
  min: number;
  max: number;
  exclude?: number[];
  integer?: boolean; // الافتراضي true
}

// ✅ التعديل 1: إضافة خاصية math
export interface Option { 
  id: OptionId; 
  text: string; 
  math?: boolean; // true إذا كان النص يحتوي على LaTeX ويحتاج rendering خاص
}

export interface ExplanationStep { 
  text: string; 
  math?: string; 
}

// ما يرجعه القالب (المحرك يضيف stableId والخلط والمشتتات الناقصة)
export interface TemplateOutput {
  questionText: string;
  mathExpression?: string;
  correct: string;
  distractors?: string[];
  steps?: ExplanationStep[];
  optionFormat?: 'math' | 'text'; // ✅ التعديل 1: الافتراضي 'math'
}

export interface QuestionTemplate {
  id: TemplateId;
  name: string;
  type: 'limits' | 'continuity' | 'derivative';
  difficulty: Difficulty;
  variables: VariableDefinition[];
  constraint?: (v: Record<string, number>) => boolean;
  generate: (v: Record<string, number>) => TemplateOutput;
}

interface BaseQuestion {
  stableId: string;
  questionText: string;
  mathExpression?: string;
  graphImage?: string;
  options: Option[];
  correctId: OptionId;
  steps?: ExplanationStep[];
}

export interface GeneratedQuestion extends BaseQuestion {
  kind: 'generated';
  templateId: TemplateId;
  seed: number;
}

export interface StaticQuestion extends BaseQuestion {
  kind: 'static';
  ideaAnchorId?: string;
}

export interface QuestionGroup {
  kind: 'group';
  stableId: string;
  questionText: string;
  mathExpression?: string;
  graphImage?: string;
  parts: StaticQuestion[];
  ideaAnchorId?: string;
}

export type Question = GeneratedQuestion | StaticQuestion | QuestionGroup;

export interface TemplateConfig {
  templateId: TemplateId;
  seed?: number;
  count?: number;
  difficulty?: Difficulty;
variablesOverride?: Record<string, Partial<VariableDefinition>>;}
export type QuestionItem = TemplateConfig | StaticQuestion | QuestionGroup;
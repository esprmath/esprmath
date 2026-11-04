// lib/questions/engine/validator.ts
import katex from 'katex';
import type {
  Question, GeneratedQuestion, StaticQuestion, QuestionGroup, Option, OptionId,
} from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

type Single = GeneratedQuestion | StaticQuestion;

const norm = (s: string) => s.replace(/\s+/g, '');
const result = (errors: string[], warnings: string[]): ValidationResult =>
  ({ isValid: errors.length === 0, errors, warnings });

function checkMath(latex: string | undefined, label: string, errors: string[]) {
  if (!latex) return;
  try {
    katex.renderToString(latex, { throwOnError: true });
  } catch {
    errors.push(`${label}: صيغة LaTeX غير صالحة.`);
  }
}

function checkOptions(options: Option[], correctId: OptionId, errors: string[], warnings: string[]) {
  if (options.length < 2) errors.push('يجب أن يحتوي السؤال على خيارين على الأقل.');
  else if (options.length !== 4) warnings.push(`عدد الخيارات ${options.length} (المتوقع 4).`);

  const ids = options.map(o => o.id);
  if (new Set(ids).size !== ids.length) errors.push('توجد معرفات خيارات (OptionId) مكررة.');

  if (options.filter(o => o.id === correctId).length !== 1) {
    errors.push(`الإجابة الصحيحة (${correctId}) غير موجودة أو مكررة في الخيارات.`);
  }

  if (options.some(o => !o.text.trim())) errors.push('يوجد خيار نصه فارغ.');

  const texts = options.map(o => norm(o.text));
  if (new Set(texts).size !== texts.length) errors.push('توجد خيارات مكررة في النص.');

  options.forEach(o => {
    // ✅ التعديل 4: التحقق من LaTeX فقط إذا كان الخيار مُعلماً كـ math
    if (o.math) {
      checkMath(o.text, `الخيار ${o.id}`, errors);
    }
  });
}

export function validateSingle(q: Single): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!q.stableId) errors.push('معرف السؤال (stableId) مفقود.');
  if (!q.questionText.trim()) errors.push('نص السؤال فارغ.');

  checkOptions(q.options, q.correctId, errors, warnings);
  checkMath(q.mathExpression, 'mathExpression', errors);

  q.steps?.forEach((s, i) => {
    if (!s.text.trim() && !s.math) warnings.push(`الخطوة ${i + 1} فارغة.`);
    if (s.text.includes('\\')) errors.push(`الخطوة ${i + 1}: LaTeX خام داخل text (انقله إلى math).`);
    checkMath(s.math, `الخطوة ${i + 1}`, errors);
  });

  if (q.kind === 'generated' && q.stableId !== `${q.templateId}:${q.seed}`) {
    warnings.push('stableId لا يطابق الصيغة `${templateId}:${seed}`.');
  }

  return result(errors, warnings);
}

export function validateQuestionGroup(group: QuestionGroup): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!group.stableId) errors.push('معرف المجموعة (stableId) مفقود.');
  checkMath(group.mathExpression, 'mathExpression', errors);

  if (!group.parts?.length) {
    errors.push('المجموعة لا تحتوي على أجزاء (parts).');
  } else {
    const ids = group.parts.map(p => p.stableId);
    if (new Set(ids).size !== ids.length) errors.push('توجد معرفات أجزاء مكررة.');

    for (const part of group.parts) {
      const r = validateSingle(part);
      errors.push(...r.errors.map(e => `[${part.stableId}] ${e}`));
      warnings.push(...r.warnings.map(w => `[${part.stableId}] ${w}`));
    }
  }
  return result(errors, warnings);
}

export function validateQuestion(q: Question): ValidationResult {
  switch (q.kind) {
    case 'generated':
    case 'static':
      return validateSingle(q);
    case 'group':
      return validateQuestionGroup(q);
  }
}

export function validateQuestionSet(questions: Question[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();

  const track = (id: string) => {
    if (seen.has(id)) errors.push(`stableId مكرر: ${id}`);
    seen.add(id);
  };

  for (const q of questions) {
    track(q.stableId);
    if (q.kind === 'group') q.parts.forEach(p => track(p.stableId));
    const r = validateQuestion(q);
    errors.push(...r.errors.map(e => `[${q.stableId}] ${e}`));
    warnings.push(...r.warnings.map(w => `[${q.stableId}] ${w}`));
  }
  return result(errors, warnings);
}
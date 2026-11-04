// lib/questions/engine/grader.ts
import type { Question, OptionId, QuestionGroup } from '../types';

type Single = Exclude<Question, QuestionGroup>;
type GroupAnswers = Record<string, OptionId | null>; // المفتاح: part.stableId

export interface GradingResult {
  isCorrect: boolean;
  correctId: OptionId;
  selectedId: OptionId | null;
}

export interface GroupGradingResult {
  totalParts: number;
  answeredParts: number;   // كم جزء جاوب عليه الطالب
  correctParts: number;
  isFullyCorrect: boolean;
  partsResults: Record<string, GradingResult>;
}

/** تصحيح سؤال فردي (Generated أو Static) */
export function gradeSingleQuestion(
  question: Single,
  selectedId: OptionId | null
): GradingResult {
  return {
    isCorrect: selectedId === question.correctId,
    correctId: question.correctId,
    selectedId,
  };
}

/** تصحيح سؤال له أجزاء (أ، ب، ج) */
export function gradeQuestionGroup(
  group: QuestionGroup,
  selectedAnswers: GroupAnswers
): GroupGradingResult {
  const partsResults: Record<string, GradingResult> = {};
  let correctParts = 0;
  let answeredParts = 0;

  for (const part of group.parts) {
    const selectedId = selectedAnswers[part.stableId] ?? null;
    const result = gradeSingleQuestion(part, selectedId);
    partsResults[part.stableId] = result;
    if (selectedId !== null) answeredParts++;
    if (result.isCorrect) correctParts++;
  }

  return {
    totalParts: group.parts.length,
    answeredParts,
    correctParts,
    isFullyCorrect: correctParts === group.parts.length,
    partsResults,
  };
}

/** دالة موحدة: النوع الخاطئ يعطي خطأ وقت الكتابة، ولا ترمي أخطاء وقت التشغيل */
export function grade(q: QuestionGroup, a: GroupAnswers | null | undefined): GroupGradingResult;
export function grade(q: Single, a: OptionId | null | undefined): GradingResult;
export function grade(
  q: Question,
  a: OptionId | GroupAnswers | null | undefined
): GradingResult | GroupGradingResult {
  return q.kind === 'group'
    ? gradeQuestionGroup(q, (a as GroupAnswers | null | undefined) ?? {})
    : gradeSingleQuestion(q, (a as OptionId | null | undefined) ?? null);
}
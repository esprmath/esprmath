// src/components/questions/useQuestionSet.ts
import { useState, useMemo, useCallback } from 'react';
import type { Question, GeneratedQuestion, OptionId, QuestionItem } from '@/lib/questions/types';
import { generateMany, questionKey } from '@/lib/questions/engine/generator';
import {
  gradeSingleQuestion,
  gradeQuestionGroup,
  type GradingResult,
  type GroupGradingResult,
} from '@/lib/questions/engine/grader';

/** المفتاح: stableId للسؤال، أو stableId الجزء لو كان من مجموعة */
type Answers = Record<string, OptionId>;

const NO_KEYS: ReadonlySet<string> = new Set();

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

export interface UseQuestionSetReturn {
  questions: Question[];
  answers: Answers;
  attempted: Record<string, boolean>;
  results: Record<string, GradingResult | GroupGradingResult>;
  select: (questionId: string, optionId: OptionId, partId?: string) => void;
  canCheck: (q: Question) => boolean;
  check: (q: Question) => void;
  regenerate: () => void;
}

/**
 * @param items     قوالب أو أسئلة ثابتة أو مجموعات (مرّرها من ثابت أو useMemo)
 * @param stableKey هوية الفكرة، مثل "1.5:idea-2"
 */
export function useQuestionSet(items: QuestionItem[], stableKey: string): UseQuestionSetReturn {
  const [round, setRound] = useState(0);
  const [prevKeys, setPrevKeys] = useState<ReadonlySet<string>>(NO_KEYS); // أسئلة الجولة السابقة
  const [answers, setAnswers] = useState<Answers>({});
  const [attempted, setAttempted] = useState<Record<string, boolean>>({});

  const questions = useMemo(() => {
    const out: Question[] = [];
    const usedNow = new Set<string>();

    items.forEach((item, i) => {
      if ('kind' in item) {
        out.push(item); // سؤال ثابت أو مجموعة جاهزة
        return;
      }
      const seed =
        item.seed !== undefined
          ? item.seed + round
          : stringToSeed(`${stableKey}:${i}:${item.templateId}:${round}`);

      const generated = generateMany(item, seed, new Set([...prevKeys, ...usedNow]));
      generated.forEach(q => usedNow.add(questionKey(q)));
      out.push(...generated);
    });

    if (process.env.NODE_ENV !== 'production') {
      const ids = out.flatMap(q =>
        q.kind === 'group' ? [q.stableId, ...q.parts.map(p => p.stableId)] : [q.stableId]
      );
      const dup = ids.find((id, i) => ids.indexOf(id) !== i);
      if (dup) console.warn(`[useQuestionSet] stableId مكرر: ${dup}`);
    }
    return out;
  }, [items, stableKey, round, prevKeys]);

  const select = useCallback((questionId: string, optionId: OptionId, partId?: string) => {
    setAnswers(prev => ({ ...prev, [partId ?? questionId]: optionId }));
    // تغيير الاختيار يلغي نتيجة المحاولة السابقة لهذا السؤال
    setAttempted(prev => (prev[partId ?? questionId] || prev[questionId] ? { ...prev, [partId ?? questionId]: false, [questionId]: false } : prev));
  }, []);

  const canCheck = useCallback(
    (q: Question) =>
      q.kind === 'group'
        ? q.parts.every(p => answers[p.stableId] !== undefined)
        : answers[q.stableId] !== undefined,
    [answers]
  );

  const check = useCallback(
    (q: Question) => {
      if (!canCheck(q)) return;
      setAttempted(prev => ({ ...prev, [q.stableId]: true }));
    },
    [canCheck]
  );

  const regenerate = useCallback(() => {
    // نحفظ مفاتيح الأسئلة الحالية لنمنع ظهورها مباشرة في الجولة التالية
    setPrevKeys(
      new Set(
        questions
          .filter((q): q is GeneratedQuestion => q.kind === 'generated')
          .map(questionKey)
      )
    );
    setRound(r => r + 1);
    setAnswers({});
    setAttempted({});
  }, [questions]);

  const results = useMemo(() => {
    const out: Record<string, GradingResult | GroupGradingResult> = {};
    for (const q of questions) {
      if (q.kind === 'group') {
        // كل جزء يُتحقق منه وحده، فالنتيجة تشمل الأجزاء التي ضغط الطالب تحقق عليها فقط
        const checkedParts = q.parts.filter(p => attempted[p.stableId]);
        if (checkedParts.length === 0) continue;

        const full = gradeQuestionGroup(q, answers);
        const correctParts = checkedParts.filter(p => full.partsResults[p.stableId].isCorrect).length;
        out[q.stableId] = {
          ...full,
          correctParts,
          isFullyCorrect: correctParts === q.parts.length,
          partsResults: Object.fromEntries(checkedParts.map(p => [p.stableId, full.partsResults[p.stableId]])),
        };
      } else if (attempted[q.stableId]) {
        out[q.stableId] = gradeSingleQuestion(q, answers[q.stableId] ?? null);
      }
    }
    return out;
  }, [questions, answers, attempted]);

  return { questions, answers, attempted, results, select, canCheck, check, regenerate };
}
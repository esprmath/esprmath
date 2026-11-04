// src/components/questions/IdeaQuestions.tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useQuestionSet } from './useQuestionSet';
import QuestionRenderer from './QuestionRenderer';
import { legacyToItems } from '@/lib/questions/legacy';
import { questionKey } from '@/lib/questions/engine/generator';
import type { Idea } from '@/types/math';
import type { QuestionItem } from '@/lib/questions/types';
import s from './IdeaQuestions.module.css';

const EMPTY: QuestionItem[] = [];

interface Props {
  idea: Idea;
  stableKey: string;
  onQuestionResult: (questionId: string, isCorrect: boolean) => void;
  onOpenCanvas?: (image?: string, math?: string, storageKey?: string) => void;
  onTutorContext?: (context: string) => void;
}

export default function IdeaQuestions({ idea, stableKey, onQuestionResult, onOpenCanvas, onTutorContext }: Props) {
  const items = useMemo<QuestionItem[]>(
    () => {
      if (idea.questions) return idea.questions;
      if (idea.practiceQuestion) {
        return legacyToItems(idea.practiceQuestion, stableKey);
      }
      return EMPTY;
    },
    [idea.questions, idea.practiceQuestion, stableKey]
  );

  const { questions, answers, attempted, results, select, check, canCheck, regenerate } =
    useQuestionSet(items, stableKey);

  const onResultRef = useRef(onQuestionResult);
  useEffect(() => { onResultRef.current = onQuestionResult; }, [onQuestionResult]);

  // نبلّغ عن كل نتيجة مرة واحدة. سؤال الأجزاء لا يُحسب صح إلا بعد حل كل أجزائه
  const reported = useRef(new Set<string>());
  useEffect(() => {
    for (const q of questions) {
      const r = results[q.stableId];
      if (!r) continue;
      const isCorrect = 'isFullyCorrect' in r ? r.isFullyCorrect : r.isCorrect;
      const questionId = q.kind === 'generated' ? questionKey(q) : q.stableId;
      const token = `${questionId}:${isCorrect}`;
      if (reported.current.has(token)) continue;
      reported.current.add(token);
      onResultRef.current(questionId, isCorrect);
    }
  }, [questions, results]);

  if (questions.length === 0) {
    return <div className={s.empty}>لا توجد أسئلة تدريبية مضافة لهذه الفكرة حالياً.</div>;
  }

  // ✅ التحقق الذكي: هل توجد أسئلة ديناميكية (قوالب) في هذه الفكرة؟
  const hasTemplates = items.some((i) => 'templateId' in i);

  return (
    <div className={s.list}>
      {questions.map((q) => (
        <div key={q.stableId} className={s.questionWrapper}>
          <QuestionRenderer
            question={q}
            answers={answers}
            attempted={attempted}
            results={results}
            select={select}
            check={check}
            canCheck={canCheck}
            onOpenCanvas={onOpenCanvas}
            onTutorContext={onTutorContext}
          />
        </div>
      ))}

      {/* ✅ زر التوليد يظهر فقط إذا كانت هناك أسئلة ديناميكية */}
      {hasTemplates && (
        <button
          type="button"
          className={s.regen}
          onClick={regenerate}
        >
          🔄 توليد أسئلة جديدة
        </button>
      )}
    </div>
  );
}
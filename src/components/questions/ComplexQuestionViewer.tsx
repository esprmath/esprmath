// src/components/questions/ComplexQuestionViewer.tsx
'use client';

import { useState } from 'react';
import Tex from './Tex';
import styles from './ComplexQuestionViewer.module.css';
import type { Question, QuestionGroup, OptionId } from '@/lib/questions/types';

interface Props {
  question: QuestionGroup;
  answers: Record<string, OptionId>;
  attempted: Record<string, boolean>;
  select: (questionId: string, optionId: OptionId, partId?: string) => void;
  check: (q: Question) => void;
  canCheck: (q: Question) => boolean;
  onOpenCanvas?: (image?: string, math?: string, storageKey?: string) => void;
}

export default function ComplexQuestionViewer({
  question,
  answers,
  attempted,
  select,
  check,
  canCheck,
  onOpenCanvas,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { parts } = question;
  const part = parts[activeIndex];

  const isCorrectPart = (id: string, correctId: OptionId) => answers[id] === correctId;
  const done = !!attempted[part.stableId];
  const correct = isCorrectPart(part.stableId, part.correctId);
  const solvedCount = parts.filter(
    (p) => attempted[p.stableId] && isCorrectPart(p.stableId, p.correctId)
  ).length;

  const handleCheck = () => {
    check(part); // يسجّل محاولة هذا الجزء
    // إذا كل الأجزاء صحيحة نسجّل محاولة المجموعة (لاحتفال إكمال الفكرة)
    if (parts.every((p) => isCorrectPart(p.stableId, p.correctId))) check(question);
  };

  return (
    <div className={styles.container}>
      {/* رأس السؤال الرئيسي مع الصورة المصغرة الموحدة (لا تأخذ مساحة كبيرة) */}
      <div className={`${styles.topSection} ${question.graphImage ? styles.hasGraph : ''}`}>
        <div className={styles.questionMain}>
          <div className={styles.questionBadge}>
            سؤال متعدد الأجزاء • {solvedCount}/{parts.length} محلولة
          </div>
          <h3 className={styles.mainTitle}>{question.questionText}</h3>
        </div>

        {question.graphImage && (
          <div className={styles.graphWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={question.graphImage}
              alt="رسم السؤال"
              className={styles.graphImage}
              style={{ maxHeight: '140px', objectFit: 'contain' }} // تقييد الحجم لكي لا تأخذ مساحة كبيرة
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
      </div>

      {/* شريط التبويبات العلوي لاختيار الجزئية */}
      <div className={styles.tabBar} role="tablist">
        {parts.map((p, idx) => {
          const tried = !!attempted[p.stableId];
          const icon = tried ? (isCorrectPart(p.stableId, p.correctId) ? '✅' : '❌') : '';
          return (
            <button
              key={p.stableId}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              className={`${styles.tab} ${idx === activeIndex ? styles.tabActive : ''}`}
              onClick={() => setActiveIndex(idx)}
            >
              <span className={styles.tabIcon}>{icon}</span>
              <span className={styles.tabLabel}>الجزئية {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* عرض الجزئية النشطة والمختارة فقط */}
      <div className={styles.activePart}>
        <div className={styles.partHeader}>
          <div className={styles.partTitle}>{part.questionText}</div>
          {part.mathExpression && (
            <div className={styles.mathBox}>
              <Tex math={part.mathExpression} block />
            </div>
          )}
        </div>

        {onOpenCanvas && (part.mathExpression || question.graphImage) && (
          <button
            type="button"
            className={styles.canvasBtn}
            onClick={() =>
              onOpenCanvas(question.graphImage, part.mathExpression, `q_${part.stableId}`)
            }
          >
            ✍️ افتح صفحة الحل الكاملة (للحل والرسم)
          </button>
        )}

        <div className={styles.optionsList}>
          {part.options.map((opt) => {
            const selected = answers[part.stableId] === opt.id;
            return (
              <label
                key={opt.id}
                className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
              >
                <input
                  type="radio"
                  name={part.stableId}
                  checked={selected}
                  onChange={() => select(part.stableId, opt.id)}
                />
                <span className={styles.optionText}>
                  {opt.math ? <Tex math={opt.text} /> : opt.text}
                </span>
              </label>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.checkBtn}
          disabled={!canCheck(part)}
          onClick={handleCheck}
        >
          تحقق من إجابة الجزئية ✅
        </button>

        {done && (
          <div
            className={`${styles.feedback} ${correct ? styles.feedbackCorrect : styles.feedbackWrong}`}
          >
            <div className={styles.feedbackTitle}>
              {correct ? '✅ إجابة الجزئية صحيحة!' : '❌ إجابة خاطئة، حاول مرة أخرى!'}
            </div>

            {correct && part.steps && (
              <div className={styles.steps}>
                <div className={styles.stepsHeader}>💡 خطوات الحل:</div>
                {part.steps.map((step, i) => (
                  <div key={i} className={styles.step}>
                    <span>{step.text}</span>
                    {step.math && <Tex math={step.math} />}
                  </div>
                ))}
              </div>
            )}

            {correct && activeIndex < parts.length - 1 && (
              <button
                type="button"
                className={styles.nextBtn}
                onClick={() => setActiveIndex(activeIndex + 1)}
              >
                الجزئية التالية ←
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
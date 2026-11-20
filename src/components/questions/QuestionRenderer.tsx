// src/components/questions/QuestionRenderer.tsx
'use client';

import { memo, useEffect, useState, type ReactNode } from 'react';
import { describeQuestionForTutor } from '@/lib/questions/tutorContext';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import styles from './QuestionRenderer.module.css';
import type { Question, OptionId } from '@/lib/questions/types';
import type { GradingResult, GroupGradingResult } from '@/lib/questions/engine/grader';

const Tex = memo(({ math, block }: { math: string; block?: boolean }) =>
  block ? <BlockMath math={math} /> : <InlineMath math={math} />
);

interface QuestionRendererProps {
  question: Question;
  answers: Record<string, OptionId>;
  attempted: Record<string, boolean>;
  results: Record<string, GradingResult | GroupGradingResult>;
  select: (questionId: string, optionId: OptionId, partId?: string) => void;
  check: (q: Question) => void;
  canCheck: (q: Question) => boolean;
  onOpenCanvas?: (image?: string, math?: string, storageKey?: string) => void;
  onTutorContext?: (context: string) => void;
  /** زر إضافي يظهر جنب «سبورة الحل» في نفس الصف، مثل «سؤال جديد» */
  extraAction?: ReactNode;
}

export default function QuestionRenderer({
  question,
  answers,
  attempted,
  results,
  select,
  check,
  canCheck,
  onOpenCanvas,
  onTutorContext,
  extraAction,
}: QuestionRendererProps) {
  const [activePartIndex, setActivePartIndex] = useState(0);

  // نخبر فيكتور بالسؤال أو الجزء المعروض حاليًا
  useEffect(() => {
    if (!onTutorContext) return;
    const shown = question.kind === 'group' ? question.parts[activePartIndex] : question;
    onTutorContext(describeQuestionForTutor({
      questionText: question.questionText,
      partText: question.kind === 'group' ? shown.questionText : undefined,
      math: shown.mathExpression,
      options: shown.options.map((o) => `${o.id}) ${o.text}`),
      correctAnswer: shown.options.find((o) => o.id === shown.correctId)?.text,
      steps: shown.steps,
      hasGraph: Boolean(question.graphImage),
    }));
  }, [question, activePartIndex, onTutorContext]);

  const isAttempted = attempted[question.stableId];
  const result = results[question.stableId];
  
  const isCorrect = result
    ? question.kind === 'group'
      ? (result as GroupGradingResult).isFullyCorrect
      : (result as GradingResult).isCorrect
    : false;

  const renderOption = (qId: string, opt: { id: OptionId; text: string; math?: boolean }, partId?: string) => {
    const isSelected = answers[partId ?? qId] === opt.id;
    const inputId = `${qId}-${partId ?? 'main'}-${opt.id}`;

    return (
      <label key={opt.id} htmlFor={inputId} className={`${styles.optionLabel} ${isSelected ? styles.selected : ''}`}>
        <input
          type="radio"
          id={inputId}
          name={partId ?? qId}
          checked={isSelected}
          onChange={() => select(qId, opt.id, partId)}
        />
        <span className={styles.optionText}>
          {opt.math ? <Tex math={opt.text} /> : opt.text}
        </span>
      </label>
    );
  };

  const renderSteps = (steps: { text: string; math?: string }[] | undefined) => {
    if (!steps) return null;
    return (
      <div className={styles.stepsContainer}>
        <div className={styles.stepsHeader}>💡 خطوات الحل:</div>
        {steps.map((step, idx) => (
          <div key={idx} className={styles.stepItem}>
            <span>{step.text}</span>
            {step.math && <Tex math={step.math} />}
          </div>
        ))}
      </div>
    );
  };

  const renderCanvasButton = (q: Question, storageKey: string, customMath?: string) => {
    if (!onOpenCanvas || (!customMath && !question.graphImage)) return null;
    return (
      <button
        type="button"
        className={styles.canvasBtn}
        onClick={() => onOpenCanvas(question.graphImage, customMath ?? question.mathExpression, storageKey)}
      >
        سبورة الحل ✍️
      </button>
    );
  };

  return (
    <div className={styles.questionCard}>
      <style jsx>{`
        /* تصميم الشاشات الكبيرة: سؤال يمين، صورة يسار */
        .group-container {
          background: #ffffff;
          border: 1px solid #e6dec5;
          border-radius: 14px;
          padding: 24px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.03);
          display: grid;
          grid-template-columns: ${question.graphImage ? '1fr 1.2fr' : '1fr'};
          gap: 24px;
          align-items: start;
        }
        .question-content-side {
          order: 1;
        }
        .image-side {
          order: 2;
        }
        .tab-btn {
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 0.95rem;
        }

        /* تصميم الجوال: الصورة في الأعلى ثم السؤال تحتها */
        @media (max-width: 768px) {
          .group-container {
            grid-template-columns: 1fr !important;
            padding: 14px !important;
            gap: 16px !important;
          }
          .image-side {
            order: 1 !important;
          }
          .question-content-side {
            order: 2 !important;
          }
          .tabs-wrapper {
            gap: 4px !important;
            overflow-x: auto;
            padding-bottom: 6px;
          }
          .tab-btn {
            padding: 6px 10px !important;
            font-size: 0.8rem !important;
            border-radius: 8px !important;
          }
        }
      `}</style>

      {/* رأس السؤال الرئيسي ونصه */}
      <div className={styles.questionHeader}>
        <h3 className={styles.questionTitle} style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2C3531', margin: 0 }}>
          {question.questionText}
        </h3>
        {question.mathExpression && question.kind !== 'group' && <Tex math={question.mathExpression} block />}
      </div>

      <div className={styles.questionBody}>
        {question.kind === 'group' ? (
          <div>
            {/* 1) تبويبات الأجزاء في الأعلى */}
            <div className="tabs-wrapper" style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              {question.parts.map((p, idx) => {
                const groupResult = result as GroupGradingResult;
                const pResult = groupResult?.partsResults?.[p.stableId];
                const pAttempted = pResult !== undefined;
                const pCorrect = pResult?.isCorrect;
                const icon = pAttempted ? (pCorrect ? '✅' : '❌') : '';

                return (
                  <button
                    key={p.stableId}
                    type="button"
                    onClick={() => setActivePartIndex(idx)}
                    className="tab-btn"
                    style={{
                      border: idx === activePartIndex ? '1px solid #8c5521' : '1px solid #e6dec5',
                      background: idx === activePartIndex ? '#8c5521' : '#ffffff',
                      color: idx === activePartIndex ? '#ffffff' : '#2C3531',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: idx === activePartIndex ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span>{icon}</span>
                    <span>الجزئية {idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* 2) الصندوق الموحد */}
            <div className="group-container">
              
              {/* قسم السؤال والخيارات */}
              {(() => {
                const part = question.parts[activePartIndex];
                const groupResult = result as GroupGradingResult;
                const partResult = groupResult?.partsResults?.[part.stableId];
                const partIsAttempted = partResult !== undefined;
                const partIsCorrect = partResult?.isCorrect;

                return (
                  <div className="question-content-side" style={{ width: '100%' }}>
                    <div className={styles.partTitle} style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#2C3531', marginBottom: '12px', lineHeight: '1.5' }}>
                      {part.questionText}
                    </div>
                    {part.mathExpression && <Tex math={part.mathExpression} block />}
                    
                    <div className={styles.optionsGrid} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {part.options.map((opt) => renderOption(question.stableId, opt, part.stableId))}
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button
                        type="button"
                        className={styles.checkBtn}
                        disabled={!canCheck(part as Question)}
                        onClick={() => check(part as Question)}
                      >
                        تحقق من إجابة الجزئية ✅
                      </button>

                      <div className={styles.toolRow}>
                        {renderCanvasButton(part as Question, `q_${part.stableId}`, part.mathExpression)}
                        {extraAction}
                      </div>
                    </div>

                    {partIsAttempted && partIsCorrect && part.steps && (
                      <div className={`${styles.partFeedback} ${styles.correctFeedback}`} style={{ marginTop: '12px' }}>
                        {renderSteps(part.steps)}
                      </div>
                    )}
                    {partIsAttempted && !partIsCorrect && (
                      <div className={`${styles.partFeedback} ${styles.incorrectFeedback}`} style={{ marginTop: '12px', color: '#b91c1c', fontWeight: 'bold', background: '#fee2e2', padding: '10px', borderRadius: '8px' }}>
                        ❌ إجابة خاطئة، حاول مرة أخرى!
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* قسم الصورة (تظهر بالأعلى في الجوال، وفي اليسار بالشاشات الكبيرة) */}
              {question.graphImage && (
                <div className="image-side" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: '#fdfbf7',
                  border: '1px solid #eef2f6',
                  borderRadius: '10px',
                  padding: '12px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <img 
                    src={question.graphImage} 
                    alt="Question Graph" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '260px', 
                      objectFit: 'contain', 
                      borderRadius: '6px' 
                    }} 
                  />
                </div>
              )}

            </div>
          </div>
        ) : (
          // الأسئلة العادية تعمل كما هي بدون أي تغيير
          <div className={styles.singleQuestion}>
            <div className={styles.optionsGrid}>
              {question.options.map((opt) => renderOption(question.stableId, opt))}
            </div>

            <div className={styles.actionArea}>
              <button
                type="button"
                className={styles.checkBtn}
                disabled={!canCheck(question)}
                onClick={() => check(question)}
              >
                تحقق من الإجابة ✅
              </button>

              {/* سبورة الحل وسؤال جديد جنب بعض في كل الشاشات */}
              <div className={styles.toolRow}>
                {renderCanvasButton(question, `q_${question.stableId}`, question.mathExpression)}
                {extraAction}
              </div>

              {isAttempted && isCorrect && (
                <div className={`${styles.feedback} ${styles.correctFeedback}`}>
                  <div className={styles.feedbackTitle}>✅ إجابة صحيحة!</div>
                  {renderSteps(question.steps)}
                </div>
              )}

              {isAttempted && !isCorrect && (
                <div className={`${styles.feedback} ${styles.incorrectFeedback}`}>
                  <div className={styles.feedbackTitle}>❌ إجابة خاطئة، حاول مرة أخرى!</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
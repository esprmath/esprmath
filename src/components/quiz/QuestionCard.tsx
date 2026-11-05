'use client';

import { BlockMath, InlineMath } from 'react-katex';
import type { QuizQuestion } from '@/lib/quiz/engine';
import s from './Quiz.module.css';

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(' ');

function OptionContent({ option, mathOptionIds }: { option: string; mathOptionIds?: string[] }) {
    const match = option.match(/^([A-D])\)\s*(.*)$/);
    const letter = match?.[1];
    const body = match ? match[2] : option;
    const isMath = (letter && mathOptionIds?.includes(letter)) || body.includes('\\');

    return (
        <>
            {letter && <span className={s.optionLetter}>{letter}</span>}
            {isMath ? <span className={s.ltr}><InlineMath math={body} /></span> : <span>{body}</span>}
        </>
    );
}

interface QuestionCardProps {
    question: QuizQuestion;
    selected: string;
    onSelect?: (option: string) => void;
    /** بعد التحقق: تُقفل الخيارات ويظهر الصحيح والخطأ */
    revealed: boolean;
}

export function QuestionCard({ question, selected, onSelect, revealed }: QuestionCardProps) {
    return (
        <div>
            {/* كل سطر يأخذ اتجاه لغته، حتى لا تنقلب علامات الترقيم في السؤال الإنجليزي */}
            <div className={s.questionText}>
                {question.questionText.split('\n').map((line, i) => (
                    <div key={i} dir="auto">{line}</div>
                ))}
            </div>

            {question.math && (
                <div className={s.mathBox}>
                    <BlockMath math={question.math} />
                </div>
            )}

            {question.image && (
                <img className={s.questionImage} src={question.image} alt="الرسم البياني للسؤال" />
            )}

            <div className={s.options}>
                {question.options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        disabled={revealed}
                        onClick={() => onSelect?.(option)}
                        aria-pressed={selected === option}
                        className={cx(
                            s.option,
                            selected === option && !revealed && s.optionSelected,
                            revealed && option === question.correctAnswer && s.optionCorrect,
                            revealed && selected === option && option !== question.correctAnswer && s.optionWrong
                        )}
                    >
                        <OptionContent option={option} mathOptionIds={question.mathOptionIds} />
                    </button>
                ))}
            </div>
        </div>
    );
}

export function Solution({ question }: { question: QuizQuestion }) {
    if (question.steps?.length) {
        return (
            <div className={s.solution}>
                <strong>طريقة الحل</strong>
                {question.steps.map((step, i) => (
                    <div key={i} className={s.solutionStep}>
                        <div>{step.text}</div>
                        {step.math && (
                            <div className={s.mathBox}>
                                <BlockMath math={step.math} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    if (!question.explanation) return null;
    return (
        <div className={s.solution}>
            <strong>طريقة الحل</strong>
            <div className={s.solutionStep}>{question.explanation}</div>
        </div>
    );
}

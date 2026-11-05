// src/components/AdditionalQuestionsView.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { generateFromTemplate } from '@/lib/questions/additional';
import { describeQuestionForTutor } from '@/lib/questions/tutorContext';
import type { ChapterData } from '@/types/math';
import styles from './AdditionalQuestionsView.module.css';

interface AdditionalQuestionsViewProps {
    questions: any[];
    chapters: ChapterData[];
    initialChapter: string | null;
    coursePath: string;
    backToModule: () => void;
    jumpToIdea: (chapterKey: string, ideaId: string) => void;
    onOpenCanvas: (image?: string, math?: string, storageKey?: string) => void;
    onQuestionResult: (ideaKey: string, questionId: string, isCorrect: boolean) => void;
    onTutorContext: (context: { chapter: string; ideaName: string; question: string } | null) => void;
}

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(' ');

function renderOptionContent(opt: string) {
    if (!opt.includes('\\')) return opt;
    return <span style={{ direction: 'ltr', display: 'inline-block' }}><InlineMath math={opt} /></span>;
}

function renderExplanation(text?: string) {
    if (!text) return null;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <div style={{ fontWeight: 'bold', color: '#16a34a', fontSize: '13px' }}>💡 خطوات الحل والتفصيل:</div>
            {text.split('\n').filter((line) => line.trim() !== '').map((line, idx) => (
                <div
                    key={idx}
                    style={{
                        background: '#ffffff',
                        border: '1px solid #bbf7d0',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: '#2C3531',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-line'
                    }}
                >
                    {line}
                </div>
            ))}
        </div>
    );
}

export default function AdditionalQuestionsView({
    questions,
    chapters,
    initialChapter,
    coursePath,
    backToModule,
    jumpToIdea,
    onOpenCanvas,
    onQuestionResult,
    onTutorContext,
}: AdditionalQuestionsViewProps) {
    const router = useRouter();

    const [selectedAdditionalChapterTab, setSelectedAdditionalChapterTab] = useState(
        chapters.some((chapter) => chapter.chapterNumber === initialChapter) ? initialChapter! : chapters[0]?.chapterNumber ?? ''
    );
    const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(0);

    // الإجابات الحالية. تُصفَّر عند مغادرة السؤال
    const [activeSubPartIndexMap, setActiveSubPartIndexMap] = useState<Record<string, number>>({});
    const [additionalSelected, setAdditionalSelected] = useState<Record<string, string>>({});
    const [additionalAttempted, setAdditionalAttempted] = useState<Record<string, boolean>>({});
    const [subPartSelectedOptionsMap, setSubPartSelectedOptionsMap] = useState<Record<string, string>>({});
    const [subPartAttemptedMap, setSubPartAttemptedMap] = useState<Record<string, boolean>>({});

    // 🧠 حالة لتخزين الأسئلة الديناميكية المولدة لكل قوالب الأسئلة الإضافية
    const [dynamicQuestionsCache, setDynamicQuestionsCache] = useState<Record<string, any>>({});

    // نتائج هذه الجلسة فقط، لتلوين أرقام الأسئلة بعد مغادرتها وتصفير إجاباتها
    const [sessionResults, setSessionResults] = useState<Record<string, boolean>>({});

    const sheetRef = useRef<HTMLDivElement>(null);
    const feedbackRef = useRef<HTMLDivElement>(null);

    // إذا نزل الطالب في الصفحة ثم غيّر السؤال، نرجعه لبداية الورقة
    const revealSheetTop = () => {
        setTimeout(() => {
            const top = sheetRef.current?.getBoundingClientRect().top;
            if (top !== undefined && top < 0) window.scrollBy({ top: top - 12, behavior: 'smooth' });
        }, 0);
    };

    const filteredAdditionalQuestions = questions.filter((q) => q.meta?.chapterNumber === selectedAdditionalChapterTab);

    // 🔄 تصفير إجابات السؤال تلقائياً بمجرد مغادرته أو الانتقال عنه
    useEffect(() => {
        return () => {
            if (selectedAdditionalChapterTab) {
                const prevUniqueKey = `${selectedAdditionalChapterTab}-${expandedQuestionIndex}`;
                const q = filteredAdditionalQuestions[expandedQuestionIndex];

                if (q) {
                    const hasSubParts = q.subQuestions && q.subQuestions.length > 0;
                    if (hasSubParts) {
                        q.subQuestions.forEach((_: any, sIdx: number) => {
                            const subUniqueKey = `${prevUniqueKey}-sub-${sIdx}`;
                            setSubPartSelectedOptionsMap(prev => { const c = {...prev}; delete c[subUniqueKey]; return c; });
                            setSubPartAttemptedMap(prev => { const c = {...prev}; delete c[subUniqueKey]; return c; });
                        });
                    } else {
                        setAdditionalSelected(prev => { const c = {...prev}; delete c[prevUniqueKey]; return c; });
                        setAdditionalAttempted(prev => { const c = {...prev}; delete c[prevUniqueKey]; return c; });
                    }
                }
            }
        };
    }, [expandedQuestionIndex, selectedAdditionalChapterTab]);

    // ⚡ دالة توليد أو جلب السؤال (سواء كان ثابتاً أو معتمداً على قالب ديناميكي)
    const getActiveQuestionData = (baseQ: any, qUniqueKey: string) => {
        if (!baseQ.templateId) return baseQ;
        if (dynamicQuestionsCache[qUniqueKey]) return dynamicQuestionsCache[qUniqueKey];

        const shownKeys = new Set(Object.values(dynamicQuestionsCache).map((q: any) => q.generatedKey as string));
        const generated = generateFromTemplate(baseQ, shownKeys);
        setDynamicQuestionsCache(prev => ({ ...prev, [qUniqueKey]: generated }));
        return generated;
    };

    const handleRegenerateTemplate = (baseQ: any, qUniqueKey: string) => {
        const shownKeys = new Set(Object.values(dynamicQuestionsCache).map((q: any) => q.generatedKey as string));
        const newGenerated = generateFromTemplate(baseQ, shownKeys);
        setDynamicQuestionsCache(prev => ({ ...prev, [qUniqueKey]: newGenerated }));

        // تصفير الإجابات عند توليد سؤال جديد من القالب
        setAdditionalSelected(prev => { const c = {...prev}; delete c[qUniqueKey]; return c; });
        setAdditionalAttempted(prev => { const c = {...prev}; delete c[qUniqueKey]; return c; });
        setSessionResults(prev => { const c = {...prev}; delete c[qUniqueKey]; return c; });
    };

    // نخبر فيكتور بالسؤال أو الجزء المعروض حاليًا
    const tutorQuestionKey = `${selectedAdditionalChapterTab}-${expandedQuestionIndex}`;
    const tutorBaseQuestion = filteredAdditionalQuestions[expandedQuestionIndex];
    const tutorQuestion = tutorBaseQuestion?.templateId ? dynamicQuestionsCache[tutorQuestionKey] : tutorBaseQuestion;
    const tutorSubIndex = activeSubPartIndexMap[tutorQuestionKey] || 0;

    useEffect(() => {
        if (!tutorQuestion?.meta) {
            onTutorContext(null);
            return;
        }
        const shown = tutorQuestion.subQuestions?.[tutorSubIndex] ?? tutorQuestion;
        onTutorContext({
            chapter: tutorQuestion.meta.chapterNumber,
            ideaName: `فكرة ${tutorQuestion.meta.ideaNumber}: ${tutorQuestion.meta.ideaName}`,
            question: describeQuestionForTutor({
                questionText: tutorQuestion.questionText,
                partText: shown === tutorQuestion ? undefined : shown.questionText,
                math: shown.mathExpression,
                options: shown.options,
                correctAnswer: shown.correctAnswer,
                steps: shown.steps,
                explanation: shown.questionExplanation,
                hasGraph: Boolean(tutorQuestion.graphImage),
            }),
        });
    }, [tutorQuestion, tutorSubIndex, onTutorContext]);

    const chapterQuestions: Array<{ q: any; index: number }> = filteredAdditionalQuestions.map((q, index) => ({ q, index }));

    // حالة السؤال في شريط الأرقام: محلول، جزئيًا، خطأ، أو لم يبدأ
    const getQuestionStatus = (q: any, index: number): 'done' | 'progress' | 'wrong' | null => {
        const key = `${selectedAdditionalChapterTab}-${index}`;
        if (q.subQuestions && q.subQuestions.length > 0) {
            const results = q.subQuestions.map((_: any, sIdx: number) => sessionResults[`${key}-sub-${sIdx}`]);
            if (results.every((r: boolean | undefined) => r === true)) return 'done';
            return results.some((r: boolean | undefined) => r !== undefined) ? 'progress' : null;
        }
        if (sessionResults[key] === undefined) return null;
        return sessionResults[key] ? 'done' : 'wrong';
    };

    const solvedCount = chapterQuestions.filter(({ q, index }) => getQuestionStatus(q, index) === 'done').length;

    const openQuestion = (index: number, subIndex: number) => {
        setActiveSubPartIndexMap(prev => ({ ...prev, [`${selectedAdditionalChapterTab}-${index}`]: subIndex }));
        setExpandedQuestionIndex(index);
        revealSheetTop();
    };

    const renderQuestion = (baseQ: any, index: number) => {
        const qUniqueKey = `${selectedAdditionalChapterTab}-${index}`;
        const q = getActiveQuestionData(baseQ, qUniqueKey);

        const subQuestions: any[] = q.subQuestions || [];
        const hasSubParts = subQuestions.length > 0;
        const activeSubIdx = hasSubParts ? Math.min(activeSubPartIndexMap[qUniqueKey] || 0, subQuestions.length - 1) : 0;

        // الجزئية الحالية، أو السؤال نفسه إذا لم تكن له جزئيات
        const part = hasSubParts ? subQuestions[activeSubIdx] : q;
        const partKey = hasSubParts ? `${qUniqueKey}-sub-${activeSubIdx}` : qUniqueKey;
        const choice = (hasSubParts ? subPartSelectedOptionsMap[partKey] : additionalSelected[partKey]) || null;
        const attempted = (hasSubParts ? subPartAttemptedMap[partKey] : additionalAttempted[partKey]) || false;
        const isCorrect = choice === part.correctAnswer;

        const selectOption = (opt: string) => {
            if (hasSubParts) setSubPartSelectedOptionsMap(prev => ({ ...prev, [partKey]: opt }));
            else setAdditionalSelected(prev => ({ ...prev, [partKey]: opt }));
        };

        const checkAnswer = () => {
            if (hasSubParts) setSubPartAttemptedMap(prev => ({ ...prev, [partKey]: true }));
            else setAdditionalAttempted(prev => ({ ...prev, [partKey]: true }));
            setSessionResults(prev => ({ ...prev, [partKey]: isCorrect }));

            // سؤال الأجزاء لا يُحسب صح للإتقان إلا بعد حل كل أجزائه
            if (q.meta) {
                const countsAsCorrect = hasSubParts
                    ? subQuestions.every((_: any, sIdx: number) =>
                        sIdx === activeSubIdx ? isCorrect : sessionResults[`${qUniqueKey}-sub-${sIdx}`] === true)
                    : isCorrect;
                const ideaKey = `${q.meta.chapterNumber}-${q.meta.ideaAnchorId}`;
                onQuestionResult(ideaKey, q.generatedKey || `additional:${ideaKey}`, countsAsCorrect);
            }

            // ننزل بالصفحة إلى النتيجة والشرح
            setTimeout(() => {
                feedbackRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }, 60);
        };

        const position = chapterQuestions.findIndex((item) => item.index === index);
        const previousItem = chapterQuestions[position - 1];
        const nextItem = chapterQuestions[position + 1];
        const hasPrevious = activeSubIdx > 0 || Boolean(previousItem);
        const hasNext = (hasSubParts && activeSubIdx < subQuestions.length - 1) || Boolean(nextItem);

        const goPrevious = () => {
            if (activeSubIdx > 0) openQuestion(index, activeSubIdx - 1);
            else if (previousItem) openQuestion(previousItem.index, Math.max((previousItem.q.subQuestions?.length || 1) - 1, 0));
        };

        const goNext = () => {
            if (hasSubParts && activeSubIdx < subQuestions.length - 1) openQuestion(index, activeSubIdx + 1);
            else if (nextItem) openQuestion(nextItem.index, 0);
        };

        const openSolutionPage = () => {
            onOpenCanvas(q.graphImage, part.mathExpression, `add_q_${qUniqueKey}`);
        };

        return (
            <div className={styles.stage}>
                {q.meta && (
                    <div className={styles.stageHead}>
                        <div className={styles.ideaInfo}>
                            <span className={styles.ideaNumber}>{q.meta.ideaNumber}</span>
                            <span className={styles.ideaName}>{q.meta.ideaName}</span>
                        </div>
                        <div className={styles.headActions}>
                            {/* 🌟 زر توليد سؤال جديد إذا كان السؤال يعتمد على قالب ديناميكي */}
                            {baseQ.templateId && (
                                <button type="button" className={styles.linkBtn} onClick={() => handleRegenerateTemplate(baseQ, qUniqueKey)}>
                                    🔄 سؤال جديد
                                </button>
                            )}
                            <button
                                type="button"
                                className={styles.linkBtn}
                                onClick={() => jumpToIdea(q.meta.chapterNumber, q.meta.ideaAnchorId)}
                            >
                                الرجوع للفكرة ↗
                            </button>
                        </div>
                    </div>
                )}

                <div className={styles.paper}>
                    <div className={styles.questionText}>{q.questionText}</div>

                    {hasSubParts && (
                        <div className={styles.parts}>
                            {subQuestions.map((_: any, sIdx: number) => {
                                const result = sessionResults[`${qUniqueKey}-sub-${sIdx}`];
                                return (
                                    <button
                                        key={sIdx}
                                        type="button"
                                        onClick={() => setActiveSubPartIndexMap(prev => ({ ...prev, [qUniqueKey]: sIdx }))}
                                        className={cx(
                                            styles.partBtn,
                                            sIdx === activeSubIdx && styles.partBtnActive,
                                            result === true && styles.partBtnDone,
                                            result === false && styles.partBtnWrong
                                        )}
                                    >
                                        {result === true && '✓ '}
                                        {result === false && '✕ '}
                                        الجزئية {sIdx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className={cx(styles.workspace, q.graphImage && styles.workspaceWithGraph)}>
                        <div>
                            {hasSubParts && part.questionText && (
                                <div className={styles.partText}>{part.questionText}</div>
                            )}

                            {part.mathExpression && (
                                <div className={styles.mathCard}>
                                    <BlockMath math={part.mathExpression} />
                                </div>
                            )}

                            <div className={styles.options}>
                                {part.options?.map((opt: string) => {
                                    const match = opt.match(/^([A-D])\)\s*(.*)$/);
                                    const isChosen = choice === opt;
                                    const isAnswer = opt === part.correctAnswer;
                                    return (
                                        <label
                                            key={opt}
                                            className={cx(
                                                styles.option,
                                                isChosen && !attempted && styles.optionSelected,
                                                attempted && isAnswer && styles.optionCorrect,
                                                attempted && isChosen && !isAnswer && styles.optionWrong
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name={`additional-${partKey}`}
                                                checked={isChosen}
                                                onChange={() => selectOption(opt)}
                                            />
                                            {match && <span className={styles.optionLetter}>{match[1]}</span>}
                                            <span className={styles.optionBody}>
                                                {match && part.mathOptionIds?.includes(match[1])
                                                    ? <InlineMath math={match[2]} />
                                                    : renderOptionContent(match ? match[2] : opt)}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>

                            {attempted && (
                                <div ref={feedbackRef} className={cx(styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong)}>
                                    <div className={styles.feedbackTitle}>
                                        {isCorrect ? '✓ إجابة صحيحة، كفو!' : '✕ إجابة خاطئة'}
                                    </div>
                                    {part.steps ? (
                                        <div className={styles.steps}>
                                            {part.steps.map((step: { text: string; math?: string }, stepIdx: number) => (
                                                <div key={stepIdx} className={styles.step}>
                                                    <div>{step.text}</div>
                                                    {step.math && (
                                                        <div className={styles.stepMath}>
                                                            <BlockMath math={step.math} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : renderExplanation(part.questionExplanation)}
                                </div>
                            )}
                        </div>

                        {q.graphImage && (
                            <div className={styles.graphCard}>
                                <img src={q.graphImage} alt="الرسم البياني للسؤال" />
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button type="button" className={styles.checkBtn} onClick={checkAnswer} disabled={!choice}>
                        تحقق من الإجابة
                    </button>
                    <button type="button" className={styles.secondaryBtn} onClick={openSolutionPage} title="افتح صفحة الحل والرسم">
                        ✍️<span className={styles.solveLabel}> صفحة الحل</span>
                    </button>
                    <div className={styles.stepper}>
                        <button type="button" className={styles.secondaryBtn} onClick={goPrevious} disabled={!hasPrevious} aria-label="السابق">
                            →
                        </button>
                        <button type="button" className={styles.secondaryBtn} onClick={goNext} disabled={!hasNext} aria-label="التالي">
                            ←
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const expandedQuestion = filteredAdditionalQuestions[expandedQuestionIndex];
    const activeChapterData = chapters.find((chapter) => chapter.chapterNumber === selectedAdditionalChapterTab);

    return (
        <div className={styles.shell}>
            <div className={styles.topbar}>
                <div className={styles.heading}>
                    <div className={styles.eyebrow}>
                        الأسئلة الإضافية{chapterQuestions.length > 0 && ` · حللت ${solvedCount} من ${chapterQuestions.length} في هذه الجلسة`}
                    </div>
                    <div className={styles.title} dir="auto">
                        {activeChapterData?.chapterTitle || 'اختر شابتر'}
                    </div>
                </div>
                <div className={styles.topActions}>
                    <button type="button" onClick={backToModule} className={styles.ghostBtn}>→ الشباتر</button>
                    <button type="button" onClick={() => router.push(coursePath)} className={styles.ghostBtn}>→ الكورس</button>
                </div>
            </div>

            <div className={styles.tabs}>
                {chapters.map(({ chapterNumber: chKey }) => {
                    const countForCh = questions.filter(q => q.meta?.chapterNumber === chKey).length;
                    return (
                        <button
                            key={chKey}
                            type="button"
                            onClick={() => {
                                setSelectedAdditionalChapterTab(chKey);
                                setExpandedQuestionIndex(0);
                            }}
                            className={cx(styles.tab, selectedAdditionalChapterTab === chKey && styles.tabActive)}
                        >
                            <span>{chKey}</span>
                            <span className={styles.tabCount}>{countForCh}</span>
                        </button>
                    );
                })}
            </div>

            <div className={styles.sheet} ref={sheetRef}>
                <div className={styles.rail}>
                    <div className={styles.railInner}>
                        <span className={styles.railLabel}>الأفكار</span>
                        {chapterQuestions.map(({ q, index }) => {
                            const status = getQuestionStatus(q, index);
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        setExpandedQuestionIndex(index);
                                        revealSheetTop();
                                    }}
                                    title={q.meta?.ideaName}
                                    aria-label={`فكرة ${q.meta?.ideaNumber}: ${q.meta?.ideaName}`}
                                    aria-current={expandedQuestionIndex === index}
                                    className={cx(
                                        styles.qDot,
                                        expandedQuestionIndex === index && styles.qDotActive,
                                        status === 'done' && styles.qDotDone,
                                        status === 'progress' && styles.qDotProgress,
                                        status === 'wrong' && styles.qDotWrong
                                    )}
                                >
                                    {q.meta?.ideaNumber}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {expandedQuestion ? (
                    renderQuestion(expandedQuestion, expandedQuestionIndex)
                ) : (
                    <div className={styles.empty}>لا توجد أسئلة إضافية في هذا الشابتر بعد</div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import GuideTip from '@/components/GuideTip';
import { ChapterData } from '@/types/math';
import { chapter1_5Data } from './1.5';
import { chapter1_6Data } from './1.6';
import { chapter2_1Data } from './2.1';
import { chapter1_8Data } from './1.8';
import { chapter3_4Data } from './3.4';

import { moreQuesData } from './moreques';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

type ChapterKey = '1.5' | '1.6' | '1.8' | '2.1' | '3.4' | 'additional-questions';

export default function ModulePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const allChaptersMap: Record<Exclude<ChapterKey, 'additional-questions'>, ChapterData> = {
        '1.5': chapter1_5Data,
        '1.6': chapter1_6Data,
        '2.1': chapter2_1Data,
        '1.8': chapter1_8Data,
        '3.4': chapter3_4Data,

    };

    const validChapters = Object.keys(allChaptersMap) as ChapterKey[];

    const chapterParam = searchParams.get('chapter') as ChapterKey | null;
    const ideaParam = searchParams.get('idea');

    const initialChapter: ChapterKey = (chapterParam && (validChapters.includes(chapterParam) || chapterParam === 'additional-questions')) ? chapterParam : '1.5';
    const [activeChapter, setActiveChapter] = useState<ChapterKey>(initialChapter);

    const isAdditionalView = activeChapter === 'additional-questions';
    const currentChapterData = !isAdditionalView ? allChaptersMap[activeChapter as Exclude<ChapterKey, 'additional-questions'>] || chapter1_5Data : null;
    const [activeIdeaId, setActiveIdeaId] = useState(currentChapterData ? currentChapterData.ideas[0].id : '');

    const [completedItems, setCompletedItems] = useState<string[]>([]);

    // للأسئلة الرئيسية العادية
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [hasAttempted, setHasAttempted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // للأسئلة الإضافية في الصفحة الخاصة بها
    const [additionalSelected, setAdditionalSelected] = useState<Record<number, string>>({});
    const [additionalAttempted, setAdditionalAttempted] = useState<Record<number, boolean>>({});

    // حالات الأجزاء المتعددة (subQuestions) للأفكار داخل الشباتر
    const [activeSubPartIndex, setActiveSubPartIndex] = useState<number>(0);
    const [subPartSelectedOptions, setSubPartSelectedOptions] = useState<Record<number, string>>({});
    const [subPartAttempted, setSubPartAttempted] = useState<Record<number, boolean>>({});

    // حالات الأجزاء المتعددة للأسئلة الإضافية
    const [activeSubPartIndexMap, setActiveSubPartIndexMap] = useState<Record<number, number>>({});
    const [subPartSelectedOptionsMap, setSubPartSelectedOptionsMap] = useState<Record<string, string>>({});
    const [subPartAttemptedMap, setSubPartAttemptedMap] = useState<Record<string, boolean>>({});

    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const isChapterView = chapterParam !== null && (validChapters.includes(chapterParam as ChapterKey) || chapterParam === 'additional-questions');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('last_studied_module', '1');
            const savedProgress = localStorage.getItem('module_1_completed_items');
            if (savedProgress) setCompletedItems(JSON.parse(savedProgress));
        }
    }, []);

    useEffect(() => {
        if (chapterParam && (validChapters.includes(chapterParam as ChapterKey) || chapterParam === 'additional-questions')) {
            setActiveChapter(chapterParam);
            if (chapterParam !== 'additional-questions') {
                const targetChapterData = allChaptersMap[chapterParam as Exclude<ChapterKey, 'additional-questions'>];
                const ideasForChapter = targetChapterData.ideas;
                const validIdea = ideaParam && ideasForChapter.some(idea => idea.id === ideaParam)
                    ? ideaParam
                    : ideasForChapter[0].id;

                setActiveIdeaId(validIdea);
            }
            setSelectedOption(null);
            setHasAttempted(false);
            setErrorMsg('');
            setActiveSubPartIndex(0);
            setSubPartSelectedOptions({});
            setSubPartAttempted({});
        }
    }, [chapterParam, ideaParam]);

    const totalIdeasCount = Object.values(allChaptersMap).reduce((acc, ch) => acc + ch.ideas.length, 0);
    const completedIdeasCount = Object.keys(allChaptersMap).reduce((acc, chKey) => {
        const chData = allChaptersMap[chKey as Exclude<ChapterKey, 'additional-questions'>];
        const count = chData.ideas.filter(idea => completedItems.includes(`${chKey}-${idea.id}`)).length;
        return acc + count;
    }, 0);
    const totalProgress = totalIdeasCount > 0 ? Math.round((completedIdeasCount / totalIdeasCount) * 100) : 0;

    function openChapter(chKey: ChapterKey) {
        router.push(`/workspace/101/1?chapter=${encodeURIComponent(chKey)}`);
    }

    function backToModule() {
        router.push('/workspace/101/1');
    }

    function handleChapterSwitch(chKey: ChapterKey, ideaId: string) {
        setActiveChapter(chKey);
        setActiveIdeaId(ideaId);
        setSelectedOption(null);
        setHasAttempted(false);
        setErrorMsg('');
        setActiveSubPartIndex(0);
        setSubPartSelectedOptions({});
        setSubPartAttempted({});

        router.push(`/workspace/101/1?chapter=${encodeURIComponent(chKey)}&idea=${encodeURIComponent(ideaId)}`);
    }

    const currentIdeaObj = currentChapterData?.ideas.find(i => i.id === activeIdeaId) || currentChapterData?.ideas[0];

    function handleQuizVerify() {
        if (!currentIdeaObj || !currentIdeaObj.practiceQuestion) return;
        setErrorMsg('');
        setHasAttempted(true);

        const currentKey = `${activeChapter}-${activeIdeaId}`;
        const isCorrect = selectedOption === currentIdeaObj.practiceQuestion.correctAnswer;

        if (isCorrect) {
            setIsFadingOut(false);
            setShowSuccessToast(true);

            setTimeout(() => { setIsFadingOut(true); }, 2000);
            setTimeout(() => { setShowSuccessToast(false); setIsFadingOut(false); }, 2500);

            let updatedList = [...completedItems];
            if (!updatedList.includes(currentKey)) {
                updatedList.push(currentKey);
                setCompletedItems(updatedList);
                localStorage.setItem('module_1_completed_items', JSON.stringify(updatedList));
            }
        } else {
            setErrorMsg('❌ إجابة خاطئة، حاول مرة أخرى!');
        }
    }

    function handleSubPartVerify(partIndex: number) {
        setSubPartAttempted(prev => ({ ...prev, [partIndex]: true }));
    }

    function handleAdditionalVerify(index: number) {
        setAdditionalAttempted(prev => ({ ...prev, [index]: true }));
    }

    function renderOptionContent(opt: string) {
        if (opt.includes('\\')) {
            const match = opt.match(/^([A-D]\))\s*(.*)$/);
            if (match) {
                return (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', direction: 'ltr' }}>
                        <span>{match[1]}</span>
                        <InlineMath math={match[2]} />
                    </span>
                );
            }
            return <span style={{ direction: 'ltr', display: 'inline-block' }}><InlineMath math={opt} /></span>;
        }
        return opt;
    }

    return (
        <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', color: '#2C3531', fontFamily: 'sans-serif', margin: 0, padding: 0, paddingBottom: '80px', position: 'relative' }}>
            <Navbar isLoggedIn={true} />

            {!isChapterView && (
                <GuideTip
                    id="module1-chapters-list-intro"
                    text="مرحباً بك في قائمة الشباتر! 📚 اختر الشابتر للدراسة أو انتقل إلى قسم 'الأسئلة الإضافية'."
                />
            )}

            {isChapterView && !isAdditionalView && currentChapterData && (
                <GuideTip
                    id={`chapter-${activeChapter}-intro`}
                    text={`أهلاً بك في شابتر ${currentChapterData.chapterTitle}! 💡 تصفح الأفكار وشاهد الشرح.`}
                />
            )}

            {isAdditionalView && (
                <GuideTip
                    id="additional-questions-intro"
                    text="أهلاً بك في صفحة الأسئلة الإضافية! ➕ تدرب على أسئلة إضافية مرتبطة بأفكار المقرر."
                />
            )}

            {showSuccessToast && (
                <div style={{
                    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: '#CDD4B1', color: '#2C3531', border: '1px solid #b8c29e',
                    padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    zIndex: 9999, fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px',
                    opacity: isFadingOut ? 0 : 1, transition: 'opacity 0.5s ease-in-out'
                }}>
                    <span>🎉 كفو! حليت صح وتم حفظ تقدمك</span>
                </div>
            )}

            <div style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 20px' }}>

                <div style={{ marginBottom: '16px' }}>
                    <Link href="/workspace/101" style={{ textDecoration: 'none', background: '#FEECD0', border: '1px solid #e6dec5', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', color: '#8c5521', fontSize: '13px' }}>
                        ⬅️ Back to Workspace
                    </Link>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#DCA27B' }}>
                          📘 Module 1 (التقدم الإجمالي: {totalProgress}%)
                        </span>
                        <span style={{ fontSize: '12px', color: '#8c5521', fontWeight: 'bold' }}>جميع الشباتر متاحة</span>
                    </div>
                    <div style={{ background: '#f0ebdc', borderRadius: '20px', height: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${totalProgress}%`, background: '#CDD4B1', height: '100%', transition: 'width 0.3s' }} />
                    </div>
                </div>

                {/* قائمة الشباتر الرئيسية */}
                {!isChapterView && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                        {(Object.keys(allChaptersMap) as ChapterKey[]).map((chKey) => {
                            const chData = allChaptersMap[chKey as Exclude<ChapterKey, 'additional-questions'>];
                            const chCompletedCount = chData.ideas.filter(idea => completedItems.includes(`${chKey}-${idea.id}`)).length;
                            const chProgress = Math.round((chCompletedCount / chData.ideas.length) * 100);

                            return (
                                <button
                                    key={chKey}
                                    type="button"
                                    onClick={() => openChapter(chKey)}
                                    style={{
                                        width: '100%', background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '14px',
                                        padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', cursor: 'pointer', textAlign: 'right', color: '#2C3531'
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '10px' }}>
                                        📖 Chapter {chData.chapterNumber}: {chData.chapterTitle}
                                    </div>
                                    <div style={{ color: '#8c5521', fontSize: '12px', marginBottom: '12px' }}>
                                        {chData.ideas.length} أفكار رئيسية • مكتمل {chCompletedCount}/{chData.ideas.length}
                                    </div>
                                    <div style={{ background: '#f0ebdc', height: '7px', borderRadius: '20px', overflow: 'hidden' }}>
                                        <div style={{ width: `${chProgress}%`, background: '#CDD4B1', height: '100%' }} />
                                    </div>
                                    <div style={{ marginTop: '14px', color: '#DCA27B', fontWeight: 'bold', fontSize: '13px' }}>
                                        فتح الشابتر والدخول للأفكار ←
                                    </div>
                                </button>
                            );
                        })}

                        <button
                            type="button"
                            onClick={() => openChapter('additional-questions')}
                            style={{
                                width: '100%', background: '#FEECD0', border: '1px solid #DCA27B', borderRadius: '14px',
                                padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', cursor: 'pointer', textAlign: 'right', color: '#2C3531'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '10px', color: '#8c5521' }}>
                                ➕ الأسئلة الإضافية للمقرر
                            </div>
                            <div style={{ color: '#8c5521', fontSize: '12px', marginBottom: '26px' }}>
                                تدرب على أسئلة إضافية مرتبطة بأفكار الشباتر مع الشرح الفوري.
                            </div>
                            <div style={{ marginTop: '14px', color: '#8c5521', fontWeight: 'bold', fontSize: '13px' }}>
                                فتح صفحة الأسئلة الإضافية ←
                            </div>
                        </button>
                    </div>
                )}

                {/* صفحة الأسئلة الإضافية الشاملة */}
                {isAdditionalView && (
                    <>
                        <div style={{ marginBottom: '16px' }}>
                            <button
                                type="button"
                                onClick={backToModule}
                                style={{
                                    background: '#FEECD0', border: '1px solid #e6dec5', padding: '8px 16px',
                                    borderRadius: '8px', fontWeight: 'bold', color: '#8c5521', fontSize: '13px', cursor: 'pointer'
                                }}
                            >
                                ⬅️ الرجوع للقائمة الرئيسية
                            </button>
                        </div>

                        <div style={{ background: '#fff', border: '1px solid #e6dec5', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                            <h2 style={{ margin: '0 0 6px 0', color: '#2C3531', fontSize: '1.25rem' }}>
                                ➕ صفحة الأسئلة الإضافية الشاملة
                            </h2>
                            <p style={{ color: '#8c5521', fontSize: '13px', margin: '0 0 20px 0' }}>تجميع لجميع الأسئلة الإضافية المستخرجة مع الشرح والتفاعل.</p>

                            {moreQuesData.length === 0 ? (
                                <div style={{ padding: '30px', textAlign: 'center', color: '#8c5521', background: '#FAFAFA', borderRadius: '12px' }}>
                                    لا توجد أسئلة إضافية مضافة حالياً في الملف.
                                </div>
                            ) : (
                                moreQuesData.map((q, index) => {
                                    const activeSubIdx = activeSubPartIndexMap[index] || 0;
                                    const userChoice = additionalSelected[index] || null;
                                    const isAttempted = additionalAttempted[index] || false;
                                    const isCorrect = userChoice === q.correctAnswer;

                                    return (
                                        <div key={index} style={{ marginBottom: '24px', padding: '18px', background: '#FAFAFA', borderRadius: '12px', border: '1px solid #eae5d5' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '10px', color: '#2C3531' }}>
                                                سؤال {index + 1}: {q.questionText}
                                            </div>

                                            {q.graphImage && (
                                                <div style={{ textAlign: 'center', margin: '12px 0' }}>
                                                    <img
                                                        src={q.graphImage}
                                                        alt="Graph for additional question"
                                                        style={{ maxWidth: '240px', height: 'auto', borderRadius: '8px', border: '1px solid #ccc', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                                    />
                                                </div>
                                            )}

                                            {q.mathExpression && (
                                                <div style={{ marginBottom: '12px', direction: 'ltr', display: 'inline-block' }}>
                                                    <BlockMath math={q.mathExpression} />
                                                </div>
                                            )}

                                            {q.subQuestions && q.subQuestions.length > 0 ? (
                                                <div>
                                                    <div style={{ margin: '15px 0 12px 0', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '2px solid #e6dec5', paddingBottom: '10px' }}>
                                                        {q.subQuestions.map((subQ, sIdx) => {
                                                            const isSubActive = activeSubIdx === sIdx;
                                                            const subAttemptKey = `${index}-${sIdx}`;
                                                            const isSubTried = subPartAttemptedMap[subAttemptKey] || false;

                                                            return (
                                                                <button
                                                                    key={sIdx}
                                                                    type="button"
                                                                    onClick={() => setActiveSubPartIndexMap(prev => ({ ...prev, [index]: sIdx }))}
                                                                    style={{
                                                                        padding: '8px 12px', borderRadius: '8px', border: '1px solid #e6dec5',
                                                                        background: isSubActive ? '#8c5521' : '#FEECD0',
                                                                        color: isSubActive ? '#ffffff' : '#8c5521',
                                                                        fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s'
                                                                    }}
                                                                >
                                                                    الجزئية ({sIdx + 1}) {isSubTried ? '✅' : ''}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    {(() => {
                                                        const currentSub = q.subQuestions?.[activeSubIdx];
                                                        if (!currentSub) return null;

                                                        const subKey = `${index}-${activeSubIdx}`;
                                                        const subUserChoice = subPartSelectedOptionsMap[subKey] || null;
                                                        const isSubTried = subPartAttemptedMap[subKey] || false;
                                                        const isSubCorrect = subUserChoice === currentSub.correctAnswer;

                                                        return (
                                                            <div style={{ background: '#fff', padding: '14px', borderRadius: '8px', border: '1px solid #e6dec5' }}>
                                                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px', color: '#2C3531', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                                    <span>{currentSub.questionText}</span>
                                                                    {currentSub.mathExpression && (
                                                                        <span style={{ direction: 'ltr', display: 'inline-block', unicodeBidi: 'embed' }}>
                                                                            <BlockMath math={currentSub.mathExpression} />
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                                                                    {currentSub.options.map((opt) => (
                                                                        <label key={opt} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: subUserChoice === opt ? '#FEECD0' : '#FFF9E2', border: '1px solid #e6dec5', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#2C3531', gap: '8px' }}>
                                                                            <input
                                                                                type="radio"
                                                                                name={`add-sub-${subKey}`}
                                                                                checked={subUserChoice === opt}
                                                                                onChange={() => setSubPartSelectedOptionsMap(prev => ({ ...prev, [subKey]: opt }))}
                                                                            />
                                                                            {renderOptionContent(opt)}
                                                                        </label>
                                                                    ))}
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSubPartAttemptedMap(prev => ({ ...prev, [subKey]: true }))}
                                                                    style={{ background: '#DCA27B', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                                >
                                                                    تحقق من إجابة الجزئية ✅
                                                                </button>

                                                                {isSubTried && (
                                                                    <div style={{ marginTop: '10px', padding: '10px', borderRadius: '6px', background: isSubCorrect ? '#f0fdf4' : '#fee2e2', border: `1px solid ${isSubCorrect ? '#bbf7d0' : '#fca5a5'}`, fontSize: '13px' }}>
                                                                        {isSubCorrect ? (
                                                                            <div style={{ color: '#16a34a', fontWeight: 'bold' }}>
                                                                                ✅ إجابة صحيحة!
                                                                                <p style={{ margin: '6px 0 0 0', fontWeight: 'normal', whiteSpace: 'pre-line' }}>{currentSub.questionExplanation}</p>
                                                                            </div>
                                                                        ) : (
                                                                            <div style={{ color: '#991b1b', fontWeight: 'bold' }}>
                                                                                ❌ إجابة خاطئة، حاول مرة أخرى في هذه الجزئية!
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                                                        {q.options.map((opt) => (
                                                            <label key={opt} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: userChoice === opt ? '#FEECD0' : '#FFF9E2', border: '1px solid #e6dec5', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#2C3531', gap: '8px' }}>
                                                                <input
                                                                    type="radio"
                                                                    name={`add-q-${index}`}
                                                                    checked={userChoice === opt}
                                                                    onChange={() => setAdditionalSelected(prev => ({ ...prev, [index]: opt }))}
                                                                />
                                                                {renderOptionContent(opt)}
                                                            </label>
                                                        ))}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleAdditionalVerify(index)}
                                                        style={{ background: '#8c5521', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                    >
                                                        تحقق من الإجابة الإضافية
                                                    </button>

                                                    {isAttempted && (
                                                        <div style={{ marginTop: '10px', padding: '10px', borderRadius: '6px', background: isCorrect ? '#f0fdf4' : '#fee2e2', border: `1px solid ${isCorrect ? '#bbf7d0' : '#fca5a5'}`, fontSize: '13px' }}>
                                                            {isCorrect ? (
                                                                <div style={{ color: '#16a34a', fontWeight: 'bold' }}>
                                                                    ✅ إجابة صحيحة!
                                                                    <p style={{ margin: '6px 0 0 0', fontWeight: 'normal', whiteSpace: 'pre-line' }}>{q.questionExplanation}</p>
                                                                </div>
                                                            ) : (
                                                                <div style={{ color: '#991b1b', fontWeight: 'bold' }}>
                                                                    ❌ إجابة خاطئة، حاول مرة أخرى!
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                )}

                {/* عرض محتوى الشابتر والأفكار */}
                {isChapterView && !isAdditionalView && currentChapterData && (
                    <>
                        <div style={{ marginBottom: '16px' }}>
                            <button
                                type="button"
                                onClick={backToModule}
                                style={{
                                    background: '#FEECD0', border: '1px solid #e6dec5', padding: '8px 16px',
                                    borderRadius: '8px', fontWeight: 'bold', color: '#8c5521', fontSize: '13px', cursor: 'pointer'
                                }}
                            >
                                ⬅️ الرجوع لقائمة الشباتر
                            </button>
                        </div>

                        {/* شبكة الأفكار */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px', marginBottom: '20px' }}>
                            {currentChapterData.ideas.map((idea) => {
                                const isIdeaActive = idea.id === activeIdeaId;
                                const isIdeaCompleted = completedItems.includes(`${activeChapter}-${idea.id}`);

                                return (
                                    <button
                                        key={idea.id}
                                        type="button"
                                        onClick={() => handleChapterSwitch(activeChapter, idea.id)}
                                        style={{
                                            padding: '12px 14px', borderRadius: '12px', border: '1px solid #e6dec5',
                                            background: isIdeaActive ? '#8c5521' : '#ffffff',
                                            color: isIdeaActive ? '#ffffff' : '#2C3531',
                                            fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', textAlign: 'right',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}
                                    >
                                        <span>فكرة {idea.ideaNumber}: {idea.ideaName}</span>
                                        <span>{isIdeaCompleted ? '✅' : '⚪'}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* تفاصيل الفكرة النشطة */}
                        {currentIdeaObj && (
                            <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                                <h2 style={{ color: '#8c5521', marginBottom: '16px', fontSize: '1.2rem' }}>
                                    فكرة {currentIdeaObj.ideaNumber}: {currentIdeaObj.ideaName}
                                </h2>

                                {/* الشرح النظري */}
                                <div style={{ marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '1rem', color: '#2C3531', marginBottom: '12px' }}>💡 الشرح النظري الممهد والمبسط:</h3>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {currentIdeaObj.theoreticalSteps.map((step, idx) => (
                                            <div key={idx} style={{ background: '#FFF9E2', border: '1px solid #e6dec5', padding: '14px', borderRadius: '10px' }}>
                                                <div style={{ fontWeight: 'bold', color: '#8c5521', marginBottom: '6px', fontSize: '0.95rem' }}>{step.stepTitle}</div>
                                                <div style={{ color: '#2C3531', fontSize: '0.9rem', whiteSpace: 'pre-line', lineHeight: '1.5' }}>{step.stepDescription}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* فيديو الشرح */}
                                {currentIdeaObj.videoUrl && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '1rem', color: '#2C3531', marginBottom: '12px' }}>🎥 فيديو الشرح:</h3>
                                        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e6dec5' }}>
                                            <iframe
                                                src={currentIdeaObj.videoUrl}
                                                title="YouTube video"
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* السؤال التطبيقي للفكرة (مع دعم الـ subQuestions بالكامل) */}
                                <div style={{ background: '#FAFAFA', border: '1px solid #e6dec5', borderRadius: '12px', padding: '20px' }}>
                                    <h3 style={{ fontSize: '1rem', color: '#8c5521', marginBottom: '12px' }}>✍️ السؤال التطبيقي:</h3>

                                    {currentIdeaObj.practiceQuestion ? (
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '10px', color: '#2C3531' }}>
                                                {currentIdeaObj.practiceQuestion.questionText}
                                            </div>

                                            {currentIdeaObj.practiceQuestion.graphImage && (
                                                <div style={{ textAlign: 'center', margin: '12px 0' }}>
                                                    <img
                                                        src={currentIdeaObj.practiceQuestion.graphImage}
                                                        alt="Graph for question"
                                                        style={{ maxWidth: '240px', height: 'auto', borderRadius: '8px', border: '1px solid #ccc', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                                    />
                                                </div>
                                            )}

                                            {currentIdeaObj.practiceQuestion.mathExpression && (
                                                <div style={{ marginBottom: '14px', direction: 'ltr', display: 'inline-block' }}>
                                                    <BlockMath math={currentIdeaObj.practiceQuestion.mathExpression} />
                                                </div>
                                            )}

                                            {/* التحقق من وجود subQuestions لعرض أزرار الجزئيات */}
                                            {currentIdeaObj.practiceQuestion.subQuestions && currentIdeaObj.practiceQuestion.subQuestions.length > 0 ? (
                                                <div>
                                                    <div style={{ margin: '15px 0 12px 0', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '2px solid #e6dec5', paddingBottom: '10px' }}>
                                                        {currentIdeaObj.practiceQuestion.subQuestions.map((subQ, sIdx) => {
                                                            const isSubActive = activeSubPartIndex === sIdx;
                                                            const isSubTried = subPartAttempted[sIdx] || false;

                                                            return (
                                                                <button
                                                                    key={sIdx}
                                                                    type="button"
                                                                    onClick={() => setActiveSubPartIndex(sIdx)}
                                                                    style={{
                                                                        padding: '8px 12px', borderRadius: '8px', border: '1px solid #e6dec5',
                                                                        background: isSubActive ? '#8c5521' : '#FEECD0',
                                                                        color: isSubActive ? '#ffffff' : '#8c5521',
                                                                        fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s'
                                                                    }}
                                                                >
                                                                    الجزئية ({sIdx + 1}) {isSubTried ? '✅' : ''}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    {(() => {
                                                        const currentSub = currentIdeaObj.practiceQuestion?.subQuestions?.[activeSubPartIndex];
                                                        if (!currentSub) return null;

                                                        const subUserChoice = subPartSelectedOptions[activeSubPartIndex] || null;
                                                        const isSubTried = subPartAttempted[activeSubPartIndex] || false;
                                                        const isSubCorrect = subUserChoice === currentSub.correctAnswer;

                                                        return (
                                                            <div style={{ background: '#fff', padding: '14px', borderRadius: '8px', border: '1px solid #e6dec5' }}>
                                                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px', color: '#2C3531', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                                    <span>{currentSub.questionText}</span>
                                                                    {currentSub.mathExpression && (
                                                                        <span style={{ direction: 'ltr', display: 'inline-block', unicodeBidi: 'embed' }}>
                                                                            <BlockMath math={currentSub.mathExpression} />
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                                                                    {currentSub.options.map((opt) => (
                                                                        <label key={opt} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: subUserChoice === opt ? '#FEECD0' : '#FFF9E2', border: '1px solid #e6dec5', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#2C3531', gap: '8px' }}>
                                                                            <input
                                                                                type="radio"
                                                                                name={`idea-sub-${activeSubPartIndex}`}
                                                                                checked={subUserChoice === opt}
                                                                                onChange={() => setSubPartSelectedOptions(prev => ({ ...prev, [activeSubPartIndex]: opt }))}
                                                                            />
                                                                            {renderOptionContent(opt)}
                                                                        </label>
                                                                    ))}
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSubPartVerify(activeSubPartIndex)}
                                                                    style={{ background: '#DCA27B', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                                >
                                                                    تحقق من إجابة الجزئية ✅
                                                                </button>

                                                                {isSubTried && (
                                                                    <div style={{ marginTop: '10px', padding: '10px', borderRadius: '6px', background: isSubCorrect ? '#f0fdf4' : '#fee2e2', border: `1px solid ${isSubCorrect ? '#bbf7d0' : '#fca5a5'}`, fontSize: '13px' }}>
                                                                        {isSubCorrect ? (
                                                                            <div style={{ color: '#16a34a', fontWeight: 'bold' }}>
                                                                                ✅ إجابة صحيحة!
                                                                                <p style={{ margin: '6px 0 0 0', fontWeight: 'normal', whiteSpace: 'pre-line' }}>{currentSub.questionExplanation}</p>
                                                                            </div>
                                                                        ) : (
                                                                            <div style={{ color: '#991b1b', fontWeight: 'bold' }}>
                                                                                ❌ إجابة خاطئة، حاول مرة أخرى في هذه الجزئية!
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                                        {currentIdeaObj.practiceQuestion.options.map((opt) => (
                                                            <label key={opt} style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', background: selectedOption === opt ? '#FEECD0' : '#FFF9E2', border: '1px solid #e6dec5', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#2C3531', gap: '10px' }}>
                                                                <input
                                                                    type="radio"
                                                                    name="practice-option"
                                                                    checked={selectedOption === opt}
                                                                    onChange={() => setSelectedOption(opt)}
                                                                />
                                                                {renderOptionContent(opt)}
                                                            </label>
                                                        ))}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={handleQuizVerify}
                                                        style={{ background: '#8c5521', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                                                    >
                                                        تحقق من الإجابة ✅
                                                    </button>

                                                    {errorMsg && <div style={{ color: '#991b1b', marginTop: '10px', fontSize: '13px', fontWeight: 'bold' }}>{errorMsg}</div>}

                                                    {hasAttempted && selectedOption === currentIdeaObj.practiceQuestion.correctAnswer && (
                                                        <div style={{ marginTop: '14px', padding: '14px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '13px', color: '#16a34a' }}>
                                                            <strong>✅ إجابة صحيحة!</strong>
                                                            <p style={{ margin: '8px 0 0 0', fontWeight: 'normal', whiteSpace: 'pre-line', lineHeight: '1.5', color: '#2C3531' }}>
                                                                {currentIdeaObj.practiceQuestion.questionExplanation}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{ color: '#8c5521', fontSize: '13px', padding: '10px 0' }}>
                                            لا توجد أسئلة تدريبية مضافة لهذه الفكرة حالياً.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}
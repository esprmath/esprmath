'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { InlineMath } from 'react-katex';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import OnboardingTour, { TOUR_EVENTS } from '@/components/OnboardingTour';
import GlobalTutor from '@/components/GlobalTutor';
import FullScreenCanvasModal from '@/components/FullScreenCanvasModal';
import AdditionalQuestionsView from '@/components/AdditionalQuestionsView';
import IdeaQuestions from '@/components/questions/IdeaQuestions';
import type { ModuleContent } from '@/types/math';
import { buildAdditionalQuestions } from '@/lib/questions/additional';
import { MASTERY_TARGET, getIdeaStatus, loadIdeaProgress, moduleProgressKey, recordIdeaResult, type IdeaProgressMap } from '@/lib/questions/mastery';
import { toEmbedUrl } from '@/lib/video';
import { useAiAllowed } from '@/components/useAiAllowed';

const ADDITIONAL_VIEW = 'additional-questions';

/**
 * نص البطاقة: ما بين علامتي $ يظهر معادلة، وما بين علامتي تنصيص يبقى ترتيبه سليمًا
 * داخل السطر العربي حتى لا تنزاح علامات الترقيم في العبارات الإنجليزية.
 */
function StepText({ text }: { text: string }) {
    return (
        <>
            {text.split(/(\$[^$\n]+\$|"[^"\n]+")/g).map((piece, i) => {
                if (piece.length > 2 && piece.startsWith('$') && piece.endsWith('$')) {
                    return (
                        <span key={i} className="step-math" style={{ direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block', maxWidth: '100%', overflowX: 'auto', overflowY: 'hidden', verticalAlign: 'middle', padding: '5px 1px', margin: '-3px 0', scrollbarWidth: 'none' }}>
                            <InlineMath math={piece.slice(1, -1)} />
                        </span>
                    );
                }
                if (piece.length > 2 && piece.startsWith('"') && piece.endsWith('"')) {
                    return <bdi key={i}>{piece}</bdi>;
                }
                return <span key={i}>{piece}</span>;
            })}
        </>
    );
}

/**
 * قالب صفحة الموديول لكل الكورسات. يعرض قائمة الشباتر، وصفحة الفكرة، والأسئلة الإضافية.
 * المحتوى يصله من src/content، والصفحة المعروضة تتحدد من رابط الصفحة.
 */
export default function ModulePage({ content }: { content: ModuleContent }) {
    const { courseId, moduleNumber, chapters } = content;
    const searchParams = useSearchParams();
    const modulePath = `/workspace/${courseId}/${moduleNumber}`;
    const coursePath = `/workspace/${courseId}`;

    const additionalQuestions = useMemo(
        () => buildAdditionalQuestions(chapters, content.extraQuestions),
        [chapters, content.extraQuestions]
    );

    const chapterParam = searchParams.get('chapter');
    const isAdditionalView = chapterParam === ADDITIONAL_VIEW;
    const currentChapterData = chapters.find((chapter) => chapter.chapterNumber === chapterParam) ?? null;
    const isChapterView = isAdditionalView || currentChapterData !== null;
    const activeChapter = currentChapterData?.chapterNumber ?? '';

    const currentIdeaObj =
        currentChapterData?.ideas.find((idea) => idea.id === searchParams.get('idea')) ?? currentChapterData?.ideas[0];
    const activeIdeaId = currentIdeaObj?.id ?? '';
    const currentVideoUrl = currentIdeaObj?.videoUrl ? toEmbedUrl(currentIdeaObj.videoUrl) : null;

    const isAiAllowed = useAiAllowed(courseId);

    // ما يعرضه فيكتور: السؤال الحالي في الشابتر، أو السؤال المفتوح في الأسئلة الإضافية
    const [chapterTutorQuestion, setChapterTutorQuestion] = useState('');
    const [additionalTutor, setAdditionalTutor] = useState<{ chapter: string; ideaName: string; question: string } | null>(null);

    const [ideaProgress, setIdeaProgress] = useState<IdeaProgressMap>({});
    const [toast, setToast] = useState<{ message: string; fading: boolean } | null>(null);

    const [canvas, setCanvas] = useState<{ image?: string; math?: string; storageKey: string } | null>(null);
    const openCanvas = (image?: string, math?: string, storageKey?: string) =>
        setCanvas({ image, math, storageKey: storageKey ?? 'default_canvas' });

    useEffect(() => {
        setIdeaProgress(loadIdeaProgress(courseId));
    }, [courseId]);

    // نسبة إتقان الموديول تظهر في صفحة الكورس. نحفظها بعد كل نتيجة، والحساب نفسه يحدّثها عند فتح الموديول
    useEffect(() => {
        const progress = loadIdeaProgress(courseId);
        const allIdeas = chapters.flatMap((chapter) => chapter.ideas.map((idea) => `${chapter.chapterNumber}-${idea.id}`));
        if (allIdeas.length === 0) return;
        const masteredCount = allIdeas.filter((key) => getIdeaStatus(progress[key]) === 'mastered').length;
        localStorage.setItem(moduleProgressKey(courseId, moduleNumber), String(Math.round((masteredCount / allIdeas.length) * 100)));
    }, [courseId, moduleNumber, chapters, ideaProgress]);

    // pushState يغيّر الرابط فورًا بدون طلب جديد من الخادم، وزر الرجوع يبقى يعمل
    function navigate(query: string, scroll: ScrollBehavior = 'auto') {
        window.history.pushState(null, '', query ? `${modulePath}?${query}` : modulePath);
        window.scrollTo({ top: 0, behavior: scroll });
    }

    const openChapter = (chapterKey: string) => navigate(`chapter=${encodeURIComponent(chapterKey)}`);
    const backToModule = () => navigate('');
    const openIdea = (chapterKey: string, ideaId: string, scroll?: ScrollBehavior) =>
        navigate(`chapter=${encodeURIComponent(chapterKey)}&idea=${encodeURIComponent(ideaId)}`, scroll);

    // التنقل بين أفكار الشابتر
    const ideaPosition = currentChapterData && currentIdeaObj ? currentChapterData.ideas.indexOf(currentIdeaObj) : 0;
    const previousIdea = currentChapterData?.ideas[ideaPosition - 1];
    const nextIdea = currentChapterData?.ideas[ideaPosition + 1];

    const activeIdeaMetaObj = isAdditionalView
        ? { id: 'additional', name: additionalTutor?.ideaName ?? 'الأسئلة الإضافية' }
        : currentIdeaObj
            ? { id: currentIdeaObj.id, name: `فكرة ${currentIdeaObj.ideaNumber}: ${currentIdeaObj.ideaName}` }
            : undefined;

    // بيانات فيكتور المشتركة بين الصفحة وورقة الحل. المحادثة واحدة لكل فكرة
    const tutorChapter = isAdditionalView ? additionalTutor?.chapter ?? '' : activeChapter;
    const tutorQuestion = isAdditionalView ? additionalTutor?.question ?? '' : chapterTutorQuestion;
    const tutorChatKey = isAdditionalView ? ADDITIONAL_VIEW : `${activeChapter}-${activeIdeaId}`;
    // شرح الفكرة يصل لفيكتور داخل الشابتر فقط، ومعه يظهر زر "مختصر الفكرة"
    const tutorIdeaNotes = isAdditionalView
        ? ''
        : (currentIdeaObj?.theoreticalSteps ?? []).map((step) => `${step.stepTitle}: ${step.stepDescription}`).join('\n');

    // يسجل نتيجة سؤال للفكرة، ويعرض رسالة تشجيع عند الحل الصحيح
    function handleQuestionResult(ideaKey: string, questionId: string, isCorrect: boolean) {
        const wasMastered = getIdeaStatus(ideaProgress[ideaKey]) === 'mastered';
        const updated = recordIdeaResult(courseId, ideaKey, questionId, isCorrect);
        setIdeaProgress(updated);
        window.dispatchEvent(new Event(TOUR_EVENTS.questionChecked)); // تُنهي جولة أول دخول
        if (!isCorrect) return;

        const isMastered = getIdeaStatus(updated[ideaKey]) === 'mastered';
        const message = isMastered && !wasMastered
            ? '🎉 كفو! أتقنت هذه الفكرة'
            : isMastered
                ? '✅ إجابة صحيحة!'
                : '✅ صح! باقي سؤال مختلف وتتقن الفكرة';
        setToast({ message, fading: false });
        setTimeout(() => setToast((current) => current && { ...current, fading: true }), 2000);
        setTimeout(() => setToast(null), 2500);
    }

    return (
        <>
            <style jsx>{`
                .chapters-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 16px;
                    margin-bottom: 20px;
                }
                .chapter-card {
                    width: 100%;
                    background: #ffffff;
                    border: 1px solid #e6dec5;
                    border-radius: 14px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                    cursor: pointer;
                    text-align: right;
                    color: #2C3531;
                    transition: transform 0.2s, box-shadow 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .chapter-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                }
                .chapter-badge {
                    display: inline-block;
                    background: #f5efe6;
                    color: #2C3531;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .chapter-title {
                    font-weight: bold;
                    font-size: 15px;
                    margin-bottom: 8px;
                }
                .chapter-meta {
                    color: #8c5521;
                    font-size: 12px;
                }
                .chapter-progress {
                    width: 100%;
                    height: 6px;
                    margin-top: 8px;
                    background: #f5efe6;
                    border-radius: 999px;
                    overflow: hidden;
                }
                .chapter-progress-fill {
                    display: block;
                    height: 100%;
                    background: #8b9a63;
                    border-radius: 999px;
                    transition: width 0.3s;
                }
                /* margin-top: auto يثبت الرابط أسفل البطاقة مهما طال العنوان */
                .chapter-cta {
                    margin-top: auto;
                    padding-top: 14px;
                    color: #b0764a;
                    font-weight: bold;
                    font-size: 13px;
                }

                /* زر الرجوع فوق، وتحته اسم الموديول، والاثنين على اليمين */
                .page-heading {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                    margin-bottom: 14px;
                }
                .page-title {
                    font-size: clamp(18px, 1.8vw, 22px);
                    font-weight: 900;
                    color: #2C3531;
                    margin: 0;
                }
                /* مكوّن Link لا يأخذ كلاس styled-jsx، فنستهدف الرابط عبر حاويته */
                .back-link,
                .page-heading :global(a),
                .back-buttons :global(a) {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    background: #FEECD0;
                    border: 1px solid #e6dec5;
                    padding: 8px 14px;
                    border-radius: 8px;
                    font-weight: bold;
                    color: #8c5521;
                    font-size: 13px;
                    cursor: pointer;
                    text-decoration: none;
                    white-space: nowrap;
                }
                .back-link:hover,
                .page-heading :global(a:hover),
                .back-buttons :global(a:hover) {
                    background: #fbdfb4;
                }

                .idea-card {
                    background: #ffffff;
                    border: 1px solid #e6dec5;
                    border-radius: 16px;
                    padding: clamp(14px, 2vw, 24px);
                    box-shadow: 0 2px 6px rgba(0,0,0,0.03);
                }
                .idea-eyebrow {
                    font-size: 12px;
                    font-weight: bold;
                    color: #b0764a;
                    margin-bottom: 4px;
                }
                .idea-heading {
                    color: #8c5521;
                    margin: 0 0 16px;
                    font-size: clamp(1.05rem, 1.5vw, 1.25rem);
                    line-height: 1.4;
                }
                .idea-layout {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }
                .video-frame {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    /* حجم الفيديو يتبع ارتفاع الشاشة حتى لا يدفع السؤال بعيدًا */
                    max-width: max(426px, 85vh);
                    margin: 0 auto;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #e6dec5;
                    background: #000;
                }
                /* معادلات البطاقة تتحرك عند الحاجة بدون شريط تمرير ظاهر */
                .theory-section :global(.step-math::-webkit-scrollbar) {
                    display: none;
                }
                /* المعادلات الطويلة تتحرك داخل مكانها بدل أن توسّع الصفحة */
                .question-section :global(.katex-display) {
                    overflow-x: auto;
                    overflow-y: hidden;
                    padding: 2px 0;
                }
                .idea-pager {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                }
                .pager-btn {
                    flex: 0 1 48%;
                    min-width: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    background: #ffffff;
                    border: 1px solid #e6dec5;
                    border-radius: 10px;
                    padding: 10px 14px;
                    cursor: pointer;
                    color: #2C3531;
                    font-size: 13px;
                    font-weight: bold;
                    text-align: right;
                    transition: background-color 0.2s;
                }
                .pager-btn:hover {
                    background: #f5efe6;
                }
                .pager-next {
                    margin-inline-start: auto;
                    text-align: left;
                }
                .pager-label {
                    font-size: 11px;
                    color: #b0764a;
                }
                /* Safari في الآيفون ما يقص النص داخل الأزرار إلا إذا كان للعنصر عرض محدد */
                .pager-name {
                    display: block;
                    width: 100%;
                    min-width: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    direction: ltr;
                }
                .idea-mark {
                    flex-shrink: 0;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    margin-inline-start: 8px;
                    border-radius: 50%;
                    border: 1.5px solid currentColor;
                    opacity: 0.4;
                    font-size: 11px;
                    line-height: 1;
                }
                .idea-mark-done {
                    background: #66783d;
                    border-color: #66783d;
                    color: #ffffff;
                    opacity: 1;
                }
                .idea-mark-practicing {
                    background: #e9b949;
                    border-color: #e9b949;
                    opacity: 1;
                }
                .mastery-note {
                    margin: -8px 0 16px;
                    padding: 8px 12px;
                    border-radius: 10px;
                    font-size: 13px;
                    line-height: 1.5;
                }
                .mastery-new {
                    background: #fbf3e0;
                    color: #6b5a3a;
                }
                .mastery-practicing {
                    background: #fdf1cd;
                    color: #7a5a10;
                }
                .mastery-mastered {
                    background: #eef2dd;
                    color: #46552a;
                }

                .idea-btn {
                    padding: 12px 14px;
                    border-radius: 12px;
                    border: 1px solid #e6dec5;
                    background: #ffffff;
                    color: #2C3531;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 13px;
                    text-align: right;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s;
                }
                .idea-btn:hover {
                    background: #f5efe6;
                }

                @media (min-width: 768px) {
                    .navigation-row {
                        display: grid !important;
                        grid-template-columns: 1fr 4fr !important;
                        gap: 16px !important;
                        align-items: start !important;
                        margin-bottom: 16px !important;
                    }

                    .back-buttons {
                        display: flex !important;
                        flex-direction: column !important;
                        gap: 8px !important;
                        width: 100% !important;
                    }

                    .ideas-container {
                        display: grid !important;
                        grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)) !important;
                        gap: 8px !important;
                        width: 100% !important;
                    }

                    .idea-layout {
                        display: grid;
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                        grid-template-areas:
                            "theory video"
                            "question question"
                            "additional additional"
                            "pager pager";
                        gap: 20px;
                    }
                    .theory-section {
                        grid-area: theory;
                    }
                    .idea-layout-no-video .theory-section {
                        grid-column: 1 / -1;
                    }
                    .theory-section h3 {
                        font-size: 0.9rem !important;
                        margin-bottom: 8px !important;
                    }
                    .theory-section > div {
                        gap: 8px !important;
                    }
                    .theory-section > div > div {
                        padding: 10px 12px !important;
                        border-radius: 8px !important;
                    }
                    .theory-section > div > div > div:first-child {
                        font-size: 0.9rem !important;
                        margin-bottom: 4px !important;
                    }
                    .theory-section > div > div > div:last-child {
                        font-size: 0.85rem !important;
                        line-height: 1.5 !important;
                    }
                    .video-section {
                        grid-area: video;
                    }
                    .question-section {
                        grid-area: question;
                    }
                    .additional-link {
                        grid-area: additional;
                    }
                    .idea-pager {
                        grid-area: pager;
                    }

                }

                @media (max-width: 767px) {
                    .navigation-row {
                        display: flex !important;
                        flex-direction: column !important;
                        gap: 12px !important;
                        margin-bottom: 16px !important;
                    }
                    .back-buttons {
                        display: flex !important;
                        flex-direction: row !important;
                        gap: 8px !important;
                        flex-wrap: wrap;
                    }
                    .ideas-container {
                        display: grid !important;
                        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)) !important;
                        gap: 6px !important;
                    }

                    .chapters-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 10px !important;
                    }
                    .chapter-card {
                        padding: 12px !important;
                        border-radius: 10px !important;
                        min-height: 110px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }
                    .chapter-badge {
                        font-size: 11px !important;
                        padding: 3px 8px !important;
                        margin-bottom: 6px !important;
                    }
                    .chapter-title {
                        font-size: 12px !important;
                        margin-bottom: 4px !important;
                        line-height: 1.3 !important;
                    }
                    .chapter-meta {
                        font-size: 10px !important;
                    }
                    .chapter-cta {
                        display: none !important;
                    }
                    /* تأخذ العرض كاملًا فقط إذا بقيت وحدها في صفها */
                    .additional-card:nth-child(odd) {
                        grid-column: 1 / -1 !important;
                        min-height: auto !important;
                    }
                    .idea-mark {
                        display: none;
                    }

                    .idea-btn {
                        padding: 10px 4px !important;
                        font-size: 14px !important;
                        justify-content: center !important;
                        min-height: 48px !important;
                    }
                    .idea-full-text {
                        display: none !important;
                    }
                    .idea-btn::after {
                        content: attr(data-idea-num);
                        display: block;
                        font-weight: bold;
                    }
                }
            `}</style>

            <div style={{
                backgroundColor: '#FFF9E2',
                minHeight: '100vh',
                overflow: isChapterView && !isAdditionalView ? 'auto' : undefined,
                color: '#2C3531',
                fontFamily: 'sans-serif', 
                margin: 0, 
                padding: 0, 
                paddingBottom: isChapterView && !isAdditionalView ? '80px' : 0,
                position: 'relative' 
            }}>
                <Navbar isLoggedIn={true} />

                <OnboardingTour
                    page={isAdditionalView ? 'other' : isChapterView ? (currentIdeaObj ? 'idea' : 'other') : 'moduleList'}
                />

                <FullScreenCanvasModal
                    isOpen={canvas !== null}
                    onClose={() => setCanvas(null)}
                    questionImage={canvas?.image}
                    mathText={canvas?.math}
                    modalStorageKey={canvas?.storageKey ?? 'default_canvas'}
                    activeChapter={tutorChapter}
                    activeIdeaMeta={activeIdeaMetaObj}
                    courseId={courseId}
                    currentQuestion={tutorQuestion}
                    isAiAllowed={isAiAllowed}
                    chatKey={tutorChatKey}
                    ideaNotes={tutorIdeaNotes}
                />

                {/* ورقة الحل لها شات خاص بنفس المحادثة، فنخفي هذا أثناء فتحها */}
                {isChapterView && canvas === null && (
                    <GlobalTutor
                        key={tutorChatKey}
                        courseId={courseId}
                        isAiAllowed={isAiAllowed}
                        currentChapter={tutorChapter}
                        currentIdea={activeIdeaMetaObj}
                        currentQuestion={tutorQuestion}
                        chatKey={tutorChatKey}
                        ideaNotes={tutorIdeaNotes}
                    />
                )}


                {toast && (
                    <div style={{
                        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                        backgroundColor: '#CDD4B1', color: '#2C3531', border: '1px solid #b8c29e',
                        padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 9999, fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px',
                        opacity: toast.fading ? 0 : 1, transition: 'opacity 0.5s ease-in-out'
                    }}>
                        <span>{toast.message}</span>
                    </div>
                )}

                <div style={{
                    maxWidth: isAdditionalView ? '1400px' : isChapterView ? '1280px' : '1100px',
                    margin: isAdditionalView ? '8px auto 0' : '14px auto',
                    padding: '0 16px'
                }}>

                    {!isChapterView && (
                        <>
                            <div className="page-heading">
                                <Link href={coursePath} className="back-link">
                                    → الكورس
                                </Link>
                                <h1 className="page-title">Module {moduleNumber}</h1>
                            </div>

                            <div className="chapters-grid">
                                {chapters.map((chData, chIndex) => {
                                    const chKey = chData.chapterNumber;
                                    const chMasteredCount = chData.ideas.filter(idea => getIdeaStatus(ideaProgress[`${chKey}-${idea.id}`]) === 'mastered').length;

                                    return (
                                        <button
                                            key={chKey}
                                            type="button"
                                            onClick={() => openChapter(chKey)}
                                            className="chapter-card"
                                            data-tour={chIndex === 0 ? 'first-chapter' : undefined}
                                        >
                                            <div className="chapter-badge">
                                                Chapter {chData.chapterNumber}
                                            </div>
                                            <div className="chapter-title">
                                                {chData.chapterTitle}
                                            </div>
                                            <div className="chapter-meta">
                                                أتقنت {chMasteredCount} من {chData.ideas.length} أفكار
                                            </div>
                                            <span className="chapter-progress">
                                                <span
                                                    className="chapter-progress-fill"
                                                    style={{ width: `${(chMasteredCount / chData.ideas.length) * 100}%` }}
                                                />
                                            </span>
                                            <div className="chapter-cta">
                                                فتح الشابتر والدخول للأفكار ←
                                            </div>
                                        </button>
                                    );
                                })}

                                <button
                                    type="button"
                                    onClick={() => openChapter(ADDITIONAL_VIEW)}
                                    className="chapter-card additional-card"
                                    style={{ background: '#FEECD0', border: '1px solid #DCA27B' }}
                                >
                                    <div className="chapter-badge" style={{ background: '#DCA27B', color: '#ffffff' }}>
                                         إضافي
                                    </div>
                                    <div className="chapter-title" style={{ color: '#8c5521' }}>
                                        الأسئلة الإضافية للمقرر
                                    </div>
                                    <div className="chapter-meta">
                                        تدرب على أسئلة إضافية مرتبطة بأفكار الشباتر.
                                    </div>
                                    <div className="chapter-cta" style={{ color: '#8c5521' }}>
                                        فتح صفحة الأسئلة الإضافية ←
                                    </div>
                                </button>
                            </div>
                        </>
                    )}

                    {isAdditionalView && (
                        <AdditionalQuestionsView
                            questions={additionalQuestions}
                            chapters={chapters}
                            initialChapter={searchParams.get('tab')}
                            coursePath={coursePath}
                            backToModule={backToModule}
                            jumpToIdea={openIdea}
                            onOpenCanvas={openCanvas}
                            onQuestionResult={handleQuestionResult}
                            onTutorContext={setAdditionalTutor}
                        />
                    )}

                    {isChapterView && !isAdditionalView && currentChapterData && (
                        <>
                            <div className="navigation-row">
                                <div className="back-buttons">
                                    <Link href={coursePath} className="back-link">
                                        → الكورس
                                    </Link>
                                    <button type="button" onClick={backToModule} className="back-link">
                                        → الشباتر
                                    </button>
                                </div>
                                <div className="ideas-container">
                                    {currentChapterData.ideas.map((idea) => {
                                        const isIdeaActive = idea.id === activeIdeaId;
                                        const ideaStatus = getIdeaStatus(ideaProgress[`${activeChapter}-${idea.id}`]);

                                        return (
                                            <button
                                                key={idea.id}
                                                type="button"
                                                onClick={() => openIdea(activeChapter, idea.id)}
                                                className="idea-btn"
                                                data-idea-num={idea.ideaNumber}
                                                style={{
                                                    background: isIdeaActive ? '#8c5521' : '#ffffff',
                                                    color: isIdeaActive ? '#ffffff' : '#2C3531',
                                                    borderColor: isIdeaActive ? '#8c5521' : '#e6dec5'
                                                }}
                                            >
                                                <span className="idea-full-text">
                                                    فكرة {idea.ideaNumber}: {idea.ideaName}
                                                </span>
                                                <span
                                                    className={`idea-mark ${ideaStatus === 'mastered' ? 'idea-mark-done' : ideaStatus === 'practicing' ? 'idea-mark-practicing' : ''}`}
                                                    title={ideaStatus === 'mastered' ? 'متقنة' : ideaStatus === 'practicing' ? 'تحتاج تدريب' : 'لم تبدأ'}
                                                >
                                                    {ideaStatus === 'mastered' ? '✓' : ''}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {currentIdeaObj && (
                                <div className="idea-card">
                                    <div className="idea-eyebrow">
                                        Chapter {currentChapterData.chapterNumber} · فكرة {ideaPosition + 1} من {currentChapterData.ideas.length}
                                    </div>
                                    <h2 className="idea-heading">
                                        فكرة {currentIdeaObj.ideaNumber}: {currentIdeaObj.ideaName}
                                    </h2>
                                    {(() => {
                                        const progress = ideaProgress[`${activeChapter}-${currentIdeaObj.id}`];
                                        const status = getIdeaStatus(progress);
                                        const solvedCount = progress?.solved.length ?? 0;
                                        return (
                                            <div className={`mastery-note mastery-${status}`}>
                                                <strong>
                                                    {status === 'mastered' ? '✓ أتقنت هذه الفكرة' : `الإتقان: ${solvedCount} من ${MASTERY_TARGET}`}
                                                </strong>
                                                {status !== 'mastered' && (
                                                    <span>
                                                        {solvedCount === 0
                                                            ? ' · حل سؤالين مختلفين صح لإتقان الفكرة'
                                                            : ' · باقي سؤال مختلف: ولّد سؤالًا جديدًا أو جرّب الأسئلة الإضافية'}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    <div className={`idea-layout ${currentVideoUrl ? '' : 'idea-layout-no-video'}`}>

                                        <div className="theory-section">
                                            <h3 style={{ fontSize: '1rem', color: '#2C3531', marginBottom: '12px' }}>📖 ملخص الفكرة:</h3>
                                            <div style={{ display: 'grid', gap: '12px' }}>
                                                {currentIdeaObj.theoreticalSteps.map((step, idx) => (
                                                    <div key={idx} className="idea-step" style={{ background: '#FFF9E2', border: '1px solid #e6dec5', padding: '14px', borderRadius: '10px' }}>
                                                        <div className="idea-step-title" style={{ fontWeight: 'bold', color: '#8c5521', marginBottom: '6px', fontSize: '0.95rem' }}>{step.stepTitle}</div>
                                                        <div className="idea-step-text" style={{ color: '#2C3531', fontSize: '0.9rem', whiteSpace: 'pre-line', lineHeight: '1.5' }}><StepText text={step.stepDescription} /></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {currentVideoUrl && (
                                            <div className="video-section">
                                                <h3 style={{ fontSize: '1rem', color: '#2C3531', marginBottom: '12px' }}>📹 فيديو الشرح:</h3>
                                                <div className="video-frame">
                                                    <iframe
                                                        src={currentVideoUrl}
                                                        title="YouTube video"
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="question-section">
                                            <h3 style={{ fontSize: '1rem', color: '#8c5521', marginBottom: '12px' }}>✍️ السؤال التطبيقي:</h3>
                                            <IdeaQuestions
                                                key={`${activeChapter}:${activeIdeaId}`}
                                                idea={currentIdeaObj}
                                                stableKey={`${activeChapter}:${activeIdeaId}`}
                                                onQuestionResult={(questionId, isCorrect) =>
                                                    handleQuestionResult(`${activeChapter}-${currentIdeaObj.id}`, questionId, isCorrect)
                                                }
                                                onTutorContext={setChapterTutorQuestion}
                                                onOpenCanvas={openCanvas}
                                            />
                                        </div>

                                        <div className="additional-link">
                                            <button
                                                type="button"
                                                onClick={() => navigate(`chapter=${ADDITIONAL_VIEW}&tab=${encodeURIComponent(activeChapter)}`)}
                                                style={{
                                                    width: '100%', background: '#FEECD0', border: '1px solid #DCA27B', borderRadius: '12px',
                                                    padding: '16px 20px', cursor: 'pointer', textAlign: 'right', display: 'flex',
                                                    justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                                    transition: 'background 0.2s'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ fontSize: '20px' }}>➕</span>
                                                    <div>
<div style={{ fontWeight: 'bold', fontSize: '14px', color: '#8c5521' }}>
                                                            أسئلة إضافية للشابتر {currentChapterData.chapterNumber}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#2C3531', marginTop: '2px' }}>
                                                            انتقل مباشرة لتدريبات هذا الشابتر واختبر فهمك
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: 'bold', color: '#8c5521', fontSize: '14px', whiteSpace: 'nowrap' }}>
                                                    عرض الأسئلة ←
                                                </div>
                                            </button>
                                        </div>

                                        <div className="idea-pager">
                                            {previousIdea && (
                                                <button type="button" className="pager-btn" onClick={() => openIdea(activeChapter, previousIdea.id, 'smooth')}>
                                                    <span className="pager-label">→ الفكرة السابقة</span>
                                                    <span className="pager-name">{previousIdea.ideaNumber} {previousIdea.ideaName}</span>
                                                </button>
                                            )}
                                            {nextIdea && (
                                                <button type="button" className="pager-btn pager-next" onClick={() => openIdea(activeChapter, nextIdea.id, 'smooth')}>
                                                    <span className="pager-label">الفكرة التالية ←</span>
                                                    <span className="pager-name">{nextIdea.ideaNumber} {nextIdea.ideaName}</span>
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </>
    );
}
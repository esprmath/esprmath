'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import GuideTip from '@/components/GuideTip';
import GlobalTutor from '@/components/GlobalTutor';
import FullScreenCanvasModal from '@/components/FullScreenCanvasModal';
import AdditionalQuestionsView from '@/components/AdditionalQuestionsView';
import { ChapterData } from '@/types/math';
import { chapter1_5Data } from './1.5';
import { chapter1_6Data } from './1.6';
import { chapter2_1Data } from './2.1';
import { chapter1_8Data } from './1.8';
import { chapter3_4Data } from './3.4';
import { moreQuesData } from './moreques';
import { buildAdditionalQuestions } from '@/lib/questions/additional';
import { MASTERY_TARGET, getIdeaStatus, loadIdeaProgress, recordIdeaResult, type IdeaProgressMap } from '@/lib/questions/mastery';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import IdeaQuestions from '@/components/questions/IdeaQuestions';
import { supabase } from '@/lib/supabase'; // ✅ استيراد سوبابيس للربط

// ✅ 1. استيراد النظام الجديد
import { useQuestionSet } from '@/components/questions/useQuestionSet';
import QuestionRenderer from '@/components/questions/QuestionRenderer';

type ChapterKey = '1.5' | '1.6' | '1.8' | '2.1' | '3.4' | 'additional-questions';

const additionalQuestions = buildAdditionalQuestions(
    [chapter1_5Data, chapter1_6Data, chapter2_1Data, chapter1_8Data, chapter3_4Data],
    moreQuesData
);

export default function ModulePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams(); // ✅ للحصول على معرف الكورس من الـ URL
    const routeCourseId = (params?.courseId as string) || '101';

    // ✅ حالات المستخدم وصلاحيات الـ AI
    const [isAiAllowed, setIsAiAllowed] = useState<boolean>(true);

    // ما يعرضه فيكتور: السؤال الحالي في الشابتر، أو السؤال المفتوح في الأسئلة الإضافية
    const [chapterTutorQuestion, setChapterTutorQuestion] = useState('');
    const [additionalTutor, setAdditionalTutor] = useState<{ chapter: string; ideaName: string; question: string } | null>(null);

    // صلاحية فيكتور: نفس الإعداد الذي يتحكم فيه المشرف، والخادم يتحقق منها أيضًا
    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!session?.user) return;
            const { data, error } = await supabase
                .from('user_courses')
                .select('is_ai_allowed')
                .eq('user_id', session.user.id)
                .eq('course_id', routeCourseId)
                .maybeSingle();

            if (!error && data) {
                setIsAiAllowed(data.is_ai_allowed !== false);
            }
        });
    }, [routeCourseId]);

    const allChaptersMap: Record<Exclude<ChapterKey, 'additional-questions'>, ChapterData> = {
        '1.5': chapter1_5Data,
        '1.6': chapter1_6Data,
        '2.1': chapter2_1Data,
        '1.8': chapter1_8Data,
        '3.4': chapter3_4Data,
    };

    const validChapters = Object.keys(allChaptersMap) as ChapterKey[];
    const chapterParam = searchParams.get('chapter') as ChapterKey | null;
    const tabParam = searchParams.get('tab');
    const ideaParam = searchParams.get('idea');

    const initialChapter: ChapterKey = (chapterParam && (validChapters.includes(chapterParam) || chapterParam === 'additional-questions')) ? chapterParam : '1.5';
    const [activeChapter, setActiveChapter] = useState<ChapterKey>(initialChapter);

    const isAdditionalView = activeChapter === 'additional-questions';
    const currentChapterData = !isAdditionalView ? allChaptersMap[activeChapter as Exclude<ChapterKey, 'additional-questions'>] || chapter1_5Data : null;
    const [activeIdeaId, setActiveIdeaId] = useState(currentChapterData ? currentChapterData.ideas[0].id : '');

    const [selectedAdditionalChapterTab, setSelectedAdditionalChapterTab] = useState<string>('all');
    const [ideaProgress, setIdeaProgress] = useState<IdeaProgressMap>({});
    const [toastMessage, setToastMessage] = useState('');

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [hasAttempted, setHasAttempted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [additionalSelected, setAdditionalSelected] = useState<Record<number, string>>({});
    const [additionalAttempted, setAdditionalAttempted] = useState<Record<number, boolean>>({});

    const [activeSubPartIndex, setActiveSubPartIndex] = useState<number>(0);
    const [subPartSelectedOptions, setSubPartSelectedOptions] = useState<Record<number, string>>({});
    const [subPartAttempted, setSubPartAttempted] = useState<Record<number, boolean>>({});

    const [activeSubPartIndexMap, setActiveSubPartIndexMap] = useState<Record<number, number>>({});
    const [subPartSelectedOptionsMap, setSubPartSelectedOptionsMap] = useState<Record<string, string>>({});
    const [subPartAttemptedMap, setSubPartAttemptedMap] = useState<Record<string, boolean>>({});

    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);
    const [currentModalImage, setCurrentModalImage] = useState<string | undefined>(undefined);
    const [currentModalMath, setCurrentModalMath] = useState<string | undefined>(undefined);
    const [currentModalStorageKey, setCurrentModalStorageKey] = useState<string>('default_canvas');

    const isChapterView = chapterParam !== null && (validChapters.includes(chapterParam as ChapterKey) || chapterParam === 'additional-questions');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('last_studied_module', '1');
            setIdeaProgress(loadIdeaProgress());
        }
    }, []);

    // نسبة إتقان الموديول تظهر في صفحة الكورس
    useEffect(() => {
        const allIdeas = Object.values(allChaptersMap).flatMap((chapter) =>
            chapter.ideas.map((idea) => `${chapter.chapterNumber}-${idea.id}`)
        );
        const masteredCount = allIdeas.filter((key) => getIdeaStatus(ideaProgress[key]) === 'mastered').length;
        localStorage.setItem('module_1_progress', String(Math.round((masteredCount / allIdeas.length) * 100)));
    }, [ideaProgress]);

    useEffect(() => {
        if (chapterParam && (validChapters.includes(chapterParam as ChapterKey) || chapterParam === 'additional-questions')) {
            setActiveChapter(chapterParam);
            if (chapterParam === 'additional-questions' && tabParam) {
                setSelectedAdditionalChapterTab(tabParam);
            } else if (chapterParam !== 'additional-questions') {
                const targetChapterData = allChaptersMap[chapterParam as Exclude<ChapterKey, 'additional-questions'>];
                if (targetChapterData) {
                    const ideasForChapter = targetChapterData.ideas;
                    const validIdea = ideaParam && ideasForChapter.some(idea => idea.id === ideaParam)
                        ? ideaParam
                        : ideasForChapter[0].id;

                    setActiveIdeaId(validIdea);
                }
            }
        } else {
            setActiveChapter('1.5');
        }
        setSelectedOption(null);
        setHasAttempted(false);
        setErrorMsg('');
        setActiveSubPartIndex(0);
        setSubPartSelectedOptions({});
        setSubPartAttempted({});
    }, [chapterParam, ideaParam, tabParam]);

    function openChapter(chKey: ChapterKey) {
        router.push(`/workspace/${routeCourseId}/1?chapter=${encodeURIComponent(chKey)}`);
    }

    function backToModule() {
        router.push(`/workspace/${routeCourseId}/1`);
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

        router.push(`/workspace/${routeCourseId}/1?chapter=${encodeURIComponent(chKey)}&idea=${encodeURIComponent(ideaId)}`);
    }

    function jumpToIdeaFromAdditional(chapterKey: string, ideaAnchorId: string) {
        router.push(`/workspace/${routeCourseId}/1?chapter=${encodeURIComponent(chapterKey)}&idea=${encodeURIComponent(ideaAnchorId)}`);
    }

    const currentIdeaObj = currentChapterData?.ideas.find(i => i.id === activeIdeaId) || currentChapterData?.ideas[0];

    // التنقل بين أفكار الشابتر
    const ideaPosition = currentChapterData && currentIdeaObj ? currentChapterData.ideas.indexOf(currentIdeaObj) : 0;
    const previousIdea = currentChapterData?.ideas[ideaPosition - 1];
    const nextIdea = currentChapterData?.ideas[ideaPosition + 1];

    function goToIdea(ideaId: string) {
        handleChapterSwitch(activeChapter, ideaId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const activeIdeaMetaObj = isAdditionalView
        ? { id: 'additional', name: additionalTutor?.ideaName ?? 'الأسئلة الإضافية' }
        : currentIdeaObj
            ? { id: currentIdeaObj.id, name: `فكرة ${currentIdeaObj.ideaNumber}: ${currentIdeaObj.ideaName}` }
            : undefined;

    // بيانات فيكتور المشتركة بين الصفحة وورقة الحل. المحادثة واحدة لكل فكرة
    const tutorChapter = isAdditionalView ? additionalTutor?.chapter ?? '' : activeChapter;
    const tutorQuestion = isAdditionalView ? additionalTutor?.question ?? '' : chapterTutorQuestion;
    const tutorChatKey = isAdditionalView ? 'additional-questions' : `${activeChapter}-${activeIdeaId}`;
    // شرح الفكرة يصل لفيكتور داخل الشابتر فقط، ومعه يظهر زر "مختصر الفكرة"
    const tutorIdeaNotes = isAdditionalView
        ? ''
        : (currentIdeaObj?.theoreticalSteps ?? []).map((step) => `${step.stepTitle}: ${step.stepDescription}`).join('\n');

    // يسجل نتيجة سؤال للفكرة، ويعرض رسالة تشجيع عند الحل الصحيح
    function handleQuestionResult(ideaKey: string, questionId: string, isCorrect: boolean) {
        const wasMastered = getIdeaStatus(ideaProgress[ideaKey]) === 'mastered';
        const updated = recordIdeaResult(ideaKey, questionId, isCorrect);
        setIdeaProgress(updated);
        if (!isCorrect) return;

        const isMastered = getIdeaStatus(updated[ideaKey]) === 'mastered';
        setToastMessage(
            isMastered && !wasMastered
                ? '🎉 كفو! أتقنت هذه الفكرة'
                : isMastered
                    ? '✅ إجابة صحيحة!'
                    : '✅ صح! باقي سؤال مختلف وتتقن الفكرة'
        );
        setIsFadingOut(false);
        setShowSuccessToast(true);
        setTimeout(() => { setIsFadingOut(true); }, 2000);
        setTimeout(() => { setShowSuccessToast(false); setIsFadingOut(false); }, 2500);
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

    function renderStructuredExplanation(text?: string) {
        if (!text) return null;
        const lines = text.split('\n').filter(line => line.trim() !== '');

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#16a34a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>💡 خطوات الحل والتفصيل:</span>
                </div>
                {lines.map((line, idx) => (
                    <div
                        key={idx}
                        style={{
                            background: '#ffffff',
                            border: '1px solid #bbf7d0',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            color: '#2C3531',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
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

    // ✅ 2. استدعاء الهوك للنظام الجديد
    const stableKey = `${activeChapter}:${activeIdeaId}`;
    const questionSet = useQuestionSet(
        currentIdeaObj?.questions ?? [],
        stableKey
    );

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

                .page-heading {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 14px;
                }
                .page-title {
                    font-size: clamp(16px, 1.6vw, 20px);
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
                .pager-name {
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

                .ideas-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 8px;
                    margin-bottom: 20px;
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

                    .question-content-grid {
                        display: grid !important;
                        grid-template-columns: 1fr 1fr !important;
                        gap: 20px !important;
                        align-items: start !important;
                    }
                    .question-text-area {
                        text-align: right !important;
                    }
                    .question-options-area {
                        text-align: right !important;
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

                    .ideas-grid {
                        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)) !important;
                        gap: 6px !important;
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

                    .question-content-grid {
                        display: grid !important;
                        grid-template-columns: 1fr !important;
                        gap: 12px !important;
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

                <FullScreenCanvasModal
                    isOpen={isCanvasModalOpen}
                    onClose={() => setIsCanvasModalOpen(false)}
                    questionImage={currentModalImage}
                    mathText={currentModalMath}
                    modalStorageKey={currentModalStorageKey}
                    activeChapter={tutorChapter}
                    activeIdeaMeta={activeIdeaMetaObj}
                    courseId={routeCourseId}
                    currentQuestion={tutorQuestion}
                    isAiAllowed={isAiAllowed}
                    chatKey={tutorChatKey}
                    ideaNotes={tutorIdeaNotes}
                />

                {/* ورقة الحل لها شات خاص بنفس المحادثة، فنخفي هذا أثناء فتحها */}
                {isChapterView && !isCanvasModalOpen && (
                    <GlobalTutor
                        key={tutorChatKey}
                        courseId={routeCourseId}
                        isAiAllowed={isAiAllowed}
                        currentChapter={tutorChapter}
                        currentIdea={activeIdeaMetaObj}
                        currentQuestion={tutorQuestion}
                        chatKey={tutorChatKey}
                        ideaNotes={tutorIdeaNotes}
                    />
                )}

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
                        <span>{toastMessage}</span>
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
                                <h1 className="page-title">شباتر الموديول الأول</h1>
                                <Link href={`/workspace/${routeCourseId}`} className="back-link">
                                    → الكورس
                                </Link>
                            </div>

                            <div className="chapters-grid">
                                {(Object.keys(allChaptersMap) as ChapterKey[]).map((chKey) => {
                                    const chData = allChaptersMap[chKey as Exclude<ChapterKey, 'additional-questions'>];
                                    const chMasteredCount = chData.ideas.filter(idea => getIdeaStatus(ideaProgress[`${chKey}-${idea.id}`]) === 'mastered').length;

                                    return (
                                        <button
                                            key={chKey}
                                            type="button"
                                            onClick={() => openChapter(chKey)}
                                            className="chapter-card"
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
                                    onClick={() => openChapter('additional-questions')}
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
                            moreQuesData={additionalQuestions}
                            selectedAdditionalChapterTab={selectedAdditionalChapterTab}
                            setSelectedAdditionalChapterTab={setSelectedAdditionalChapterTab}
                            allChaptersMap={allChaptersMap}
                            backToModule={backToModule}
                            jumpToIdeaFromAdditional={jumpToIdeaFromAdditional}
                            activeSubPartIndexMap={activeSubPartIndexMap}
                            setActiveSubPartIndexMap={setActiveSubPartIndexMap}
                            additionalSelected={additionalSelected}
                            setAdditionalSelected={setAdditionalSelected}
                            additionalAttempted={additionalAttempted}
                            setAdditionalAttempted={setAdditionalAttempted}
                            subPartSelectedOptionsMap={subPartSelectedOptionsMap}
                            setSubPartSelectedOptionsMap={setSubPartSelectedOptionsMap}
                            subPartAttemptedMap={subPartAttemptedMap}
                            setSubPartAttemptedMap={setSubPartAttemptedMap}
                            setCurrentModalImage={setCurrentModalImage}
                            setCurrentModalMath={setCurrentModalMath}
                            setCurrentModalStorageKey={setCurrentModalStorageKey}
                            setIsCanvasModalOpen={setIsCanvasModalOpen}
                            renderOptionContent={renderOptionContent}
                            renderStructuredExplanation={renderStructuredExplanation}
                            onQuestionResult={handleQuestionResult}
                            onTutorContext={setAdditionalTutor}
                        />
                    )}

                    {isChapterView && !isAdditionalView && currentChapterData && (
                        <>
                            <div className="navigation-row">
                                <div className="back-buttons">
                                    <Link href={`/workspace/${routeCourseId}`} className="back-link">
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
                                                onClick={() => handleChapterSwitch(activeChapter, idea.id)}
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

                                    <div className="idea-layout">

                                        <div className="theory-section">
                                            <h3 style={{ fontSize: '1rem', color: '#2C3531', marginBottom: '12px' }}>📖 الشرح النظري الممهد والمبسط:</h3>
                                            <div style={{ display: 'grid', gap: '12px' }}>
                                                {currentIdeaObj.theoreticalSteps.map((step, idx) => (
                                                    <div key={idx} style={{ background: '#FFF9E2', border: '1px solid #e6dec5', padding: '14px', borderRadius: '10px' }}>
                                                        <div style={{ fontWeight: 'bold', color: '#8c5521', marginBottom: '6px', fontSize: '0.95rem' }}>{step.stepTitle}</div>
                                                        <div style={{ color: '#2C3531', fontSize: '0.9rem', whiteSpace: 'pre-line', lineHeight: '1.5' }}>{step.stepDescription}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {currentIdeaObj.videoUrl && (
                                            <div className="video-section">
                                                <h3 style={{ fontSize: '1rem', color: '#2C3531', marginBottom: '12px' }}>📹 فيديو الشرح:</h3>
                                                <div className="video-frame">
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
                                                onOpenCanvas={(img, math, key) => {
                                                    setCurrentModalImage(img);
                                                    setCurrentModalMath(math);
                                                    setCurrentModalStorageKey(key ?? 'default_canvas');
                                                    setIsCanvasModalOpen(true);
                                                }}
                                            />
                                        </div>

                                        <div className="additional-link">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    router.push(`/workspace/${routeCourseId}/1?chapter=additional-questions&tab=${encodeURIComponent(activeChapter)}`);
                                                }}
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
<div style={{ fontWeight: 'bold', fontSize: '14px', color: '#8c5521' }}>                                                            أسئلة إضافية للشابتر {currentChapterData.chapterNumber}
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
                                                <button type="button" className="pager-btn" onClick={() => goToIdea(previousIdea.id)}>
                                                    <span className="pager-label">→ الفكرة السابقة</span>
                                                    <span className="pager-name">{previousIdea.ideaNumber} {previousIdea.ideaName}</span>
                                                </button>
                                            )}
                                            {nextIdea && (
                                                <button type="button" className="pager-btn pager-next" onClick={() => goToIdea(nextIdea.id)}>
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
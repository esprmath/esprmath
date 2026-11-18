'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { QuizIdea } from '@/lib/quiz/engine';
import { getIdeaStatus, type IdeaProgressMap, type IdeaStatus } from '@/lib/questions/mastery';
import { toEmbedUrl } from '@/lib/video';
import s from './Quiz.module.css';

interface QuizHomeProps {
    title: string;
    coursePath: string;
    ideas: QuizIdea[];
    progress: IdeaProgressMap;
    mistakesCount: number;
    pastExamCount: number;
    pastExamVideoUrl?: string;
    mockQuestionCount: number;
    mockMinutes: number;
    /** إذا حُدد (مثل 3) تُقسَّم الأفكار إلى مراجعات بالتساوي، وتظهر كطريق في أعلى الشاشة */
    reviewParts?: number;
    onStartIdeas: (title: string, ideas: QuizIdea[]) => void;
    onStartPastExam: () => void;
    onStartMistakes: () => void;
    /** quick = true: النسخة السريعة من الاختبار التجريبي */
    onStartMock: (quick: boolean) => void;
    /** إذا حُدد يظهر تجريبي سريع لمن وقته ضيق بجانب التجريبي الكامل */
    quickMock?: { questionCount: number; minutes: number };
    /** الطريق على اليسار وبطاقات الاختبارات على اليمين (للشاشات الكبيرة) */
    sideLayout?: boolean;
}

const STATUS_LABEL: Record<IdeaStatus, string> = {
    new: 'لم تبدأ',
    practicing: 'تحتاج تدريب',
    mastered: 'متقنة',
};

/** من هذي النسبة نعتبر الطالب جاهزًا للاختبار التجريبي */
const READY_PERCENT = 50;

const Chevron = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 5l4.5 4.5L11.5 5" />
    </svg>
);

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(' ');

/** يقسم الأفكار إلى أجزاء متساوية بحسب ترتيبها في المحتوى */
function splitIntoParts<T>(items: T[], count: number): T[][] {
    const size = Math.ceil(items.length / count);
    return Array.from({ length: count }, (_, i) => items.slice(i * size, (i + 1) * size)).filter((part) => part.length > 0);
}

// الطريق: يبدأ من اليسار، وينزل من المراجعة الأولى للثانية ثم يصعد للثالثة نحو اليمين. الإحداثيات نسبة مئوية داخل مربع الطريق
const ROAD_WIDTH = 300;
const ROAD_HEIGHT = 190;
const nodePosition = (index: number, total: number) => ({
    x: total === 1 ? 50 : 13 + index * (74 / (total - 1)),
    y: index % 2 === 0 ? 28 : 56,
});

// الطريق العمودي (من فوق لتحت): يتعرّج قليلًا، والمسميات بجانب الدوائر
const VROAD_HEIGHT = 340;
const nodePositionVertical = (index: number, total: number) => ({
    x: index % 2 === 0 ? 38 : 54,
    y: total === 1 ? 50 : 12 + index * (76 / (total - 1)),
});

function roadPathVertical(total: number) {
    const points = Array.from({ length: total }, (_, i) => {
        const { x, y } = nodePositionVertical(i, total);
        return { x: (x / 100) * ROAD_WIDTH, y: (y / 100) * VROAD_HEIGHT };
    });
    return points.slice(1).reduce((path, point, i) => {
        const from = points[i];
        const middle = (from.y + point.y) / 2;
        return `${path} C ${from.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`;
    }, `M ${points[0].x} ${points[0].y}`);
}

function roadPath(total: number) {
    const points = Array.from({ length: total }, (_, i) => {
        const { x, y } = nodePosition(i, total);
        return { x: (x / 100) * ROAD_WIDTH, y: (y / 100) * ROAD_HEIGHT };
    });
    return points.slice(1).reduce((path, point, i) => {
        const from = points[i];
        const middle = (from.x + point.x) / 2;
        return `${path} C ${middle} ${from.y}, ${middle} ${point.y}, ${point.x} ${point.y}`;
    }, `M ${points[0].x} ${points[0].y}`);
}

export default function QuizHome({
    title,
    coursePath,
    ideas,
    progress,
    mistakesCount,
    pastExamCount,
    pastExamVideoUrl,
    mockQuestionCount,
    mockMinutes,
    reviewParts,
    onStartIdeas,
    onStartPastExam,
    onStartMistakes,
    onStartMock,
    quickMock,
    sideLayout,
}: QuizHomeProps) {
    const [showMockPrompt, setShowMockPrompt] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [toggled, setToggled] = useState<Record<string, boolean>>({});
    const [closedModules, setClosedModules] = useState<Record<string, boolean>>({});

    const statusOf = (idea: QuizIdea) => getIdeaStatus(progress[idea.masteryKey]);
    const masteredCount = ideas.filter((idea) => statusOf(idea) === 'mastered').length;
    const readyPercent = ideas.length ? Math.round((masteredCount / ideas.length) * 100) : 0;
    const videoUrl = pastExamVideoUrl ? toEmbedUrl(pastExamVideoUrl) : null;

    // وضع المراجعات: الأفكار مقسومة إلى أجزاء، ولا تظهر قائمة الفصول إلا لجزء اختاره الطالب
    const [selectedPart, setSelectedPart] = useState<number | null>(null);
    const partsMode = (reviewParts ?? 0) > 1;
    const parts = partsMode ? splitIntoParts(ideas, reviewParts as number) : [];
    const doneIn = (list: QuizIdea[]) => list.filter((idea) => statusOf(idea) === 'mastered').length;
    const nextPart = parts.findIndex((part) => doneIn(part) < part.length);
    const listIdeas = partsMode ? (selectedPart !== null ? parts[selectedPart] ?? [] : []) : ideas;

    const chapters = [...new Set(listIdeas.map((idea) => idea.chapter))];
    const modules = [...new Set(listIdeas.map((idea) => idea.moduleNumber))];

    // الخطوة التالية: أول Chapter بدأ الطالب فيه ولم يكمله، وإلا أول Chapter لم يكتمل
    const unfinished = (chapter: string) =>
        listIdeas.filter((idea) => idea.chapter === chapter && statusOf(idea) !== 'mastered');
    const nextChapter =
        chapters.find((chapter) => unfinished(chapter).some((idea) => statusOf(idea) === 'practicing')) ??
        chapters.find((chapter) => unfinished(chapter).length > 0);
    const nextIdeas = nextChapter ? unfinished(nextChapter) : [];
    const everStarted = ideas.some((idea) => statusOf(idea) !== 'new');

    const isOpen = (chapter: string) => toggled[chapter] ?? chapter === nextChapter;
    const toggle = (chapter: string) => setToggled((previous) => ({ ...previous, [chapter]: !isOpen(chapter) }));

    // الطريق: مراجعات الاختبار بالترتيب
    const roadBlock = partsMode && (
        <>
            <div className={s.pathNote}>أتقنت {masteredCount} من {ideas.length} فكرة، مقسومة على {parts.length} مراجعات</div>
            <section
                className={cx(s.path, sideLayout && s.pathCompact, sideLayout && s.pathVert)}
                style={{ '--vheight': `${parts.length * 85}px` } as React.CSSProperties}
                aria-label="مراجعات الاختبار"
            >
                <svg className={cx(s.road, sideLayout && s.roadH)} viewBox={`0 0 ${ROAD_WIDTH} ${ROAD_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
                    <path d={roadPath(parts.length)} className={s.roadBase} vectorEffect="non-scaling-stroke" />
                    <path d={roadPath(parts.length)} className={s.roadLine} vectorEffect="non-scaling-stroke" />
                </svg>
                {sideLayout && (
                    <svg className={cx(s.road, s.roadV)} viewBox={`0 0 ${ROAD_WIDTH} ${VROAD_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
                        <path d={roadPathVertical(parts.length)} className={s.roadBase} vectorEffect="non-scaling-stroke" />
                        <path d={roadPathVertical(parts.length)} className={s.roadLine} vectorEffect="non-scaling-stroke" />
                    </svg>
                )}
                {parts.map((part, i) => {
                    const { x, y } = nodePosition(i, parts.length);
                    const vertical = nodePositionVertical(i, parts.length);
                    const done = doneIn(part);
                    const isNext = i === nextPart && selectedPart === null;
                    return (
                        <button
                            key={i}
                            type="button"
                            className={cx(s.pathNode, selectedPart === i && s.pathNodeActive)}
                            style={{ '--hx': `${x}%`, '--hy': `${y}%`, '--vx': `${vertical.x}%`, '--vy': `${vertical.y}%` } as React.CSSProperties}
                            aria-pressed={selectedPart === i}
                            onClick={() => setSelectedPart(selectedPart === i ? null : i)}
                        >
                            <span className={s.pathCircle}>{done === part.length ? '✓' : i + 1}</span>
                            <span className={s.pathInfo}>
                                <strong>المراجعة {i + 1}</strong>
                                <span>{done}/{part.length}</span>
                            </span>
                            {isNext && <span className={s.pathBadge}>ابدأ من هنا</span>}
                        </button>
                    );
                })}
            </section>
        </>
    );

    // بطاقات التحدي: تُرتَّب في مجموعتين (سريع / عندك وقت) إذا وُجد تجريبي سريع
    const pastExamTile = pastExamCount > 0 && (
        <section className={s.track}>
            <strong>📝 جاءت في اختبارات سابقة</strong>
            <p className={s.muted}>{pastExamCount} أفكار، لمن وقته ضيق.</p>
            <button type="button" className={s.smallPrimaryBtn} onClick={onStartPastExam}>ابدأ</button>
            {videoUrl && (
                <button type="button" className={s.linkBtn} onClick={() => setShowVideo(!showVideo)}>
                    {showVideo ? 'إخفاء الشرح' : 'مشاهدة الشرح ▶'}
                </button>
            )}
        </section>
    );

    const mistakesTile = (
        <section className={s.track}>
            <strong>📌 راجع أخطائي</strong>
            <p className={s.muted}>
                {mistakesCount > 0 ? `${mistakesCount} أفكار، بأسئلة جديدة.` : 'ما عندك أخطاء حاليًا.'}
            </p>
            <button type="button" className={s.smallPrimaryBtn} onClick={onStartMistakes} disabled={mistakesCount === 0}>ابدأ</button>
        </section>
    );

    const quickMockTile = quickMock && (
        <section className={s.track}>
            <strong>⚡ تجريبي سريع</strong>
            <p className={s.muted}>{quickMock.questionCount} أسئلة في {quickMock.minutes} دقيقة، بدون فيكتور.</p>
            <button type="button" className={s.smallPrimaryBtn} onClick={() => onStartMock(true)}>ابدأ</button>
        </section>
    );

    const fullMockTile = (
        <section className={s.track}>
            <strong>{quickMock ? '🕐 تجريبي كامل' : '⏱ الاختبار التجريبي'}</strong>
            <p className={s.muted}>{mockQuestionCount} أسئلة في {mockMinutes} دقيقة، بدون فيكتور.</p>
            <div className={s.ready} role="img" aria-label={`جاهزيتك ${readyPercent}%`}>
                <span style={{ width: `${readyPercent}%` }} />
                <em style={{ insetInlineStart: `${READY_PERCENT}%` }} />
            </div>
            <div className={s.readyNote}>
                جاهزيتك <bdi>{readyPercent}%</bdi>
                {readyPercent >= READY_PERCENT ? '، تقدر تبدأ' : <>، ننصح بعد <bdi>{READY_PERCENT}%</bdi></>}
            </div>
            <button
                type="button"
                className={readyPercent >= READY_PERCENT ? s.smallPrimaryBtn : s.smallBtn}
                onClick={() => (readyPercent >= READY_PERCENT ? onStartMock(false) : setShowMockPrompt(true))}
            >
                ابدأ
            </button>
        </section>
    );

    // قسم المراجعة المفتوحة وقائمة الفصول
    const detailBlock = (
        <>
            {partsMode && selectedPart !== null && (
                <div className={s.partHead}>
                    <strong className={s.partTitle}>المراجعة {selectedPart + 1}</strong>
                    <span className={s.chapterCount}>{doneIn(listIdeas)}/{listIdeas.length}</span>
                    <button
                        type="button"
                        className={doneIn(listIdeas) < listIdeas.length ? s.smallPrimaryBtn : s.smallBtn}
                        onClick={() =>
                            onStartIdeas(
                                `المراجعة ${selectedPart + 1}`,
                                doneIn(listIdeas) < listIdeas.length ? listIdeas.filter((idea) => statusOf(idea) !== 'mastered') : listIdeas,
                            )
                        }
                    >
                        ابدأ المراجعة
                    </button>
                </div>
            )}

            {!partsMode && (
            <section className={s.nextCard}>
                <div className={s.nextRow}>
                    <div>
                        <div className={s.nextEyebrow}>خطوتك التالية</div>
                        {nextChapter ? (
                            <div className={s.nextTitle}>
                                {everStarted ? 'كمّل' : 'ابدأ من'} Chapter {nextChapter}،{' '}
                                {nextIdeas.length === 1 ? 'باقي لك فكرة وحدة' : `باقي لك ${nextIdeas.length} أفكار`}
                            </div>
                        ) : (
                            <div className={s.nextTitle}>أتقنت كل الأفكار، جرّب الاختبار التجريبي</div>
                        )}
                        <div className={s.nextEyebrow}>أتقنت {masteredCount} من {ideas.length} فكرة</div>
                    </div>
                    {nextChapter ? (
                        <button type="button" className={s.heroBtn} onClick={() => onStartIdeas(`Chapter ${nextChapter}`, nextIdeas)}>
                            {everStarted ? 'كمّل' : 'ابدأ'}
                        </button>
                    ) : (
                        <button type="button" className={s.heroBtn} onClick={() => onStartMock(false)}>ابدأ الاختبار</button>
                    )}
                </div>
                <div className={s.heroBar} aria-hidden="true">
                    <span style={{ width: `${readyPercent}%` }} />
                </div>
            </section>
            )}

            {!partsMode && <h2 className={s.subheading}>الفصول</h2>}
            {modules.map((moduleNumber) => {
                const moduleIdeas = listIdeas.filter((idea) => idea.moduleNumber === moduleNumber);
                const moduleLeft = moduleIdeas.filter((idea) => statusOf(idea) !== 'mastered');
                const moduleChapters = chapters.filter((chapter) => moduleIdeas.some((idea) => idea.chapter === chapter));

                return (
                <div key={moduleNumber} className={s.moduleGroup}>
                {partsMode && modules.length > 1 && (
                    <div className={s.moduleLabel}>Module {moduleNumber}</div>
                )}
                {!partsMode && modules.length > 1 && (
                    <div className={s.moduleHead}>
                        <button
                            type="button"
                            className={s.moduleToggle}
                            onClick={() => setClosedModules((previous) => ({ ...previous, [moduleNumber]: !previous[moduleNumber] }))}
                            aria-expanded={!closedModules[moduleNumber]}
                        >
                            <strong className={s.moduleTitle}>Module {moduleNumber}</strong>
                            <span className={s.chapterCount}>{moduleIdeas.length - moduleLeft.length}/{moduleIdeas.length}</span>
                            <span className={cx(s.caret, !closedModules[moduleNumber] && s.caretOpen)} aria-hidden="true"><Chevron /></span>
                        </button>
                        <button
                            type="button"
                            className={moduleLeft.length > 0 ? s.smallPrimaryBtn : s.smallBtn}
                            onClick={() => onStartIdeas(`Module ${moduleNumber}`, moduleLeft.length > 0 ? moduleLeft : moduleIdeas)}
                        >
                            ابدأ
                        </button>
                    </div>
                )}
            {!(modules.length > 1 && closedModules[moduleNumber]) && (
            <div className={s.chapterList}>
                {moduleChapters.map((chapter) => {
                    const chapterIdeas = listIdeas.filter((idea) => idea.chapter === chapter);
                    const left = unfinished(chapter);
                    const open = isOpen(chapter);

                    return (
                        <section key={chapter} className={s.chapterRow}>
                            <div className={s.chapterTop}>
                                <button
                                    type="button"
                                    className={s.chapterToggle}
                                    onClick={() => toggle(chapter)}
                                    aria-expanded={open}
                                >
                                    <strong className={s.chapterName}>Chapter {chapter}</strong>
                                    <span className={s.chapterCount}>{chapterIdeas.length - left.length}/{chapterIdeas.length}</span>
                                    <span className={cx(s.caret, s.caretPlain, open && s.caretOpen)} aria-hidden="true"><Chevron /></span>
                                </button>
                                <button
                                    type="button"
                                    className={left.length > 0 ? s.smallPrimaryBtn : s.smallBtn}
                                    onClick={() => onStartIdeas(`Chapter ${chapter}`, left.length > 0 ? left : chapterIdeas)}
                                >
                                    ابدأ
                                </button>
                            </div>

                            {open && (
                                <div className={s.ideaList}>
                                    <div className={s.chips}>
                                        {chapterIdeas.map((idea) => {
                                            const status = statusOf(idea);
                                            return (
                                                <button
                                                    key={idea.key}
                                                    type="button"
                                                    className={cx(s.chip, status === 'practicing' && s.chipPracticing, status === 'mastered' && s.chipMastered)}
                                                    title={`${idea.ideaName} · ${STATUS_LABEL[status]}`}
                                                    aria-label={`فكرة ${idea.ideaNumber}: ${idea.ideaName}، ${STATUS_LABEL[status]}`}
                                                    onClick={() => onStartIdeas(`فكرة ${idea.ideaNumber}`, [idea])}
                                                >
                                                    {status === 'mastered' && '✓ '}{idea.ideaNumber}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {left.length === 0 && (
                                        <button type="button" className={s.smallBtn} onClick={() => onStartIdeas(`Chapter ${chapter}`, chapterIdeas)}>
                                            أعد المراجعة
                                        </button>
                                    )}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
            )}
                </div>
                );
            })}
        </>
    );

    return (
        <div className={s.card}>
            <div className={s.sessionHead}>
                <h1 className={s.heading}>🎯 {title}</h1>
                <Link href={coursePath} className={s.ghostBtn}>→ الـ Workspace</Link>
            </div>

            {partsMode && sideLayout ? (
                <div className={s.sideGrid}>
                    <div className={s.sideRoad}>{roadBlock}</div>
                    <div className={s.sideTiles}>
                        {quickMockTile}
                        {fullMockTile}
                        {mistakesTile}
                        {pastExamTile}
                    </div>
                    <div className={s.sideDetail}>{detailBlock}</div>
                </div>
            ) : roadBlock}

            {!(partsMode && sideLayout) && detailBlock}

            {!(partsMode && sideLayout) && (quickMock ? (
                <>
                    <h2 className={s.subheading}>⚡ وقتك ضيق</h2>
                    <div className={s.tracks}>
                        {pastExamTile}
                        {quickMockTile}
                    </div>
                    <h2 className={s.subheading}>🕐 عندك وقت</h2>
                    <div className={s.tracks}>
                        {fullMockTile}
                        {mistakesTile}
                    </div>
                </>
            ) : (
                <>
                    <h2 className={s.subheading}>جاهز للتحدي؟</h2>
                    <div className={s.tracks}>
                        {pastExamTile}
                        {mistakesTile}
                        {fullMockTile}
                    </div>
                </>
            ))}

            {showVideo && videoUrl && (
                <div className={s.video}>
                    <iframe
                        src={videoUrl}
                        title="شرح الاختبارات السابقة"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )}

            {showMockPrompt && (
                <div className={s.prompt} role="alert">
                    <p>جاهزيتك {readyPercent}%، وننصحك تخلص المراجعة أول عشان نتيجتك تكون أحسن.</p>
                    <div className={s.actions}>
                        <button type="button" className={s.secondaryBtn} onClick={() => setShowMockPrompt(false)}>أكمل المراجعة</button>
                        <button type="button" className={s.primaryBtn} onClick={() => onStartMock(false)}>ابدأ الاختبار</button>
                    </div>
                </div>
            )}
        </div>
    );
}

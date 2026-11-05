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
    onStartIdeas: (title: string, ideas: QuizIdea[]) => void;
    onStartPastExam: () => void;
    onStartMistakes: () => void;
    onStartMock: () => void;
}

const STATUS_CLASS: Record<IdeaStatus, string> = {
    new: '',
    practicing: s.chipPracticing,
    mastered: s.chipMastered,
};

const STATUS_LABEL: Record<IdeaStatus, string> = {
    new: 'لم تبدأ',
    practicing: 'تحتاج تدريب',
    mastered: 'متقنة',
};

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
    onStartIdeas,
    onStartPastExam,
    onStartMistakes,
    onStartMock,
}: QuizHomeProps) {
    const [showMockPrompt, setShowMockPrompt] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    const statusOf = (idea: QuizIdea) => getIdeaStatus(progress[idea.masteryKey]);
    const remaining = ideas.filter((idea) => statusOf(idea) !== 'mastered');
    const masteredCount = ideas.length - remaining.length;
    const chapters = [...new Set(ideas.map((idea) => idea.chapter))];
    const videoUrl = pastExamVideoUrl ? toEmbedUrl(pastExamVideoUrl) : null;

    return (
        <div className={s.card}>
            <div className={s.sessionHead}>
                <h1 className={s.heading}>🎯 {title}</h1>
                <Link href={coursePath} className={s.ghostBtn}>→ الكورس</Link>
            </div>

            <div className={s.progressLabel}>أتقنت {masteredCount} من {ideas.length} فكرة</div>
            <div className={s.bar}><span style={{ width: `${ideas.length ? (masteredCount / ideas.length) * 100 : 0}%` }} /></div>

            <h2 className={s.subheading}>مراجعة الأفكار</h2>
            <div className={s.chapters}>
                {chapters.map((chapter) => {
                    const chapterIdeas = ideas.filter((idea) => idea.chapter === chapter);
                    const left = chapterIdeas.filter((idea) => statusOf(idea) !== 'mastered');

                    return (
                        <section key={chapter} className={s.chapter}>
                            <div className={s.chapterHead}>
                                <strong>Chapter {chapter}</strong>
                                <button
                                    type="button"
                                    className={left.length > 0 ? s.smallPrimaryBtn : s.smallBtn}
                                    onClick={() => onStartIdeas(`Chapter ${chapter}`, left.length > 0 ? left : chapterIdeas)}
                                >
                                    {left.length === 0 ? 'أعد المراجعة' : `ابدأ · ${left.length} ${left.length === 1 ? 'فكرة' : 'أفكار'}`}
                                </button>
                            </div>
                            <div className={s.chips}>
                                {chapterIdeas.map((idea) => (
                                    <button
                                        key={idea.key}
                                        type="button"
                                        className={`${s.chip} ${STATUS_CLASS[statusOf(idea)]}`}
                                        title={`${idea.ideaName} · ${STATUS_LABEL[statusOf(idea)]}`}
                                        aria-label={`فكرة ${idea.ideaNumber}: ${idea.ideaName}، ${STATUS_LABEL[statusOf(idea)]}`}
                                        onClick={() => onStartIdeas(`فكرة ${idea.ideaNumber}`, [idea])}
                                    >
                                        {statusOf(idea) === 'mastered' && '✓ '}{idea.ideaNumber}
                                    </button>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            <div className={s.legend}>
                <span><i className={s.chipMastered} /> متقنة</span>
                <span><i className={s.chipPracticing} /> تحتاج تدريب</span>
                <span><i /> لم تبدأ</span>
            </div>

            <h2 className={s.subheading}>جاهز للتحدي؟</h2>
            <div className={s.tracks}>
                {pastExamCount > 0 && (
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
                )}

                <section className={s.track}>
                    <strong>📌 راجع أخطائي</strong>
                    <p className={s.muted}>
                        {mistakesCount > 0 ? `${mistakesCount} أفكار، بأسئلة جديدة.` : 'ما عندك أخطاء حاليًا.'}
                    </p>
                    <button type="button" className={s.smallPrimaryBtn} onClick={onStartMistakes} disabled={mistakesCount === 0}>ابدأ</button>
                </section>

                <section className={s.track}>
                    <strong>⏱ الاختبار التجريبي</strong>
                    <p className={s.muted}>{mockQuestionCount} أسئلة في {mockMinutes} دقيقة، بدون فيكتور.</p>
                    <button
                        type="button"
                        className={s.smallPrimaryBtn}
                        onClick={() => (remaining.length > 0 ? setShowMockPrompt(true) : onStartMock())}
                    >
                        ابدأ
                    </button>
                </section>
            </div>

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
                    <p>باقي لك {remaining.length} من {ideas.length} فكرة. ننصحك تخلص المراجعة أول.</p>
                    <div className={s.actions}>
                        <button type="button" className={s.secondaryBtn} onClick={() => setShowMockPrompt(false)}>أكمل المراجعة</button>
                        <button type="button" className={s.primaryBtn} onClick={onStartMock}>ابدأ الاختبار</button>
                    </div>
                </div>
            )}
        </div>
    );
}

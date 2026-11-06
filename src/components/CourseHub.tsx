'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import OnboardingTour from '@/components/OnboardingTour';
import { supabase } from '@/lib/supabase';
import { FALLBACK_MODULES, hasQuizPage, quizPath, windowStatus, type CourseModule } from '@/lib/courseAccess';
import { moduleProgressKey } from '@/lib/questions/mastery';
import styles from './CourseHub.module.css';

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(' ');

interface QuizSetting {
    quiz_id: string;
    title: string;
    is_open: boolean;
    opens_at: string | null;
    closes_at: string | null;
}

const QUIZ_ORDER = ['quiz-1', 'quiz-2', 'quiz-3', 'quiz-4'];

const quizLabel = (quiz: QuizSetting) => {
    const number = quiz.quiz_id.match(/quiz-(\d+)/)?.[1];
    return number ? `Q${number}` : quiz.title.slice(0, 3).toUpperCase();
};

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ar-SA-u-nu-latn', { day: 'numeric', month: 'short' });

interface HubCache {
    modules: CourseModule[];
    quizzes: QuizSetting[];
}

const hubCacheKey = (courseId: string) => `course_hub_${courseId}`;

function readHubCache(courseId: string): HubCache | null {
    try {
        const cached = JSON.parse(localStorage.getItem(hubCacheKey(courseId)) ?? 'null');
        return Array.isArray(cached?.modules) && Array.isArray(cached?.quizzes) ? cached : null;
    } catch {
        return null;
    }
}

function writeHubCache(courseId: string, cache: HubCache) {
    try {
        localStorage.setItem(hubCacheKey(courseId), JSON.stringify(cache));
    } catch {
        // الصفحة تعمل بدون النسخة المحفوظة
    }
}

/** صفحة الكورس: موديولاته واختباراته تأتي من لوحة التحكم */
export default function CourseHub({ courseId }: { courseId: string }) {
    const router = useRouter();
    const [modules, setModules] = useState<CourseModule[]>([]);
    const [quizzes, setQuizzes] = useState<QuizSetting[]>([]);
    const [progressMap, setProgressMap] = useState<Record<number, number>>({});
    const [lastModuleNumber, setLastModuleNumber] = useState<number | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [showExams, setShowExams] = useState(false);

    const lastModuleKey = `last_module_${courseId}`;

    useEffect(() => {
        let cancelled = false;

        async function load() {
            // نعرض آخر نسخة فورًا، ثم نحدّثها من قاعدة البيانات في الخلفية
            const cached = readHubCache(courseId);
            if (cached) {
                setModules(cached.modules);
                setQuizzes(cached.quizzes);
                setLoading(false);
            }

            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;
            if (cancelled) return;

            const approvedKey = user ? `course_approved_${user.id}_${courseId}` : '';
            if (user) setIsAuthorized(localStorage.getItem(approvedKey) === 'true');

            const [modulesRes, quizzesRes, enrollmentRes] = await Promise.all([
                supabase.from('course_modules').select('*').eq('course_id', courseId).order('module_number'),
                supabase.from('quiz_settings').select('quiz_id, title, is_open, opens_at, closes_at').eq('course_id', courseId),
                user
                    ? supabase.from('user_courses').select('is_approved').eq('user_id', user.id).eq('course_id', courseId).maybeSingle()
                    : null,
            ]);
            if (cancelled) return;

            // إذا تعذر الاتصال نبقي النسخة المحفوظة، وبدونها نعرض القائمة الاحتياطية
            const nextModules = modulesRes.error
                ? cached?.modules ?? (FALLBACK_MODULES[courseId] ?? []).map((m, i) => ({ ...m, id: -(i + 1), course_id: courseId, opens_at: null, closes_at: null }))
                : modulesRes.data ?? [];
            const nextQuizzes = quizzesRes.error ? cached?.quizzes ?? [] : quizzesRes.data ?? [];

            setModules(nextModules);
            setQuizzes(nextQuizzes);
            if (!modulesRes.error && !quizzesRes.error) writeHubCache(courseId, { modules: nextModules, quizzes: nextQuizzes });

            if (enrollmentRes && !enrollmentRes.error) {
                const approved = enrollmentRes.data?.is_approved === true;
                localStorage.setItem(approvedKey, String(approved));
                setIsAuthorized(approved);
            }
            setLoading(false);
        }

        load();

        const saved: Record<number, number> = {};
        for (let i = 1; i <= 8; i++) {
            saved[i] = parseInt(localStorage.getItem(moduleProgressKey(courseId, i)) ?? '0', 10) || 0;
        }
        setProgressMap(saved);
        setLastModuleNumber(Number(localStorage.getItem(lastModuleKey)) || null);
        localStorage.setItem('last_studied_course', courseId);

        return () => {
            cancelled = true;
        };
    }, [courseId, lastModuleKey]);

    const canOpen = (quiz: QuizSetting) => isAuthorized && windowStatus(quiz) === 'open';

    const openQuiz = (quiz: QuizSetting) => {
        if (!isAuthorized) {
            setAlertMessage(`🔒 "${quiz.title}" يتطلب اعتماد الكورس أولاً.`);
        } else if (windowStatus(quiz) !== 'open') {
            setAlertMessage(
                windowStatus(quiz) === 'scheduled' && quiz.opens_at
                    ? `🔒 ${quiz.title} يفتح في ${formatDate(quiz.opens_at)}.`
                    : `🔒 ${quiz.title} غير متاح حالياً. سيتم فتحه في الوقت المحدد.`
            );
        } else if (!hasQuizPage(courseId, quiz.quiz_id)) {
            setAlertMessage(`🚧 ${quiz.title} قيد التجهيز، وسيكون جاهزًا قريبًا.`);
        } else {
            router.push(quizPath(courseId, quiz.quiz_id));
        }
    };

    if (loading) {
        return <div className={styles.loading}>جاري تحميل محتوى الكورس... ⏳</div>;
    }

    // جولة أول دخول تشير لأول موديول يقدر الطالب يفتحه
    const firstOpenModuleId = modules.find((mod) => {
        const isAvailable = windowStatus(mod) === 'open';
        return isAvailable && (mod.is_free || isAuthorized);
    })?.id;

    const regularQuizzes = quizzes
        .filter((q) => q.quiz_id !== 'final-review' && !q.quiz_id.includes('mid'))
        .sort((a, b) => {
            const rank = (q: QuizSetting) => (QUIZ_ORDER.includes(q.quiz_id) ? QUIZ_ORDER.indexOf(q.quiz_id) : QUIZ_ORDER.length);
            return rank(a) - rank(b) || a.title.localeCompare(b.title);
        });
    const midterms = quizzes.filter((q) => q.quiz_id.includes('mid'));
    const finalReview = quizzes.find((q) => q.quiz_id === 'final-review');
    const isFinalOpen = finalReview ? canOpen(finalReview) : false;
    const hasExams = regularQuizzes.length > 0 || midterms.length > 0 || Boolean(finalReview);

    // الكويزات والميد ثم الفاينل: تظهر في عمود الصفحة، وفي الجوال داخل نافذة «الاختبارات»
    const renderExams = (pick: (quiz: QuizSetting) => void) => (
        <>
            {(regularQuizzes.length > 0 || midterms.length > 0) && (
                <div className={styles.examsRow}>
                    {regularQuizzes.length > 0 && (
                        <section className={styles.panel}>
                            <h2 className={styles.panelTitle}>الكويزات</h2>
                            <div className={styles.exams}>
                                {regularQuizzes.map((quiz) => {
                                    const isOpen = canOpen(quiz);
                                    return (
                                        <button
                                            key={quiz.quiz_id}
                                            type="button"
                                            onClick={() => pick(quiz)}
                                            aria-label={`${quiz.title}${isOpen ? '' : ' (مقفل)'}`}
                                            className={cx(styles.exam, isOpen && styles.examOpen)}
                                        >
                                            <span className={styles.examCircle}>
                                                {quizLabel(quiz)}
                                                {!isOpen && <span className={styles.lock}>🔒</span>}
                                            </span>
                                            <span>{quiz.title.split(' - ')[0]}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {midterms.map((quiz) => {
                        const isOpen = canOpen(quiz);
                        return (
                            <button
                                key={quiz.quiz_id}
                                type="button"
                                onClick={() => pick(quiz)}
                                aria-label={`${quiz.title}${isOpen ? '' : ' (مقفل)'}`}
                                className={cx(styles.midCard, isOpen && styles.midOpen)}
                            >
                                <span className={styles.examCircle}>
                                    MID
                                    {!isOpen && <span className={styles.lock}>🔒</span>}
                                </span>
                                <span className={styles.midText}>
                                    <span className={styles.midName}>{quiz.title.split(' - ')[0]}</span>
                                    <span className={styles.midState}>{isOpen ? '✓ متاح الآن' : 'مقفل حاليًا'}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {finalReview && (
                <section className={cx(styles.finalBox, isFinalOpen && styles.finalOpen)}>
                    <span className={styles.finalEyebrow}>{isFinalOpen ? '✓ متاحة الآن' : '🔒 تفتح قبل الاختبار'}</span>
                    <h3 className={styles.finalName}>مراجعة الفاينل</h3>
                    <p className={styles.finalDesc}>تجميعات شاملة ونماذج اختبارات نهائية.</p>
                    <button type="button" onClick={() => pick(finalReview)} className={styles.finalBtn}>
                        {isFinalOpen ? 'ابدأ المراجعة ←' : 'مقفلة حاليًا'}
                    </button>
                </section>
            )}
        </>
    );

    return (
        <div className={styles.page}>
            <Navbar
                isLoggedIn={true}
                mobileAction={
                    hasExams ? (
                        <button type="button" className={styles.examsBtn} onClick={() => setShowExams(true)}>
                            📝 الاختبارات
                        </button>
                    ) : undefined
                }
            />
            <OnboardingTour page="course" />

            <div className={styles.grid}>
                <header className={styles.header}>
                    <h1 className={styles.title}>📚 Course Modules - Math {courseId}</h1>
                    <p className={styles.subtitle}>اختر أي Module لبدء استعراض الشباتر، الأفكار، والتدريبات التفاعلية.</p>
                    <span className={cx(styles.status, isAuthorized ? styles.statusApproved : styles.statusTrial)}>
                        {isAuthorized
                            ? '✓ حسابك معتمد، فالك التوفيق'
                            : '🎁 الموديولات المجانية متاحة، والباقي يتطلب موافقة المشرف'}
                    </span>
                </header>

                <h2 className={styles.modulesTitle}>Modules</h2>
                <div className={styles.modules}>
                    {modules.length === 0 && (
                        <div className={styles.panel} style={{ textAlign: 'center', fontWeight: 700 }}>
                            🚧 محتوى هذا الكورس قيد التجهيز.
                        </div>
                    )}

                    {modules.map((mod) => {
                        const status = windowStatus(mod);
                        const isAvailable = status === 'open';
                        const isLocked = isAvailable && !mod.is_free && !isAuthorized;
                        const isOpen = isAvailable && !isLocked;
                        const progress = progressMap[mod.module_number] || 0;
                        const modulePath = `/workspace/${courseId}/${mod.module_number}`;
                        const remember = () => localStorage.setItem(lastModuleKey, String(mod.module_number));

                        return (
                            <article
                                key={mod.id}
                                id={`module-${mod.module_number}`}
                                className={cx(
                                    styles.card,
                                    isOpen && styles.cardOpen,
                                    isLocked && styles.cardLocked,
                                    !isAvailable && styles.cardSoon
                                )}
                                onClick={() => {
                                    if (isOpen) {
                                        remember();
                                        router.push(modulePath);
                                    } else if (isLocked) {
                                        setAlertMessage('🔒 هذا الموديول مقفل. لفتحه اطلب الانضمام للكورس من الصفحة الرئيسية.');
                                    }
                                }}
                            >
                                <div className={styles.cardBody}>
                                    <div className={styles.cardTop}>
                                        <span className={cx(styles.pill, styles.pillModule)}>Module {mod.module_number}</span>
                                        {mod.is_free && !isAuthorized && isAvailable && (
                                            <span className={cx(styles.pill, styles.pillFree)}>مجاني 🎁</span>
                                        )}
                                        {isOpen && lastModuleNumber === mod.module_number && (
                                            <span className={cx(styles.pill, styles.pillLast)}>آخر ما ذاكرته</span>
                                        )}
                                        {!isAvailable && (
                                            <span className={cx(styles.pill, styles.pillSoon)}>
                                                {status === 'scheduled' && mod.opens_at ? `يفتح ${formatDate(mod.opens_at)}` : 'قريبًا'}
                                            </span>
                                        )}
                                    </div>

                                    <h2 className={styles.moduleTitle}>{mod.title}</h2>
                                    {mod.description && <p className={styles.desc}>{mod.description}</p>}

                                    {mod.chapters.length > 0 && (
                                        <div className={styles.chapters}>
                                            {mod.chapters.map((chapter) =>
                                                isOpen ? (
                                                    <Link
                                                        key={chapter}
                                                        href={`${modulePath}?chapter=${chapter}`}
                                                        className={styles.chip}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            remember();
                                                        }}
                                                    >
                                                        Ch {chapter}
                                                    </Link>
                                                ) : (
                                                    <span key={chapter} className={styles.chip}>Ch {chapter}</span>
                                                )
                                            )}
                                        </div>
                                    )}

                                    {isOpen && courseId === '101' && (
                                        <div className={styles.progress}>
                                            <span className={styles.progressTrack}>
                                                <span className={styles.progressFill} style={{ width: `${progress}%` }} />
                                            </span>
                                            <span>الإتقان {progress}%</span>
                                        </div>
                                    )}
                                </div>

                                {isOpen && (
                                    <Link
                                        href={modulePath}
                                        className={styles.startBtn}
                                        data-tour={mod.id === firstOpenModuleId ? 'first-module' : undefined}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            remember();
                                        }}
                                    >
                                        {progress > 0 ? 'كمّل ←' : 'ابدأ ←'}
                                    </Link>
                                )}
                                {isLocked && (
                                    <span className={cx(styles.startBtn, styles.startBtnLocked)}>🔒 مقفل</span>
                                )}
                            </article>
                        );
                    })}
                </div>

                <div className={styles.sidebar}>{renderExams(openQuiz)}</div>
            </div>

            {/* الجوال: الاختبارات في نافذة تفتح من زر «الاختبارات» في الشريط العلوي */}
            {showExams && (
                <div className={styles.overlay} onClick={() => setShowExams(false)}>
                    <div
                        className={styles.examsSheet}
                        role="dialog"
                        aria-modal="true"
                        aria-label="الاختبارات"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.examsSheetHead}>
                            <h2>📝 الاختبارات</h2>
                            <button type="button" aria-label="إغلاق" onClick={() => setShowExams(false)}>✕</button>
                        </div>
                        {renderExams((quiz) => {
                            setShowExams(false);
                            openQuiz(quiz);
                        })}
                    </div>
                </div>
            )}

            {alertMessage && (
                <div className={styles.overlay}>
                    <div className={styles.dialog} role="alertdialog" aria-modal="true">
                        <p className={styles.dialogText}>{alertMessage}</p>
                        <button type="button" onClick={() => setAlertMessage('')} className={styles.dialogBtn}>
                            حسنًا
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

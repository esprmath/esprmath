'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * جولة أول دخول: تمشي مع الطالب من صفحة الكورس حتى يجرب أول سؤال، ثم تختفي نهائيًا.
 * بطاقة صغيرة أسفل الشاشة تبرز العنصر المطلوب بدون أن تمنع الضغط على الصفحة.
 * الخطوة الحالية محفوظة في المتصفح، فلو خرج الطالب ورجع تكمل من نفس المكان.
 */

export type TourPage = 'course' | 'moduleList' | 'idea' | 'other';

type Step = 'install' | 'exam' | 'module' | 'chapter' | 'summary' | 'video' | 'question' | 'done' | 'finished';

/** طريقة التثبيت كتطبيق (للجوالات والآيباد فقط): زر تثبيت مباشر في أندرويد، أو شرح للآيفون والآيباد */
type InstallMode = 'prompt' | 'ios';

interface InstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
    interface Window {
        /** يلتقطه سكربت في layout.tsx قبل ما تجهز الصفحة */
        __esprInstall?: InstallPromptEvent | null;
    }
}

const INSTALL_TEXT: Record<InstallMode, string> = {
    prompt: 'يفتح من أيقونة على شاشتك الرئيسية مثل أي تطبيق، وبدون شريط المتصفح.',
    ios: 'اضغط زر المشاركة (المربع اللي طالع منه سهم)، ثم «إضافة إلى الشاشة الرئيسية».',
};

function isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches
        || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** null: لابتوب أو كمبيوتر، أو الموقع مثبت أصلًا، أو المتصفح ما يدعم التثبيت */
function detectInstall(): InstallMode | null {
    if (isStandalone()) return null;
    const ua = navigator.userAgent;
    // الآيباد الحديث يعرّف نفسه Macintosh، ونميزه عن الماك باللمس
    if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
    if (/Android/.test(ua) && window.__esprInstall) return 'prompt';
    return null;
}

const STORAGE_KEY = 'esprmath_tour_v1';

/** أحداث ترسلها الصفحات حتى تتقدم الجولة */
export const TOUR_EVENTS = {
    examDateSaved: 'esprmath:exam-date-saved',
    questionChecked: 'esprmath:question-checked',
} as const;

interface StepConfig {
    page: TourPage[];
    target?: string;
    title: string;
    text: string;
    number?: number;
    /** زر التقدم، وبدونه تتقدم الجولة بضغطة الطالب على العنصر أو بحدث */
    next?: { label: string; to: Step };
    /** الخطوة التالية إذا لم يوجد العنصر في الصفحة */
    fallback?: Step;
    advanceOn?: { event: string; to: Step };
}

const TOTAL = 6;

const STEPS: Record<Exclude<Step, 'finished'>, StepConfig> = {
    // قبل الجولة وبدون رقم: نص البطاقة وأزرارها حسب الجهاز (INSTALL_TEXT)
    install: {
        page: ['course'],
        title: 'ثبّت EsprMath كتطبيق',
        text: '',
        next: { label: 'التالي', to: 'exam' },
    },
    exam: {
        page: ['course'],
        target: '[data-tour="exam-date"]',
        number: 1,
        title: 'متى اختبارك؟',
        text: 'حدد موعد اختبارك من هنا، ونعرض لك الأيام الباقية في الأعلى.',
        next: { label: 'بعدين', to: 'module' },
        fallback: 'module',
        advanceOn: { event: TOUR_EVENTS.examDateSaved, to: 'module' },
    },
    module: {
        page: ['course'],
        target: '[data-tour="first-module"]',
        number: 2,
        title: 'ابدأ من هنا',
        text: 'افتح Module 1 عشان تبدأ أول فكرة.',
    },
    chapter: {
        page: ['moduleList'],
        target: '[data-tour="first-chapter"]',
        number: 3,
        title: 'اختر الـ Chapter',
        text: 'كل Chapter فيه مجموعة أفكار. ابدأ بأول Chapter.',
    },
    summary: {
        page: ['idea'],
        target: '.theory-section',
        number: 4,
        title: 'اقرأ ملخص الفكرة',
        text: 'دقيقة وحدة: الفكرة، وكيف تعرف سؤالها، وطريقة الحل.',
        next: { label: 'التالي', to: 'video' },
        fallback: 'video',
    },
    video: {
        page: ['idea'],
        target: '.video-section',
        number: 5,
        title: 'شوف المقطع',
        text: 'المقطع يحل سؤالًا كاملًا خطوة خطوة بنفس طريقة الملخص.',
        next: { label: 'التالي', to: 'question' },
        fallback: 'question',
    },
    question: {
        page: ['idea'],
        target: '.question-section',
        number: 6,
        title: 'جرّب السؤال',
        text: 'اختر إجابة واضغط «تحقق من الإجابة». الخطأ عادي، وبعدها تطلع لك خطوات الحل.',
        advanceOn: { event: TOUR_EVENTS.questionChecked, to: 'done' },
    },
    done: {
        page: ['idea', 'moduleList'],
        title: 'كذا تمشي في كل فكرة 🎉',
        text: 'ملخص، ثم مقطع، ثم سؤال. حل سؤالين مختلفين صح وتتقن الفكرة، وفيكتور تحت لو علقت.',
        next: { label: 'يلا نبدأ', to: 'finished' },
    },
};

const ORDER: Step[] = ['install', 'exam', 'module', 'chapter', 'summary', 'video', 'question', 'done', 'finished'];

function readStep(): Step {
    try {
        const saved = localStorage.getItem(STORAGE_KEY) as Step | null;
        return saved && ORDER.includes(saved) ? saved : 'install';
    } catch {
        return 'finished'; // لا نزعج الطالب إذا كان التخزين معطلًا
    }
}

function writeStep(step: Step) {
    try {
        localStorage.setItem(STORAGE_KEY, step);
    } catch {
        // التخزين معطل: تستمر الجولة في هذه الزيارة فقط
    }
}

/** إذا وصل الطالب لصفحة متقدمة قبل إكمال الخطوات السابقة، نقفز للخطوة المناسبة لها */
function stepForPage(step: Step, page: TourPage): Step {
    const at = ORDER.indexOf(step);
    if (page === 'moduleList' && at < ORDER.indexOf('chapter')) return 'chapter';
    if (page === 'idea' && at < ORDER.indexOf('summary')) return 'summary';
    return step;
}

export default function OnboardingTour({ page }: { page: TourPage }) {
    const [step, setStep] = useState<Step>('finished');
    const [rect, setRect] = useState<DOMRect | null>(null);
    const [ready, setReady] = useState(false);

    const go = useCallback((next: Step) => {
        writeStep(next);
        setStep(next);
    }, []);

    // نقرأ الخطوة عند فتح الصفحة، ونقفز للأمام إذا لزم
    useEffect(() => {
        const current = stepForPage(readStep(), page);
        if (current !== readStep()) writeStep(current);
        setStep(current);
        setReady(true);
    }, [page]);

    const config = step === 'finished' ? null : STEPS[step];
    const visible = ready && config !== null && config.page.includes(page);
    const [installMode, setInstallMode] = useState<InstallMode | null>(null);

    // بطاقة التثبيت: نحدد طريقة الجهاز، ونتخطاها لو مثبت أو ما يدعم التثبيت
    useEffect(() => {
        if (!visible || step !== 'install') return;
        if (isStandalone()) {
            go('exam');
            return;
        }
        setInstallMode(detectInstall());
        const onPrompt = (e: Event) => {
            e.preventDefault();
            window.__esprInstall = e as InstallPromptEvent;
            setInstallMode(detectInstall());
        };
        const onInstalled = () => go('exam');
        window.addEventListener('beforeinstallprompt', onPrompt);
        window.addEventListener('appinstalled', onInstalled);
        // Chrome يرسل حدث التثبيت بعد التحميل بشوي، فننتظره قبل ما نتخطى
        const timer = window.setTimeout(() => {
            if (!detectInstall()) go('exam');
        }, 4000);
        return () => {
            window.removeEventListener('beforeinstallprompt', onPrompt);
            window.removeEventListener('appinstalled', onInstalled);
            window.clearTimeout(timer);
        };
    }, [visible, step, go]);

    const install = useCallback(async () => {
        const prompt = window.__esprInstall;
        if (!prompt) return go('exam');
        await prompt.prompt();
        await prompt.userChoice.catch(() => null);
        window.__esprInstall = null;
        go('exam');
    }, [go]);

    // تتقدم الجولة عند حدث من الصفحة (حفظ الموعد، أو التحقق من أول إجابة)
    useEffect(() => {
        if (!visible || !config?.advanceOn) return;
        const { event, to } = config.advanceOn;
        const handler = () => go(to);
        window.addEventListener(event, handler);
        return () => window.removeEventListener(event, handler);
    }, [visible, config, go]);

    // نتابع مكان العنصر المطلوب، ونتخطاه إذا لم يظهر في الصفحة
    useEffect(() => {
        if (!visible || !config?.target) {
            setRect(null);
            return;
        }
        const selector = config.target;
        let frame = 0;
        let scrolled = false;
        const started = Date.now();

        const track = () => {
            const el = document.querySelector(selector);
            const box = el?.getBoundingClientRect();
            if (el && box && box.width > 0 && box.height > 0) {
                if (!scrolled) {
                    scrolled = true;
                    if (box.top < 70 || box.bottom > window.innerHeight - 40) {
                        el.scrollIntoView({ behavior: 'smooth', block: box.height > window.innerHeight * 0.6 ? 'start' : 'center' });
                    }
                }
                setRect(box);
            } else {
                setRect(null);
                if (Date.now() - started > 1500 && config.fallback) {
                    go(config.fallback);
                    return;
                }
            }
            frame = requestAnimationFrame(track);
        };
        frame = requestAnimationFrame(track);
        return () => cancelAnimationFrame(frame);
    }, [visible, config, go]);

    if (!visible || !config) return null;
    if (config.target && !rect) return null;
    if (step === 'install' && !installMode) return null;
    const text = step === 'install' && installMode ? INSTALL_TEXT[installMode] : config.text;
    const primary =
        step === 'install' && installMode === 'prompt'
            ? { label: 'ثبّت التطبيق', onClick: install }
            : config.next
                ? { label: config.next.label, onClick: () => go(config.next!.to) }
                : null;
    // زر التثبيت يجي معه «بعدين» بدل تخطي الجولة كاملة
    const secondary =
        step === 'install' && installMode === 'prompt'
            ? { label: 'بعدين', onClick: () => go('exam') }
            : step !== 'done'
                ? { label: 'تخطي الجولة', onClick: () => go('finished') }
                : null;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    // البطاقة تحت، إلا إذا كان العنصر نفسه في أسفل الشاشة
    const cardOnTop = rect !== null && rect.top > window.innerHeight * 0.55;
    // على الشاشات الواسعة نضعها في الجهة المقابلة للعنصر حتى لا تغطيه.
    // العناصر العريضة مثل السؤال زر التحقق فيها يمين، فنضع البطاقة يسار فوق زر فيكتور
    const placeLeft =
        !isMobile && rect !== null && (rect.left + rect.width / 2 > window.innerWidth / 2 || rect.width > window.innerWidth * 0.6);

    return createPortal(
        <>
            {rect && (
                <div
                    aria-hidden="true"
                    style={{
                        position: 'fixed',
                        top: rect.top - 6,
                        left: rect.left - 6,
                        width: rect.width + 12,
                        height: rect.height + 12,
                        borderRadius: 14,
                        boxShadow: '0 0 0 3px #DCA27B, 0 0 0 9px rgba(220, 162, 123, 0.35)',
                        pointerEvents: 'none',
                        zIndex: 2000,
                    }}
                />
            )}
            <div
                role="dialog"
                aria-label={config.title}
                dir="rtl"
                style={{
                    position: 'fixed',
                    zIndex: 2001,
                    ...(isMobile
                        ? { left: 12, right: 12 }
                        : placeLeft
                            ? { left: 24, width: 380 }
                            : { right: 24, width: 380 }),
                    ...(cardOnTop
                        ? { top: isMobile ? 70 : 86 }
                        : { bottom: isMobile || placeLeft ? 84 : 24 }),
                    background: '#FFF9E2',
                    border: '2px solid #DCA27B',
                    borderRadius: 16,
                    padding: '16px 18px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                    color: '#2C3531',
                    fontFamily: 'inherit',
                }}
            >
                {config.number && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#B0764A', marginBottom: 4 }}>
                        خطوة {config.number} من {TOTAL}
                    </div>
                )}
                <div style={{ fontSize: 17, fontWeight: 800, color: '#8C5521', marginBottom: 6 }}>{config.title}</div>
                <p style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.6 }}>{text}</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                    {primary ? (
                        <button
                            type="button"
                            onClick={primary.onClick}
                            style={{ background: '#3A4D39', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                        >
                            {primary.label}
                        </button>
                    ) : (
                        <span style={{ fontSize: 12, color: '#6B5A3A' }}>اضغط على الجزء المحدد</span>
                    )}
                    {secondary && (
                        <button
                            type="button"
                            onClick={secondary.onClick}
                            style={{ background: 'none', border: 'none', color: '#8C5521', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {secondary.label}
                        </button>
                    )}
                </div>
            </div>
        </>,
        document.body
    );
}

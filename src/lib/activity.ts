// src/lib/activity.ts
// متتبع نشاط الطالب (للمشرف فقط): وقت التفاعل الفعلي، وقت كل درس، وأجوبة الأسئلة.
//
// خفيف عمدًا: كل العدّ بالذاكرة داخل المتصفح بدون أي طلب، ثم يُرسل دفعة وحدة كل 3 دقايق
// (وعند مغادرة الصفحة) إلى الدالة track_activity في قاعدة البيانات.
//
// الثانية تُحسب تفاعلًا إذا:
//   1) التبويب ظاهر، و
//   2) فيه حركة أو ضغط أو كتابة أو تمرير خلال آخر دقيقتين، أو مقطع يوتيوب شغّال.
// ومقطع الفكرة يُحسب بحد أقصى مرة ونصف مدته، حتى لا يحسب المقطع المتروك شغّالًا.

import { supabase } from '@/lib/supabase';
import { isDemoCourse } from '@/lib/courseAccess';

/** كم ثانية بعد آخر حركة نعتبر الطالب لسا متفاعلًا */
const INTERACTION_WINDOW_MS = 2 * 60 * 1000;
/** كل كم ثانية نرسل الدفعة */
const FLUSH_EVERY_MS = 3 * 60 * 1000;
/** حد المقطع الذي ما نعرف مدته */
const DEFAULT_VIDEO_CAP_SECONDS = 40 * 60;

interface IdeaBuffer {
    lesson: number;
    opens: number;
    answered: number;
    correct: number;
    completed: boolean;
}

interface CourseBuffer {
    active: number;
    video: number;
    ideas: Record<string, IdeaBuffer>;
}

const buffers: Record<string, CourseBuffer> = {};
let currentCourse: string | null = null;
let currentIdea: { key: string; videoCap: number; videoSeconds: number } | null = null;
let lastInteraction = 0;
let videoPlaying = false;
let started = false;
let accessToken: string | null = null;
/** إذا الجداول غير موجودة (لم يُشغَّل ملف SQL) أو رفض الخادم، نوقف الإرسال لهذه الجلسة */
let disabled = false;

const newIdea = (): IdeaBuffer => ({ lesson: 0, opens: 0, answered: 0, correct: 0, completed: false });
const bufferOf = (course: string): CourseBuffer => (buffers[course] ??= { active: 0, video: 0, ideas: {} });
const ideaOf = (course: string, key: string): IdeaBuffer => (bufferOf(course).ideas[key] ??= newIdea());

export function setActivityCourse(course: string | null) {
    if (course !== currentCourse) void flush();
    currentCourse = course;
}

/** يُستدعى عند فتح درس فكرة: يبدأ عدّ وقتها. يرجع دالة تنهي العدّ */
export function enterIdea(courseId: string, key: string, videoSeconds?: number) {
    if (isDemoCourse(courseId)) return () => undefined;
    const cap = videoSeconds && videoSeconds > 0 ? Math.round(videoSeconds * 1.5) : DEFAULT_VIDEO_CAP_SECONDS;
    ideaOf(courseId, key).opens += 1;
    currentIdea = { key, videoCap: cap, videoSeconds: 0 };
    return () => {
        if (currentIdea?.key === key) currentIdea = null;
        videoPlaying = false;
    };
}

/** إجابة سؤال: تُستدعى من recordIdeaResult، فتغطي الدروس والكويزات والميد */
export function trackAnswer(courseId: string, ideaKey: string, isCorrect: boolean, completedNow: boolean) {
    if (isDemoCourse(courseId)) return;
    const idea = ideaOf(courseId, ideaKey);
    idea.answered += 1;
    if (isCorrect) idea.correct += 1;
    if (completedNow) idea.completed = true;
}

/** يربط مشغّل يوتيوب لنعرف هل المقطع شغّال (بدون تحميل أي سكربت إضافي) */
export function attachVideo(iframe: HTMLIFrameElement | null) {
    if (!iframe) return;
    const listen = () =>
        iframe.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), 'https://www.youtube.com');
    listen();
    // المشغّل أحيانًا يتأخر، فنعيد النداء مرتين
    window.setTimeout(listen, 1500);
    window.setTimeout(listen, 4000);
}

function onVideoMessage(event: MessageEvent) {
    if (event.origin !== 'https://www.youtube.com' || typeof event.data !== 'string') return;
    try {
        const data = JSON.parse(event.data);
        if (data.event === 'onStateChange') videoPlaying = data.info === 1;
        else if (data.event === 'infoDelivery' && typeof data.info?.playerState === 'number') videoPlaying = data.info.playerState === 1;
    } catch {
        // رسائل غير مفهومة نتجاهلها
    }
}

function tick() {
    if (!currentCourse || document.visibilityState !== 'visible') return;

    const interacting = Date.now() - lastInteraction < INTERACTION_WINDOW_MS;
    const watching =
        videoPlaying && currentIdea !== null && currentIdea.videoSeconds < currentIdea.videoCap;
    if (!interacting && !watching) return;

    const buffer = bufferOf(currentCourse);
    buffer.active += 1;
    if (watching && currentIdea) {
        buffer.video += 1;
        currentIdea.videoSeconds += 1;
    }
    if (currentIdea) ideaOf(currentCourse, currentIdea.key).lesson += 1;
}

function takeBuffers() {
    const taken = Object.entries(buffers).filter(
        ([, buffer]) => buffer.active > 0 || Object.keys(buffer.ideas).length > 0
    );
    taken.forEach(([course]) => delete buffers[course]);
    return taken;
}

/** يرسل ما تراكم. عند الفشل يرجّعه للذاكرة ليُرسل لاحقًا */
export async function flush() {
    if (disabled || !accessToken) return;
    const taken = takeBuffers();
    if (taken.length === 0) return;

    for (const [course, buffer] of taken) {
        const ideas = Object.entries(buffer.ideas).map(([key, idea]) => ({ key, ...idea }));
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/track_activity`, {
                method: 'POST',
                keepalive: true, // يكمل حتى لو أغلق الطالب الصفحة
                headers: {
                    'Content-Type': 'application/json',
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ p_course: course, p_active: buffer.active, p_video: buffer.video, p_ideas: ideas }),
            });
            if (response.status === 404) {
                disabled = true; // ملف SQL ما شُغّل بعد
                console.warn('[activity] دالة track_activity غير موجودة. شغّل ملف supabase/migrations/20261118_activity_stats.sql');
            } else if (response.status >= 500 || response.status === 429 || response.status === 401) {
                restore(course, buffer); // مشكلة مؤقتة: نعيد المحاولة بالدفعة القادمة
            }
            // بقية الأخطاء (طلب مرفوض) نتجاهلها حتى لا نكرر نفس الطلب الفاشل
        } catch {
            restore(course, buffer);
        }
    }
}

function restore(course: string, buffer: CourseBuffer) {
    const target = bufferOf(course);
    target.active += buffer.active;
    target.video += buffer.video;
    for (const [key, idea] of Object.entries(buffer.ideas)) {
        const merged = ideaOf(course, key);
        merged.lesson += idea.lesson;
        merged.opens += idea.opens;
        merged.answered += idea.answered;
        merged.correct += idea.correct;
        merged.completed = merged.completed || idea.completed;
    }
}

/** يشغّل المتتبع مرة وحدة للصفحة. يرجع دالة إيقاف */
export function startActivityTracking() {
    if (started) return () => undefined;
    started = true;
    lastInteraction = Date.now();

    const interact = () => {
        lastInteraction = Date.now();
    };
    const events: Array<keyof WindowEventMap> = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel'];
    events.forEach((name) => window.addEventListener(name, interact, { passive: true }));
    window.addEventListener('message', onVideoMessage);

    const onHide = () => {
        if (document.visibilityState === 'hidden') void flush();
    };
    const onPageHide = () => void flush();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onPageHide);

    supabase.auth.getSession().then(({ data }) => {
        accessToken = data.session?.access_token ?? null;
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
        accessToken = session?.access_token ?? null;
    });

    const ticker = window.setInterval(tick, 1000);
    const sender = window.setInterval(() => void flush(), FLUSH_EVERY_MS);

    return () => {
        started = false;
        events.forEach((name) => window.removeEventListener(name, interact));
        window.removeEventListener('message', onVideoMessage);
        document.removeEventListener('visibilitychange', onHide);
        window.removeEventListener('pagehide', onPageHide);
        window.clearInterval(ticker);
        window.clearInterval(sender);
        subscription.subscription.unsubscribe();
        void flush();
    };
}

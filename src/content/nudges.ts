// ════════════════════════════════════════════════════════════
// إشعارات الشخصيات: تطلع للطالب إذا طوّل في نفس الفكرة
// الوقت المفروض للفكرة = مدة المقطع + 7 دقائق (الحساب في lib/lessonTime.ts)
// لإضافة شخصية: ضع صورتها في public/characters وأضف مرحلة جديدة هنا
// ════════════════════════════════════════════════════════════

export interface NudgeStage {
    /** بعد كم دقيقة من انتهاء الوقت المفروض يطلع الإشعار (0 = عند انتهائه مباشرة) */
    afterMinutes: number;
    /** مسار صورة الشخصية داخل public */
    image: string;
    title: string;
    /** نص ثانوي. {minutes} تُستبدل بالدقائق التي قضاها الطالب في الفكرة */
    text?: string;
}

/** صورتا النتيجة بجنب الجواب: كرت أحمر للغلط، وموافقة للصح */
export const ANSWER_CATS = {
    wrong: '/characters/cat-red-card.png',
    correct: '/characters/cat-approved.png',
};

/** قطو القراءة: يطلع بشات فيكتور وهو يجهّز الرد */
export const THINKING_CAT = '/characters/cat-reading.png';

/** قطو الخمول: يطلع إذا قعد الطالب بالموقع بدون ما يسوي شي (خارج الدروس). يعدّ الوقت والتبويب ظاهر فقط */
export const IDLE_NUDGE = {
    /** كم دقيقة بدون أي حركة قبل ما يطلع */
    afterMinutes: 3,
    image: '/characters/cat-clock.png',
    title: 'وينك؟ ما ودك تكمل؟',
    /** {minutes} تُستبدل بدقائق الخمول */
    text: 'صار لك {minutes} دقايق بدون ما تسوي شي.',
};

/** المراحل بالترتيب. كل مرحلة تطلع مرة واحدة لكل فكرة */
export const NUDGE_STAGES: NudgeStage[] = [
    {
        afterMinutes: 0,
        image: '/characters/cat-clock.png',
        title: 'ما ودك تخلص الدرس؟',
        text: 'صار لك {minutes} دقيقة على هذي الفكرة.',
    },
];

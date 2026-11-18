// src/lib/lessonTime.ts
// الوقت المفروض أن يخلص فيه الطالب الفكرة: مدة المقطع + وقت الشرح والأسئلة.

/** مدة كل مقطع بالثواني، المفتاح معرّف يوتيوب (11 حرفًا). مقطع جديد؟ أضف سطرًا هنا */
const VIDEO_SECONDS: Record<string, number> = {
    '21eTWUm3BlA': 192,
    '24JkXZRKV5s': 878,
    '27yDQF3NEYo': 286,
    '3Fr_MiPWr3E': 539,
    '6v6MrvQw-aw': 111,
    '7j5Uodh89Bk': 597,
    '8P1mzWDCKtc': 741,
    '9a9hhU6QGCs': 758,
    'Ao18r_hisrg': 130,
    'Cjyf0zaevuI': 176,
    'J9y13Rn9R5k': 380,
    'JaQot6_u_Mw': 229,
    'JmoIUDohJHE': 538,
    'LFbfyO-qdzM': 198,
    'LvZsZUEhjkA': 1034,
    'R8i1WGZe1GQ': 438,
    'Sy8S8lnaxXc': 874,
    'T2_YaOw-g4c': 497,
    'Th-WmtlnoNA': 696,
    'ZE5uOjsHERM': 530,
    'Zck9FvSunDg': 205,
    '_mBA66XhjYA': 336,
    'cnKEWTY01xk': 771,
    'djHhCU1yENQ': 963,
    'h4RXkKCZcpc': 296,
    'ij79sNXpL_8': 150,
    'mwkjAHdWlt4': 660,
    'o7rjD4v5oN8': 413,
    'o8Kyshw5qfE': 422,
    's-7uz1x90ZY': 762,
    'uEh_wJw1czY': 307,
    'x0-WriBYFP8': 866,
    'yyPdwUKXNdg': 577,
};

/** دقائق الشرح النظري والأسئلة، تُضاف على مدة المقطع */
const EXTRA_MINUTES = 7;
/** وقت الفكرة التي ليس لها مقطع معروف المدة */
const DEFAULT_MINUTES = 15;

/** كم دقيقة يُفترض أن تأخذ هذه الفكرة، بحسب رابط مقطعها */
export function lessonMinutes(videoUrl?: string): number {
    const id = videoUrl?.match(/([\w-]{11})(?:[?&#].*)?$/)?.[1];
    const seconds = id ? VIDEO_SECONDS[id] : undefined;
    return seconds ? Math.ceil(seconds / 60) + EXTRA_MINUTES : DEFAULT_MINUTES;
}

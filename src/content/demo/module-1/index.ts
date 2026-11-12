// ════════════════════════════════════════════════════════════
// الكورس النموذجي · Module 1
// كورس توضيحي يشوف فيه الطالب شكل الكورسات من الداخل:
// Chapter واحد بفكرتين، وأسئلة إضافية تتولد من قوالب الأفكار.
// ════════════════════════════════════════════════════════════
import type { ChapterData, ModuleContent } from '@/types/math';

const demoChapter: ChapterData = {
    moduleNumber: "1",
    chapterNumber: "1.6",
    chapterTitle: "Calculating Limits Using Limit Laws",
    ideas: [
        // ─────────── الفكرة 1.1 ───────────
        {
            id: "idea-1",
            ideaNumber: "1.1",
            ideaName: "Applying Basic Limit Laws and the Direct Substitution Property",
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "إذا كانت الدالة معرفة عند $a$، فالنهاية هي قيمتها عند $a$. هذا هو التعويض المباشر (Direct Substitution)." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "يطلب $\\lim_{x \\to a}$ لكثيرة حدود أو كسر، والمقام لا يساوي صفرًا عند $a$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. وزّع النهاية على الحدود بقوانين النهايات (Limit Laws)\n2. عوّض $x = a$ في البسط والمقام\n3. بسّط الناتج" },
                { stepTitle: "⚠️ انتبه", stepDescription: "إذا طلع $\\frac{0}{0}$ فالتعويض لا يكفي، وتحتاج تبسيطًا أولًا." }
            ],
            videoUrl: "",
            questions: [{ templateId: 'limits:direct-substitution', count: 1, difficulty: 'easy' }],
        },
        // ─────────── الفكرة 1.2 ───────────
        {
            id: "idea-2",
            ideaNumber: "1.2",
            ideaName: "The Conjugate Technique for Indeterminate Forms",
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "إذا أعطى التعويض $\\frac{0}{0}$ وفيه جذر، نتخلص من الجذر بالضرب في المرافق (Conjugate)." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "صيغة غير معينة (Indeterminate Form) $\\frac{0}{0}$ مع جذر في البسط أو المقام." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. عوّض وتأكد أن الناتج $\\frac{0}{0}$\n2. اضرب البسط والمقام في المرافق\n3. بسّط بفرق المربعين واختصر العامل المشترك\n4. عوّض $x = a$" },
                { stepTitle: "⚠️ انتبه", stepDescription: "لا تفك الطرف الثاني بعد الضرب، لأنك تحتاج عوامله للاختصار." }
            ],
            videoUrl: "",
            questions: [{ templateId: 'limits:conjugate-zero', count: 1, difficulty: 'medium' }],
        },
    ],
};

export const demoModule1: ModuleContent = {
    courseId: 'demo',
    moduleNumber: '1',
    title: 'Module 1',
    chapters: [demoChapter],
    extraQuestions: [],
    // تظهر للتوضيح فقط، وفي الكورس الفعلي تكون مفتوحة
    lockedChapters: [
        { chapterNumber: "1.8", chapterTitle: "Continuity" },
        { chapterNumber: "2.1", chapterTitle: "Derivatives and Rates of Change" },
        { chapterNumber: "3.4", chapterTitle: "Limits at Infinity; Horizontal Asymptotes" },
    ],
};

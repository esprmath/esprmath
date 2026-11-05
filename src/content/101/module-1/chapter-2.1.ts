// ════════════════════════════════════════════════════════════
// Math 101 · الموديول 1 · الشابتر 2.1
// هذا الملف للمحتوى فقط. تصميم الصفحة في components/module/ModulePage.tsx
// ════════════════════════════════════════════════════════════
import type { ChapterData } from '@/types/math';

export const chapter2_1Data: ChapterData = {
    // رقم الموديول، ورقم الشابتر، واسمه كما يظهر في بطاقة الشابتر
    moduleNumber: "1",
    chapterNumber: "2.1",
    chapterTitle: "المماس ومعدل التغير والسرعة اللحظية",
    // أفكار الشابتر بالترتيب الذي تظهر به للطالب
    ideas: [
        // ─────────── الفكرة 3.1 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-1",
            ideaNumber: "3.1",
            ideaName: "Slope and Equation of the Tangent Line Using the Limit Definition",

            // 📖 الشرح النظري: كل سطر بطاقة، فيها عنوان وشرح
            theoreticalSteps: [
                { stepTitle: "Step 1: قانون إيجاد ميل المماس", stepDescription: "يُحسب ميل المماس للمنحنى عند النقطة a باستخدام قانون النهاية الأساسي: m = lim (x→a) [f(x) - f(a)] / [x - a]" },
                { stepTitle: "Step 2: تكوين معادلة الخط المستقيم", stepDescription: "بعد إيجاد قيمة الميل (m) والنقطة المعطاة، نطبق صيغة الميل والنقطة: (y - y1) = m(x - x1) لإيجاد المعادلة بالشكل النهائي." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/uEh_wJw1czY",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [
                {
                    templateId: 'derivatives:tangent-limit',
                    count: 1,
                    difficulty: 'medium'
                }
            ],
        },
        // ─────────── الفكرة 3.2 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-2",
            ideaNumber: "3.2",
            ideaName: "Physical Applications (Instantaneous Velocity and Rates of Change)",

            // 📖 الشرح النظري: كل سطر بطاقة، فيها عنوان وشرح
            theoreticalSteps: [
                { stepTitle: "Step 1: السرعة اللحظية للأجسام الساقطة", stepDescription: "لحساب السرعة اللحظية بعد زمن محدد (t) لجسم يسقط سقوطاً حراً، نستخدم قانون السرعة الزمنية v(t) = g * t." },
                { stepTitle: "Step 2: السرعة لحظة الاصطدام بالأرض", stepDescription: "لحساب السرعة عند الاصطدام بالاعتماد على ارتفاع السقوط الكلي (h)، نستخدم العلاقة: v = √(2gh)." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/24JkXZRKV5s",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [
                {
                    templateId: 'derivatives:instantaneous-velocity',
                    count: 1,
                    difficulty: 'medium'
                }
            ],
        }
    ]
};

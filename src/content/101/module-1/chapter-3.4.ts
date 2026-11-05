// ════════════════════════════════════════════════════════════
// Math 101 · الموديول 1 · الشابتر 3.4
// هذا الملف للمحتوى فقط. تصميم الصفحة في components/module/ModulePage.tsx
// ════════════════════════════════════════════════════════════
import type { ChapterData } from '@/types/math';

export const chapter3_4Data: ChapterData = {
    // رقم الموديول، ورقم الشابتر، واسمه كما يظهر في بطاقة الشابتر
    moduleNumber: "1",
    chapterNumber: "3.4",
    chapterTitle: "النهايات عند اللانهاية وخطوط التقارب الأفقية",
    // أفكار الشابتر بالترتيب الذي تظهر به للطالب
    ideas: [
        // ─────────── الفكرة 5.1 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-1",
            ideaNumber: "5.1",
            ideaName: "Fundamental Concepts of Limits at Infinity for Reciprocal and Trigonometric Functions",

            // 📖 الشرح النظري: كل سطر بطاقة، فيها عنوان وشرح
            theoreticalSteps: [
                { stepTitle: "Step 1: النهايات للدوال المقلوبة عند ما لا نهاية", stepDescription: "عندما تقترب x من ما لا نهاية، فإن أي عدد ثابت مقسوماً على x يؤول ناتجه إلى الصفر (0)." },
                { stepTitle: "Step 2: نهايات الدوال المثلثية عند ما لا نهاية", stepDescription: "الدوال المثلثية تتذبذب باستمرار، ولذلك فإن نهايتها تكون غير موجودة (DNE)." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/o8Kyshw5qfE",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'limits:infinity-reciprocal', count: 1, difficulty: 'easy' }],
        },
        // ─────────── الفكرة 5.2 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-2",
            ideaNumber: "5.2",
            ideaName: "Limits of Rational and Radical Functions at Infinity and Identifying Horizontal Asymptotes",

            // 📖 الشرح النظري: كل سطر بطاقة، فيها عنوان وشرح
            theoreticalSteps: [
                { stepTitle: "Step 1: القسمة على أعلى قوة في المقام", stepDescription: "نقسم البسط والمقام على أعلى قوة لـ x موجودة في المقام لتسهيل تبسيط الحدود إلى 0." },
                { stepTitle: "Step 2: إيجاد الخطوط المحاذية الأفقية (HA)", stepDescription: "الخط المحاذي الأفقي هو y = L حيث L هي قيمة النهاية عندما x → ∞ أو x → -∞." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/LvZsZUEhjkA",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'limits:rational-infinity', count: 1, difficulty: 'medium' }],
        },
        // ─────────── الفكرة 5.3 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-3",
            ideaNumber: "5.3",
            ideaName: "The Conjugate Technique at Infinity for Infinity - Infinity Forms",

            // 📖 الشرح النظري: كل سطر بطاقة، فيها عنوان وشرح
            theoreticalSteps: [
                { stepTitle: "Step 1: التعرف على حالة عدم التعيين", stepDescription: "قد تنتج صيغة غير معينة من نوع (∞ - ∞) والتي لا يمكن حلها مباشراً." },
                { stepTitle: "Step 2: استخدام المرافق", stepDescription: "نضرب ونقسم في المرافق للتخلص من الجذر في البسط، ثم نبسط المقدار." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/ij79sNXpL_8",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'limits:conjugate-infinity', count: 1, difficulty: 'hard' }],
        },
        // ─────────── الفكرة 5.4 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-4",
            ideaNumber: "5.4",
            ideaName: "Infinite Limits at Infinity",

            // 📖 الشرح النظري: كل سطر بطاقة، فيها عنوان وشرح
            theoreticalSteps: [
                { stepTitle: "Step 1: مفهوم النهايات اللانهائية عند ما لا نهاية", stepDescription: "إذا كانت درجة البسط أكبر من درجة المقام، فإن ناتج النهاية يؤول إلى ما لا نهاية." },
                { stepTitle: "Step 2: طريقة الحل بالقسمة على أعلى قوة في المقام", stepDescription: "نقسم البسط والمقام على أعلى قوة لـ x في المقام، ثم نعوض لنحصل على الإشارة النهائية." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/Ao18r_hisrg",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'limits:infinity-infinite', count: 1, difficulty: 'medium' }],
        }
    ]
};

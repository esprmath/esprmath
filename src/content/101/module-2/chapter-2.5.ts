// ════════════════════════════════════════════════════════════
// Math 101 · الموديول 2 · الشابتر 2.5
// هذا الملف للمحتوى فقط. تصميم الصفحة في components/module/ModulePage.tsx
// ════════════════════════════════════════════════════════════
import type { ChapterData } from '@/types/math';

export const chapter2_5Data: ChapterData = {
    // رقم الموديول، ورقم الشابتر، واسمه كما يظهر في بطاقة الشابتر
    moduleNumber: "2",
    chapterNumber: "2.5",
    chapterTitle: "The Chain Rule",
    // أفكار الشابتر بالترتيب الذي تظهر به للطالب
    ideas: [
        // ─────────── الفكرة 3.1 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-1",
            ideaNumber: "3.1",
            ideaName: "Applying the Chain Rule to Composite Powers (General Power Rule)",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "قاعدة السلسلة (Chain Rule) مع القوى: $\\frac{d}{dx}[g(x)]^n = n[g(x)]^{n-1} \\cdot g'(x)$." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "قوس كامل مرفوع لقوة مثل $(x^3 - 1)^{100}$، أو جذر فوق دالة مثل $\\sqrt{x^2 + 1}$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. اكتب الجذر كقوة إذا وُجد\n2. أنزل القوة وأنقصها 1، واترك القوس كما هو\n3. اضرب في مشتقة ما داخل القوس\n4. بسّط الناتج" },
                { stepTitle: "⚠️ انتبه", stepDescription: "أكثر خطأ هو نسيان مشتقة ما داخل القوس." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/yyPdwUKXNdg",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:general-power', count: 1, difficulty: 'medium' }],
        },
        // ─────────── الفكرة 3.2 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-2",
            ideaNumber: "3.2",
            ideaName: "Applying the Chain Rule to Trigonometric Functions and Composite Radicals",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "نشتق من الخارج إلى الداخل بالترتيب: القوة (Power) ثم الدالة (Function) ثم الزاوية (Angle)." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "دالة مثلثية زاويتها ليست $x$ مثل $\\sin(x^2)$، أو قوة فوق دالة مثلثية مثل $\\sin^5(3x^4)$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. Power: أنزل القوة وأنقصها 1\n2. Function: اشتق الدالة واترك الزاوية كما هي\n3. Angle: اضرب في مشتقة الزاوية" },
                { stepTitle: "⚠️ انتبه", stepDescription: "الزاوية لا تتغير داخل الدالة: $(\\sin x^2)' = 2x \\cos x^2$." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/x0-WriBYFP8",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:chain-trig', count: 1, difficulty: 'medium' }],
        }
    ]
};

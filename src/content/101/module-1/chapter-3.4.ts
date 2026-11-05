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

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "عند ما لا نهاية (Limits at Infinity): عدد ثابت مقسوم على مقدار يكبر بلا حدود يقترب من الصفر." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Find the limit\" لكسر بسطه ثابت: $\\lim_{x \\to \\pm\\infty} \\frac{k}{x^n}$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. لاحظ المقام: قيمته المطلقة تكبر بلا حدود\n2. الثابت على مقدار كبير جدًا يعطي: $\\frac{k}{\\infty} = 0$" },
                { stepTitle: "⚠️ انتبه", stepDescription: "الدوال المثلثية مثل $\\sin x$ و$\\cos x$ تتذبذب عند $\\infty$، فنهايتها DNE." }
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

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "نقسم على أعلى قوة في المقام، والنهاية $L$ تعطينا خط التقارب الأفقي (Horizontal Asymptote) $y = L$." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Find the limit\" أو \"horizontal asymptote\" لكسر عندما $x \\to \\pm\\infty$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. اقسم البسط والمقام على أعلى قوة (Highest Power) في المقام\n2. الكسور $\\frac{k}{x^n}$ تصير صفرًا\n3. الناتج $L$ يعطيك $y = L$" },
                { stepTitle: "⚠️ انتبه", stepDescription: "انتبه للجذر: $\\sqrt{x^2} = |x|$، فعندما $x \\to -\\infty$ تساوي $-x$." }
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

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "الصيغة $\\infty - \\infty$ غير معينة (Indeterminate Form)، والمرافق (Conjugate) يحولها إلى كسر سهل الحساب." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "يطلب $\\lim_{x \\to \\infty} (\\sqrt{\\dots} - x)$ أو \"using the conjugate technique\"." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. اضرب واقسم على المرافق\n2. بسّط البسط بفرق المربعين\n3. اقسم على أعلى قوة في المقام، ثم عوّض" },
                { stepTitle: "⚠️ انتبه", stepDescription: "لا تعتبر $\\infty - \\infty = 0$." }
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

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "إذا كانت درجة البسط (Degree) أكبر من درجة المقام، فالنهاية $\\infty$ أو $-\\infty$ وليست عددًا." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Find the infinite limit at infinity\"، أو كسر درجة بسطه أكبر عندما $x \\to \\pm\\infty$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. خذ أعلى حد (Leading Term) في البسط والمقام\n2. اختصرهما: مثل $\\frac{2x^5}{x^4} = 2x$\n3. عوّض $\\infty$ أو $-\\infty$ وحدد الإشارة" },
                { stepTitle: "⚠️ انتبه", stepDescription: "الإشارة تعتمد على المعامل واتجاه $x$، فراجعهما معًا." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/Ao18r_hisrg",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'limits:infinity-infinite', count: 1, difficulty: 'medium' }],
        }
    ]
};

// ════════════════════════════════════════════════════════════
// Math 101 · الـ Module 1 · الـ Chapter 1.6
// هذا الملف للمحتوى فقط. تصميم الصفحة في components/module/ModulePage.tsx
// ════════════════════════════════════════════════════════════
import type { ChapterData } from '@/types/math';

export const chapter1_6Data: ChapterData = {
    // رقم الـ Module، ورقم الـ Chapter، واسمه كما يظهر في بطاقة الـ Chapter
    moduleNumber: "1",
    chapterNumber: "1.6",
    chapterTitle: "Calculating Limits Using Limit Laws and Algebraic Techniques",
    // أفكار الـ Chapter بالترتيب الذي تظهر به للطالب
    ideas: [
        // ─────────── الفكرة 2.1 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-1",
            ideaNumber: "2.1",
            ideaName: "Applying Basic Limit Laws and the Direct Substitution Property",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "إذا كانت الدالة معرفة عند $a$، فالنهاية هي قيمتها عند $a$. هذا هو التعويض المباشر (Direct Substitution)." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "يطلب $\\lim_{x \\to a}$ لكثيرة حدود أو كسر، والمقام لا يساوي صفرًا عند $a$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. وزّع النهاية على الحدود بقوانين النهايات (Limit Laws)\n2. عوّض $x = a$ في البسط والمقام\n3. بسّط الناتج" },
                { stepTitle: "⚠️ انتبه", stepDescription: "إذا طلع $\\frac{0}{0}$ فالتعويض لا يكفي، وتحتاج تبسيطًا أولًا." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/h4RXkKCZcpc",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'limits:direct-substitution', count: 1, difficulty: 'easy' }],
        },
        // ─────────── الفكرة 2.2 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-2",
            ideaNumber: "2.2",
            ideaName: "Evaluating Limits of Piecewise Functions",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "الدالة متعددة التعريف (Piecewise) تتغير قاعدتها عند نقطة، فنحسب النهاية من كل جهة بقاعدتها." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "دالة بقاعدتين وشروط مثل $x < a$ و$x > a$، ويطلب $\\lim_{x \\to a} f(x)$ أو \"determine whether the limit exists\"." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. من اليسار ($a^-$): عوّض في قاعدة $x < a$\n2. من اليمين ($a^+$): عوّض في قاعدة $x > a$\n3. قارن: متساويتان تعني أن النهاية موجودة، ومختلفتان تعني DNE" },
                { stepTitle: "⚠️ انتبه", stepDescription: "قيمة $f(a)$ لا تؤثر في وجود النهاية." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/27yDQF3NEYo",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'limits:piecewise-eval', count: 1, difficulty: 'medium' }],
        },
        // ─────────── الفكرة 2.3 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-3",
            ideaNumber: "2.3",
            ideaName: "The Conjugate Technique for Indeterminate Forms",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "إذا أعطى التعويض $\\frac{0}{0}$ وفيه جذر، نتخلص من الجذر بالضرب في المرافق (Conjugate)." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "صيغة غير معينة (Indeterminate Form) $\\frac{0}{0}$ مع جذر في البسط أو المقام." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. عوّض وتأكد أن الناتج $\\frac{0}{0}$\n2. اضرب البسط والمقام في المرافق\n3. بسّط بفرق المربعين واختصر العامل المشترك\n4. عوّض $x = a$" },
                { stepTitle: "⚠️ انتبه", stepDescription: "لا تفك الطرف الثاني بعد الضرب، لأنك تحتاج عوامله للاختصار." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/s-7uz1x90ZY",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'limits:conjugate-zero', count: 1, difficulty: 'medium' }],
        },
        // ─────────── الفكرة 2.4 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-4",
            ideaNumber: "2.4",
            ideaName: "Indirect Limit Evaluation and Handling Unknown Functions",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "إذا كانت نهاية الكسر موجودة ومقامه يقترب من الصفر، فبسطه يقترب من الصفر أيضًا." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "دالة مجهولة (Unknown Function): يعطيك $\\lim_{x \\to a} \\frac{f(x) - A}{x - a} = L$ ويطلب $\\lim_{x \\to a} f(x)$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. اكتب البسط كحاصل ضرب: $f(x) - A = \\frac{f(x) - A}{x - a} \\cdot (x - a)$\n2. خذ النهاية للطرفين بقوانين النهايات (Limit Laws): الناتج $L \\cdot 0 = 0$\n3. وزّع النهاية وأوجد $\\lim_{x \\to a} f(x)$" },
                { stepTitle: "⚠️ انتبه", stepDescription: "لا تعوّض في $f$ مباشرة، لأن قيمة الدالة غير معطاة." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/Cjyf0zaevuI",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'limits:unknown-function', count: 1, difficulty: 'medium' }],
        }
    ]
};

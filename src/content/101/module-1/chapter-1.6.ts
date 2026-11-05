// ════════════════════════════════════════════════════════════
// Math 101 · الموديول 1 · الشابتر 1.6
// هذا الملف للمحتوى فقط. تصميم الصفحة في components/module/ModulePage.tsx
// ════════════════════════════════════════════════════════════
import type { ChapterData } from '@/types/math';

export const chapter1_6Data: ChapterData = {
    // رقم الموديول، ورقم الشابتر، واسمه كما يظهر في بطاقة الشابتر
    moduleNumber: "1",
    chapterNumber: "1.6",
    chapterTitle: "Calculating Limits Using Limit Laws and Algebraic Techniques",
    // أفكار الشابتر بالترتيب الذي تظهر به للطالب
    ideas: [
        // ─────────── الفكرة 2.1 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-1",
            ideaNumber: "2.1",
            ideaName: "Applying Basic Limit Laws and the Direct Substitution Property",

            // 📖 الشرح النظري: كل سطر بطاقة، فيها عنوان وشرح
            theoreticalSteps: [
                { stepTitle: "Step 1: استخدام قوانين توزيع النهايات", stepDescription: "عند إيجاد نهاية دالة كسرية كثيرة حدود، نوزع النهاية على البسط والمقام أولاً، ثم نطبق قوانين الجمع والطرح والأسس." },
                { stepTitle: "Step 2: التعويض المباشر والتبسيط", stepDescription: "نعوض بقيمة x المعطاة في البسط والمقام، ثم نبسط الناتج النهائي باختصار الكسور إن أمكن." }
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

            // 📖 الشرح النظري: كل سطر بطاقة، فيها عنوان وشرح
            theoreticalSteps: [
                { stepTitle: "Step 1: تحديد نقطة التشعب", stepDescription: "التركيز على النقطة الفاصلة التي تتغير عندها القاعدة الجبرية للدالة لمعرفة القاعدة المناسبة لكل اتجاه." },
                { stepTitle: "Step 2: حساب النهايات الجانبية والمقارنة", stepDescription: "إيجاد النهاية من اليمين (للقيم الأكبر) ومن اليسار (للقيم الأصغر)، وتكون النهاية موجودة فقط إذا تساوت القيمتان." }
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

            // 📖 الشرح النظري: كل سطر بطاقة، فيها عنوان وشرح
            theoreticalSteps: [
                { stepTitle: "Step 1: كشف حالة عدم التعيين وجود الجذور", stepDescription: "عند التعويض المباشر وتنتج كمية غير معينة (0/0) مع وجود جذور تربيعية، نلجأ للضرب في المرافق الجبري." },
                { stepTitle: "Step 2: الضرب في المرافق والاختصار", stepDescription: "نضرب البسط والمقام في مرافق الحد الجذري للتخلص من الجذور، ثم نختصر العامل الصفري المشترك ونعوض بقيمة x." }
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

            // 📖 الشرح النظري: كل سطر بطاقة، فيها عنوان وشرح
            theoreticalSteps: [
                { stepTitle: "Step 1: التعامل مع النهايات غير المباشرة والدوال المجهولة", stepDescription: "عند إعطاء نهاية كسر يحتوي على دالة مجهولة ويساوي قيمة ثابتة، نربط البسط بالمقام عبر خصائص النهايات." },
                { stepTitle: "Step 2: الضرب في المقام وحل المعادلة", stepDescription: "نضرب طرفي المعادلة في المقام وأخذ النهاية لتصفير الأجزاء المرتبطة به، ثم إيجاد قيمة نهاية الدالة المطلوبة." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/Cjyf0zaevuI",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'limits:unknown-function', count: 1, difficulty: 'medium' }],
        }
    ]
};

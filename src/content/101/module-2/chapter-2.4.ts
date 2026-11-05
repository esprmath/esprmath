// ════════════════════════════════════════════════════════════
// Math 101 · الموديول 2 · الشابتر 2.4
// هذا الملف للمحتوى فقط. تصميم الصفحة في components/module/ModulePage.tsx
// ════════════════════════════════════════════════════════════
import type { ChapterData } from '@/types/math';

export const chapter2_4Data: ChapterData = {
    // رقم الموديول، ورقم الشابتر، واسمه كما يظهر في بطاقة الشابتر
    moduleNumber: "2",
    chapterNumber: "2.4",
    chapterTitle: "Derivatives and Special Limits of Trigonometric Functions",
    // أفكار الشابتر بالترتيب الذي تظهر به للطالب
    ideas: [
        // ─────────── الفكرة 2.1 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-1",
            ideaNumber: "2.1",
            ideaName: "Derivatives of Basic and Reciprocal Trigonometric Functions (sin, cos, tan, sec, csc, cot)",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "لكل دالة مثلثية مشتقة ثابتة تحفظها:\n$\\sin x \\to \\cos x$\n$\\cos x \\to -\\sin x$\n$\\tan x \\to \\sec^2 x$\n$\\sec x \\to \\sec x \\tan x$\n$\\csc x \\to -\\csc x \\cot x$\n$\\cot x \\to -\\csc^2 x$" },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Differentiate\" لدالة فيها $\\sin$ أو $\\cos$ أو $\\tan$ أو $\\sec$ أو $\\csc$ أو $\\cot$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. حدد النوع: جمع، أو ضرب (Product Rule)، أو قسمة (Quotient Rule)\n2. طبق القاعدة مع جدول المشتقات\n3. بسّط الناتج" },
                { stepTitle: "⚠️ انتبه", stepDescription: "الدوال التي تبدأ بحرف c مشتقتها بالسالب: $\\cos$ و$\\csc$ و$\\cot$." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/Sy8S8lnaxXc",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:trig-product', count: 1, difficulty: 'medium' }],
        },
        // ─────────── الفكرة 2.2 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-2",
            ideaNumber: "2.2",
            ideaName: "Proving Derivative Formulas for Trigonometric Functions",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "نثبت مشتقات $\\tan$ و$\\cot$ و$\\sec$ و$\\csc$ بكتابتها بدلالة $\\sin$ و$\\cos$، ثم قاعدة القسمة." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Show that\" ومعها مشتقة دالة مثلثية، مثل $\\frac{d}{dx}(\\cot x) = -\\csc^2 x$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. اكتب الدالة ككسر: $\\cot x = \\frac{\\cos x}{\\sin x}$\n2. طبق Quotient Rule\n3. استخدم المتطابقة (Identity): $\\sin^2 x + \\cos^2 x = 1$\n4. بسّط حتى تصل للطرف الأيمن" },
                { stepTitle: "⚠️ انتبه", stepDescription: "ابدأ من الطرف الأيسر (LHS)، ولا تستخدم المشتقة المطلوب إثباتها داخل الحل." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/JaQot6_u_Mw",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:trig-proof', count: 1, difficulty: 'medium' }],
        },
        // ─────────── الفكرة 2.3 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-3",
            ideaNumber: "2.3",
            ideaName: "Evaluating Special Trigonometric Limits at Zero",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "النهاية الخاصة (Special Limit): $\\lim_{x \\to 0} \\frac{\\sin px}{px} = 1$." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Find the limit\" عندما $x \\to 0$ والدالة فيها $\\sin$ أو $\\tan$، والتعويض يعطي $\\frac{0}{0}$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. اجعل المقام نفس زاوية $\\sin$: اضرب واقسم على عدد مناسب\n2. طبق القاعدة: الكسر يساوي 1\n3. احسب الباقي" },
                { stepTitle: "⚠️ انتبه", stepDescription: "القاعدة تحتاج نفس الزاوية فوق وتحت: $\\frac{\\sin 5x}{3x}$ نهايتها $\\frac{5}{3}$ وليست 1." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/ZE5uOjsHERM",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'limits:special-trig', count: 1, difficulty: 'medium' }],
        }
    ]
};

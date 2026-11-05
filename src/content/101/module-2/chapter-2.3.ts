// ════════════════════════════════════════════════════════════
// Math 101 · الموديول 2 · الشابتر 2.3
// هذا الملف للمحتوى فقط. تصميم الصفحة في components/module/ModulePage.tsx
// ════════════════════════════════════════════════════════════
import type { ChapterData } from '@/types/math';

export const chapter2_3Data: ChapterData = {
    // رقم الموديول، ورقم الشابتر، واسمه كما يظهر في بطاقة الشابتر
    moduleNumber: "2",
    chapterNumber: "2.3",
    chapterTitle: "Basic Differentiation Rules",
    // أفكار الشابتر بالترتيب الذي تظهر به للطالب
    ideas: [
        // ─────────── الفكرة 1.1 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-1",
            ideaNumber: "1.1",
            ideaName: "Constant, Power, and Constant Multiple Rules",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "قاعدة القوة (Power Rule): مشتقة $x^n$ هي $nx^{n-1}$، ومشتقة الثابت (Constant) صفر." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Differentiate\" أو \"Find the derivative\" لدالة فيها قوى أو جذور أو كسر مثل $\\frac{1}{\\sqrt{x}}$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. حوّل الجذور والكسور إلى قوى: $\\sqrt[n]{x} = x^{1/n}$ و$\\frac{1}{x^n} = x^{-n}$\n2. أنزل القوة واطرح منها 1\n3. المعامل (Constant Multiple) يبقى كما هو" },
                { stepTitle: "⚠️ انتبه", stepDescription: "القوة السالبة تنقص أيضًا: $(x^{-3})' = -3x^{-4}$ وليس $-3x^{-2}$." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/cnKEWTY01xk",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:power-rules', count: 1, difficulty: 'easy' }],
        },
        // ─────────── الفكرة 1.2 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-2",
            ideaNumber: "1.2",
            ideaName: "Sum and Difference Rules with Applications to Polynomials and Radicals",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "مشتقة المجموع أو الفرق (Sum and Difference Rules) هي مجموع أو فرق المشتقات، حدًا حدًا." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Differentiate\" لدالة من عدة حدود، أو كسر مقامه حد واحد مثل $\\frac{3x^2 + x^3}{x}$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. بسّط أولًا: اقسم كل حد على المقام\n2. اشتق كل حد لوحده بقاعدة القوة\n3. اجمع الناتج" },
                { stepTitle: "⚠️ انتبه", stepDescription: "مشتقة الكسر ليست مشتقة البسط على مشتقة المقام، فبسّط قبل الاشتقاق." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/6v6MrvQw-aw",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:sum-difference', count: 1, difficulty: 'easy' }],
        },
        // ─────────── الفكرة 1.3 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-3",
            ideaNumber: "1.3",
            ideaName: "The Product Rule and Its Applications",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "قاعدة الضرب (Product Rule): $(uv)' = u'v + uv'$." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Use the Product Rule\"، أو دالتان مضروبتان ببعض." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. سمِّ الدالتين $u$ و$v$\n2. اشتق كل واحدة لوحدها\n3. عوّض في $u'v + uv'$\n4. فك الأقواس واجمع الحدود المتشابهة (Like Terms)" },
                { stepTitle: "⚠️ انتبه", stepDescription: "مشتقة الضرب ليست ضرب المشتقتين: $(uv)' \\neq u'v'$." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/JmoIUDohJHE",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:product-rule', count: 1, difficulty: 'medium' }],
        },
        // ─────────── الفكرة 1.4 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-4",
            ideaNumber: "1.4",
            ideaName: "The Quotient Rule and Its Applications",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "قاعدة القسمة (Quotient Rule): $\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Use the Quotient Rule\"، أو كسر بسطه ومقامه دوال وما يتبسط بالقسمة." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. سمِّ البسط $u$ والمقام $v$\n2. اشتق كل واحد لوحده\n3. عوّض في القاعدة\n4. فك البسط واترك المقام كما هو" },
                { stepTitle: "⚠️ انتبه", stepDescription: "ترتيب الطرح مهم: ابدأ بـ $u'v$، ووزّع الناقص على كل القوس بعده." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/R8i1WGZe1GQ",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:quotient-rule', count: 1, difficulty: 'medium' }],
        }
    ]
};

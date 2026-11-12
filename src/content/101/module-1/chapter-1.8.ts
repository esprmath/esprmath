// ════════════════════════════════════════════════════════════
// Math 101 · الـ Module 1 · الـ Chapter 1.8
// هذا الملف للمحتوى فقط. تصميم الصفحة في components/module/ModulePage.tsx
// ════════════════════════════════════════════════════════════
import type { ChapterData } from '@/types/math';

export const chapter1_8Data: ChapterData = {
    // رقم الـ Module، ورقم الـ Chapter، واسمه كما يظهر في بطاقة الـ Chapter
    moduleNumber: "1",
    chapterNumber: "1.8",
    chapterTitle: "الاتصال (Continuity)",
    // أفكار الـ Chapter بالترتيب الذي تظهر به للطالب
    ideas: [
        // ─────────── الفكرة 4.1 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-1",
            ideaNumber: "4.1",
            ideaName: "Conditions of Continuity at a Point (Radical Functions Example)",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "الدالة متصلة (Continuous) عند $a$ إذا كانت نهايتها عند $a$ تساوي قيمتها: $\\lim_{x \\to a} f(x) = f(a)$." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Use the definition of continuity\" عند عدد $a$، أو \"Explain why the function is discontinuous\"." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. تأكد أن $f(a)$ معرفة\n2. تأكد أن $\\lim_{x \\to a} f(x)$ موجودة\n3. تأكد أن النهاية تساوي $f(a)$" },
                { stepTitle: "⚠️ انتبه", stepDescription: "إذا اختل شرط واحد، فالدالة غير متصلة عند $a$." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/Th-WmtlnoNA",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'continuity:check-point', count: 1, difficulty: 'easy' }],
        },
        // ─────────── الفكرة 4.2 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-2",
            ideaNumber: "4.2",
            ideaName: "Classifying Types of Discontinuity",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "عدم الاتصال (Discontinuity) يحدث عند نقطة يختل فيها شرط من شروط الاتصال، مثل صفر المقام أو نقطة تغيّر القاعدة." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Determine where the function is discontinuous\" لدالة كسرية أو متعددة التعريف (Piecewise)." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. الدالة الكسرية: ساوِ المقام بالصفر\n2. الدالة Piecewise: قارن النهايتين من الجهتين مع $f(a)$ عند نقطة التغيّر\n3. حدد النوع: يختصر العامل = Removable، جهتان مختلفتان = Jump، نهاية لا نهائية = Infinite" },
                { stepTitle: "⚠️ انتبه", stepDescription: "اختصار العامل لا يجعل الدالة متصلة، فهي تبقى غير معرفة عند هذه النقطة." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/7j5Uodh89Bk",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'continuity:rational-discontinuity', count: 1, difficulty: 'medium' }],
        },
        // ─────────── الفكرة 4.3 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-3",
            ideaNumber: "4.3",
            ideaName: "Algebraic Properties of Continuous Functions and Intervals of Continuity",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "إذا كانت $f$ و$g$ متصلتين (Continuous) عند $a$، فالنهاية تساوي القيمة عند $a$. ومجموعهما وحاصل ضربهما متصلان أيضًا." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Suppose f and g are continuous\"، ويعطيك $g(a)$ ونهاية، ويطلب $f(a)$. أو \"On what intervals is the function continuous\"." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. عوّض مباشرة: استبدل $x$ بـ $a$ داخل النهاية\n2. عوّض قيمة $g(a)$ المعطاة\n3. حل المعادلة لإيجاد $f(a)$\n4. لفترات الاتصال (Intervals): الكسرية متصلة إلا حيث المقام صفر" },
                { stepTitle: "⚠️ انتبه", stepDescription: "هذا التعويض صحيح لأن الدوال متصلة، فلا تطبقه على دالة غير متصلة." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/mwkjAHdWlt4",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'continuity:unknown-value', count: 1, difficulty: 'medium' }],
        },
        // ─────────── الفكرة 4.4 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-4",
            ideaNumber: "4.4",
            ideaName: "Continuity of Composite Radical and Rational Functions",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "الدالة متصلة في كل نقطة معرفة عندها، فنبحث عن النقاط التي تفشل: ما تحت الجذر سالب أو المقام صفر." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Where is the function continuous?\" لدالة فيها جذر وكسر." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. الجذر: تأكد أن ما تحته $\\geq 0$\n2. المقام: ساوِه بالصفر وأوجد القيم المستثناة\n3. اكتب الفترات (Intervals): كل الأعداد ما عدا هذه القيم" },
                { stepTitle: "⚠️ انتبه", stepDescription: "المقدار $x^2 + c$ مع $c > 0$ موجب دائمًا، فلا يضيّق المجال." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/21eTWUm3BlA",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'continuity:interval-of-continuity', count: 1, difficulty: 'medium' }],
        }
    ]
};

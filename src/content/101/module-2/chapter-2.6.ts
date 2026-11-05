// ════════════════════════════════════════════════════════════
// Math 101 · الموديول 2 · الشابتر 2.6
// هذا الملف للمحتوى فقط. تصميم الصفحة في components/module/ModulePage.tsx
// ════════════════════════════════════════════════════════════
import type { ChapterData } from '@/types/math';

export const chapter2_6Data: ChapterData = {
    // رقم الموديول، ورقم الشابتر، واسمه كما يظهر في بطاقة الشابتر
    moduleNumber: "2",
    chapterNumber: "2.6",
    chapterTitle: "Implicit Differentiation",
    // أفكار الشابتر بالترتيب الذي تظهر به للطالب
    ideas: [
        // ─────────── الفكرة 4.1 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-1",
            ideaNumber: "4.1",
            ideaName: "Finding dy/dx for Implicitly Defined Functions",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "الاشتقاق الضمني (Implicit Differentiation): نشتق الطرفين بالنسبة لـ $x$، وكل حد فيه $y$ يضرب في $y'$." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Find dy/dx\" أو \"Find y'\" من معادلة يصعب فصل $y$ فيها، مثل $x^3 + y^3 = 6xy$، أو \"tangent\" عند نقطة على منحنى." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. اشتق الطرفين بالنسبة لـ $x$\n2. انقل حدود $y'$ إلى طرف والباقي إلى الطرف الثاني\n3. خذ $y'$ عاملًا مشتركًا (Factor)\n4. اقسم على القوس" },
                { stepTitle: "⚠️ انتبه", stepDescription: "$xy$ حاصل ضرب، فمشتقتها $y + xy'$. وللمماس: عوّض النقطة في $y'$ ثم استخدم Point-Slope." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/3Fr_MiPWr3E",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:implicit-cubic', count: 1, difficulty: 'medium' }],
        },
        // ─────────── الفكرة 4.2 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-2",
            ideaNumber: "4.2",
            ideaName: "Implicit Differentiation of Trigonometric Functions and Functions Implicitly Defined via g(x)",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "نفس الاشتقاق الضمني، لكن إذا كانت الزاوية فيها $y$ نضيف مشتقة الزاوية: $(\\sin(x + y))' = (1 + y')\\cos(x + y)$." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "$\\sin$ أو $\\cos$ فيها $y$ مع \"implicit differentiation\"، أو معادلة في $g(x)$ تطلب $g'(0)$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. اشتق الطرفين مع مشتقة الزاوية\n2. اجمع حدود $y'$ في طرف واقسم\n3. مع $g'(0)$: عوّض $x = 0$\n4. أوجد $g(0)$ من المعادلة الأصلية وعوّضها" },
                { stepTitle: "⚠️ انتبه", stepDescription: "$x \\sin g(x)$ حاصل ضرب مع Chain Rule، فلا تترك الحل عند $\\sin g(0)$." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/8P1mzWDCKtc",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:implicit-trig', count: 1, difficulty: 'hard' }],
        }
    ]
};

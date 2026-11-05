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

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "ميل المماس (Tangent Line) عند نقطة هو نهاية ميل القاطع عند الاقتراب منها." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Find an equation of the tangent line\" عند نقطة $(a, f(a))$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. اكتب قانون الميل: $m = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}$\n2. بسّط واختصر $(x - a)$، ثم عوّض\n3. اكتب المعادلة بصيغة Point-Slope: $y - y_1 = m(x - x_1)$" },
                { stepTitle: "⚠️ انتبه", stepDescription: "التعويض المباشر في البداية يعطي $\\frac{0}{0}$، فبسّط أولًا." }
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

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "السرعة (Velocity) عند لحظة معينة هي ميل دالة الموقع (Position Function) عند هذه اللحظة." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"A ball is dropped\"، ويسأل عن \"velocity\" بعد زمن معين أو \"How fast\" عند الاصطدام." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. ابنِ دالة الموقع: $s(t) = s_0 + v_0 t - \\frac{1}{2}gt^2$\n2. احسب الميل بالنهاية: $v(a) = \\lim_{t \\to a} \\frac{s(t) - s(a)}{t - a}$\n3. عوّض الزمن المطلوب في $v(a)$\n4. للاصطدام: حل $s(t) = 0$ لإيجاد الزمن، ثم عوّضه" },
                { stepTitle: "⚠️ انتبه", stepDescription: "\"dropped\" تعني $v_0 = 0$. السرعة السالبة تعني أن الجسم نازل، و\"How fast\" تسأل عن مقدارها فتكون موجبة." }
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

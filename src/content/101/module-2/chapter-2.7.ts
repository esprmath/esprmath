// ════════════════════════════════════════════════════════════
// Math 101 · الموديول 2 · الشابتر 2.7
// هذا الملف للمحتوى فقط. تصميم الصفحة في components/module/ModulePage.tsx
// ════════════════════════════════════════════════════════════
import type { ChapterData } from '@/types/math';

export const chapter2_7Data: ChapterData = {
    // رقم الموديول، ورقم الشابتر، واسمه كما يظهر في بطاقة الشابتر
    moduleNumber: "2",
    chapterNumber: "2.7",
    chapterTitle: "Rates of Change in Natural and Social Sciences",
    // أفكار الشابتر بالترتيب الذي تظهر به للطالب
    ideas: [
        // ─────────── الفكرة 5.1 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-1",
            ideaNumber: "5.1",
            ideaName: "Motion of Particles along a Straight Line (Position, Velocity, and Direction)",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "السرعة (Velocity) مشتقة الموقع (Position): $v(t) = \\frac{ds}{dt}$، وإشارتها تحدد الاتجاه." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"The position of a particle\" ويسأل عن \"velocity\" أو \"at rest\" أو \"moving forward\"." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. اشتق: $v(t) = s'(t)$\n2. At rest: حل $v(t) = 0$\n3. Forward: أوجد متى $v(t) > 0$ بجدول الإشارة (Sign Chart)" },
                { stepTitle: "⚠️ انتبه", stepDescription: "\"At rest\" تعني $v = 0$ وليس $s = 0$." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/9a9hhU6QGCs",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:particle-motion', count: 1, difficulty: 'medium' }],
        },
        // ─────────── الفكرة 5.2 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-2",
            ideaNumber: "5.2",
            ideaName: "Geometric Rates of Change (Volume of a Cube)",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "معدل التغير (Rate of Change) للحجم هو مشتقته: $\\frac{dV}{dx}$ يبين كم يزيد الحجم لكل زيادة في الضلع." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"cube\" مع \"calculate dV/dx\" عند طول ضلع معين." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. اكتب القانون: $V = x^3$\n2. اشتق: $\\frac{dV}{dx} = 3x^2$\n3. عوّض طول الضلع" },
                { stepTitle: "⚠️ انتبه", stepDescription: "لا تحسب الحجم نفسه، والوحدة هنا $\\text{mm}^3/\\text{mm}$." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/Zck9FvSunDg",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:cube-volume', count: 1, difficulty: 'easy' }],
        },
        // ─────────── الفكرة 5.3 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-3",
            ideaNumber: "5.3",
            ideaName: "Physical and Hydraulic Rates of Change (Torricelli's Law)",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "معدل تفريغ الخزان هو مشتقة حجم الماء بالنسبة للزمن: $\\frac{dV}{dt}$." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"tank\" و\"drains\" و\"Torricelli's Law\"، ومعادلة مثل $V = 5000(1 - \\frac{t}{40})^2$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. اشتق $V$ بقاعدة السلسلة (Chain Rule)\n2. بسّط المعاملات\n3. عوّض الزمن المطلوب" },
                { stepTitle: "⚠️ انتبه", stepDescription: "لا تنس مشتقة القوس، والإشارة السالبة تعني أن الماء ينقص." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/_mBA66XhjYA",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:torricelli', count: 1, difficulty: 'medium' }],
        },
        // ─────────── الفكرة 5.4 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-4",
            ideaNumber: "5.4",
            ideaName: "Rates of Change in Electricity (Electric Charge and Current)",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "التيار (Current) مشتقة الشحنة (Charge): $I = \\frac{dQ}{dt}$، ووحدته الأمبير (Ampere)." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"quantity of charge\" مع \"Find the current\" أو \"At what time is the current lowest\"." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. اشتق: $I = Q'(t)$\n2. عوّض الزمن المطلوب\n3. أقل قيمة: حل $\\frac{dI}{dt} = 0$" },
                { stepTitle: "⚠️ انتبه", stepDescription: "عوّض في $I$ وليس في $Q$." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/LFbfyO-qdzM",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'derivatives:electric-current', count: 1, difficulty: 'medium' }],
        }
    ]
};

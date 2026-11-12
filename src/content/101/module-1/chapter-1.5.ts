// ════════════════════════════════════════════════════════════
// Math 101 · الـ Module 1 · الـ Chapter 1.5
// هذا الملف للمحتوى فقط. تصميم الصفحة في components/module/ModulePage.tsx
// ════════════════════════════════════════════════════════════
import type { ChapterData } from '@/types/math';

export const chapter1_5Data: ChapterData = {
    // رقم الـ Module، ورقم الـ Chapter، واسمه كما يظهر في بطاقة الـ Chapter
    moduleNumber: "1",
    chapterNumber: "1.5",
    chapterTitle: "The Concept of a Limit and Infinite Limits",
    // أفكار الـ Chapter بالترتيب الذي تظهر به للطالب
    ideas: [
        // ─────────── الفكرة 1.1 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-1",
            ideaNumber: "1.1",
            ideaName: "The Intuitive Idea of a Limit and Estimating Limits Numerically",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "النهاية (Limit) هي القيمة التي تقترب منها $f(x)$ عندما تقترب $x$ من $a$، وليست قيمة الدالة عند $a$ نفسها." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "يعطيك جدول قيم (Table) قريبة من عدد، ويطلب تقدير (Estimate) النهاية $\\lim_{x \\to a} f(x)$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. من اليسار: لاحظ أين تتجه القيم عندما $x < a$\n2. من اليمين: لاحظ أين تتجه القيم عندما $x > a$\n3. قارن: نفس العدد يعني أن النهاية موجودة، وعددان مختلفان يعني DNE" },
                { stepTitle: "⚠️ انتبه", stepDescription: "تجاهل قيمة الدالة عند $x = a$ نفسها، فهي لا تحدد النهاية." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/djHhCU1yENQ",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [{ templateId: 'limits:numerical-table', count: 1, difficulty: 'easy' }],
        },
        // ─────────── الفكرة 1.2 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-2",
            ideaNumber: "1.2",
            ideaName: "Estimating Limits Graphically",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "من الرسم (Graph): النهاية هي الارتفاع الذي يقترب منه المنحنى، وقيمة الدالة هي النقطة الممتلئة." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Use the given graph\" ويطلب $\\lim_{x \\to a^-} f(x)$ أو $\\lim_{x \\to a^+} f(x)$ أو $\\lim_{x \\to a} f(x)$ أو $f(a)$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. تتبع المنحنى من اليسار ($a^-$) واقرأ قيمة $y$\n2. تتبع المنحنى من اليمين ($a^+$) واقرأ قيمة $y$\n3. قارن: متساويتان تعني أن النهاية موجودة، ومختلفتان تعني DNE\n4. لقيمة $f(a)$: اقرأ النقطة الممتلئة فوق $a$" },
                { stepTitle: "⚠️ انتبه", stepDescription: "الدائرة الفارغة تساعدك في قراءة النهاية، لكنها ليست قيمة الدالة." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/J9y13Rn9R5k",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [
                {
                    kind: 'group',
                    stableId: '1.5-idea2-graph-q1',
                    questionText: "Use the given graph of f to state the value of each quantity, if it exists.",
                    graphImage: "/q04-graph.png",
                    ideaAnchorId: "idea-2",
                    parts: [
                        { kind: 'static', stableId: '1.5-idea2-graph-q1-part-a', questionText: "أ) إيجاد النهاية الكلية عندما تقترب x من القيمة 1.", mathExpression: "\\lim_{x \\to 1} f(x)", options: [{ id: 'A', text: '1' }, { id: 'B', text: '2' }, { id: 'C', text: 'DNE' }, { id: 'D', text: '3' }], correctId: 'C', steps: [{ text: "النهاية من اليسار تساوي 2 ومن اليمين تساوي 1، وبما أن القيمتين غير متساويتين فالنهاية غير موجودة (DNE)." }] },
                        { kind: 'static', stableId: '1.5-idea2-graph-q1-part-b', questionText: "ب) إيجاد النهاية من جهة اليسار عندما تقترب x من القيمة 1.", mathExpression: "\\lim_{x \\to 1^-} f(x)", options: [{ id: 'A', text: '1' }, { id: 'B', text: '2' }, { id: 'C', text: '3' }, { id: 'D', text: 'DNE' }], correctId: 'B', steps: [{ text: "عند تتبع المنحنى قادماً من اليسار نحو 1، تقترب قيمة y من العدد 2." }] },
                        { kind: 'static', stableId: '1.5-idea2-graph-q1-part-c', questionText: "ج) إيجاد النهاية من جهة اليمين عندما تقترب x من القيمة 1.", mathExpression: "\\lim_{x \\to 1^+} f(x)", options: [{ id: 'A', text: '1' }, { id: 'B', text: '2' }, { id: 'C', text: '3' }, { id: 'D', text: 'DNE' }], correctId: 'A', steps: [{ text: "عند تتبع المنحنى قادماً من اليمين نحو 1، تقترب قيمة y من العدد 1." }] },
                        { kind: 'static', stableId: '1.5-idea2-graph-q1-part-d', questionText: "د) إيجاد قيمة الدالة الفعليّة عند x = 1.", mathExpression: "f(1)", options: [{ id: 'A', text: '1' }, { id: 'B', text: '2' }, { id: 'C', text: '3' }, { id: 'D', text: 'Undefined' }], correctId: 'A', steps: [{ text: "قيمة الدالة الفعلية تحددها حصرياً النقطة المغلقة الممتلئة عند x = 1 والتي تقع عند y = 1." }] },
                        { kind: 'static', stableId: '1.5-idea2-graph-q1-part-e', questionText: "هـ) إيجاد النهاية الكلية عندما تقترب x من القيمة 4.", mathExpression: "\\lim_{x \\to 4} f(x)", options: [{ id: 'A', text: '1' }, { id: 'B', text: '3' }, { id: 'C', text: 'DNE' }, { id: 'D', text: '2' }], correctId: 'C', steps: [{ text: "النهاية من اليسار تساوي 1 ومن اليمين تساوي 3، وبما أن الطرفين غير متطابقين فالنهاية غير موجودة." }] },
                        { kind: 'static', stableId: '1.5-idea2-graph-q1-part-f', questionText: "و) إيجاد قيمة الدالة الفعليّة عند x = 4.", mathExpression: "f(4)", options: [{ id: 'A', text: '1' }, { id: 'B', text: '2' }, { id: 'C', text: '3' }, { id: 'D', text: 'Undefined' }], correctId: 'C', steps: [{ text: "النقطة المغلقة الفعلية عند x = 4 تقع تماماً عند الإحداثي y = 3." }] }
                    ]
                }
            ],
        },
        // ─────────── الفكرة 1.3 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-3",
            ideaNumber: "1.3",
            ideaName: "Infinite Limits",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "إذا اقترب البسط من عدد غير الصفر والمقام من الصفر، فالنهاية لا نهائية (Infinite Limit): $\\infty$ أو $-\\infty$." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "يطلب $\\lim_{x \\to a^+}$ أو $\\lim_{x \\to a^-}$ لكسر، والتعويض يعطي $\\frac{k}{0}$." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. عوّض $x = a$: إذا طلع $\\frac{k}{0}$ فالنهاية لا نهائية\n2. حدد إشارة المقام: عوّض عددًا قريبًا من $a$ من الجهة المطلوبة\n3. إشارة البسط مع إشارة المقام تعطيك $\\infty$ أو $-\\infty$" },
                { stepTitle: "⚠️ انتبه", stepDescription: "الجهتان $a^+$ و$a^-$ قد تختلف إشارتهما، فافحص الجهة المطلوبة." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/T2_YaOw-g4c",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [
                {
                    templateId: 'limits:rational-sign',
                    count: 1,
                    difficulty: 'medium',
                    variablesOverride: {
                        numerator: { min: -9, max: 9, exclude: [0] },
                        asymptote: { min: -5, max: 5 },
                    }
                }
            ],
        },
        // ─────────── الفكرة 1.4 ───────────
        {
            // id ثابت لا تغيّره: تقدم الطالب محفوظ عليه
            id: "idea-4",
            ideaNumber: "1.4",
            ideaName: "Finding Vertical Asymptotes Using Limits",

            // 📖 ملخص الفكرة: الفكرة، وتعرف السؤال لما، وطريقة الحل، وانتبه. اكتب المعادلات بين علامتي $
            theoreticalSteps: [
                { stepTitle: "💡 الفكرة", stepDescription: "خط التقارب الرأسي (Vertical Asymptote) هو $x = a$ إذا كانت النهاية عند $a$ تساوي $\\infty$ أو $-\\infty$." },
                { stepTitle: "🔍 تعرف السؤال لما", stepDescription: "\"Find the vertical asymptotes\" أو \"أوجد خطوط التقارب الرأسية\" لدالة كسرية." },
                { stepTitle: "🪜 طريقة الحل", stepDescription: "1. ساوِ المقام بالصفر وأوجد قيم $x$\n2. تأكد بالنهاية عند كل قيمة: إذا طلعت $\\infty$ أو $-\\infty$ فهو خط تقارب\n3. اكتب الجواب كمعادلة: $x = a$" },
                { stepTitle: "⚠️ انتبه", stepDescription: "إذا صار البسط والمقام صفرًا معًا عند $a$، فقد تكون فجوة وليست خط تقارب." }
            ],

            // 🎬 رابط المقطع: الصق رابط يوتيوب بأي صيغة، واتركه "" إذا لا يوجد مقطع
            videoUrl: "https://www.youtube.com/embed/o7rjD4v5oN8",

            // ✍️ الأسئلة: templateId هو اسم القالب، والقوالب في lib/questions/templates
            questions: [
                {
                    templateId: 'limits:vertical-asymptote',
                    count: 1,
                    difficulty: 'easy'
                }
            ],
        }
    ]
};

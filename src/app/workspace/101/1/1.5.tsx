// src/data/courses/101/1/1.5.ts
import { ChapterData } from '@/types/math';
import type { QuestionItem } from '@/lib/questions/types';

export const chapter1_5Data: ChapterData = {
    moduleNumber: "1",
    chapterNumber: "1.5",
    chapterTitle: "The Concept of a Limit and Infinite Limits",
    ideas: [
        {
            id: "idea-1",
            ideaNumber: "1.1",
            ideaName: "The Intuitive Idea of a Limit and Estimating Limits Numerically",
            theoreticalSteps: [
                { stepTitle: "🎯 فكرة الدرس", stepDescription: "في هذا الجزء ستتعلم مفهوم النهاية للدالة، وكيف نقدر قيمتها عندما تقترب المتغيرات من نقطة معينة." },
                { stepTitle: "📌 المفهوم الأساسي", stepDescription: "النهاية لا تهتم بما تفعله الدالة عند النقطة بالضبط، بل بما يحدث عند الاقتراب منها." },
                { stepTitle: "📊 التقدير باستخدام الجداول", stepDescription: "سنتعلم كيف نُعوض بقيم قريبة جداً من النقطة المستهدفة من اليمين واليسار." },
                { stepTitle: "↔️ الاقتراب من اليمين واليسار", stepDescription: "ستتعلم كيف تقرأ السلوك من الجهتين وتقارن بينهما." },
                { stepTitle: "✅ متى تكون النهاية موجودة", stepDescription: "إذا تقاربت القيم من اليمين واليسار نحو نفس العدد فالنهاية موجودة." }
            ],
            videoUrl: "https://www.youtube.com/embed/djHhCU1yENQ",
            questions: [{ templateId: 'limits:numerical-table', count: 1, difficulty: 'easy' }] as QuestionItem[],
        },
        {
            id: "idea-2",
            ideaNumber: "1.2",
            ideaName: "Estimating Limits Graphically",
            theoreticalSteps: [
                { stepTitle: "🎯 فكرة الدرس", stepDescription: "كيف توجد قيمة النهاية وقيمة الدالة مباشرة من الرسم البياني." },
                { stepTitle: "⬅️ اقتراب اليسار", stepDescription: "تتبع المنحنى قادماً من اليسار نحو العدد على محور x وانظر لقيمة y." },
                { stepTitle: "➡️ اقتراب اليمين", stepDescription: "تتبع المنحنى قادماً من اليمين نحو العدد على محور x وانظر لقيمة y." },
                { stepTitle: "❌ متى تكون النهاية غير موجودة", stepDescription: "إذا كانت قيمة الاقتراب من اليمين لا تساوي قيمة الاقتراب من اليسار." },
                { stepTitle: "🔵 الفرق بين النهاية وقيمة الدالة", stepDescription: "النهاية تهتم باتجاه الأطراف، وقيمة الدالة تعتمد على النقطة المغلقة الممتلئة." }
            ],
            videoUrl: "https://www.youtube.com/embed/J9y13Rn9R5k",
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
            ] as QuestionItem[],
        },
        {
            id: "idea-3",
            ideaNumber: "1.3",
            ideaName: "Infinite Limits",
            theoreticalSteps: [
                { stepTitle: "مفهوم النهايات اللانهائية", stepDescription: "تحدث عندما يقترب الناتج من عدد ثابت لا يساوي الصفر بينما يقترب المقام من الصفر." },
                { stepTitle: "خطوات الحل السريع", stepDescription: "التعويض المباشر، ثم اختبار إشارة العامل الصفري بتعويض قيمة قريبة جداً." }
            ],
            videoUrl: "https://www.youtube.com/embed/T2_YaOw-g4c",
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
            ] as QuestionItem[],
        },
        {
            id: "idea-4",
            ideaNumber: "1.4",
            ideaName: "Finding Vertical Asymptotes Using Limits",
            theoreticalSteps: [
                { stepTitle: "خطوط التقارب الرأسية", stepDescription: "يوجد خط تقارب رأسي إذا اقتربت قيمة الدالة من مالانهاية عند الاقتراب من قيمة معينة." },
                { stepTitle: "خطوات الحل السريع", stepDescription: "نساوي المقام بالصفر ونحسب النهاية من اليمين واليسار." }
            ],
            videoUrl: "https://www.youtube.com/embed/o7rjD4v5oN8",
            // ✅ تم تحويله إلى قالب ديناميكي
            questions: [
                {
                    templateId: 'limits:vertical-asymptote',
                    count: 1,
                    difficulty: 'easy'
                }
            ] as QuestionItem[],
        }
    ]
};
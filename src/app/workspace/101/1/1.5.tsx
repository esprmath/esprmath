import { ChapterData } from '@/types/math';

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
                {
                    stepTitle: "🎯 فكرة الدرس",
                    stepDescription: "في هذا الجزء ستتعلم مفهوم النهاية للدالة، وكيف نقدر قيمتها عندما تقترب المتغيرات من نقطة معينة. شاهد الفيديو لفهم كيف نستخدم الجداول والاقتراب العددي لتوقع الناتج."
                },
                {
                    stepTitle: "📌 المفهوم الأساسي",
                    stepDescription: "النهاية لا تهتم بما يفعله الاقتراب أو الدالة عند النقطة بالضبط، بل تهتم بما يحدث لقيم الدالة عندما تقترب من تلك النقطة من الجهتين."
                },
                {
                    stepTitle: "📊 التقدير باستخدام الجداول",
                    stepDescription: "سنتعلم كيف نُعوض بقيم قريبة جداً من النقطة المستهدفة من اليمين واليسار، لنلاحظ القيمة التي تقترب إليها الدالة ونخمن الناتج النهائي."
                },
                {
                    stepTitle: "↔️ الاقتراب من اليمين واليسار",
                    stepDescription: "ستتعلم كيف نقرأ السلوك من جهة اليمين ومن جهة اليسار، وكيف نقارن بين اتجاهي الاقتراب."
                },
                {
                    stepTitle: "✅ متى تكون النهاية موجودة أو غير موجودة",
                    stepDescription: "إذا تقاربت القيم من اليمين واليسار نحو نفس العدد فالعلاقة موجودة، وإذا اختلفت الاتجاهات أو ذهبت القيم بلا حدود فالنهاية غير موجودة."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/djHhCU1yENQ",
        },
        {
            id: "idea-2",
            ideaNumber: "1.2",
            ideaName: "Estimating Limits Graphically",
            theoreticalSteps: [
                {
                    stepTitle: "🎯 فكرة الدرس",
                    stepDescription: "في هذا الجزء ستتعلم كيف توجد قيمة النهاية وقيمة الدالة مباشرة من الرسم البياني بكل سهولة."
                },
                {
                    stepTitle: "⬅️ اقتراب اليسار",
                    stepDescription: "لمعرفة النهاية عندما تقترب x من عدد من جهة اليسار، تتبع منحنى الدالة وأنت قادم من اليسار نحو ذلك العدد على محور x وانظر إلى قيمة y."
                },
                {
                    stepTitle: "➡️ اقتراب اليمين",
                    stepDescription: "لمعرفة النهاية من جهة اليمين، تتبع منحنى الدالة وأنت قادم من اليمين نحو العدد على محور x وانظر إلى قيمة y المستهدفة."
                },
                {
                    stepTitle: "❌ متى تكون النهاية غير موجودة",
                    stepDescription: "تكون النهاية العامة غير موجودة عند نقطة معينة إذا كانت قيمة الاقتراب من اليمين لا تساوي قيمة الاقتراب من اليسار."
                },
                {
                    stepTitle: "🔵 الفرق بين النهاية وقيمة الدالة",
                    stepDescription: "النهاية تهتم بأين تتجه الأطراف عند الاقتراب، بينما قيمة الدالة تعتمد حصرياً على مكان النقطة المغلقة الممتلئة تماماً."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/J9y13Rn9R5k",
            practiceQuestion: {
                questionText: "Use the given graph of f to state the value of each quantity, if it exists.",
                graphImage: "/q04-graph.png",
                mathExpression: "Q-4)",
                options: [],
                correctAnswer: "",
                questionExplanation: "تحليل شامل للرسم البياني لإيجاد النهايات وقيم الدوال عند النقاط المستهدفة بدقة.",
                subQuestions: [
                    {
                        questionText: "أ) إيجاد النهاية الكلية عندما تقترب x من القيمة 1.",
                        mathExpression: "\\lim_{x \\to 1} f(x)",
                        options: ["A) 1", "B) 2", "C) DNE", "D) 3"],
                        correctAnswer: "C) DNE",
                        questionExplanation: "النهاية من اليسار تساوي 2 ومن اليمين تساوي 1، وبما أن القيمتين غير متساويتين فالنهاية غير موجودة."
                    },
                    {
                        questionText: "ب) إيجاد النهاية من جهة اليسار عندما تقترب x من القيمة 1.",
                        mathExpression: "\\lim_{x \\to 1^-} f(x)",
                        options: ["A) 1", "B) 2", "C) 3", "D) DNE"],
                        correctAnswer: "B) 2",
                        questionExplanation: "عند تتبع المنحنى قادماً من اليسار نحو القيمة 1 على محور x، تقترب قيمة y من العدد 2."
                    },
                    {
                        questionText: "ج) إيجاد النهاية من جهة اليمين عندما تقترب x من القيمة 1.",
                        mathExpression: "\\lim_{x \\to 1^+} f(x)",
                        options: ["A) 1", "B) 2", "C) 3", "D) DNE"],
                        correctAnswer: "A) 1",
                        questionExplanation: "عند تتبع المنحنى قادماً من اليمين نحو القيمة 1 على محور x، تقترب قيمة y من العدد 1."
                    },
                    {
                        questionText: "د) إيجاد قيمة الدالة الفعليّة عند x = 1.",
                        mathExpression: "f(1)",
                        options: ["A) 1", "B) 2", "C) 3", "D) Undefined"],
                        correctAnswer: "A) 1",
                        questionExplanation: "قيمة الدالة الفعلية تحددها حصرياً النقطة المغلقة الممتلئة عند x = 1 والتي تقع عند y = 1."
                    },
                    {
                        questionText: "هـ) إيجاد النهاية الكلية عندما تقترب x من القيمة 4.",
                        mathExpression: "\\lim_{x \\to 4} f(x)",
                        options: ["A) 1", "B) 3", "C) DNE", "D) 2"],
                        correctAnswer: "C) DNE",
                        questionExplanation: "النهاية من اليسار تساوي 1 ومن اليمين تساوي 3، وبما أن الطرفين غير متطابقين فالنهاية غير موجودة."
                    },
                    {
                        questionText: "و) إيجاد قيمة الدالة الفعليّة عند x = 4.",
                        mathExpression: "f(4)",
                        options: ["A) 1", "B) 2", "C) 3", "D) Undefined"],
                        correctAnswer: "C) 3",
                        questionExplanation: "النقطة المغلقة الفعلية عند x = 4 تقع تماماً عند الإحداثي y = 3."
                    }
                ]
            }
        },
        {
            id: "idea-3",
            ideaNumber: "1.3",
            ideaName: "Infinite Limits",
            theoreticalSteps: [
                {
                    stepTitle: "مفهوم النهايات اللانهائية",
                    stepDescription: "تحدث النهاية اللانهائية عندما يقترب الناتج من عدد ثابت لا يساوي الصفر بينما يقترب المقام من الصفر، مما يدل على وجود خط محاذي رأسي."
                },
                {
                    stepTitle: "خطوات الحل السريع",
                    stepDescription: "التعويض المباشر لمعرفة البسط والمقام، ثم اختبار إشارة العامل الصفري بتعويض قيمة قريبة جداً لمعرفة هل النتيجة موجب أو سالب مالانهاية."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/T2_YaOw-g4c",
            practiceQuestion: {
                questionText: "أوجد قيمة النهاية التالية:",
                mathExpression: "\\lim_{x \\to 3^-} \\frac{x + 2}{x(3 - x)}",
                options: [
                    "A) -\\infty",
                    "B) \\infty",
                    "C) 0",
                    "D) 1"
                ],
                correctAnswer: "B) \\infty",
                questionExplanation: "بالتعويض المباشر نحصل على عدد موجب في البسط وصفر في المقام. وبما أن الاقتراب من اليسار، نعوض بقيمة قريبة مثل 2.9 في العامل لنحصل على قيمة موجبة وصغيرة، وبقسمة الإشارات ينتج موجب مالانهاية."
            }
        },
        {
            id: "idea-4",
            ideaNumber: "1.4",
            ideaName: "Finding Vertical Asymptotes Using Limits",
            theoreticalSteps: [
                {
                    stepTitle: "خطوط التقارب الرأسية",
                    stepDescription: "يكون للدالة خط تقارب رأسي عند قيمة معينة إذا اقتربت قيمة الدالة من مالانهاية موجبة أو سالبة عند الاقتراب من تلك القيمة."
                },
                {
                    stepTitle: "خطوات الحل السريع",
                    stepDescription: "نساوي المقام بالصفر ونحسب النهاية من اليمين واليسار، فإذا كانت النتيجة مالانهاية فيوجد خط تقارب رأسي."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/o7rjD4v5oN8",
            practiceQuestion: {
                questionText: "أوجد معادلتي خطي التقارب الرأسيين للدالة التالية:",
                mathExpression: "y = \\frac{1}{x^2 - 4}",
                options: [
                    "A) x = 2 و x = -2",
                    "B) x = 4 و x = -4",
                    "C) x = 0 و x = 2",
                    "D) لا يوجد خطوط تقارب"
                ],
                correctAnswer: "A) x = 2 و x = -2",
                questionExplanation: "نساوي المقام بالصفر لتحليل القيم التي تجعل المقام صفراً، وبعد التحليل تنتج القيم x = 2 و x = -2 والتي تعطي مالانهاية عند حساب النهاية."
            }
        }
    ]
};
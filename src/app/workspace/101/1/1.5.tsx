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
                    stepDescription: "في هذا الجزء ستتعلم مفهوم النهاية (Limit) للدالة، وكيف نقدر قيمتها عندما تقترب المتغيرات من نقطة معينة (مثل اقتراب t من الصفر أو x من 3).\n\nشاهد الفيديو لفهم كيف نستخدم الجداول والاقتراب العددي لتوقع الناتج."
                },
                {
                    stepTitle: "📌 المفهوم الأساسي للـ Limit",
                    stepDescription: "النهاية لا تهتم بما يفعله الاقتراب أو الدالة عند النقطة بالضبط (فقد تكون غير معرفة مثل قسمة صفر على صفر)، بل تهتم بما يحدث لقيم الدالة عندما تقترب من تلك النقطة من الجهتين."
                },
                {
                    stepTitle: "📊 التقدير باستخدام الجداول (Numerical Estimation)",
                    stepDescription: "سنتعلم كيف نُعوض بقيم قريبة جداً من النقطة المستهدفة (بأعشار وجزء من ألف من اليمين واليسار)، لنلاحظ القيمة التي تقترب إليها الدالة ونخمن الناتج النهائي (مثل تخمين الناتج 1/6 في المثال الأول)."
                },
                {
                    stepTitle: "↔️ الاقتراب من اليمين واليسار (LHL & RHL)",
                    stepDescription: "ستتعلم كيف نقرأ السلوك من جهة اليمين (Right-hand limit) ومن جهة اليسار (Left-hand limit)، وكيف نقارن بين اتجاهين الاقتراب."
                },
                {
                    stepTitle: "✅ متى تكون النهاية موجودة أو غير موجودة (DNE)؟",
                    stepDescription: "إذا تقاربت القيم من اليمين واليسار نحو نفس العدد، فالنهاية موجودة. أما إذا اختلفت اتجاهات الاقتراب أو ذهبت القيم بلا حدود إلى المالانهاية، فالنهاية تكون غير موجودة (DNE)."
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
                    stepDescription: "في هذا الجزء ستتعلم كيف توجد قيمة النهاية (Limit) وقيمة الدالة مباشرة من الرسم البياني (Graph) بكل سهولة."
                },
                {
                    stepTitle: "⬅️ اقتراب اليسار (Left-Hand Limit)",
                    stepDescription: "لمعرفة النهاية عندما تقترب x من عدد من جهة اليسار (x→a⁻)، تتبع منحنى الدالة وأنت قادم من اليسار نحو ذلك العدد على محور x، وانظر إلى قيمة y التي تقترب منها."
                },
                {
                    stepTitle: "➡️ اقتراب اليمين (Right-Hand Limit)",
                    stepDescription: "لمعرفة النهاية من جهة اليمين (x→a⁺)، تتبع منحنى الدالة وأنت قادم من اليمين نحو العدد على محور x، وانظر إلى قيمة y المستهدفة."
                },
                {
                    stepTitle: "❌ متى تكون النهاية غير موجودة (DNE)؟",
                    stepDescription: "تكون النهاية العامة غير موجودة (DNE) عند نقطة معينة إذا كانت قيمة الاقتراب من اليمين لا تساوي قيمة الاقتراب من اليسار."
                },
                {
                    stepTitle: "🔵 الفرق بين النهاية وقيمة الدالة f(a)",
                    stepDescription: "النهاية تهتم بأين تتجه الأطراف عند الاقتراب (حتى لو وُجدت فجوة أو دائرة مفتوحة)، بينما قيمة الدالة f(a) تعتمد حصرياً على مكان النقطة الممتلئة (المغلقة) بالضبط عند تلك الإحداثية."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/J9y13Rn9R5k",
            practiceQuestion: {
                questionText: "Use the given graph of f to state the value of each quantity, if it exists. If it does not exist, explain why.",
                graphImage: "/q04-graph.png",
                mathExpression: "Q-4)",
                options: [],
                correctAnswer: "",
                questionExplanation: "تحليل شامل للرسم البياني الجديد وإيجاد النهايات وقيم الدوال عند النقطتين 1 و 4.",
                subQuestions: [
                    {
                        questionText: "أ) إيجاد النهاية الكلية عندما تقترب x من القيمة 1.",
                        mathExpression: "\\lim_{x \\to 1} f(x)",
                        options: ["A) 1", "B) 2", "C) DNE", "D) 3"],
                        correctAnswer: "C) DNE",
                        questionExplanation: "شرح الحل:<br>من الرسم، النهاية من اليسار عند x=1 تساوي 2، ومن اليمين تساوي 1. وبما أن اليمين لا يساوي اليسار، فالنهاية غير موجودة (DNE)."
                    },
                    {
                        questionText: "ب) إيجاد النهاية من جهة اليسار عندما تقترب x من القيمة 1.",
                        mathExpression: "\\lim_{x \\to 1^-} f(x)",
                        options: ["A) 1", "B) 2", "C) 3", "D) DNE"],
                        correctAnswer: "B) 2",
                        questionExplanation: "شرح الحل:<br>عند الاقتراب من x = 1 جهة اليسار، يتجه المنحنى نحو القيمة y = 2."
                    },
                    {
                        questionText: "ج) إيجاد النهاية من جهة اليمين عندما تقترب x من القيمة 1.",
                        mathExpression: "\\lim_{x \\to 1^+} f(x)",
                        options: ["A) 1", "B) 2", "C) 3", "D) DNE"],
                        correctAnswer: "A) 1",
                        questionExplanation: "شرح الحل:<br>عند الاقتراب من x = 1 جهة اليمين، يتجه المنحنى نحو القيمة y = 1."
                    },
                    {
                        questionText: "د) إيجاد قيمة الدالة الفعليّة عند x = 1.",
                        mathExpression: "f(1)",
                        options: ["A) 1", "B) 2", "C) 3", "D) Undefined"],
                        correctAnswer: "A) 1",
                        questionExplanation: "شرح الحل:<br>قيمة الدالة عند x = 1 تحددها النقطة المغلقة الممتلئة، والتي تقع عند y = 1."
                    },
                    {
                        questionText: "هـ) إيجاد النهاية الكلية عندما تقترب x من القيمة 4.",
                        mathExpression: "\\lim_{x \\to 4} f(x)",
                        options: ["A) 1", "B) 3", "C) DNE", "D) 2"],
                        correctAnswer: "C) DNE",
                        questionExplanation: "شرح الحل:<br>عند الاقتراب من x = 4 من اليسار تساوي 1، ومن اليمين تساوي 3. وبما أن الطرفين غير متساويين، فالنهاية غير موجودة (DNE)."
                    },
                    {
                        questionText: "و) إيجاد قيمة الدالة الفعليّة عند x = 4.",
                        mathExpression: "f(4)",
                        options: ["A) 1", "B) 2", "C) 3", "D) Undefined"],
                        correctAnswer: "C) 3",
                        questionExplanation: "شرح الحل:<br>النقطة المغلقة عند x = 4 تقع تماماً عند الإحداثي y = 3."
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
                    stepDescription: "تحدث النهاية اللانهائية عندما يقترب الناتج من عدد ثابت لا يساوي الصفر بينما يقترب المقام من الصفر. هندسياً، هذا يدل على وجود خط محاذي رأسي عند نقطة الاقتراب، وتحدد الإشارة بالموجب أو السالب بناءً على دراسة إشارة المقام من اليمين أو اليسار."
                },
                {
                    stepTitle: "خطوات الحل السريع",
                    stepDescription: "التعويض المباشر لمعرفة قيمة البسط والمقام. إذا كان البسط ثابتاً لا يساوي الصفر والمقام صفراً، نختبر إشارة العامل الصفري في المقام بتعويض قيمة قريبة جداً، ثم نقسم الإشارات لنعرف هل النتيجة بموجب أو سالب مالانهاية."
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
                questionExplanation: "بالتعويض المباشر بـ x يساوي 3 في البسط نحصل على 5 وهو عدد موجب. وفي المقام نحصل على صفر. بما أن الاقتراب من اليسار، نأخذ قيمة مثل 2.9 فيكون العامل (3 - 2.9) موجباً وصغيراً جداً، وموجب تقسيم موجب يعطي موجب مالانهاية."
            }
        },
        {
            id: "idea-4",
            ideaNumber: "1.4",
            ideaName: "Evaluating Limits by Factoring",
            theoreticalSteps: [
                {
                    stepTitle: "مفهوم إيجاد النهايات بالتحليل",
                    stepDescription: "عند حساب نهاية دالة ويؤدي التعويض المباشر إلى صيغة غير تعيينية مثل صفر على صفر، فإننا نلجأ إلى تبسيط الدالة عبر التحليل واختصار العامل المشترك الصفري أولاً قبل التعويض."
                },
                {
                    stepTitle: "خطوات الحل السريع",
                    stepDescription: "1. جرب التعويض المباشر بالرقم. 2. إذا ظهرت النتيجة صفر على صفر، قم بتحليل البسط أو المقام. 3. اختصر العامل المشترك ثم أعد التعويض المباشر بالناتج المبسط."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/o7rjD4v5oN8",
            practiceQuestion: {
                questionText: "أوجد قيمة النهاية التالية:",
                mathExpression: "\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}",
                options: [
                    "A) 0",
                    "B) 2",
                    "C) 4",
                    "D) غير موجودة"
                ],
                correctAnswer: "C) 4",
                questionExplanation: "بالتعويض المباشر نحصل على صفر على صفر. نقوم بتحليل البسط كفرق بين مربعين لنحصل على (x - 2)(x + 2)، ثم نختصر (x - 2) من البسط والمقام، ونعوض بـ x يساوي 2 فيصبح الناتج 2 + 2 ويساوي 4."
            }
        }
    ]
};
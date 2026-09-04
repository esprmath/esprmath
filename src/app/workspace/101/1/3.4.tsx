import { ChapterData } from '@/types/math';




export const chapter3_4Data: ChapterData = {
    moduleNumber: "1",
    chapterNumber: "3.4",
    chapterTitle: "النهايات عند اللانهاية وخطوط التقارب الأفقية",
    ideas: [
        {
            id: "idea-1",
            ideaNumber: "5.1",
            ideaName: "Fundamental Concepts of Limits at Infinity for Reciprocal and Trigonometric Functions",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: النهايات للدوال المقلوبة عند ما لا نهاية",
                    stepDescription: "عندما تقترب x من ما لا نهاية (\\infty أو -\\infty)، فإن أي عدد ثابث مقسوماً على x (مثل 1/x أو 1/x^n) يؤول ناتجه إلى الصفر (0)، لأن المقام يكبر بلا حدود."
                },
                {
                    stepTitle: "Step 2: نهايات الدوال المثلثية عند ما لا نهاية",
                    stepDescription: "الدوال المثلثية مثل \\cos x و \\sin x تتذبذب باستمرار بين -1 و 1 دون أن تستقر على قيمة محددة كلما تقتربت x من \\infty، ولذلك فإن نهايتها تكون غير موجودة (DNE)."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/o8Kyshw5qfE",
            practiceQuestion: {
                questionText: "Find the limit or show that it does not exist:",
                mathExpression: "\\lim_{x \\to \\infty} \\left(5 - \\frac{3}{x^2}\\right)",
                options: [
                    "A) 0",
                    "B) 5",
                    "C) \\infty",
                    "D) DNE"
                ],
                correctAnswer: "B) 5",
                questionExplanation: "بتوزيع النهاية، حد الثابت 5 يبقى كما هو، بينما الحد (3 / x^2) عندما تقترب x من ما لا نهاية يؤول إلى الصفر (0). إذن الناتج يصبح: 5 - 0 = 5."
            }
        },
        {
            id: "idea-2",
            ideaNumber: "5.2",
            ideaName: "Limits of Rational and Radical Functions at Infinity and Identifying Horizontal Asymptotes",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: القسمة على أعلى قوة في المقام (Highest Power in Denominator)",
                    stepDescription: "لحساب النهاية عند \\infty للدوال الكسرية والجذرية، نقسم البسط والمقام على أعلى قوة لـ x موجودة في المقام (مثل القسمة على x^2 أو x) لتسهيل تبسيط الحدود إلى 0."
                },
                {
                    stepTitle: "Step 2: إيجاد الخطوط المحاذية الأفقية (Horizontal Asymptotes - HA)",
                    stepDescription: "الخط المحاذي الأفقي هو y = L حيث L هي قيمة النهاية عندما x \\to \\infty أو x \\to -\\infty. ملاحظة مهمة: عند دخول x داخل الجذر تكون \\sqrt{x^2} = x عندما x > 0، بينما تُعامل بحذر وتغير الإشارة إلى السالب عندما x \\to -\\infty."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/LvZsZUEhjkA",
            practiceQuestion: {
                questionText: "Find the horizontal asymptote(s) of the function f(x) as x approaches infinity (x → ∞):",
                mathExpression: "f(x) = \\frac{\\sqrt{5x^2 + 1}}{2x - 3}",
                options: [
                    "A) y = \\frac{\\sqrt{5}}{2}",
                    "B) y = \\frac{5}{2}",
                    "C) y = 0",
                    "D) No horizontal asymptote"
                ],
                correctAnswer: "A) y = \\frac{\\sqrt{5}}{2}",
                questionExplanation: "نقسم البسط والمقام على x (والتي تعادل √(x^2) داخل الجذر لأن x → ∞): البسط يصبح √(5 + 1/x^2) والمقام يصبح 2 - 3/x. عند x → ∞ تؤول الكسور إلى 0، فيتبقى √(5 + 0) / (2 - 0) = √5 / 2. إذن الخط المحاذي الأفقي هو y = √5 / 2."
            }
        },
        {
            id: "idea-3",
            ideaNumber: "5.3",
            ideaName: "The Conjugate Technique at Infinity for Infinity - Infinity Forms",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: التعرف على حالة عدم التعيين (Infinity - Infinity)",
                    stepDescription: "عند حساب النهاية لدالة تحتوي على طرح جذر وكمية جبرية عندما x → \\infty، قد تنتج صيغة غير معينة من نوع (\\infty - \\infty) والتي لا يمكن حلها مباشراً."
                },
                {
                    stepTitle: "Step 2: استخدام المرافق (The Conjugate Method)",
                    stepDescription: "نضرب ونقسم في المرافق (بنعكس الإشارة الوسطى بين الجذر والحد الآخر) للتخلص من الجذر في البسط، ثم نبسط المقدار ونقسم على أعلى قوة لـ x في المقام لنصل إلى النهاية النهائية أو الخط المحاذي الأفقي."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/ij79sNXpL_8",
            practiceQuestion: {
                questionText: "Compute the limit using the conjugate technique:",
                mathExpression: "\\lim_{x \\to \\infty} \\left(\\sqrt{x^2 + 4x} - x\\right)",
                options: [
                    "A) 0",
                    "B) 2",
                    "C) 4",
                    "D) \\infty"
                ],
                correctAnswer: "B) 2",
                questionExplanation: "نضرب ونقسم في المرافق (√(...) + x): في البسط يصبح لدينا (x^2 + 4x) - x^2 = 4x، وفي المقام (√(x^2 + 4x) + x). بقسمة البسط والمقام على x، يصبح البسط 4 والمقام √(1 + 4/x) + 1، وعند x → ∞ تصبح النتيجة 4 / (1 + 1) = 4 / 2 = 2."
            }
        },
        {
            id: "idea-4",
            ideaNumber: "5.4",
            ideaName: "Infinite Limits at Infinity",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: مفهوم النهايات اللانهائية عند ما لا نهاية",
                    stepDescription: "عند حساب النهاية لدالة كسرية عندما x → \\infty أو x → -\\infty، إذا كانت درجة البسط أكبر من درجة المقام، فإن ناتج النهاية لا يتقارب إلى عدد ثابت بل يؤول إلى ما لا نهاية (\\infty أو -\\infty) اعتماداً على إشارات المعاملات والتعويض."
                },
                {
                    stepTitle: "Step 2: طريقة الحل بالقسمة على أعلى قوة في المقام",
                    stepDescription: "نقسم البسط والمقام على أعلى قوة لـ x في المقام، ثم نعوض بـ \\infty أو -\\infty لنحصل على قيم تؤول للصفر في المقام بينما يستمر البسط بالتزايد أو التناقص اللانهائي لتكون النهاية غير منتهية."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/Ao18r_hisrg",
            practiceQuestion: {
                questionText: "Find the infinite limit at infinity:",
                mathExpression: "\\lim_{x \\to \\infty} \\frac{3x^3 - x}{x^2 + 2}",
                options: [
                    "A) 0",
                    "B) 3",
                    "C) \\infty",
                    "D) -\\infty"
                ],
                correctAnswer: "C) \\infty",
                questionExplanation: "بما أن درجة البسط (3) أكبر من درجة المقام (2)، نقسم كل حد على x^2 (أعلى قوة في المقام). سيبقى لدينا في البسط (3x - 1/x) وفي المقام (1 + 2/x^2). عند التعويض بـ x → \\infty، سيؤول البسط إلى \\infty والمقام إلى 1، ويكون الناتج النهائي \\infty."
            }
        }
    ]
};
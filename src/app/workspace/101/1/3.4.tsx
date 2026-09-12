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
                questionText: "Find the limit:",
                mathExpression: "\\lim_{x \\to \\infty} \\frac{7}{x^4}",
                options: [
                    "A) \\infty",
                    "B) 7",
                    "C) 0",
                    "D) DNE"
                ],
                correctAnswer: "C) 0",
                questionExplanation: "طريقة الحل التفصيلية للسؤال:\n1. عندما تقترب x من ما لا نهاية (\\infty)، فإن المقام x^4 يكبر بلا حدود بينما البسط ثابت (7).\n2. قسمة عدد ثابت على كمية ضخمة جداً تكبر بلا حدود يؤول ناتجه إلى الصفر (0).\n3. إذن الناتج النهائي يساوي 0."
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
                questionText: "Evaluate the following limit:",
                mathExpression: "\\lim_{x \\to \\infty} \\frac{2x^2 - x + 3}{4x^2 + 5x - 1}",
                options: [
                    "A) \\frac{1}{2}",
                    "B) \\frac{2}{5}",
                    "C) \\frac{3}{4}",
                    "D) 0"
                ],
                correctAnswer: "A) \\frac{1}{2}",
                questionExplanation: "طريقة الحل التفصيلية للسؤال:\n1. نحدد أعلى قوة لـ x في المقام وهي x^2.\n2. نقسم جميع حدود البسط والمقام على x^2:\n   - البسط يصبح: \\frac{2x^2}{x^2} - \\frac{x}{x^2} + \\frac{3}{x^2} = 2 - \\frac{1}{x} + \\frac{3}{x^2}\n   - المقام يصبح: \\frac{4x^2}{x^2} + \\frac{5x}{x^2} - \\frac{1}{x^2} = 4 + \\frac{5}{x} - \\frac{1}{x^2}\n3. عند تطبيق النهاية عندما x → ∞، فإن جميع الحدود التي تحتوي على x في المقام تؤول إلى الصفر (0).\n4. يتبقى لدينا في البسط 2 وفي المقام 4، ليكون الناتج النهائي: \\frac{2}{4} = \\frac{1}{2}."
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
                mathExpression: "\\lim_{x \\to \\infty} \\left(\\sqrt{x^2 + 16} - x\\right)",
                options: [
                    "A) 0",
                    "B) 4",
                    "C) 16",
                    "D) \\infty"
                ],
                correctAnswer: "A) 0",
                questionExplanation: "طريقة الحل التفصيلية للسؤال:\n1. التعويض المباشر يعطي صيغة غير معينة (∞ - ∞).\n2. نضرب ونقسم في مرافق المقدار وهو (√(x^2 + 16) + x).\n3. باستخدام متطابقة الفرق بين مربعين، يصبح البسط: (x^2 + 16) - x^2 = 16، بينما يبقى المقام كما هو: (√(x^2 + 16) + x).\n4. عند أخذ النهاية عندما x → ∞، يصبح البسط ثابتاً والمقام يؤول إلى مالانهاية، ليكون الناتج النهائي يساوي 0."
            }
        },
        {
            id: "idea-4",
            ideaNumber: "5.4",
            ideaName: "Infinite Limits at Infinity",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: مفهوم النهايات اللانهائية عند ما لا نهاية",
                    stepDescription: "عند حساب النهاية لدالة كسرية عندما x → \\infty أو -\\infty، إذا كانت درجة البسط أكبر من درجة المقام، فإن ناتج النهاية لا يتقارب إلى عدد ثابت بل يؤول إلى ما لا نهاية (\\infty أو -\\infty) اعتماداً على إشارات المعاملات والتعويض."
                },
                {
                    stepTitle: "Step 2: طريقة الحل بالقسمة على أعلى قوة في المقام",
                    stepDescription: "نقسم البسط والمقام على أعلى قوة لـ x في المقام، ثم نعوض بـ \\infty أو -\\infty لنحصل على قيم تؤول للصفر في المقام بينما يستمر البسط بالتزايد أو التناقص اللانهائي لتكون النهاية غير منتهية."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/Ao18r_hisrg",
            practiceQuestion: {
                questionText: "Find the infinite limit at infinity:",
                mathExpression: "\\lim_{x \\to \\infty} \\frac{2x^2 + x}{1 - x}",
                options: [
                    "A) 0",
                    "B) -2",
                    "C) \\infty",
                    "D) -\\infty"
                ],
                correctAnswer: "D) -\\infty",
                questionExplanation: "طريقة الحل التفصيلية للسؤال:\n1. نلاحظ أن درجة البسط (2) أكبر من درجة المقام (1)، إذن النهاية تؤول إلى ما لانهاية.\n2. نقسم البسط والمقام على أعلى قوة في المقام وهي x:\n   - البسط يصبح: 2x + 1\n   - المقام يصبح: \\frac{1}{x} - 1\n3. عند تعويض x بـ \\infty:\n   - البسط يؤول إلى اتجاه الموجب مالانهاية مع المعامل الموجب.\n   - المقام يؤول إلى -1.\n4. بقسمة الإشارات: الموجب على السالب يعطي سالب مالانهاية (-\\infty)."
            }
        }
    ]
};
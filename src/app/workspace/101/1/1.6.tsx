import { ChapterData } from '@/types/math';

export const chapter1_6Data: ChapterData = {
    moduleNumber: "1",
    chapterNumber: "1.6",
    chapterTitle: "Calculating Limits Using Limit Laws and Algebraic Techniques",
    ideas: [
        {
            id: "idea-1",
            ideaNumber: "2.1",
            ideaName: "Applying Basic Limit Laws and the Direct Substitution Property",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: استخدام قوانين توزيع النهايات",
                    stepDescription: "عند إيجاد نهاية دالة كسرية كثيرة حدود، نوزع النهاية على البسط والمقام أولاً، ثم نطبق قوانين الجمع والطرح والأسس."
                },
                {
                    stepTitle: "Step 2: التعويض المباشر والتبسيط",
                    stepDescription: "نعوض بقيمة x المعطاة في البسط والمقام، ثم نبسط الناتج النهائي باختصار الكسور إن أمكن."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/h4RXkKCZcpc",
            practiceQuestion: {
                questionText: "Evaluate the following limit:",
                mathExpression: "\\lim_{x \\to -1} \\frac{x^3 - 3x^2 + 2}{4 - 2x}",
                options: [
                    "A) -2",
                    "B) \\frac{-1}{3}",
                    "C) 1",
                    "D) \\frac{1}{2}"
                ],
                correctAnswer: "B) \\frac{-1}{3}",
                questionExplanation: "بتوزيع النهاية على البسط والمقام ثم التعويض المباشر بـ x يساوي -1: البسط ((-1)^3 - 3(-1)^2 + 2) يساوي (-1 - 3 + 2) ويساوي -2. المقام (4 - 2(-1)) يساوي (4 + 2) ويساوي 6. إذن الناتج سالب 2 على 6 (-2/6) وبعد الاختصار بقسمة البسط والمقام على 2 يصبح سالب 1 على 3."
            }
        },
        {
            id: "idea-2",
            ideaNumber: "2.2",
            ideaName: "Evaluating Limits of Piecewise Functions",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: تحديد نقطة التشعب",
                    stepDescription: "التركيز على النقطة الفاصلة التي تتغير عندها القاعدة الجبرية للدالة لمعرفة القاعدة المناسبة لكل اتجاه."
                },
                {
                    stepTitle: "Step 2: حساب النهايات الجانبية والمقارنة",
                    stepDescription: "إيجاد النهاية من اليمين (للقيم الأكبر) ومن اليسار (للقيم الأصغر)، وتكون النهاية موجودة فقط إذا تساوت القيمتان."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/27yDQF3NEYo",
            practiceQuestion: {
                questionText: "Determine whether the limit exists for the given piecewise function:",
                mathExpression: "f(x) = \\begin{cases} x^2 - 1, & x > 3 \\\\ 2x + 1, & x < 3 \\end{cases} \\quad \\text{at} \\quad \\lim_{x \\to 3} f(x)",
                options: [
                    "A) 7",
                    "B) 8",
                    "C) 3",
                    "D) Does not exist"
                ],
                correctAnswer: "D) Does not exist",
                questionExplanation: "لحساب النهاية عند نقطة التشعب 3، نوجد النهاية من اليمين باستخدام القاعدة الأولى (x تربيع ناقص 1) بالتعويض بـ 3 فينتج (9 ناقص 1) ويساوي 8. ونوجد النهاية من اليسار باستخدام القاعدة الثانية (2x زائد 1) بالتعويض بـ 3 فينتج (6 زائد 1) ويساوي 7. وبما أن النهاية من اليمين (8) لا تساوي النهاية من اليسار (7)، إذن النهاية غير موجودة (Does not exist)."
            }
        },
        {
            id: "idea-3",
            ideaNumber: "2.3",
            ideaName: "The Conjugate Technique for Indeterminate Forms",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: كشف حالة عدم التعيين وجود الجذور",
                    stepDescription: "عند التعويض المباشر وتنتج كمية غير معينة (0/0) مع وجود جذور تربيعية، نلجأ للضرب في المرافق الجبري."
                },
                {
                    stepTitle: "Step 2: الضرب في المرافق والاختصار",
                    stepDescription: "نضرب البسط والمقام في مرافق الحد الجذري للتخلص من الجذور، ثم نختصر العامل الصفري المشترك ونعوض بقيمة x."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/s-7uz1x90ZY",
            practiceQuestion: {
                questionText: "Evaluate the following limit:",
                mathExpression: "\\lim_{x \\to 2} \\frac{\\sqrt{4x + 1} - 3}{x - 2}",
                options: [
                    "A) \\frac{2}{3}",
                    "B) \\frac{1}{3}",
                    "C) \\frac{3}{2}",
                    "D) 0"
                ],
                correctAnswer: "B) \\frac{1}{3}",
                questionExplanation: "بالتعويض المباشر بـ x يساوي 2 نحصل على صيغة غير معينة (0/0). نضرب البسط والمقام في مرافق البسط وهو (جذر (4x + 1) + 3). يصبح البسط بعد تبسيط فرق المربعين: (4x + 1 - 9) والتي تساوي (4x - 8) أو 4(x - 2). نختصر العامل (x - 2) من البسط والمقام، ثم نعوض بـ x يساوي 2 فيصبح الناتج النهائي: 4 / (جذر (4(2) + 1) + 3) = 4 / (3 + 3) = 4 / 6 وبعد الاختصار يساوي 1/3."
            }
        },
        {
            id: "idea-4",
            ideaNumber: "2.4",
            ideaName: "Indirect Limit Evaluation and Handling Unknown Functions",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: التعامل مع النهايات غير المباشرة والدوال المجهولة",
                    stepDescription: "عند إعطاء نهاية كسر يحتوي على دالة مجهولة ويساوي قيمة ثابتة، نربط البسط بالمقام عبر خصائص النهايات."
                },
                {
                    stepTitle: "Step 2: الضرب في المقام وحل المعادلة",
                    stepDescription: "نضرب طرفي المعادلة في المقام وأخذ النهاية لتصفير الأجزاء المرتبطة به، ثم إيجاد قيمة نهاية الدالة المطلوبة."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/Cjyf0zaevuI",
            practiceQuestion: {
                questionText: "Find the limit of the unknown function based on the given relation:",
                mathExpression: "\\text{If } \\lim_{x \\to 2} \\frac{f(x) - 5}{x - 2} = 6, \\text{ find } \\lim_{x \\to 2} f(x)",
                options: [
                    "A) 1",
                    "B) 5",
                    "C) 6",
                    "D) 11"
                ],
                correctAnswer: "B) 5",
                questionExplanation: "بضرب طرفي المعادلة في المقام (x - 2) وأخذ النهاية عندما x يؤول إلى 2: تصبح نهاية (f(x) - 5) تساوي 6 مضروبة في نهاية (x - 2). وبما أن نهاية (x - 2) تعوض بـ (2 - 2) وتساوي 0، إذن الطرف الأيسر يصبح 6 ضرب 0 ويساوي 0. تصبح المعادلة: نهاية f(x) ناقص 5 يساوي 0، ومنه بإرسال الـ 5 للطرف الآخر تصبح نهاية f(x) عندما x يؤول إلى 2 تساوي 5."
            }
        }
    ]
};
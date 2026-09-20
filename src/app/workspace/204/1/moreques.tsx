import { PracticeQuestion } from '@/types/math';

// امتداد لنموذج الأسئلة لربط كل سؤال بفكرته وشابتره بشكل مباشر مع دعم التنقل
export interface ConnectedPracticeQuestion extends PracticeQuestion {
    meta: {
        moduleNumber: string;
        chapterNumber: string;
        ideaNumber: string;
        ideaName: string;
        ideaAnchorId: string; // معرف للوصول السريع أو العودة للفكرة عند الضغط
    };
}

export const moreQuesData: ConnectedPracticeQuestion[] = [
    // ================= شابتر 1.5 (البيانات السابقة) =================
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.5",
            ideaNumber: "1.2",
            ideaName: "Estimating Limits Graphically",
            ideaAnchorId: "idea-2"
        },
        questionText: "Use the given graph of f to state the value of each quantity, if it exists.",
        graphImage: "/q4-graph.png",
        mathExpression: "Q-1) Analyzing limits from a graph",
        options: [],
        correctAnswer: "",
        questionExplanation: "تحليل شامل للرسم البياني لإيجاد النهايات.",
        subQuestions: [
            {
                questionText: "أ) إيجاد النهاية من جهة اليسار عندما تقترب x من القيمة 2.",
                mathExpression: "\\lim_{x \\to 2^-} f(x)",
                options: ["A) 1", "B) 2", "C) 3", "D) DNE"],
                correctAnswer: "C) 3",
                questionExplanation: "من خلال الرسم، عند الاقتراب من اليسار نحو x = 2، تقترب قيمة y من العدد 3."
            },
            {
                questionText: "ب) إيجاد النهاية من جهة اليمين عندما تقترب x من القيمة 2.",
                mathExpression: "\\lim_{x \\to 2^+} f(x)",
                options: ["A) 1", "B) 2", "C) 3", "D) 4"],
                correctAnswer: "A) 1",
                questionExplanation: "من خلال الرسم، عند الاقتراب من اليمين نحو x = 2، تقترب قيمة y من العدد 1."
            },
            {
                questionText: "ج) إيجاد النهاية الكلية عندما تقترب x من القيمة 2.",
                mathExpression: "\\lim_{x \\to 2} f(x)",
                options: ["A) 1", "B) 3", "C) 4", "D) DNE"],
                correctAnswer: "D) DNE",
                questionExplanation: "النهاية غير موجودة لأن النهاية من اليسار (3) لا تساوي النهاية من اليمين (1)."
            },
            {
                questionText: "د) إيجاد قيمة الدالة الفعليّة عند x = 2.",
                mathExpression: "f(2)",
                options: ["A) 1", "B) 2", "C) 3", "D) Undefined"],
                correctAnswer: "C) 3",
                questionExplanation: "قيمة الدالة الفعلية تحددها النقطة المغلقة عند x = 2 والتي تقع عند y = 3."
            },
            {
                questionText: "هـ) إيجاد النهاية الكلية عندما تقترب x من القيمة 4.",
                mathExpression: "\\lim_{x \\to 4} f(x)",
                options: ["A) 2", "B) 3", "C) 4", "D) DNE"],
                correctAnswer: "C) 4",
                questionExplanation: "عند الاقتراب من 4 من الجهتين، تقترب قيم الدالة من العدد 4."
            },
            {
                questionText: "و) إيجاد قيمة الدالة عند x = 4.",
                mathExpression: "f(4)",
                options: ["A) 2", "B) 4", "C) 0", "D) Undefined"],
                correctAnswer: "D) Undefined",
                questionExplanation: "الدالة غير معرفة عند x = 4 لوجود فجوة بيانية (دائرة مفتوحة)."
            }
        ]
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.5",
            ideaNumber: "1.2",
            ideaName: "Estimating Limits Graphically",
            ideaAnchorId: "idea-2"
        },
        questionText: "Determine the values of x for which the graph has a break or gap:",
        mathExpression: "f(x) = \\begin{cases} x^2 & if \\; x < 1 \\\\ 3 & if \\; x = 1 \\\\ 2 - x & if \\; x > 1 \\end{cases}",
        options: [
            "A) Continuous at x = 1",
            "B) Discontinuous at x = 1 because limit does not exist",
            "C) Discontinuous because f(1) is undefined",
            "D) None of the above"
        ],
        correctAnswer: "B) Discontinuous at x = 1 because limit does not exist",
        questionExplanation: "النهاية من اليسار عندما x تقترب من 1 تساوي (1 تربيع = 1)، والنهاية من اليمين تساوي (2 - 1 = 1)، وبما أن النهاية موجودة وتساوي 1 ولكن قيمة f(1) = 3، فهذا يعني عدم الاتصال عند النقطة 1."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.5",
            ideaNumber: "1.3",
            ideaName: "Infinite Limits",
            ideaAnchorId: "idea-3"
        },
        questionText: "Find the infinite limit:",
        mathExpression: "\\lim_{x \\to 3^-} \\frac{x + 2}{x(3 - x)}",
        options: [
            "A) -\\infty",
            "B) \\infty",
            "C) 0",
            "D) 1"
        ],
        correctAnswer: "B) \\infty",
        questionExplanation: "بالتعويض المباشر نحصل على عدد موجب في البسط وصفر في المقام، وبما أن الاقتراب من اليسار، نعوض بقيمة قريبة جداً مثل 2.9 في عامل المقام لنحصل على قيمة موجبة وصغيرة، وبقسمة الإشارات ينتج موجب مالانهاية."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.5",
            ideaNumber: "1.3",
            ideaName: "Infinite Limits",
            ideaAnchorId: "idea-3"
        },
        // تم تغيير السؤال الرابع (السابق كان لوغاريتم) إلى سؤال أبسط بكثير
        questionText: "Find the one-sided infinite limit:",
        mathExpression: "\\lim_{x \\to 1^+} \\frac{2}{x - 1}",
        options: [
            "A) 0",
            "B) 1",
            "C) \\infty",
            "D) -\\infty"
        ],
        correctAnswer: "C) \\infty",
        questionExplanation: "بالتعويض بـ x تقترب من 1 من اليمين (مثل 1.1)، يصبح المقام موجباً وصغيراً جداً (0.1)، وقسمة عدد موجب على كمية موجبة صغيرة يعطي موجب مالانهاية."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.5",
            ideaNumber: "1.4",
            ideaName: "Finding Vertical Asymptotes Using Limits",
            ideaAnchorId: "idea-4"
        },
        questionText: "Find the vertical asymptote(s) of the function:",
        mathExpression: "y = \\frac{1}{x^2 - 4}",
        options: [
            "A) x = 2 و x = -2",
            "B) x = 4 و x = -4",
            "C) x = 0 و x = 2",
            "D) لا يوجد خطوط تقارب"
        ],
        correctAnswer: "A) x = 2 و x = -2",
        questionExplanation: "نساوي المقام بالصفر لتحليل القيم التي تجعل المقام صفراً، وبعد التحليل بتفريغ الفرق بين مربعين تنتج القيم x = 2 و x = -2 والتي تعطي مالانهاية عند حساب النهاية."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.5",
            ideaNumber: "1.4",
            ideaName: "Finding Vertical Asymptotes Using Limits",
            ideaAnchorId: "idea-4"
        },
        // تم تغيير السؤال السادس (السابق لوغاريتم) إلى سؤال دالة كسرية أبسط وأسهل للفهم
        questionText: "Find the vertical asymptote of the rational function:",
        mathExpression: "f(x) = \\frac{5}{x - 4}",
        options: [
            "A) x = 0",
            "B) x = 4",
            "C) x = -4",
            "D) No vertical asymptote"
        ],
        correctAnswer: "B) x = 4",
        questionExplanation: "الخط المحاذي الرأسي يوجد عند أصفار المقام، وبمساواة (x - 4 = 0) نجد أن الخط المحاذي هو x = 4."
    },

    // ================= شابتر 1.6 (الأسئلة السابقة) =================
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.6",
            ideaNumber: "2.1",
            ideaName: "Applying Basic Limit Laws and the Direct Substitution Property",
            ideaAnchorId: "idea-1"
        },
        questionText: "Evaluate the limit using limit laws:",
        mathExpression: "\\lim_{x \\to 3} (2x^2 - 4x + 1)",
        options: [
            "A) 7",
            "B) 13",
            "C) 19",
            "D) 4"
        ],
        correctAnswer: "A) 7",
        questionExplanation: "بالتعويض المباشر بـ x = 3: النتيجة تصبح 2(3)^2 - 4(3) + 1 = 2(9) - 12 + 1 = 18 - 12 + 1 = 7."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.6",
            ideaNumber: "2.1",
            ideaName: "Applying Basic Limit Laws and the Direct Substitution Property",
            ideaAnchorId: "idea-1"
        },
        questionText: "Find the limit of the rational function:",
        mathExpression: "\\lim_{x \\to 2} \\frac{x^2 + 3x}{x + 1}",
        options: [
            "A) \\frac{10}{3}",
            "B) 2",
            "C) \\frac{7}{3}",
            "D) 5"
        ],
        correctAnswer: "A) \\frac{10}{3}",
        questionExplanation: "بالتعويض المباشر بـ x = 2: البسط يصبح (2)^2 + 3(2) = 4 + 6 = 10. والمقام يصبح 2 + 1 = 3. إذن الناتج النهائي هو 10/3."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.6",
            ideaNumber: "2.2",
            ideaName: "Evaluating Limits of Piecewise Functions",
            ideaAnchorId: "idea-2"
        },
        questionText: "Find the limit of the piecewise function at x = 2:",
        mathExpression: "f(x) = \\begin{cases} 3x - 1, & x \\leq 2 \\\\ x^2 + 1, & x > 2 \\end{cases} \\quad \\text{at} \\quad \\lim_{x \\to 2} f(x)",
        options: [
            "A) 5",
            "B) 4",
            "C) 3",
            "D) Does not exist"
        ],
        correctAnswer: "A) 5",
        questionExplanation: "النهاية من اليسار عندما x يؤول إلى 2 من القيم الأصغر: 3(2) - 1 = 5. والنهاية من اليمين عندما x يؤول إلى 2 من القيم الأكبر: (2)^2 + 1 = 5. بما أن النهاية من اليمين واليسار متساويتان وتساويان 5، إذن النهاية موجودة وتساوي 5."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.6",
            ideaNumber: "2.2",
            ideaName: "Evaluating Limits of Piecewise Functions",
            ideaAnchorId: "idea-2"
        },
        questionText: "Determine the limit of the piecewise function at x = 1:",
        mathExpression: "f(x) = \\begin{cases} 2x + 3, & x < 1 \\\\ 4x, & x \\geq 1 \\end{cases} \\quad \\text{at} \\quad \\lim_{x \\to 1} f(x)",
        options: [
            "A) 4",
            "B) 5",
            "C) 1",
            "D) Does not exist"
        ],
        correctAnswer: "D) Does not exist",
        questionExplanation: "النهاية من اليسار (للقيم الأقل من 1): 2(1) + 3 = 5. النهاية من اليمين (للقيم الأكبر أو تساوي 1): 4(1) = 4. وبما أن النهاية من اليسار (5) لا تساوي النهاية من اليمين (4)، إذن النهاية غير موجودة (Does not exist)."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.6",
            ideaNumber: "2.3",
            ideaName: "The Conjugate Technique for Indeterminate Forms",
            ideaAnchorId: "idea-3"
        },
        questionText: "Evaluate the limit using the conjugate method:",
        mathExpression: "\\lim_{x \\to 0} \\frac{\\sqrt{x + 4} - 2}{x}",
        options: [
            "A) \\frac{1}{2}",
            "B) \\frac{1}{4}",
            "C) 0",
            "D) 4"
        ],
        correctAnswer: "B) \\frac{1}{4}",
        questionExplanation: "بالتعويض المباشر نحصل على (0/0). نضرب البسط والمقام في المرافق (جذر(x + 4) + 2). يصبح البسط: (x + 4 - 4) = x. نختصر x من البسط والمقام فيتبقى 1 / (جذر(x + 4) + 2). بالتعويض بـ x = 0 يصبح الناتج: 1 / (2 + 2) = 1/4."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.6",
            ideaNumber: "2.3",
            ideaName: "The Conjugate Technique for Indeterminate Forms",
            ideaAnchorId: "idea-3"
        },
        questionText: "Evaluate the limit:",
        mathExpression: "\\lim_{x \\to 5} \\frac{x - 5}{\\sqrt{x + 4} - 3}",
        options: [
            "A) 3",
            "B) 6",
            "C) 9",
            "D) \\frac{1}{6}"
        ],
        correctAnswer: "B) 6",
        questionExplanation: "بالتعويض المباشر نحصل على (0/0). نضرب البسط والمقام في مرافق المقام (جذر(x + 4) + 3). يصبح المقام بعد التبسيط: (x + 4 - 9) = x - 5. نختصر (x - 5) من البسط والمقام، فيتبقى (جذر(x + 4) + 3). بالتعويض بـ x = 5 يصبح الناتج: جذر(9) + 3 = 3 + 3 = 6."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.6",
            ideaNumber: "2.4",
            ideaName: "Indirect Limit Evaluation and Handling Unknown Functions",
            ideaAnchorId: "idea-4"
        },
        questionText: "Find the limit of the unknown function:",
        mathExpression: "\\text{If } \\lim_{x \\to 1} \\frac{f(x) - 3}{x - 1} = 5, \\text{ find } \\lim_{x \\to 1} f(x)",
        options: [
            "A) 2",
            "B) 3",
            "C) 5",
            "D) 8"
        ],
        correctAnswer: "B) 3",
        questionExplanation: "بضرب طرفي المعادلة في المقام (x - 1) وأخذ النهاية عندما x يؤول إلى 1: نهاية (f(x) - 3) تصبح مساوية لـ 5 ضرب 0 وتساوي 0. إذن نهاية f(x) ناقص 3 يساوي صفر، ومنه نهاية f(x) تساوي 3."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.6",
            ideaNumber: "2.4",
            ideaName: "Indirect Limit Evaluation and Handling Unknown Functions",
            ideaAnchorId: "idea-4"
        },
        questionText: "Find the limit given the relation:",
        mathExpression: "\\text{If } \\lim_{x \\to 0} \\frac{f(x)}{x} = 4, \\text{ find } \\lim_{x \\to 0} (f(x) + 2x)",
        options: [
            "A) 0",
            "B) 4",
            "C) 2",
            "D) 6"
        ],
        correctAnswer: "A) 0",
        questionExplanation: "بضرب الطرفين في x وأخذ النهاية عندما x يؤول إلى 0: تصبح نهاية f(x) مساوية لـ 4 ضرب 0 وتساوي 0. المطلوب هو نهاية (f(x) + 2x) والتي تساوي: 0 + 2(0) = 0."
    },

    // ================= شابتر 2.1 (الشابتر الثالث) =================
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "2.1",
            ideaNumber: "3.1",
            ideaName: "Slope and Equation of the Tangent Line Using the Limit Definition",
            ideaAnchorId: "idea-1"
        },
        questionText: "Find the slope of the tangent line to the curve y = x^2 at the point (1, 1) using limits:",
        mathExpression: "y = x^2, \\quad \\text{at } (1, 1)",
        options: [
            "A) m = 1",
            "B) m = 2",
            "C) m = 0",
            "D) m = -2"
        ],
        correctAnswer: "B) m = 2",
        questionExplanation: "نحسب الميل بتطبيق تعريف النهاية: m = lim (x→1) [(x^2 - 1) / (x - 1)]. بتحليل البسط كفرق بين مربعين (x - 1)(x + 1) واختصار (x - 1)، يتبقى lim (x→1) (x + 1) = 1 + 1 = 2."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "2.1",
            ideaNumber: "3.1",
            ideaName: "Slope and Equation of the Tangent Line Using the Limit Definition",
            ideaAnchorId: "idea-1"
        },
        questionText: "Find an equation of the tangent line to the curve y = x^2 - 3x at the point (2, -2):",
        mathExpression: "y = x^2 - 3x, \\quad \\text{at } (2, -2)",
        options: [
            "A) y = x - 4",
            "B) y = 2x - 6",
            "C) y = -x",
            "D) y = -x + 3"
        ],
        correctAnswer: "A) y = x - 4",
        questionExplanation: "1. نحسب الميل m باستخدام النهاية عندما x يؤول إلى 2 للدالة [(x^2 - 3x) - (-2)] / (x - 2) والتي تعود بعد التحليل lim (x→2)(x - 1) = 1.\n2. بتطبيق صيغة الميل والنقطة (y - (-2)) = 1(x - 2) نجد أن المعادلة هي y + 2 = x - 2، أي y = x - 4."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "2.1",
            ideaNumber: "3.2",
            ideaName: "Physical Applications (Instantaneous Velocity and Rates of Change)",
            ideaAnchorId: "idea-2"
        },
        questionText: "If a ball is thrown straight upward with an initial velocity of 24.5 m/s, its height after t seconds is given by s(t) = 24.5t - 4.9t^2. Find the instantaneous velocity of the ball at t = 2 seconds.",
        mathExpression: "s(t) = 24.5t - 4.9t^2, \\quad t = 2",
        options: [
            "A) 4.9 m/s",
            "B) 9.8 m/s",
            "C) 14.7 m/s",
            "D) 19.6 m/s"
        ],
        correctAnswer: "A) 4.9 m/s",
        questionExplanation: "السرعة اللحظية هي نهاية معدل التغير عندما تقترب الفترة الزمنية من الصفر: v(t) = s'(t) = 24.5 - 9.8t. بالتعويض بـ t = 2: النتيجة تصبح 24.5 - 9.8(2) = 4.9 m/s."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "2.1",
            ideaNumber: "3.2",
            ideaName: "Physical Applications (Instantaneous Velocity and Rates of Change)",
            ideaAnchorId: "idea-2"
        },
        questionText: "Suppose an object moves along a line so that its position after t seconds is s(t) = 3t^2 + 2t. What is the velocity of the object at t = 3 seconds?",
        mathExpression: "s(t) = 3t^2 + 2t, \\quad t = 3",
        options: [
            "A) 16 m/s",
            "B) 20 m/s",
            "C) 33 m/s",
            "D) 35 m/s"
        ],
        correctAnswer: "B) 20 m/s",
        questionExplanation: "نحسب السرعة اللحظية باشتقاق دالة الموقع بالنسبة للزمن t: v(t) = s'(t) = 6t + 2. بالتعويض بالزمن t = 3: النتيجة تصبح v(3) = 6(3) + 2 = 20 m/s."
    },

    // ================= شابتر 1.8 (الشابتر الرابع - الاتصال) =================
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.8",
            ideaNumber: "4.1",
            ideaName: "Conditions of Continuity at a Point (Radical Functions Example)",
            ideaAnchorId: "idea-1"
        },
        questionText: "Check the continuity of the function at x = 3:",
        mathExpression: "f(x) = \\sqrt{x + 1}",
        options: [
            "A) Continuous at x = 3",
            "B) Discontinuous at x = 3",
            "C) Undefined at x = 3",
            "D) Limit does not exist"
        ],
        correctAnswer: "A) Continuous at x = 3",
        questionExplanation: "قيمة الدالة f(3) = √(3 + 1) = 2، والنهاية عندما x يؤول إلى 3 تساوي 2 أيضاً، وبما أن القيمة معرفة وتساوي النهاية فالدالة متصلة."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.8",
            ideaNumber: "4.1",
            ideaName: "Conditions of Continuity at a Point (Radical Functions Example)",
            ideaAnchorId: "idea-1"
        },
        questionText: "Determine if the function is continuous at x = 0:",
        mathExpression: "g(x) = \\sqrt{x^2 + 9} - 1",
        options: [
            "A) Continuous, g(0) = 2",
            "B) Continuous, g(0) = 3",
            "C) Discontinuous",
            "D) Undefined"
        ],
        correctAnswer: "A) Continuous, g(0) = 2",
        questionExplanation: "بالتعويض المباشر: g(0) = √(0 + 9) - 1 = 3 - 1 = 2، والنهاية تطابق هذه القيمة تماماً."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.8",
            ideaNumber: "4.2",
            ideaName: "Classifying Types of Discontinuity",
            ideaAnchorId: "idea-2"
        },
        questionText: "Classify the discontinuity of the function at x = 1:",
        mathExpression: "f(x) = \\frac{x^2 - 1}{x - 1}",
        options: [
            "A) Removable discontinuity",
            "B) Jump discontinuity",
            "C) Infinite discontinuity",
            "D) Continuous"
        ],
        correctAnswer: "A) Removable discontinuity",
        questionExplanation: "المقام ينعدم عند x = 1 ولكن بعد تحليل البسط واختصاره (x + 1) نجد أن النهاية موجودة وتساوي 2 بينما الدالة أصله غير معرفة عند 1، وهذا يسمى عدم اتصال قابل للإزالة."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.8",
            ideaNumber: "4.2",
            ideaName: "Classifying Types of Discontinuity",
            ideaAnchorId: "idea-2"
        },
        questionText: "Find the type of discontinuity for the function at x = 0:",
        mathExpression: "f(x) = \\frac{1}{x^2}",
        options: [
            "A) Removable discontinuity",
            "B) Jump discontinuity",
            "C) Infinite discontinuity",
            "D) Continuous"
        ],
        correctAnswer: "C) Infinite discontinuity",
        questionExplanation: "عند الاقتراب من الصفر تتجه قيم الدالة نحو مالانهاية، مما ينتج عنه خط محاذي رأسي وعدم اتصال لانهائي."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.8",
            ideaNumber: "4.3",
            ideaName: "Algebraic Properties of Continuous Functions and Intervals of Continuity",
            ideaAnchorId: "idea-3"
        },
        questionText: "On what interval is the polynomial function continuous?",
        mathExpression: "P(x) = 4x^3 - 5x^2 + 7",
        options: [
            "A) (0, \\infty)",
            "B) (-\\infty, \\infty)",
            "C) [0, 5]",
            "D) x \\neq 0"
        ],
        correctAnswer: "B) (-\\infty, \\infty)",
        questionExplanation: "الدوال كثيرات الحدود متصلة دائماً على مجموعة الأعداد الحقيقية بالكامل بدون أي انقطاع."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.8",
            ideaNumber: "4.3",
            ideaName: "Algebraic Properties of Continuous Functions and Intervals of Continuity",
            ideaAnchorId: "idea-3"
        },
        questionText: "Find the values of x for which the rational function is continuous:",
        mathExpression: "R(x) = \\frac{x}{x^2 - 9}",
        options: [
            "A) All real numbers",
            "B) All real numbers except x = 3 and x = -3",
            "C) Only for x > 3",
            "D) x = 0 only"
        ],
        correctAnswer: "B) All real numbers except x = 3 and x = -3",
        questionExplanation: "الدالة الكسرية متصلة على كل مجالها، والمجال يستثني الأصفار التي تجعل المقام مساوياً للصفر (x^2 - 9 = 0) أي عند x = 3 و x = -3."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.8",
            ideaNumber: "4.4",
            ideaName: "Continuity of Composite Radical and Rational Functions",
            ideaAnchorId: "idea-4"
        },
        questionText: "Find the largest interval of continuity for the function:",
        mathExpression: "f(x) = \\sqrt{x - 5}",
        options: [
            "A) (-\\infty, \\infty)",
            "B) [5, \\infty)",
            "C) (5, \\infty)",
            "D) (-\\infty, 5]"
        ],
        correctAnswer: "B) [5, \\infty)",
        questionExplanation: "لكي تكون الدالة الجذرية معرفة ومتصلة، يجب أن يكون ما تحت الجذر أكبر من أو يساوي الصفر: x - 5 \\ge 0 أي x \\ge 5، وتكتب على شكل فترة مغلقة [5, \\infty)."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "1.8",
            ideaNumber: "4.4",
            ideaName: "Continuity of Composite Radical and Rational Functions",
            ideaAnchorId: "idea-4"
        },
        questionText: "Determine where the composite function is continuous:",
        mathExpression: "g(x) = \\frac{\\sqrt{x}}{x - 4}",
        options: [
            "A) [0, 4) \\cup (4, \\infty)",
            "B) (-\\infty, \\infty)",
            "C) (0, 4)",
            "D) [0, \\infty)"
        ],
        correctAnswer: "A) [0, 4) \\cup (4, \\infty)",
        questionExplanation: "الشرط الأول للجذر: x \\ge 0. والشرط الثاني للمقام: x \\neq 4. وبدمج الشرطين نتحصل على الفترة الممتدة من الصفر (مغلقة) إلى 4 (مفتوحة) مضافاً إليها الفترة من 4 إلى ما لانهاية."
    },

    // ================= شابتر 3.4 (الفكرة 5.1 - الثلاث أسئلة) =================
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.1",
            ideaName: "Fundamental Concepts of Limits at Infinity for Reciprocal and Trigonometric Functions",
            ideaAnchorId: "idea-1"
        },
        questionText: "Find the limit:",
        mathExpression: "\\lim_{x \\to \\infty} \\frac{1}{x}",
        options: [
            "A) \\infty",
            "B) 1",
            "C) 0",
            "D) DNE"
        ],
        correctAnswer: "C) 0",
        questionExplanation: "طريقة الحل التفصيلية للسؤال:\n1. عندما تقترب x من ما لا نهاية (\\infty)، فإن المقام x يكبر بلا حدود بينما البسط ثابت (1).\n2. قسمة عدد ثابت على كمية ضخمة جداً تقترب من مالانهاية يساوي صفراً.\n3. إذن الناتج النهائي يساوي 0."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.1",
            ideaName: "Fundamental Concepts of Limits at Infinity for Reciprocal and Trigonometric Functions",
            ideaAnchorId: "idea-1"
        },
        questionText: "Find the limit:",
        mathExpression: "\\lim_{x \\to -\\infty} \\frac{5}{x^3}",
        options: [
            "A) \\infty",
            "B) 5",
            "C) 0",
            "D) -\\infty"
        ],
        correctAnswer: "C) 0",
        questionExplanation: "طريقة الحل:\n1. عندما x تؤول إلى سالب مالانهاية (-∞)، فإن المقام x^3 يظل يؤول إلى مالانهاية بالسالب.\n2. ثابت مقسوماً على كمية تكبر بلا حدود يؤول ناتجه إلى الصفر (0)."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.1",
            ideaName: "Fundamental Concepts of Limits at Infinity for Reciprocal and Trigonometric Functions",
            ideaAnchorId: "idea-1"
        },
        questionText: "Find the limit or show that it does not exist:",
        mathExpression: "\\lim_{x \\to \\infty} \\sin(x)",
        options: [
            "A) 0",
            "B) 1",
            "C) -1",
            "D) DNE"
        ],
        correctAnswer: "D) DNE",
        questionExplanation: "طريقة الحل:\n1. الدالة المثلثية sin(x) تتذبذب باستمرار بين القيمتين -1 و 1 كلما كبرت x ولا تستقر أبداً عند قيمة محددة.\n2. لذلك فإن النهاية غير موجودة (Does Not Exist / DNE)."
    },

    // ================= شابتر 3.4 (الفكرة 5.2 - السؤالين) =================
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.2",
            ideaName: "Limits of Rational and Radical Functions at Infinity and Identifying Horizontal Asymptotes",
            ideaAnchorId: "idea-2"
        },
        questionText: "Evaluate the following limit:",
        mathExpression: "\\lim_{x \\to \\infty} \\frac{4x^2 + 2x - 5}{8x^2 - 3x + 1}",
        options: [
            "A) \\frac{1}{2}",
            "B) \\frac{1}{4}",
            "C) 2",
            "D) 0"
        ],
        correctAnswer: "A) \\frac{1}{2}",
        questionExplanation: "طريقة الحل:\n1. أعلى قوة في المقام هي x^2.\n2. بقسمة حدود البسط والمقام على x^2 وأخذ النهاية عندما x → ∞، تؤول جميع الحدود الكسرية إلى الصفر.\n3. يتبقى معامل أعلى درجة في البسط (4) مقسوماً على معامل أعلى درجة في المقام (8)، ليصبح الناتج 4/8 = 1/2."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.2",
            ideaName: "Limits of Rational and Radical Functions at Infinity and Identifying Horizontal Asymptotes",
            ideaAnchorId: "idea-2"
        },
        questionText: "Find the horizontal asymptote(s) of the function f(x) as x approaches infinity (x → ∞):",
        mathExpression: "f(x) = \\frac{\\sqrt{9x^2 + 4}}{5x - 2}",
        options: [
            "A) y = \\frac{3}{5}",
            "B) y = \\frac{9}{5}",
            "C) y = 0",
            "D) No horizontal asymptote"
        ],
        correctAnswer: "A) y = \\frac{3}{5}",
        questionExplanation: "طريقة الحل:\n1. أعلى قوة لـ x في المقام هي x من الدرجة الأولى.\n2. نقسم البسط والمقام على x، مع إدخال x داخل الجذر التربيعي كـ (x^2):\n   - البسط يصبح: √(9 + 4/x^2)\n   - المقام يصبح: 5 - 2/x\n3. عند تطبيق النهاية عندما x → ∞، تؤول الكسور إلى الصفر، ليتبقى في البسط √9 = 3 وفي المقام 5، فيكون الخط المحاذي الأفقي هو y = 3/5."
    },

    // ================= شابتر 3.4 (الفكرة 5.3 - السؤالين) =================
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.3",
            ideaName: "The Conjugate Technique at Infinity for Infinity - Infinity Forms",
            ideaAnchorId: "idea-3"
        },
        questionText: "Compute the limit using the conjugate technique:",
        mathExpression: "\\lim_{x \\to \\infty} \\left(\\sqrt{x^2 + 25} - x\\right)",
        options: [
            "A) 0",
            "B) 5",
            "C) 25",
            "D) \\infty"
        ],
        correctAnswer: "A) 0",
        questionExplanation: "طريقة الحل:\n1. نضرب ونقسم في المرافق (√(x^2 + 25) + x).\n2. البسط يصبح: (x^2 + 25) - x^2 = 25.\n3. المقام يصبح: √(x^2 + 25) + x والتي تؤول إلى ما لانهاية.\n4. ثابت على ما لانهاية يساوي 0."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.3",
            ideaName: "The Conjugate Technique at Infinity for Infinity - Infinity Forms",
            ideaAnchorId: "idea-3"
        },
        questionText: "Evaluate the limit:",
        mathExpression: "\\lim_{x \\to \\infty} \\left(\\sqrt{x^2 + 9} - x\\right)",
        options: [
            "A) 0",
            "B) 3",
            "C) 9",
            "D) DNE"
        ],
        correctAnswer: "A) 0",
        questionExplanation: "طريقة الحل:\n1. بالضرب في المرافق ينتج في البسط 9 وفي المقام جذر ومقدار يؤول إلى مالانهاية.\n2. الناتج النهائي يساوي 0."
    },

    // ================= شابتر 3.4 (الفكرة 5.4 - السؤالين الأبسط بدلاً من 21 و 22) =================
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.4",
            ideaName: "Infinite Limits at Infinity",
            ideaAnchorId: "idea-4"
        },
        // تم تغيير السؤال 21 المعقد إلى سؤال مباشر وسهل
        questionText: "Find the limit:",
        mathExpression: "\\lim_{x \\to \\infty} \\frac{x^2 + 1}{x - 2}",
        options: [
            "A) 0",
            "B) 1",
            "C) \\infty",
            "D) -\\infty"
        ],
        correctAnswer: "C) \\infty",
        questionExplanation: "طريقة الحل:\n1. درجة البسط (2) أكبر من درجة المقام (1)، لذا فإن النهاية لا تؤول إلى عدد ثابت.\n2. بقسمة البسط والمقام على أعلى قوة في المقام (x)، يؤول الناتج النهائي إلى ما لانهاية موجبة (\\infty)."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.4",
            ideaName: "Infinite Limits at Infinity",
            ideaAnchorId: "idea-4"
        },
        // تم تغيير السؤال 22 المعقد إلى سؤال مباشر وسهل
        questionText: "Find the limit:",
        mathExpression: "\\lim_{x \\to \\infty} \\frac{5x^3 - 2}{x^2 + 1}",
        options: [
            "A) 0",
            "B) 5",
            "C) \\infty",
            "D) -\\infty"
        ],
        correctAnswer: "C) \\infty",
        questionExplanation: "طريقة الحل:\n1. بما أن درجة البسط (3) أكبر من درجة المقام (2)، فإن النهاية تتجه نحو مالانهاية.\n2. بقسمة الحدود على x^2 والتعويض بـ x تقترب من ما لانهاية، ينتج لدينا موجب مالانهاية (\\infty)."
    }
];
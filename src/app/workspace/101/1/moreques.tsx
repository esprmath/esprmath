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
        questionText: "Evaluate the one-sided infinite limit:",
        mathExpression: "\\lim_{x \\to 0^+} \\ln(x)",
        options: [
            "A) 0",
            "B) 1",
            "C) \\infty",
            "D) -\\infty"
        ],
        correctAnswer: "D) -\\infty",
        questionExplanation: "عندما تقترب x من الصفر من جهة اليمين (قيم موجبة قريبة جداً من الصفر مثل 0.001)، فإن قيمة اللوغاريتم الطبيعي تتجه نحو السالب مالانهاية."
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
        questionText: "Determine the vertical asymptote for the logarithmic function:",
        mathExpression: "f(x) = \\ln(x - 3)",
        options: [
            "A) x = 0",
            "B) x = 3",
            "C) x = -3",
            "D) No vertical asymptote"
        ],
        correctAnswer: "B) x = 3",
        questionExplanation: "الخط المحاذي الرأسي للدالة اللوغاريتمية يحدث عندما يقترب ما داخل اللوغاريتم من الصفر، أي عندما x - 3 = 0 ومنها x = 3."
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
    // أسئلة الفكرة الأولى (4.1): Conditions of Continuity at a Point
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

    // أسئلة الفكرة الثانية (4.2): Classifying Types of Discontinuity
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

    // أسئلة الفكرة الثالثة (4.3): Algebraic Properties of Continuous Functions and Intervals of Continuity
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

    // أسئلة الفكرة الرابعة (4.4): Continuity of Composite Radical and Rational Functions
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

    // ================= شابتر 3.4 (آخر شابتر) =================
    // أسئلة الفكرة الأولى (3.4 - فكرة 1: Derivatives of Trigonometric Functions)
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.1",
            ideaName: "Derivatives of Trigonometric Functions",
            ideaAnchorId: "idea-1"
        },
        questionText: "Find the derivative of the function:",
        mathExpression: "f(x) = x^2 \\sin(x)",
        options: [
            "A) 2x \\sin(x) + x^2 \\cos(x)",
            "B) 2x \\cos(x)",
            "C) x^2 \\cos(x) - 2x \\sin(x)",
            "D) 2x \\sin(x) - x^2 \\cos(x)"
        ],
        correctAnswer: "A) 2x \\sin(x) + x^2 \\cos(x)",
        questionExplanation: "نستخدم قاعدة الضرب (Product Rule): المشتقة الأولى في الثانية + الأولى في مشتقة الثانية. مشتقه (x^2) هي 2x ومشتقة (sin x) هي cos x، إذن الناتج: 2x sin(x) + x^2 cos(x)."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.1",
            ideaName: "Derivatives of Trigonometric Functions",
            ideaAnchorId: "idea-1"
        },
        questionText: "Evaluate the derivative of the trigonometric function at x = 0:",
        mathExpression: "y = \\cos(x) - x \\sin(x), \\quad \\text{at } x = 0",
        options: [
            "A) 0",
            "B) 1",
            "C) -1",
            "D) \\pi"
        ],
        correctAnswer: "A) 0",
        questionExplanation: "مشتقة y هي: y' = -\\sin(x) - [1 \\cdot \\sin(x) + x \\cdot \\cos(x)] = -\\sin(x) - \\sin(x) - x \\cos(x) = -2\\sin(x) - x\\cos(x). بالتعويض بـ x = 0 ينتج: -2(0) - (0)(1) = 0."
    },

    // أسئلة الفكرة الثانية (3.4 - فكرة 2: Higher Order Derivatives of Trigonometric Functions)
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.2",
            ideaName: "Higher Order Derivatives of Trigonometric Functions",
            ideaAnchorId: "idea-2"
        },
        questionText: "Find the second derivative of the function:",
        mathExpression: "f(x) = \\sin(x)",
        options: [
            "A) \\cos(x)",
            "B) -\\sin(x)",
            "C) -\\cos(x)",
            "D) \\sin(x)"
        ],
        correctAnswer: "B) -\\sin(x)",
        questionExplanation: "المشتقة الأولى لـ sin(x) هي cos(x)، والمشتقة الثانية (مشتقة cos(x)) هي -sin(x)."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.2",
            ideaName: "Higher Order Derivatives of Trigonometric Functions",
            ideaAnchorId: "idea-2"
        },
        questionText: "Find the fourth derivative (f^{(4)}(x)) of the function:",
        mathExpression: "f(x) = \\cos(x)",
        options: [
            "A) \\sin(x)",
            "B) -\\sin(x)",
            "C) \\cos(x)",
            "D) -\\cos(x)"
        ],
        correctAnswer: "C) \\cos(x)",
        questionExplanation: "المشتقة الأولى: -sin(x). المشتقة الثانية: -cos(x). المشتقة الثالثة: sin(x). المشتقة الرابعة: cos(x) (حيث تتكرر المشتقات الدائرية كل 4 مرات)."
    },

    // أسئلة الفكرة الثالثة (3.4 - فكرة 3: Finding Tangent Lines Involving Trigonometric Functions)
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.3",
            ideaName: "Finding Tangent Lines Involving Trigonometric Functions",
            ideaAnchorId: "idea-3"
        },
        questionText: "Find the equation of the tangent line to the curve y = \\tan(x) at the origin (0, 0):",
        mathExpression: "y = \\tan(x), \\quad \\text{at } (0, 0)",
        options: [
            "A) y = x",
            "B) y = -x",
            "C) y = 0",
            "D) y = 2x"
        ],
        correctAnswer: "A) y = x",
        questionExplanation: "مشتقة y هي sec^2(x). ميل المماس عند x = 0 هو sec^2(0) = (1/cos(0))^2 = 1. بمعادلة الميل والنقطة: y - 0 = 1(x - 0) أي y = x."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.3",
            ideaName: "Finding Tangent Lines Involving Trigonometric Functions",
            ideaAnchorId: "idea-3"
        },
        questionText: "Find the slope of the tangent line to the curve y = 2\\cos(x) at x = \\pi / 3:",
        mathExpression: "y = 2\\cos(x), \\quad \\text{at } x = \\frac{\\pi}{3}",
        options: [
            "A) -\\sqrt{3}",
            "B) \\sqrt{3}",
            "C) -1",
            "D) 1"
        ],
        correctAnswer: "A) -\\sqrt{3}",
        questionExplanation: "المشتقة هي y' = -2\\sin(x). بالتعويض بـ x = \\pi/3 (أي 60 درجة): الناتج يصبح -2\\sin(\\pi/3) = -2(\\sqrt{3}/2) = -\\sqrt{3}."
    },

    // أسئلة الفكرة الرابعة (3.4 - فكرة 4: Evaluating Special Trigonometric Limits)
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.4",
            ideaName: "Evaluating Special Trigonometric Limits",
            ideaAnchorId: "idea-4"
        },
        questionText: "Evaluate the special trigonometric limit:",
        mathExpression: "\\lim_{x \\to 0} \\frac{\\sin(3x)}{x}",
        options: [
            "A) 1",
            "B) 3",
            "C) 0",
            "D) \\frac{1}{3}"
        ],
        correctAnswer: "B) 3",
        questionExplanation: "باستخدام النهاية الشهيرة lim (x→0) [sin(kx)/x] = k، إذن عندما تكون k = 3 يصبح الناتج مباشرةً يساوي 3."
    },
    {
        meta: {
            moduleNumber: "1",
            chapterNumber: "3.4",
            ideaNumber: "5.4",
            ideaName: "Evaluating Special Trigonometric Limits",
            ideaAnchorId: "idea-4"
        },
        questionText: "Evaluate the limit using trigonometric identities and special limits:",
        mathExpression: "\\lim_{x \\to 0} \\frac{\\tan(4x)}{2x}",
        options: [
            "A) 2",
            "B) 4",
            "C) 1",
            "D) \\frac{1}{2}"
        ],
        correctAnswer: "A) 2",
        questionExplanation: "يمكن كتابة المقدار بالشكل: [sin(4x) / (2x * cos(4x))]. باستخدام النهاية الشهيرة لنهاية sin(kx)/x ومعاملاتها: (4 / 2) * (1 / cos(0)) = 2 * 1 = 2."
    }
];
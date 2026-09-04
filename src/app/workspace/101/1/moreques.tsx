import { PracticeQuestion } from '@/types/math';

export const moreQuesData: PracticeQuestion[] = [
    {
        questionText: "قدّر قيمة النهاية الآتية عدديّاً:",
        mathExpression: "\\lim_{t \\to 0} \\frac{\\sqrt{t^2+9}-3}{t^2}",
        options: [
            "A) 0",
            "B) \\frac{1}{3}",
            "C) \\frac{1}{6}",
            "D) غير موجودة"
        ],
        correctAnswer: "C) \\frac{1}{6}",
        questionExplanation: "شرح الحل خطوة بخطوة:\n" +
            "1. التعويض المباشر واكتشاف حالة عدم التعيين: نبدأ بمحاولة التعويض المباشر بالقيمة t = 0، فنحصل على المقدار (3 - 3) / 0 = 0 / 0، وهي كمية غير تعيينية تجبرنا على استخدام التقدير العددي.\n" +
            "2. دراسة سلوك الدالة: نعتمد على مفهوم الاقتراب من العدد 0 عبر اختيار قيم لـ t قريبة جداً منه من اليمين واليسار.\n" +
            "3. التعويض بقيم جدولية مقربة: عند تعويض قيم مثل (±1.0, ±0.5, ±0.1, ±0.05, ±0.01) نلاحظ أن النواتج تتدرج وتتقارب نحو 0.166666.\n" +
            "4. الاستنتاج النهائي: كلما اقتربت t من الصفر تتجه قيم الدالة نحو الكسر الاعتيادي 1/6، إذن قيمة النهاية تساوي 1/6."
    },
    {
        questionText: "إذا كانت المصفوفة A مصفوفة قطرية (Diagonal Matrix)، فإن محددها يساوي:",
        mathExpression: "A = \\begin{pmatrix} 3 & 0 \\\\ 0 & 5 \\end{pmatrix}",
        options: [
            "أ) مجموع عناصر القطر الرئيسي",
            "ب) حاصل ضرب عناصر القطر الرئيسي",
            "ج) صفر دائماً",
            "د) واحد دائماً"
        ],
        correctAnswer: "ب) حاصل ضرب عناصر القطر الرئيسي",
        questionExplanation: "محدد أي مصفوقة قطرية يساوي دائماً حاصل ضرب العناصر الواقعة على القطر الرئيسي (3 × 5 = 15)."
    },
    {
        questionText: "Determine the value(s) of x where the function is discontinuous:",
        mathExpression: "f(x) = \\frac{x^2 - 4}{x - 2}",
        options: [
            "A) x = 2",
            "B) x = -2",
            "C) x = 0",
            "D) Continuous everywhere"
        ],
        correctAnswer: "A) x = 2",
        questionExplanation: "الدالة غير متصلة عندما يكون المقام مساوياً لصفر: x - 2 = 0 إذن x = 2 (تكون القيمة غير معرفة Undefined ويحدث عدم اتصال)."
    },
    {
        questionText: "Suppose f and g are continuous functions such that g(2) = 6 and lim (x→2) [3f(x) + f(x)g(x)] = 36. Find f(2):",
        mathExpression: "g(2) = 6, \\quad \\lim_{x \\to 2} [3f(x) + f(x)g(x)] = 36",
        options: [
            "A) f(2) = 2",
            "B) f(2) = 4",
            "C) f(2) = 6",
            "D) f(2) = 12"
        ],
        correctAnswer: "B) f(2) = 4",
        questionExplanation: "بما أن الدوال متصلة، يمكننا توزيع النهاية والتعويض بالقيم المباشرة: 3f(2) + f(2) \\cdot g(2) = 36، وبما أن g(2) = 6 تصبح المعادلة 3f(2) + 6f(2) = 36، أي 9f(2) = 36، ومنها نقسم على 9 لنحصل على f(2) = 4."
    },
    {
        questionText: "Where is the following function continuous?",
        mathExpression: "F(x) = \\frac{1}{\\sqrt{x^2 + 16} - 5}",
        options: [
            "A) Continuous everywhere on (-\\infty, \\infty)",
            "B) Continuous for all x, except x = -3 and x = 3",
            "C) Continuous only at x = 0",
            "D) Continuous for all x, except x = -5 and x = 5"
        ],
        correctAnswer: "B) Continuous for all x, except x = -3 and x = 3",
        questionExplanation: "نجعل المقام يساوي صفراً: √(x^2 + 16) - 5 = 0 أي √(x^2 + 16) = 5. بتربيع الطرفين: x^2 + 16 = 25، إذن x^2 = 9 ومنها x = \\pm 3. وبما أن ما تحت الجذر (x^2 + 16) موجب دائماً، تكون الدالة متصلة في كل مكان ما عدا x = 3 و x = -3."
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
        questionText: "Use the given graph of f to state the value of each quantity, if it exists. If it does not exist, explain why.",
        graphImage: "/q4-graph.png",
        mathExpression: "Q-4) Analyzing limits and function values from a graph",
        options: [],
        correctAnswer: "",
        questionExplanation: "شرح عام يعتمد على تفاصيل كل جزئية في الأسئلة أدناه.",
        subQuestions: [
            {
                questionText: "الجزء (1 من 6): إيجاد النهاية من جهة اليسار (Left-Hand Limit) من خلال الرسم البياني.",
                mathExpression: "\\lim_{x \\to 2^-} f(x)",
                options: ["A) 1", "B) 2", "C) 3", "D) DNE"],
                correctAnswer: "C) 3",
                questionExplanation: "شرح الحل:<br>من خلال الرسم البياني، عندما تقترب x من القيمة 2 جهة اليسار (LHS)، فإن قيمة المنحنى تتجه نحو الصعود إلى y = 3."
            },
            {
                questionText: "الجزء (2 من 6): إيجاد النهاية من جهة اليمين (Right-Hand Limit) من خلال الرسم البياني.",
                mathExpression: "\\lim_{x \\to 2^+} f(x)",
                options: ["A) 1", "B) 2", "C) 3", "D) 4"],
                correctAnswer: "A) 1",
                questionExplanation: "شرح الحل:<br>من خلال الرسم البياني، عندما تقترب x من القيمة 2 جهة اليمين (RHS)، فإن قيمة المنحنى تقترب من y = 1."
            },
            {
                questionText: "الجزء (3 من 6): إيجاد النهاية الكلية (Two-Sided Limit) عند النقطة x = 2.",
                mathExpression: "\\lim_{x \\to 2} f(x)",
                options: ["A) 1", "B) 3", "C) 4", "D) DNE"],
                correctAnswer: "D) DNE",
                questionExplanation: "شرح الحل:<br>النهاية غير موجودة (DNE) لأن النهاية من اليسار (3) لا تساوي النهاية من اليمين (1)."
            },
            {
                questionText: "الجزء (4 من 6): إيجاد قيمة الدالة الفعليّة عند النقطة المعطاة.",
                mathExpression: "f(2)",
                options: ["A) 1", "B) 2", "C) 3", "D) Undefined"],
                correctAnswer: "C) 3",
                questionExplanation: "شرح الحل:<br>قيمة الدالة عند x = 2 تساوي 3 (وهي ممثلة بالنقطة المغلقة الممتلئة عند هذا الإحداثي)."
            },
            {
                questionText: "الجزء (5 من 6): إيجاد النهاية الكلية عندما تقترب x من القيمة 4.",
                mathExpression: "\\lim_{x \\to 4} f(x)",
                options: ["A) 2", "B) 3", "C) 4", "D) DNE"],
                correctAnswer: "C) 4",
                questionExplanation: "شرح الحل:<br>عندما تقترب x من القيمة 4 من الجهتين (اليمين واليسار)، تتجه قيم الدالة وتقترب من العدد 4."
            },
            {
                questionText: "الجزء (6 من 6): إيجاد قيمة الدالة عند النقطة x = 4.",
                mathExpression: "f(4)",
                options: ["A) 2", "B) 4", "C) 0", "D) Undefined"],
                correctAnswer: "D) Undefined",
                questionExplanation: "شرح الحل:<br>الدالة غير معرفة (Undefined) عند x = 4 لوجود فجوة بيانية (دائرة مفتوحة) على المنحنى عند هذه النقطة."
            }
        ]
    }
];
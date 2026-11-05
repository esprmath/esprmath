// ════════════════════════════════════════════════════════════
// Math 101 · الموديول 1 · الأسئلة الإضافية الثابتة
// صفحة الأسئلة الإضافية والكويز يولّدان سؤالًا من قالب كل فكرة تلقائيًا.
// اكتب هنا فقط أسئلة الأفكار التي ليس لها قالب، مثل أسئلة الرسم البياني.
// ════════════════════════════════════════════════════════════
import type { ExtraQuestion } from '@/types/math';

export const extraQuestions: ExtraQuestion[] = [
    // ─────────── الشابتر 1.5 · الفكرة 1.2 ───────────
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
];

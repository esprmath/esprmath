import { ChapterData } from '@/types/math'; // أو المسار النسبي الصحيح '../types/math'


export const chapter2_1Data: ChapterData = {
    moduleNumber: "1",
    chapterNumber: "2.1",
    chapterTitle: "الاتصال وخواص الدوال المتصلة (Continuity)",
    ideas: [
        {
            id: "idea-1",
            ideaNumber: "3.1",
            ideaName: "Slope and Equation of the Tangent Line Using the Limit Definition",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: قانون إيجاد ميل المماس",
                    stepDescription: "يُحسب ميل المماس للمنحنى عند النقطة a باستخدام قانون النهاية الأساسي: m = lim (x→a) [f(x) - f(a)] / [x - a]"
                },
                {
                    stepTitle: "Step 2: تكوين معادلة الخط المستقيم",
                    stepDescription: "بعد إيجاد قيمة الميل (m) والنقطة المعطاة، نطبق صيغة الميل والنقطة: (y - y1) = m(x - x1) لإيجاد المعادلة بالشكل النهائي."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/uEh_wJw1czY",
            practiceQuestion: {
                questionText: "Find an equation of the tangent line to the curve y = 4/x at the point (2, 2):",
                mathExpression: "y = 4/x, at \\ point  (2, 2)",
                options: [
                    "A) y = -x + 4",
                    "B) y = -1/2 x + 3",
                    "C) y = -2x + 6",
                    "D) y = x"
                ],
                correctAnswer: "B) y = -1/2 x + 3",
                questionExplanation: "نحسب الميل باستخدام النهاية عندما x يؤول إلى 2 للدالة (4/x ناقص 2) على (x ناقص 2). بتوحيد المقامات في البسط يصبح (4 - 2x) على (x(x - 2)). بأخذ عامل مشتركة سالب 2 من البسط يصبح سالب 2 على x، وعند التعويض بـ x يساوي 2 ينتج الميل m يساوي سالب نصف. بتطبيق صيغة الميل والنقطة: (y - 2) تساوي سالب نصف في (x - 2)، وبعد ترتيبها تصبح المعادلة النهائية y تساوي سالب نصف x زائد 3."
            }
        },
        {
            id: "idea-2",
            ideaNumber: "3.2",
            ideaName: "Physical Applications (Instantaneous Velocity and Rates of Change)",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: سرعة الأجسام الساقطة سقوطاً حراً",
                    stepDescription: "لحساب السرعة بعد زمن محدد (t)، نستخدم قانون السرعة الزمنية v = gt (باعتبار السرعة الابتدائية تساوي صفر ومع تسارع الجاذبية g)."
                },
                {
                    stepTitle: "Step 2: السرعة عند الاصطدام بالأرض",
                    stepDescription: "لحساب السرعة اللحظية لحظة الاصطدام بالأرض من ارتفاع كلي (h)، نستخدم قانون السرعة المرتبط بالمسافة v^2 = 2gh ومنها نأخذ الجذر التربيعي للناتج."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/24JkXZRKV5s",
            practiceQuestion: {
                questionText: "Suppose that a ball is dropped from an upper observation deck, 122.5 m above the ground.\n\n(a) What is the velocity of the ball after 3 seconds?\n\n(b) How fast is the ball traveling when it hits the ground?",
                mathExpression: "h = 122.5 m, g = 9.8 m/s^2",
                options: [
                    "A) (a) 19.6 m/s, (b) 49.0 m/s",
                    "B) (a) 29.4 m/s, (b) 49.0 m/s",
                    "C) (a) 29.4 m/s, (b) 98.0 m/s",
                    "D) (a) 49.0 m/s, (b) 29.4 m/s"
                ],
                correctAnswer: "B) (a) 29.4 m/s, (b) 49.0 m/s",
                questionExplanation: "للجزء (a): السرعة بعد 3 ثوانٍ تُحسب كالتالي v = g * t أي (9.8 * 3) وتساوي 29.4 متراً لكل ثانية. وللجزء (b): السرعة عند اصطدام الأرض تُحسب عبر v = جذر(2 * g * h) أي جذر(2 * 9.8 * 122.5) والتي تساوي جذر(2401) وتنتج 49.0 متراً لكل ثانية."
            }
        }
    ]
};
import { ChapterData } from '@/types/math'; // أو المسار النسبي الصحيح '../types/math'


export const chapter2_1Data: ChapterData = {
    moduleNumber: "1",
    chapterNumber: "2.1",
    chapterTitle: "المماس ومعدل التغير والسرعة اللحظية",
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
                questionExplanation: "1. نحسب الميل (m) بتطبيق تعريف النهاية: lim (x→2) [(4/x - 2) / (x - 2)].\n2. بتوحيد مقامات البسط، يصبح الكسر: [(4 - 2x) / x] / (x - 2).\n3. بأخذ عامل مشترك (-2) من البسط لتبسيط الحد مع المقام: lim (x→2) [-2(x - 2)] / [x(x - 2)] = lim (x→2) (-2 / x).\n4. بالتعويض المباشر بـ x = 2، ينتج الميل: m = -2 / 2 = -1/2.\n5. نطبق صيغة الميل والنقطة (y - y1) = m(x - x1): أي (y - 2) = -1/2(x - 2)، وبعد الترتيب تصبح المعادلة النهائية: y = -1/2 x + 3."
            }
        },
        {
            id: "idea-2",
            ideaNumber: "3.2",
            ideaName: "Physical Applications (Instantaneous Velocity and Rates of Change)",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: السرعة اللحظية للأجسام الساقطة",
                    stepDescription: "لحساب السرعة اللحظية بعد زمن محدد (t) لجسم يسقط سقوطاً حراً، نستخدم قانون السرعة الزمنية v(t) = g * t (باعتبار تسارع الجاذبية الأرضية g والإحداثي القياسي)."
                },
                {
                    stepTitle: "Step 2: السرعة لحظة الاصطدام بالأرض",
                    stepDescription: "لحساب السرعة عند الاصطدام بالاعتماد على ارتفاع السقوط الكلي (h)، نستخدم العلاقة المرتبطة بالمسافة والسرعة: v^2 = 2gh ومنها نأخذ الجذر التربيعي للناتج."
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
                questionExplanation: "• للفقرة (a) السرعة بعد 3 ثوانٍ:\nنطبق قانون السرعة الزمنية v = g * t حيث g = 9.8 و t = 3، إذن السرعة = 9.8 × 3 = 29.4 m/s.\n\n• للفقرة (b) السرعة عند اصطدام الأرض:\nنستخدم علاقة السرعة مع الارتفاع v = √(2gh) حيث h = 122.5 و g = 9.8، إذن v = √(2 × 9.8 × 122.5) = √2401 = 49.0 m/s."
            }
        }
    ]
};
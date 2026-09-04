import { ChapterData } from '@/types/math';





export const chapter1_8Data: ChapterData = {
    moduleNumber: "1",
    chapterNumber: "1.8",
    chapterTitle: "المماس ومعدل التغير والسرعة اللحظية",
    ideas: [
        {
            id: "idea-1",
            ideaNumber: "4.1",
            ideaName: "Conditions of Continuity at a Point (Radical Functions Example)",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: تطبيق شروط الاتصال على الدوال الجذرية",
                    stepDescription: "عند فحص اتصال دالة تحتوي على جذور عند نقطة معينة a، نتبع نفس الشروط الثلاثة: إيجاد قيمة الدالة المباشرة f(a)، حساب النهاية عند نفس الاقتراب، ثم التأكد من مطابقة الطرفين مع مراعاة أن تكون النقطة واقعة ضمن مجال تعريف الجذر."
                },
                {
                    stepTitle: "Step 2: خصائص الحسابات والتعويض المباشر",
                    stepDescription: "بفضل خصائص النهايات، يمكن إدخال النهاية داخل الجذر للدوال المتصلة طالما أن ما تحت الجذر موجباً ومعرفاً عند النقطة المعطاة."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/Th-WmtlnoNA",
            practiceQuestion: {
                questionText: "Use the definition of continuity to verify if the function p(v) = 2√(3v^2 + 1) is continuous at the number a = 1:",
                mathExpression: "p(v) = 2√(3v^2 + 1), a = 1",
                options: [
                    "A) p(v) is discontinuous at v = 1",
                    "B) p(v) is continuous because p(1) = lim (v→1) p(v) = 4",
                    "C) p(v) is continuous only at v = 0",
                    "D) The limit does not exist at v = 1"
                ],
                correctAnswer: "B) p(v) is continuous because p(1) = lim (v→1) p(v) = 4",
                questionExplanation: "نطبق الشروط الثلاثة: أولاً نقوم بإيجاد قيمة الدالة p(1) = 2√(3(1)^2 + 1) = 2√(3 + 1) = 2√(4) = 2(2) = 4 وهي معرفة. ثانياً نحسب النهاية lim (v→1) [2√(3v^2 + 1)] والتي تعطي أيضاً 4. ثالثاً بما أن قيمة الدالة تساوي النهاية وتساوي 4، إذن الدالة متصلة عند v = 1."
            }
        },
        {
            id: "idea-2",
            ideaNumber: "4.2",
            ideaName: "Classifying Types of Discontinuity",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: الدوال الكسرية (Rational Functions)",
                    stepDescription: "تكون الدالة غير متصلة عند النقاط التي تجعل المقام يساوي صفراً (Undefined)، وتحدث عندها فجوة أو خط محاسي (Vertical Asymptote)."
                },
                {
                    stepTitle: "Step 2: الدوال متعددة التعريف (Piecewise Functions)",
                    stepDescription: "نتحقق من شروط الاتصال عند النقطة المعطاة a: التأكد من معرفة الصورة f(a)، وجود النهاية بحساب النهاية من اليسار (LHL) ومن اليمين (RHL)، وهل النهاية تساوي الصورة."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/7j5Uodh89Bk",
            practiceQuestion: {
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
            }
        },
        {
            id: "idea-3",
            ideaNumber: "4.3",
            ideaName: "Algebraic Properties of Continuous Functions and Intervals of Continuity",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: خصائص العمليات على الدوال المتصلة (Properties of Continuous Functions)",
                    stepDescription: "إذا كانت الدوال f و g متصلتين عند النقطة a، فإن مجموعها (f+g)، فرقها (f-g)، ضربها في ثابت (cf)، حاصل ضربهما (fg)، وحاصل قسمتهما (f/g بشرط أن g(a) لا تساوي صفراً) تكون جميعها دوال متصلة عند النقطة a."
                },
                {
                    stepTitle: "Step 2: فترات الاتصال للدوال المختلفة (Intervals of Continuity)",
                    stepDescription: "الدوال كثيرات الحدود (Polynomials) متصلة على جميع الأعداد الحقيقية (-\\infty, \\infty). أما الدوال الكسرية (Rational Functions) فتكون متصلة على جميع نقاط مجالها، وتستثنى من ذلك القيم التي تجعل المقام مساوياً لصفر."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/mwkjAHdWlt4",
            practiceQuestion: {
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
            }
        },
        {
            id: "idea-4",
            ideaNumber: "4.4",
            ideaName: "Continuity of Composite Radical and Rational Functions",
            theoreticalSteps: [
                {
                    stepTitle: "Step 1: مجال الشروط للدوال المركبة والذرية (Radical & Rational Composition)",
                    stepDescription: "عند إيجاد فترات اتصال دالة مركبة تحتوي على جذور في المقام (مثل الدوال الجذرية والكسرية)، ندمج شرطين: أولاً أن يكون ما تحت الجذر التربيعي موجباً أو مساوياً لصفر (x^2 + c \\ge 0)، وثانياً ألا يساوي المقام الكلي صفراً."
                },
                {
                    stepTitle: "Step 2: استبعاد أصفار المقام وتحديد الفترة النهائية",
                    stepDescription: "نساوي المقام بـ صفر لحل المعادلة وإيجاد القيم المستثناة (مثل x = \\pm 3)، ثم نكتب فترة الاتصال النهائية بصيغة جميع الأعداد الحقيقية عدا هذه القيم (R \\setminus \\{-3, 3\\})."
                }
            ],
            videoUrl: "https://www.youtube.com/embed/21eTWUm3BlA",
            practiceQuestion: {
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
            }
        }

    ]
};
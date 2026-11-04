import { ChapterData } from '@/types/math';
import type { QuestionItem } from '@/lib/questions/types';

export const chapter1_8Data: ChapterData = {
    moduleNumber: "1",
    chapterNumber: "1.8",
    chapterTitle: "الاتصال (Continuity)",
    ideas: [
        {
            id: "idea-1",
            ideaNumber: "4.1",
            ideaName: "Conditions of Continuity at a Point (Radical Functions Example)",
            theoreticalSteps: [
                { stepTitle: "Step 1: تطبيق شروط الاتصال على الدوال الجذرية", stepDescription: "عند فحص اتصال دالة تحتوي على جذور عند نقطة معينة a، نتبع نفس الشروط الثلاثة: إيجاد قيمة الدالة المباشرة f(a)، حساب النهاية عند نفس الاقتراب، ثم التأكد من مطابقة الطرفين." },
                { stepTitle: "Step 2: خصائص الحسابات والتعويض المباشر", stepDescription: "بفضل خصائص النهايات، يمكن إدخال النهاية داخل الجذر للدوال المتصلة طالما أن ما تحت الجذر موجباً ومعرفاً عند النقطة المعطاة." }
            ],
            videoUrl: "https://www.youtube.com/embed/Th-WmtlnoNA",
            questions: [{ templateId: 'continuity:check-point', count: 1, difficulty: 'easy' }] as QuestionItem[],
        },
        {
            id: "idea-2",
            ideaNumber: "4.2",
            ideaName: "Classifying Types of Discontinuity",
            theoreticalSteps: [
                { stepTitle: "Step 1: الدوال الكسرية (Rational Functions)", stepDescription: "تكون الدالة غير متصلة عند النقاط التي تجعل المقام يساوي صفراً (Undefined)، وتحدث عندها فجوة أو خط محاذي." },
                { stepTitle: "Step 2: الدوال متعددة التعريف (Piecewise Functions)", stepDescription: "نتحقق من شروط الاتصال عند النقطة المعطاة a: التأكد من معرفة الصورة f(a)، وجود النهاية، وهل النهاية تساوي الصورة." }
            ],
            videoUrl: "https://www.youtube.com/embed/7j5Uodh89Bk",
            questions: [{ templateId: 'continuity:rational-discontinuity', count: 1, difficulty: 'medium' }] as QuestionItem[],
        },
        {
            id: "idea-3",
            ideaNumber: "4.3",
            ideaName: "Algebraic Properties of Continuous Functions and Intervals of Continuity",
            theoreticalSteps: [
                { stepTitle: "Step 1: خصائص العمليات على الدوال المتصلة", stepDescription: "إذا كانت الدوال f و g متصلتين عند النقطة a، فإن مجموعها، فرقها، ضربها، وقسمتها (بشرط عدم انعدام المقام) تكون جميعها دوال متصلة عند النقطة a." },
                { stepTitle: "Step 2: فترات الاتصال للدوال المختلفة", stepDescription: "الدوال كثيرات الحدود متصلة على جميع الأعداد الحقيقية، بينما الدوال الكسرية والجذرية متصلة على جميع نقاط مجالاتها المعرفة." }
            ],
            videoUrl: "https://www.youtube.com/embed/mwkjAHdWlt4",
            questions: [{ templateId: 'continuity:unknown-value', count: 1, difficulty: 'medium' }] as QuestionItem[],
        },
        {
            id: "idea-4",
            ideaNumber: "4.4",
            ideaName: "Continuity of Composite Radical and Rational Functions",
            theoreticalSteps: [
                { stepTitle: "Step 1: مجال الشروط للدوال المركبة والذرية", stepDescription: "عند إيجاد فترات اتصال دالة مركبة تحتوي على جذور ومقامات، ندمج شرطين: أن يكون ما تحت الجذر التربيعي موجباً أو مساوياً لصفر، وألا يساوي المقام الكلي صفراً." },
                { stepTitle: "Step 2: استبعاد أصفار المقام وتحديد الفترة النهائية", stepDescription: "نساوي المقام بـ صفر لحل المعادلة وإيجاد القيم المستثناة، ثم نكتب فترة الاتصال النهائية بصيغة الأعداد الحقيقية عدا هذه القيم." }
            ],
            videoUrl: "https://www.youtube.com/embed/21eTWUm3BlA",
            questions: [{ templateId: 'continuity:interval-of-continuity', count: 1, difficulty: 'medium' }] as QuestionItem[],
        }
    ]
};
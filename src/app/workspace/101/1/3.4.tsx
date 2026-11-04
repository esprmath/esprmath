// src/data/courses/101/1/3.4.ts
import { ChapterData } from '@/types/math';
import type { QuestionItem } from '@/lib/questions/types';

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
                { stepTitle: "Step 1: النهايات للدوال المقلوبة عند ما لا نهاية", stepDescription: "عندما تقترب x من ما لا نهاية، فإن أي عدد ثابت مقسوماً على x يؤول ناتجه إلى الصفر (0)." },
                { stepTitle: "Step 2: نهايات الدوال المثلثية عند ما لا نهاية", stepDescription: "الدوال المثلثية تتذبذب باستمرار، ولذلك فإن نهايتها تكون غير موجودة (DNE)." }
            ],
            videoUrl: "https://www.youtube.com/embed/o8Kyshw5qfE",
            questions: [{ templateId: 'limits:infinity-reciprocal', count: 1, difficulty: 'easy' }] as QuestionItem[],
        },
        {
            id: "idea-2",
            ideaNumber: "5.2",
            ideaName: "Limits of Rational and Radical Functions at Infinity and Identifying Horizontal Asymptotes",
            theoreticalSteps: [
                { stepTitle: "Step 1: القسمة على أعلى قوة في المقام", stepDescription: "نقسم البسط والمقام على أعلى قوة لـ x موجودة في المقام لتسهيل تبسيط الحدود إلى 0." },
                { stepTitle: "Step 2: إيجاد الخطوط المحاذية الأفقية (HA)", stepDescription: "الخط المحاذي الأفقي هو y = L حيث L هي قيمة النهاية عندما x → ∞ أو x → -∞." }
            ],
            videoUrl: "https://www.youtube.com/embed/LvZsZUEhjkA",
            questions: [{ templateId: 'limits:rational-infinity', count: 1, difficulty: 'medium' }] as QuestionItem[],
        },
        {
            id: "idea-3",
            ideaNumber: "5.3",
            ideaName: "The Conjugate Technique at Infinity for Infinity - Infinity Forms",
            theoreticalSteps: [
                { stepTitle: "Step 1: التعرف على حالة عدم التعيين", stepDescription: "قد تنتج صيغة غير معينة من نوع (∞ - ∞) والتي لا يمكن حلها مباشراً." },
                { stepTitle: "Step 2: استخدام المرافق", stepDescription: "نضرب ونقسم في المرافق للتخلص من الجذر في البسط، ثم نبسط المقدار." }
            ],
            videoUrl: "https://www.youtube.com/embed/ij79sNXpL_8",
            questions: [{ templateId: 'limits:conjugate-infinity', count: 1, difficulty: 'hard' }] as QuestionItem[],
        },
        {
            id: "idea-4",
            ideaNumber: "5.4",
            ideaName: "Infinite Limits at Infinity",
            theoreticalSteps: [
                { stepTitle: "Step 1: مفهوم النهايات اللانهائية عند ما لا نهاية", stepDescription: "إذا كانت درجة البسط أكبر من درجة المقام، فإن ناتج النهاية يؤول إلى ما لا نهاية." },
                { stepTitle: "Step 2: طريقة الحل بالقسمة على أعلى قوة في المقام", stepDescription: "نقسم البسط والمقام على أعلى قوة لـ x في المقام، ثم نعوض لنحصل على الإشارة النهائية." }
            ],
            videoUrl: "https://www.youtube.com/embed/Ao18r_hisrg",
            questions: [{ templateId: 'limits:infinity-infinite', count: 1, difficulty: 'medium' }] as QuestionItem[],
        }
    ]
};
// src/data/courses/101/1/1.6.ts
import { ChapterData } from '@/types/math';
import type { QuestionItem } from '@/lib/questions/types';

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
                { stepTitle: "Step 1: استخدام قوانين توزيع النهايات", stepDescription: "عند إيجاد نهاية دالة كسرية كثيرة حدود، نوزع النهاية على البسط والمقام أولاً، ثم نطبق قوانين الجمع والطرح والأسس." },
                { stepTitle: "Step 2: التعويض المباشر والتبسيط", stepDescription: "نعوض بقيمة x المعطاة في البسط والمقام، ثم نبسط الناتج النهائي باختصار الكسور إن أمكن." }
            ],
            videoUrl: "https://www.youtube.com/embed/h4RXkKCZcpc",
            questions: [{ templateId: 'limits:direct-substitution', count: 1, difficulty: 'easy' }] as QuestionItem[],
        },
        {
            id: "idea-2",
            ideaNumber: "2.2",
            ideaName: "Evaluating Limits of Piecewise Functions",
            theoreticalSteps: [
                { stepTitle: "Step 1: تحديد نقطة التشعب", stepDescription: "التركيز على النقطة الفاصلة التي تتغير عندها القاعدة الجبرية للدالة لمعرفة القاعدة المناسبة لكل اتجاه." },
                { stepTitle: "Step 2: حساب النهايات الجانبية والمقارنة", stepDescription: "إيجاد النهاية من اليمين (للقيم الأكبر) ومن اليسار (للقيم الأصغر)، وتكون النهاية موجودة فقط إذا تساوت القيمتان." }
            ],
            videoUrl: "https://www.youtube.com/embed/27yDQF3NEYo",
            questions: [{ templateId: 'limits:piecewise-eval', count: 1, difficulty: 'medium' }] as QuestionItem[],
        },
        {
            id: "idea-3",
            ideaNumber: "2.3",
            ideaName: "The Conjugate Technique for Indeterminate Forms",
            theoreticalSteps: [
                { stepTitle: "Step 1: كشف حالة عدم التعيين وجود الجذور", stepDescription: "عند التعويض المباشر وتنتج كمية غير معينة (0/0) مع وجود جذور تربيعية، نلجأ للضرب في المرافق الجبري." },
                { stepTitle: "Step 2: الضرب في المرافق والاختصار", stepDescription: "نضرب البسط والمقام في مرافق الحد الجذري للتخلص من الجذور، ثم نختصر العامل الصفري المشترك ونعوض بقيمة x." }
            ],
            videoUrl: "https://www.youtube.com/embed/s-7uz1x90ZY",
            questions: [{ templateId: 'limits:conjugate-zero', count: 1, difficulty: 'medium' }] as QuestionItem[], // 🆕 جديد
        },
        {
            id: "idea-4",
            ideaNumber: "2.4",
            ideaName: "Indirect Limit Evaluation and Handling Unknown Functions",
            theoreticalSteps: [
                { stepTitle: "Step 1: التعامل مع النهايات غير المباشرة والدوال المجهولة", stepDescription: "عند إعطاء نهاية كسر يحتوي على دالة مجهولة ويساوي قيمة ثابتة، نربط البسط بالمقام عبر خصائص النهايات." },
                { stepTitle: "Step 2: الضرب في المقام وحل المعادلة", stepDescription: "نضرب طرفي المعادلة في المقام وأخذ النهاية لتصفير الأجزاء المرتبطة به، ثم إيجاد قيمة نهاية الدالة المطلوبة." }
            ],
            videoUrl: "https://www.youtube.com/embed/Cjyf0zaevuI",
            questions: [{ templateId: 'limits:unknown-function', count: 1, difficulty: 'medium' }] as QuestionItem[], // 🆕 جديد
        }
    ]
};
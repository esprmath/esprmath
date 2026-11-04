// src/data/courses/101/1/2.1.ts
import { ChapterData } from '@/types/math';
import type { QuestionItem } from '@/lib/questions/types';

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
                { stepTitle: "Step 1: قانون إيجاد ميل المماس", stepDescription: "يُحسب ميل المماس للمنحنى عند النقطة a باستخدام قانون النهاية الأساسي: m = lim (x→a) [f(x) - f(a)] / [x - a]" },
                { stepTitle: "Step 2: تكوين معادلة الخط المستقيم", stepDescription: "بعد إيجاد قيمة الميل (m) والنقطة المعطاة، نطبق صيغة الميل والنقطة: (y - y1) = m(x - x1) لإيجاد المعادلة بالشكل النهائي." }
            ],
            videoUrl: "https://www.youtube.com/embed/uEh_wJw1czY",
            questions: [
                {
                    templateId: 'derivatives:tangent-limit',
                    count: 1,
                    difficulty: 'medium'
                }
            ] as QuestionItem[],
        },
        {
            id: "idea-2",
            ideaNumber: "3.2",
            ideaName: "Physical Applications (Instantaneous Velocity and Rates of Change)",
            theoreticalSteps: [
                { stepTitle: "Step 1: السرعة اللحظية للأجسام الساقطة", stepDescription: "لحساب السرعة اللحظية بعد زمن محدد (t) لجسم يسقط سقوطاً حراً، نستخدم قانون السرعة الزمنية v(t) = g * t." },
                { stepTitle: "Step 2: السرعة لحظة الاصطدام بالأرض", stepDescription: "لحساب السرعة عند الاصطدام بالاعتماد على ارتفاع السقوط الكلي (h)، نستخدم العلاقة: v = √(2gh)." }
            ],
            videoUrl: "https://www.youtube.com/embed/24JkXZRKV5s",
            questions: [
                {
                    templateId: 'derivatives:instantaneous-velocity',
                    count: 1,
                    difficulty: 'medium'
                }
            ] as QuestionItem[],
        }
    ]
};
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY || '';

        if (!apiKey) {
            return NextResponse.json(
                { error: 'مفتاح الـ API غير متاح في ملف البيئة' },
                { status: 500 }
            );
        }

        const openai = new OpenAI({ apiKey });

        const { deptName, totalHours, finalBurnout, selectedCoursesDetails, gender } = await req.json();

        // تحديد سياق الأسلوب بناءً على عدد الساعات والجنس
        let hoursVibeContext = '';
        if (totalHours < 14) {
            hoursVibeContext = `
            ⚠️ تنبيه هام جداً (الجدول خفيف وقليل أقل من 14 ساعة):
            - بما أن الساعات قليلة (< 14)، اجمل الأجواء "دلع"، رايقة، واعتبر هذا الترم بمثابة "استراحة محارب" أو "نزهة جامعية مؤقتة".
            - ذكّر الطالب/ة بلطف وبأسلوب ساخر خفيف أن الأمور بسيطة الآن، ولكن احذره بظرافة أن الفصول القادمة ستكون هي المحرقة الكبرى والجد القادم!
            `;
        } else {
            hoursVibeContext = `
            ⚠️ تنبيه (الجدول دسم وثقيل):
            - اجعل الألقاب شاطحة، كارثية، ومبالغاً فيها بشكل درامي كوميدي يمثل صدمة الواقع والضغط العالي.
            `;
        }

        const genderContext = gender === 'female'
            ? 'الطالبة أنثى (بنت)، اجعل الألقاب والنصائح بأسلوب بناتي لطيف، كيوت، أو درامي ساخر.'
            : 'الطالب ذكر (ولد)، اجعل الألقاب شبابية، كارثية، أو بأسلوب درامي مبالغ فيه.';

        const systemInstruction = `
أنت مساعد ذكي كوميدي وساخر جداً بأسلوب "مظلومين قاعات الدراسة".
${genderContext}
${hoursVibeContext}
مهمتك هي تحليل جدول الطالب وإعطاؤه **لقباً ميمز ومبتكراً** يصف حجم جدوله، مع نصيحة ساخرة.

⚠️ قواعد الإخراج:
- يجب أن تكون الإجابة بصيغة JSON حصرياً تحتوي على الحقلين التاليين فقط:
1. "title": اللقب المبتكر والمناسب لحالة الساعات (دلع واسترخاء لو قليل، أو دمار لو كثير).
2. "advice": نصيحة مضحكة وساخرة حول وضعه وكيف يتعامل مع هذا الترم.
- لا تضف أي نص خارج كائن الـ JSON ولا تستخدم علامات التنسيق مثل \`\`\`json.
`;

        const userPrompt = `
التخصص: ${deptName}
الجنس: ${gender === 'female' ? 'أنثى' : 'ذكر'}
إجمالي ساعات الجدول: ${totalHours} ساعات
نسبة حرق الأعصاب المحسوبة: ${finalBurnout}%
المواد التي اختارها هذا الترم مع تفاصيلها:
${JSON.stringify(selectedCoursesDetails, null, 2)}
`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.9,
            response_format: { type: 'json_object' }
        });

        const rawContent = completion.choices[0]?.message?.content || '{}';
        const analysis = JSON.parse(rawContent);

        return NextResponse.json({
            totalHours,
            finalBurnout,
            title: analysis.title || 'استراحة محارب مؤقتة',
            advice: analysis.advice || 'استمتع بالهدوء الآن، فالقادم أعظم!',
            deptName
        });

    } catch (error: any) {
        console.error('❌ حدث خطأ في تحليل مؤشر الاحتراق:', error?.message || error);
        return NextResponse.json(
            { error: `خطأ في سيرفر الذكاء الاصطناعي: ${error?.message || 'مشكلة في الاتصال'}` },
            { status: 500 }
        );
    }
}
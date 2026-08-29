import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY || ''

        if (!apiKey) {
            return NextResponse.json(
                { reply: 'مفتاح الـ API غير متاح في ملف البيئة' },
                { status: 500 }
            )
        }

        const openai = new OpenAI({ apiKey })

        // تم إضافة courseId هنا لاستخراجه من الطلب
        const { messages, courseId, currentModule, currentChapter, currentQuestion } = await req.json()

        const systemInstruction = `
أنت معلم مساعد ذكي لمقرر الرياضيات (${courseId ? 'Math ' + courseId : 'المقرر الحالي'}) في منصة EsprMath.
سياق الطالب الحالي:
- الموديول: ${currentModule || 1}
- الشابتر: ${currentChapter || 'غير محدد'}
- الفكرة أو السؤال المعروض أمامه: "${currentQuestion || 'لا يوجد سؤال محدد'}".

⚠️ قواعد صارمة جداً:
1. كن مباشراً ومختصراً جداً. امنع تماماً الشروحات الطويلة أو "التفلسف" النظري أو سرد مقدمات ترحيبية متكررة.
2. أجب على قدر سؤال الطالب أو وجهه لحل السؤال المعروض أمامه باختصار شديد وبخطوات واضحة.
3. لا تستخدم رموز LaTeX المعقدة مثل \\( أو \\[ أو \\begin{pmatrix}.
4. اكتب المعادلات في أسطر منفصلة وبسيطة.
`

        const finalMessages = [
            { role: 'system', content: systemInstruction },
            ...(messages || [])
        ]

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: finalMessages,
            temperature: 0.2,
        })

        const reply = completion.choices[0]?.message?.content || 'لم يتم استلام إجابة.'

        return NextResponse.json({ reply })

    } catch (error: any) {
        console.error('❌ حدث خطأ في سيرفر OpenAI:', error?.message || error)
        return NextResponse.json(
            { reply: `خطأ في سيرفر الذكاء الاصطناعي: ${error?.message || 'مشكلة في الاتصال'}` },
            { status: 500 }
        )
    }
}
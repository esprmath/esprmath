import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const apiKey = process.env.OPENAI_API_KEY || ''
const openai = new OpenAI({ apiKey })

export async function POST(req: Request) {
    try {
        if (!apiKey) {
            return NextResponse.json(
                { reply: 'مفتاح الـ API غير متاح في ملف البيئة (.env.local)' },
                { status: 500 }
            )
        }

        const { messages, currentModule, currentChapter, currentQuestion } = await req.json()

        // تعليمات النظام محدثة لتكون صارمة وتمنع التفلسف والشرح المطول
        const systemInstruction = `
أنت معلم مساعد ذكي لمقرر الجبر الخطي (Math 204) في منصة EsprMath.
سياق الطالب الحالي:
- الموديول: ${currentModule || 3}
- الشابتر: ${currentChapter || 'غير محدد'}
- السؤال المعروض أمامه: "${currentQuestion || 'لا يوجد سؤال محدد'}".

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
            temperature: 0.2, // خفضنا القيمة لتقليل العشوائية وجعله مركزاً وعملياً
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
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { buildSystemPrompt, cleanMessages, clip } from '@/lib/tutorPrompt'
import { getRequestUser } from '@/lib/serverAuth'

export const dynamic = 'force-dynamic'

const MODEL = 'gpt-4o-mini'
// تسعيرة gpt-4o-mini التقريبية بالدولار لكل token
const INPUT_COST = 0.00000015
const OUTPUT_COST = 0.0000006

const MAX_REPLY_TOKENS = 800
const MAX_CONTEXT_CHARS = 4000
const MAX_MESSAGES_PER_HOUR = 40
const DEFAULT_COURSE = '101'

const reply = (text: string, status: number) => NextResponse.json({ reply: text }, { status })

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
            console.error('[chat] OPENAI_API_KEY غير موجود')
            return reply('خدمة فيكتور غير متاحة حاليًا، حاول لاحقًا.', 500)
        }

        // 1) التحقق من الطالب من الخادم
        const auth = await getRequestUser(req)
        if (!auth) return reply('سجّل دخولك أولًا حتى تستخدم فيكتور.', 401)
        const { supabase, user } = auth

        // المفتاح العام في لوحة التحكم يوقف فيكتور عن الجميع
        const { data: globalSwitch } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', 'ai_global_switch')
            .maybeSingle()
        if (globalSwitch?.value === false) return reply('فيكتور متوقف مؤقتًا، جرّب بعد قليل.', 503)

        const body = await req.json()
        const courseId = clip(String(body?.courseId ?? DEFAULT_COURSE), 20)
        const moduleNumber = Number(body?.currentModule) || 1

        // 2) صلاحية فيكتور: المعتمد في الكورس، أو أي طالب داخل الموديول المجاني.
        // طلب الانضمام المعلّق لا يفتح فيكتور، والمشرف يقدر يوقفه لأي طالب.
        const [{ data: enrollment }, { data: mod }] = await Promise.all([
            supabase
                .from('user_courses')
                .select('is_approved, is_ai_allowed')
                .eq('user_id', user.id)
                .eq('course_id', courseId)
                .maybeSingle(),
            supabase
                .from('course_modules')
                .select('is_free')
                .eq('course_id', courseId)
                .eq('module_number', moduleNumber)
                .maybeSingle(),
        ])

        // نفس قاعدة بوابة الصفحات: بدون إعداد في اللوحة يكون الموديول الأول هو المجاني
        const isFreeModule = mod ? mod.is_free === true : moduleNumber === 1
        const isAllowed = enrollment?.is_ai_allowed !== false && (enrollment?.is_approved === true || isFreeModule)
        if (!isAllowed) return reply('ميزة فيكتور غير مفعلة في حسابك حاليًا.', 403)

        // 3) حد الاستخدام لكل طالب حتى لا تخرج التكلفة عن السيطرة
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
        const { count } = await supabase
            .from('ai_logs')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('model_name', MODEL)
            .gte('created_at', oneHourAgo)
        if ((count ?? 0) >= MAX_MESSAGES_PER_HOUR) {
            return reply('وصلت للحد المسموح من الرسائل في هذه الساعة، جرّب بعد قليل.', 429)
        }

        // 4) تجهيز الطلب
        const messages = cleanMessages(body?.messages)
        if (messages[messages.length - 1]?.role !== 'user') {
            return reply('اكتب سؤالك أولًا.', 400)
        }

        const openai = new OpenAI({ apiKey })
        const completion = await openai.chat.completions.create({
            model: MODEL,
            temperature: 0.2,
            max_tokens: MAX_REPLY_TOKENS,
            messages: [
                {
                    role: 'system',
                    content: buildSystemPrompt({
                        courseId,
                        module: clip(String(body?.currentModule ?? ''), 20),
                        chapter: clip(body?.currentChapter, 50),
                        idea: clip(body?.currentIdea, 300),
                        ideaNotes: clip(body?.ideaNotes, MAX_CONTEXT_CHARS),
                        question: clip(body?.currentQuestion, MAX_CONTEXT_CHARS),
                    }),
                },
                ...messages,
            ],
        })

        const answer = completion.choices[0]?.message?.content || 'لم يصلني رد، حاول مرة ثانية.'

        // 5) تسجيل التكلفة باسم الطالب الحقيقي من الجلسة، وفشل التسجيل لا يوقف الرد
        const usage = completion.usage
        const cost = (usage?.prompt_tokens ?? 0) * INPUT_COST + (usage?.completion_tokens ?? 0) * OUTPUT_COST
        const { error: logError } = await supabase.from('ai_logs').insert([{
            user_id: user.id,
            student_name: user.user_metadata?.full_name || user.user_metadata?.name || 'طالب',
            model_name: MODEL,
            cost,
        }])
        if (logError) console.error('[chat] فشل تسجيل التكلفة:', logError.message)

        return NextResponse.json({ reply: answer })
    } catch (error: any) {
        console.error('[chat] خطأ:', error?.message || error)
        return reply('حدث خطأ في الاتصال بفيكتور، حاول مرة ثانية.', 500)
    }
}

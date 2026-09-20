
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

/*
|--------------------------------------------------------------------------
| Timetable periods
|--------------------------------------------------------------------------
|
| The numbers inside the timetable cells refer to these period codes.
| تم توسيع وفهرسة جميع الفترات والساعات (العادية والمسائية المتأخرة مثل 72, 69, 89) كجزء أساسي وطبيعي
|
*/

const PERIODS: Record<string, number> = {
    '54': 0,  // 07:15 - 08:05
    '86': 1,  // 08:15 - 09:05
    '44': 2,  // 09:15 - 10:05
    '80': 3,  // 10:15 - 11:05
    '57': 4,  // 11:15 - 12:05
    '47': 5,  // 12:15 - 13:05
    '63': 6,  // 13:15 - 14:05
    '52': 7,  // 14:15 - 15:05
    '51': 8,  // 15:15 - 16:05
    '72': 9,  // 16:15 - 17:05 (الساعة 4:15)
    '69': 10, // 17:15 - 18:05 (الساعة 5:15)
    '89': 11, // 18:15 - 19:05 (الساعة 6:15)
    '35': 9,  // رموز إضافية احتياطية للتوافق
    '36': 10,
    '37': 11,
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'] as const

const DAY_ARABIC: Record<string, string> = {
    Sun: 'الأحد',
    Mon: 'الاثنين',
    Tue: 'الثلاثاء',
    Wed: 'الأربعاء',
    Thu: 'الخميس',
}

/*
|--------------------------------------------------------------------------
| Normalize course code
|--------------------------------------------------------------------------
*/

function normalizeCourseCode(code: unknown): string {
    return String(code || '')
        .replace(/\s+/g, '')
        .replace(/[-–—]/g, '')
        .toUpperCase()
        .trim()
}

/*
|--------------------------------------------------------------------------
| Exact course code matching
|--------------------------------------------------------------------------
| Important:
| Do NOT match courses by title/name because different course numbers
| can have the same or very similar names (example: 101 and 201).
*/
function isExactCourseCodeMatch(a: unknown, b: unknown): boolean {
    return normalizeCourseCode(a) === normalizeCourseCode(b)
}

/*
|--------------------------------------------------------------------------
| Parse numbers from a timetable cell
|--------------------------------------------------------------------------
|
| Examples:
| "80,44"       -> ["80", "44"]
| "52,63,51"    -> ["52", "63", "51"]
| "57"          -> ["57"]
| ""            -> []
|
*/

function extractPeriodCodes(value: unknown): string[] {
    if (value === null || value === undefined) {
        return []
    }

    const text = String(value).trim()

    if (!text) {
        return []
    }

    const matches = text.match(/\d+/g) || []

    return matches.filter((code) => PERIODS[code] !== undefined)
}

/*
|--------------------------------------------------------------------------
| Main API
|--------------------------------------------------------------------------
*/

export async function POST(req: Request) {
    try {
        const {
            imageBase64,
            type,
            courseCode,
            currentAbsents,
            maxAbsence,
            availableCourses,
        } = await req.json()

        /*
        |--------------------------------------------------------------------------
        | PARSE TIMETABLE
        |--------------------------------------------------------------------------
        */

        if (type === 'parse_timetable') {
            if (!imageBase64) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'imageBase64 is required',
                    },
                    { status: 400 }
                )
            }

            /*
            |--------------------------------------------------------------------------
            | IMPORTANT:
            | availableCourses is used as the source of truth for course codes.
            |
            | The AI should NOT invent course names.
            | It only needs to identify what course code appears in each row.
            |--------------------------------------------------------------------------
            */

            const courseList = Array.isArray(availableCourses)
                ? availableCourses.map((course: any) => ({
                    code: course.code,
                    title: course.title,
                }))
                : []

            const courseCodes = courseList
                .map((course: any) => normalizeCourseCode(course.code))
                .filter(Boolean)

            /*
            |--------------------------------------------------------------------------
            | Structured output schema
            |--------------------------------------------------------------------------
            */

            const timetableSchema = {
                type: 'object',
                additionalProperties: false,
                properties: {
                    rows: {
                        type: 'array',
                        items: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                                courseCode: {
                                    type: 'string',
                                },
                                activity: {
                                    type: 'string',
                                },
                                Sun: {
                                    type: 'string',
                                },
                                Mon: {
                                    type: 'string',
                                },
                                Tue: {
                                    type: 'string',
                                },
                                Wed: {
                                    type: 'string',
                                },
                                Thu: {
                                    type: 'string',
                                },
                            },
                            required: [
                                'courseCode',
                                'activity',
                                'Sun',
                                'Mon',
                                'Tue',
                                'Wed',
                                'Thu',
                            ],
                        },
                    },
                },
                required: ['rows'],
            }

            /*
            |--------------------------------------------------------------------------
            | AI prompt
            |--------------------------------------------------------------------------
            */

            const systemPrompt = `
أنت نظام متخصص في قراءة جداول المواد الجامعية من الصور.

مهمتك الأساسية هي قراءة جدول كلية ينبع الجامعية YUC الموجود في الصورة
واستخراج بيانات الجدول كما هي، بدون تخمين (بما في ذلك الحصص المسائية والمتأخرة مثل 72، 69، 89 التي تمتد حتى الساعة 6:15 كجزء أساسي وطبيعي من أوقات الدوام).

==================================================
⚠️ قاعدة صارمة جداً لأرقام وأكواد المواد (مثل عدم الخلط بين 201 و 101):
==================================================
يجب التدقيق بنسبة 100% في أرقام المقررات الظاهرة في عمود (Course Code). 
إذا كان الكود في الجدول يظهر برقم معين مثل 201 (مثلاً MCET201 أو ELET201)، يجب استخراجه برقم 201 بدقة تامة، ولا تقم أبداً بتغييره أو استبداله برقم آخر مثل 101. قارن كود المادة المستخرج مع قائمة الأكواد المتاحة بحذر شديد لضمان مطابقة الرقم الحقيقي في الصورة.
ممنوع مطابقة المادة بالاسم فقط. إذا كان الاسم متشابهًا ولكن الرقم مختلف مثل 101 و 201 فهما مادتان مختلفتان ويجب اختيار الرقم الظاهر في الجدول فقط.

==================================================
أولاً: شكل الجدول
==================================================

الجدول يحتوي على أعمدة مثل:

Course Code
Course Name
CR
CT
Sec
Seq
Activity
Sun
Mon
Tue
Wed
Thu
Building
Room
Staff

نحن نهتم بشكل أساسي بـ:

1. Course Code
2. Activity
3. Sun
4. Mon
5. Tue
6. Wed
7. Thu

==================================================
ثانياً: أهم قاعدة
==================================================

اقرأ كود المادة (Course Code) بدقة تامة كما يظهر في الصفوف بغض النظر عما إذا كان موجوداً في القائمة أم لا.

قائمة أكواد المواد المتاحة هي:

${JSON.stringify(courseCodes)}

إذا ظهر كود جديد في الصورة غير موجود في القائمة، قم بقراءته واستخراجه كما هو.

==================================================
ثالثاً: قراءة الأيام
==================================================

كل صف يمثل حصة/شعبة من مادة.

الأيام الموجودة هي:

Sun = الأحد
Mon = الاثنين
Tue = والثلاثاء
Wed = الأربعاء
Thu = الخميس

اقرأ الرقم أو الأرقام الموجودة داخل خلية اليوم كما تظهر في الصورة تماماً.

مثلاً:

Sun = 80,44

يجب أن ترجع:

"80,44"

ومثال للمحاضرات التي تحتوي على ساعات مسائية:

Mon = 72,89,69

يجب أن ترجع الأرقام كما هي مفصولة بفاصلة:

"72,89,69"

لا تحول الأرقام إلى أوقات بنفسك.

لا تحذف أي رقم.

لا تضف أي رقم.

==================================================
رابعاً: الخلايا الفارغة
==================================================

إذا كانت خلية اليوم فارغة:

أرجع:

""

ولا تخترع أي حصة.

==================================================
خامساً: الفترات (تشمل أوقات الدوام العادية والمسائية كجزء أساسي)
==================================================

الأرقام الموجودة في الخلايا لها معنى محدد ومعتمد كجزء من أوقات الدوام:

54 = 07:15 - 08:05
86 = 08:15 - 09:05
44 = 09:15 - 10:05
80 = 10:15 - 11:05
57 = 11:15 - 12:05
47 = 12:15 - 13:05
63 = 13:15 - 14:05
52 = 14:15 - 15:05
51 = 15:15 - 16:05
72 = 16:15 - 17:05 (الساعة 4:15)
69 = 17:15 - 18:05 (الساعة 5:15)
89 = 18:15 - 19:05 (الساعة 6:15)

اقرأ هذه الأرقام طبيعياً أينما وجدت في جدول الحصص.

لكن مهم جداً:

لا تحولها إلى وقت في الـJSON.

أرجع الرقم نفسه فقط.

==================================================
سادساً: قراءة الصفوف
==================================================

اقرأ كل صف بشكل مستقل.

مثال من الجدول:

CS202 | Discrete Mathematics | ... | Sun: 80,44 | Mon: 54,86

يجب أن يكون:

{
  "courseCode": "CS202",
  "activity": "Theoretical",
  "Sun": "80,44",
  "Mon": "54,86",
  "Tue": "",
  "Wed": "",
  "Thu": ""
}

==================================================
سابعاً: لا تدمج الصفوف
==================================================

إذا ظهر نفس Course Code أكثر من مرة، لا تدمج الصفوف.

مثلاً إذا ظهر:

CS204
CS204

فهما صفان مختلفان.

كل صف يجب أن يظهر كعنصر مستقل في rows.

نفس الشيء مع:

CS201
CS201

==================================================
ثامناً: الدقة
==================================================

اقرأ الصورة من أعلى الجدول إلى أسفله.

لكل صف:

1. اقرأ Course Code.
2. اقرأ Activity.
3. اقرأ Sun.
4. اقرأ Mon.
5. اقرأ Tue.
6. اقرأ Wed.
7. اقرأ Thu.
8. انتقل للصف التالي.

لا تعتمد على شكل الألوان أو حجم الخلية لتخمين البيانات.

اعتمد على النص وموقعه داخل الجدول.

==================================================
تاسعاً: إذا كان النص غير واضح
==================================================

إذا لم تستطع قراءة Course Code بشكل موثوق:

لا تخترع كوداً.

استخدم النص الذي تستطيع قراءته فقط.

إذا كانت خلية يوم غير واضحة تماماً:

أرجع "" بدلاً من اختراع رقم.

==================================================
عاشراً: المطلوب النهائي
==================================================

أرجع JSON فقط.

لا تكتب شرحاً.

لا تكتب Markdown.

لا تكتب comments.

الشكل يجب أن يكون:

{
  "rows": [
    {
      "courseCode": "CS202",
      "activity": "Theoretical",
      "Sun": "80,44",
      "Mon": "54,86",
      "Tue": "",
      "Wed": "",
      "Thu": ""
    }
  ]
}

مهم جداً:

لا تستخرج Building أو Room أو Staff.

لا تحتاج Course Name.

لا تحتاج CR أو CT.

ركز فقط على الصفوف والـCourse Code والـActivity والأيام.
`

            /*
            |--------------------------------------------------------------------------
            | OpenAI Vision request
            |--------------------------------------------------------------------------
            */

            const response = await (openai as any).responses.create({
                model: 'gpt-5.6-luna',

                reasoning: {
                    effort: 'medium',
                },

                instructions: systemPrompt,

                input: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'input_text',
                                text: `
اقرأ صورة الجدول بالكامل بدقة شديدة مع الانتباه لأرقام الأكواد وعدم الخلط بين 201 و 101، وقراءة الساعات المسائية والصباحية كجزء أساسي.

أريد استخراج الصفوف كما هي في الجدول.

لا ترتب الحصص بنفسك.
لا تحول أرقام الفترات إلى أوقات.
لا تخترع أسماء مواد.

استخرج Course Code و Activity و Sun و Mon و Tue و Wed و Thu فقط.
                                `,
                            },
                            {
                                type: 'input_image',
                                image_url: imageBase64,
                                detail: 'high',
                            },
                        ],
                    },
                ],

                text: {
                    format: {
                        type: 'json_schema',
                        name: 'timetable_rows',
                        strict: true,
                        schema: timetableSchema,
                    },
                },

                max_output_tokens: 4000,
            })

            /*
            |--------------------------------------------------------------------------
            | Read AI result
            |--------------------------------------------------------------------------
            */

            const content = response.output_text

            if (!content) {
                throw new Error('AI returned an empty response')
            }

            const parsed = JSON.parse(content)

            const rows = Array.isArray(parsed.rows)
                ? parsed.rows
                : []

            /*
            |--------------------------------------------------------------------------
            | Match courses using YOUR database/list (with auto-extraction for new courses)
            |--------------------------------------------------------------------------
            */

            const normalizedAvailableCourses = courseList.map((course: any) => ({
                ...course,
                normalizedCode: normalizeCourseCode(course.code),
            }))

            /*
            |--------------------------------------------------------------------------
            | RESET / CLEAR OLD SLOTS:
            | نبدأ بمصفوفة فارغة تماماً لحذف وتصفير أي جدول قديم ومسح التداخلات
            |--------------------------------------------------------------------------
            */
            const slots: any[] = []

            /*
            |--------------------------------------------------------------------------
            | Convert rows -> slots
            |--------------------------------------------------------------------------
            */

            for (const row of rows) {
                const rawCode = normalizeCourseCode(row.courseCode)

                if (!rawCode) {
                    continue
                }

                /*
                | Match or Auto-create if course is missing from availableCourses
                */

                const matchedCourse = normalizedAvailableCourses.find(
                    (course: any) =>
                        isExactCourseCodeMatch(course.normalizedCode, rawCode)
                )

                const finalCode = matchedCourse
                    ? matchedCourse.code
                    : row.courseCode

                const finalTitle = matchedCourse
                    ? matchedCourse.title
                    : row.courseCode

                /*
                |--------------------------------------------------------------------------
                | Process every day separately
                |--------------------------------------------------------------------------
                */

                for (const day of DAYS) {
                    const value = row[day]

                    const periodCodes = extractPeriodCodes(value)

                    /*
                    | Each period becomes its own independent slot.
                    */

                    for (const periodCode of periodCodes) {
                        const timeSlotIndex = PERIODS[periodCode]

                        if (timeSlotIndex === undefined) {
                            continue
                        }

                        slots.push({
                            day: DAY_ARABIC[day],
                            timeSlotIndex,
                            span: 1,

                            courseCode: finalCode,
                            courseTitle: finalTitle,

                            activity: row.activity || '',

                            periodCode,
                        })
                    }
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Remove accidental duplicates
            |--------------------------------------------------------------------------
            */

            const uniqueSlots: any[] = []
            const seen = new Set<string>()

            for (const slot of slots) {
                const key = [
                    slot.day,
                    slot.timeSlotIndex,
                    normalizeCourseCode(slot.courseCode),
                    slot.activity,
                ].join('|')

                if (seen.has(key)) {
                    continue
                }

                seen.add(key)
                uniqueSlots.push(slot)
            }

            /*
            |--------------------------------------------------------------------------
            | Sort slots
            |--------------------------------------------------------------------------
            */

            const dayOrder: Record<string, number> = {
                الأحد: 0,
                الاثنين: 1,
                الثلاثاء: 2,
                الأربعاء: 3,
                الخميس: 4,
            }

            uniqueSlots.sort((a, b) => {
                const dayDifference =
                    dayOrder[a.day] - dayOrder[b.day]

                if (dayDifference !== 0) {
                    return dayDifference
                }

                return a.timeSlotIndex - b.timeSlotIndex
            })

            /*
            |--------------------------------------------------------------------------
            | Courses used in timetable (including auto-extracted new courses)
            |--------------------------------------------------------------------------
            */

            const courses = Array.from(
                new Set(
                    uniqueSlots
                        .map((slot) => slot.courseCode)
                        .filter(Boolean)
                )
            )

            /*
            |--------------------------------------------------------------------------
            | Add IDs
            |--------------------------------------------------------------------------
            */

            const finalSlots = uniqueSlots.map(
                (slot, index) => ({
                    ...slot,

                    id: `${slot.day}-${slot.timeSlotIndex}-${normalizeCourseCode(
                        slot.courseCode
                    )}-${index}`,
                })
            )

            /*
            |--------------------------------------------------------------------------
            | Final response
            |--------------------------------------------------------------------------
            */

            return NextResponse.json({
                success: true,

                data: {
                    courses,

                    slots: finalSlots,

                    rows,
                },
            })
        }

        /*
        |--------------------------------------------------------------------------
        | ABSENCE ANALYSIS
        |--------------------------------------------------------------------------
        */

        if (type === 'analyze_absence') {
            const prompt = `المادة: ${courseCode}
الغيابات: ${currentAbsents} من ${maxAbsence}

اكتب رسالة تحذيرية مختصرة جداً باللغة العربية.
أقل من 15 كلمة.
لا تضف أي شرح.`

            const response = await (openai as any).responses.create({
                model: 'gpt-5.6-luna',

                input: prompt,

                max_output_tokens: 50,
            })

            const aiMessage =
                response.output_text?.trim() ||
                `تم تسجيل غياب ${courseCode}. غياباتك: ${currentAbsents}/${maxAbsence}.`

            return NextResponse.json({
                success: true,
                message: aiMessage,
            })
        }

        /*
        |--------------------------------------------------------------------------
        | Invalid type
        |--------------------------------------------------------------------------
        */

        return NextResponse.json(
            {
                success: false,
                error: 'Invalid type',
            },
            { status: 400 }
        )
    } catch (error: any) {
        console.error('AI Error:', error)

        return NextResponse.json(
            {
                success: false,
                error:
                    error?.message ||
                    'حدث خطأ أثناء تحليل الجدول',
            },
            { status: 500 }
        )
    }
}

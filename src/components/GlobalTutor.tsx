'use client'

import { useState, useRef, useEffect } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { supabase } from '@/lib/supabase'
import { DEMO_AI_PROMPTS, isDemoCourse } from '@/lib/courseAccess'

// الكورس النموذجي: كل رسالة جاهزة تُستخدم مرة وحدة فقط في كامل الكورس
const DEMO_USED_KEY = 'demo_ai_used'

function readDemoUsed(): string[] {
    try {
        const saved = JSON.parse(localStorage.getItem(DEMO_USED_KEY) ?? '[]')
        return Array.isArray(saved) ? saved : []
    } catch {
        return []
    }
}

interface GlobalTutorProps {
    courseId?: string | number
    currentModule?: number
    currentChapter?: string
    currentQuestion?: string
    currentIdea?: string | { id: string; name: string } | null
    initialPrompt?: string | null
    onPromptConsumed?: () => void
    isAiAllowed?: boolean
    mode?: 'floating' | 'inline'
    // عند تمريره تبقى المحادثة محفوظة في نفس التبويب، مثل الانتقال لصفحة الحل والرجوع
    chatKey?: string
    // شرح الفكرة في الدرس. عند تمريره يظهر زر "مختصر الفكرة" (داخل الـ Chapter فقط)
    ideaNotes?: string
}

type ChatMessage = { role: 'ai' | 'user'; text: string }

const MAX_SAVED_MESSAGES = 30

/** يوحّد صيغ LaTeX التي قد يرسلها النموذج إلى $...$ */
const normalizeMath = (text: string) =>
    text
        .replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => `$$${m}$$`)
        .replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => `$${m}$`)

function renderInline(text: string, keyPrefix: string) {
    return text.split(/(\$[^$\n]+?\$|\*\*[^*\n]+?\*\*)/g).map((piece, i) => {
        const key = `${keyPrefix}-${i}`
        if (piece.length > 2 && piece.startsWith('$') && piece.endsWith('$')) {
            return (
                <span key={key} style={{ direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block', maxWidth: '100%', overflowX: 'auto', overflowY: 'hidden', verticalAlign: 'middle' }}>
                    <InlineMath math={piece.slice(1, -1)} />
                </span>
            )
        }
        if (piece.startsWith('**') && piece.endsWith('**') && piece.length > 4) {
            return <strong key={key}>{piece.slice(2, -2)}</strong>
        }
        return <span key={key}>{piece}</span>
    })
}

/** يعرض رد فيكتور: معادلات بـ KaTeX وأسطر مرتبة وخط عريض */
function MessageBody({ text }: { text: string }) {
    const blocks = normalizeMath(text).split(/(\$\$[\s\S]+?\$\$)/g)
    return (
        <>
            {blocks.map((block, i) => {
                if (block.startsWith('$$') && block.endsWith('$$') && block.length > 4) {
                    return (
                        <div key={i} style={{ direction: 'ltr', overflowX: 'auto', overflowY: 'hidden', margin: '4px 0' }}>
                            <BlockMath math={block.slice(2, -2)} />
                        </div>
                    )
                }
                return block
                    .split('\n')
                    .filter((line) => line.trim())
                    .map((line, j) => (
                        <div key={`${i}-${j}`} style={{ margin: '3px 0' }}>
                            {renderInline(line, `${i}-${j}`)}
                        </div>
                    ))
            })}
        </>
    )
}

export default function GlobalTutor({
    courseId = '101',
    currentModule = 1,
    currentChapter = '',
    currentQuestion = '',
    currentIdea = null,
    initialPrompt = null,
    isAiAllowed = true,
    mode = 'floating',
    chatKey,
    ideaNotes = ''
}: GlobalTutorProps) {
    const [isChatOpen, setIsChatOpen] = useState(mode === 'inline')

    const ideaName = typeof currentIdea === 'object' && currentIdea !== null ? currentIdea.name : currentIdea

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const isDemo = isDemoCourse(courseId)
    const [demoUsed, setDemoUsed] = useState<string[]>([])

    useEffect(() => {
        if (isDemo) setDemoUsed(readDemoUsed())
    }, [isDemo])

    const saveDemoUsed = (next: string[]) => {
        try {
            localStorage.setItem(DEMO_USED_KEY, JSON.stringify(next))
        } catch {
            // تبقى في الصفحة الحالية حتى لو تعذر حفظها
        }
        setDemoUsed(next)
    }

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const floatingRef = useRef<HTMLDivElement>(null)

    // الشات العائم يتقفل إذا ضغط الطالب في أي مكان خارجه
    useEffect(() => {
        if (mode !== 'floating' || !isChatOpen) return
        const closeOnOutside = (e: PointerEvent) => {
            if (floatingRef.current && !floatingRef.current.contains(e.target as Node)) setIsChatOpen(false)
        }
        document.addEventListener('pointerdown', closeOnOutside)
        return () => document.removeEventListener('pointerdown', closeOnOutside)
    }, [mode, isChatOpen])
    const storageKey = chatKey ? `vector_chat_${courseId}_${chatKey}` : null
    const [loadedKey, setLoadedKey] = useState<string | null>(null)

    // استرجاع المحادثة المحفوظة
    useEffect(() => {
        if (!storageKey) return
        try {
            const saved = sessionStorage.getItem(storageKey)
            setMessages(saved ? JSON.parse(saved) : [])
        } catch {
            setMessages([])
        }
        setLoadedKey(storageKey)
    }, [storageKey])

    // حفظ المحادثة، بعد اكتمال الاسترجاع حتى لا تُستبدل بقائمة فارغة
    useEffect(() => {
        if (!storageKey || loadedKey !== storageKey) return
        try {
            sessionStorage.setItem(storageKey, JSON.stringify(messages.slice(-MAX_SAVED_MESSAGES)))
        } catch {
            // المحادثة تستمر حتى لو تعذر حفظها
        }
    }, [messages, storageKey, loadedKey])

    useEffect(() => {
        if (isChatOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, [messages, loading, isChatOpen])

    const sendDirectPrompt = async (promptText: string) => {
        if (!promptText.trim() || loading) return

        if (!isAiAllowed) {
            setMessages(prev => [...prev, { role: 'ai', text: 'ميزة فيكتور غير مفعلة في حسابك حاليًا.' }])
            return
        }

        // في النموذج: الرسائل الجاهزة فقط، وكل وحدة مرة وحدة
        if (isDemo) {
            const used = readDemoUsed()
            if (!Object.values(DEMO_AI_PROMPTS).includes(promptText as never) || used.includes(promptText)) return
            saveDemoUsed([...used, promptText])
        }
        // إذا فشل الرد ترجع الرسالة متاحة، حتى لا تضيع المحاولة الوحيدة
        const refundDemo = () => {
            if (isDemo) saveDemoUsed(readDemoUsed().filter((p) => p !== promptText))
        }

        const history = [...messages, { role: 'user' as const, text: promptText }]
        // النموذج يرسل الرسالة الجاهزة وحدها بدون المحادثة السابقة
        const sentHistory = isDemo ? history.slice(-1) : history
        setIsChatOpen(true)
        setMessages(history)
        setLoading(true)

        try {
            const { data: { session } } = await supabase.auth.getSession()

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
                },
                body: JSON.stringify({
                    courseId,
                    currentModule,
                    currentChapter,
                    currentQuestion,
                    currentIdea: ideaName,
                    ideaNotes,
                    messages: sentHistory.map(m => ({
                        role: m.role === 'ai' ? 'assistant' : 'user',
                        content: m.text
                    }))
                })
            })

            const data = await res.json()
            if (!data.reply) throw new Error('empty reply')
            if (!res.ok) refundDemo()
            setMessages(prev => [...prev, { role: 'ai', text: data.reply }])
        } catch {
            refundDemo()
            setMessages(prev => [...prev, { role: 'ai', text: 'تعذر الاتصال بفيكتور، تأكد من الإنترنت وحاول مرة ثانية.' }])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (initialPrompt && isAiAllowed) {
            sendDirectPrompt(initialPrompt)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialPrompt, isAiAllowed])

    function sendMessage() {
        if (!input.trim() || loading) return
        const userMsg = input.trim()
        setInput('')
        sendDirectPrompt(userMsg)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault()
            sendMessage()
        }
    }

    const greeting = isDemo
        ? 'أهلًا! أنا فيكتور 👋 هذي نسخة تجريبية: تقدر ترسل كل رسالة من الرسائل الجاهزة تحت مرة وحدة.'
        : currentQuestion
            ? 'أهلًا! أنا فيكتور، وشايف السؤال اللي قدامك. تبغى تلميح أو نحله خطوة خطوة؟'
            : `أهلًا! أنا فيكتور، معلمك في Math ${courseId}. اسألني عن أي شي في الدرس.`

    const quickActions = (!isAiAllowed
        ? []
        : [
            ...(ideaNotes ? [{ label: '📝 مختصر الفكرة', prompt: DEMO_AI_PROMPTS.summary }] : []),
            ...(currentQuestion
                ? [
                    { label: '💡 أعطني تلميح', prompt: DEMO_AI_PROMPTS.hint },
                    { label: '🪜 حله خطوة خطوة', prompt: DEMO_AI_PROMPTS.steps },
                ]
                : []),
        ]).filter((action) => !isDemo || !demoUsed.includes(action.prompt))
    const demoAllUsed = isDemo && Object.values(DEMO_AI_PROMPTS).every((p) => demoUsed.includes(p))

    const bubbleStyle = (isAi: boolean): React.CSSProperties => ({
        margin: '8px 0',
        padding: '10px 12px',
        borderRadius: '10px',
        background: isAi ? '#ffffff' : '#FEECD0',
        border: '1px solid #e6dec5',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#2C3531',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        overflowWrap: 'anywhere'
    })

    const chatBox = (
        <div
            style={{
                position: mode === 'floating' ? 'fixed' : 'relative',
                bottom: mode === 'floating' ? '85px' : 'auto',
                left: mode === 'floating' ? '24px' : 'auto',
                width: mode === 'floating' ? '400px' : '100%',
                maxWidth: mode === 'floating' ? 'calc(100vw - 48px)' : '100%',
                // الارتفاع يتبع الشاشة حتى لا ينقص الشات في الشاشات القصيرة
                height: mode === 'floating' ? 'min(520px, calc(100dvh - 110px))' : '420px',
                zIndex: mode === 'floating' ? 9998 : 'auto',
                boxShadow:
                    mode === 'floating'
                        ? '0 12px 30px rgba(0,0,0,0.2)'
                        : '0 2px 8px rgba(0,0,0,0.06)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFF9E2',
                border: '1px solid #e6dec5'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    background: '#8c5521',
                    color: '#fff'
                }}
            >
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>🤖 فيكتور</div>
                    {(currentChapter || ideaName) && (
                        <div style={{ fontSize: '11px', color: '#fbdfb4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {currentChapter && `Chapter ${currentChapter}`}
                            {currentChapter && ideaName ? ' · ' : ''}
                            {ideaName}
                        </div>
                    )}
                </div>

                {mode === 'floating' && (
                    <button
                        type="button"
                        aria-label="إغلاق الشات"
                        onClick={() => setIsChatOpen(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            flexShrink: 0
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>

            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    padding: '6px 12px',
                    backgroundColor: '#FFF9E2',
                    backgroundImage: `
                        linear-gradient(to right, #efe6cf 1px, transparent 1px),
                        linear-gradient(to bottom, #efe6cf 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                }}
            >
                {!isAiAllowed && (
                    <div
                        style={{
                            margin: '8px 0',
                            padding: '12px',
                            borderRadius: '8px',
                            background: '#FEE2E2',
                            border: '1px solid #FCA5A5',
                            fontSize: '14px',
                            color: '#991B1B',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            lineHeight: '1.5'
                        }}
                    >
                        ميزة فيكتور غير مفعلة في حسابك حاليًا.
                    </div>
                )}

                <div style={bubbleStyle(true)}>{greeting}</div>

                {messages.map((msg, i) => (
                    <div key={i} style={bubbleStyle(msg.role === 'ai')}>
                        {msg.role === 'ai' ? <MessageBody text={msg.text} /> : <div dir="auto" style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>}
                    </div>
                ))}

                {loading && (
                    <div
                        style={{
                            fontSize: '13px',
                            color: '#4A5550',
                            padding: '8px',
                            background: 'rgba(255,255,255,0.8)',
                            borderRadius: '6px',
                            display: 'inline-block'
                        }}
                    >
                        فيكتور يفكر... ⏳
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {quickActions.length > 0 && !loading && (
                <div style={{ display: 'flex', gap: '6px', padding: '8px 10px 0', backgroundColor: '#ffffff', borderTop: '1px solid #e6dec5', flexWrap: 'wrap' }}>
                    {quickActions.map((action) => (
                        <button
                            key={action.label}
                            type="button"
                            onClick={() => sendDirectPrompt(action.prompt)}
                            style={{
                                background: '#FEECD0',
                                color: '#8c5521',
                                border: '1px solid #e6d5b4',
                                borderRadius: '999px',
                                padding: '5px 12px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}

            {isDemo ? (
                <div
                    style={{
                        padding: '10px 12px',
                        borderTop: quickActions.length > 0 && !loading ? 'none' : '1px solid #e6dec5',
                        backgroundColor: '#ffffff',
                        color: '#8c5521',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        lineHeight: 1.6,
                        textAlign: 'center'
                    }}
                >
                    {demoAllUsed ? 'خلصت رسائل التجربة. ' : ''}
                    في الكورس الفعلي تقدر تسأل فيكتور اللي تبي وتكتب سؤالك بنفسك ✨
                </div>
            ) : (
            <div
                style={{
                    padding: '10px',
                    display: 'flex',
                    gap: '8px',
                    borderTop: quickActions.length > 0 && !loading ? 'none' : '1px solid #e6dec5',
                    backgroundColor: '#ffffff'
                }}
            >
                <input
                    type="text"
                    dir="auto"
                    maxLength={1500}
                    placeholder={isAiAllowed ? 'اكتب سؤالك لفيكتور...' : 'المحادثة غير مفعلة...'}
                    aria-label="رسالة إلى فيكتور"
                    value={input}
                    disabled={!isAiAllowed}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        flex: 1,
                        minWidth: 0,
                        padding: '8px',
                        border: '1px solid #e6dec5',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: isAiAllowed ? '#FFF9E2' : '#f3f4f6',
                        color: '#2C3531',
                        cursor: isAiAllowed ? 'text' : 'not-allowed'
                    }}
                />

                <button
                    type="button"
                    onClick={sendMessage}
                    disabled={loading || !isAiAllowed}
                    style={{
                        backgroundColor: isAiAllowed && !loading ? '#8c5521' : '#9ca3af',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: isAiAllowed && !loading ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold'
                    }}
                >
                    إرسال
                </button>
            </div>
            )}
        </div>
    )

    if (mode === 'inline') {
        return chatBox
    }

    return (
        // كل الشات داخل هذا العنصر، والضغط خارجه يقفل الشات
        <div ref={floatingRef}>
            <div
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '24px',
                    zIndex: 9999
                }}
            >
                <button
                    type="button"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    style={{
                        backgroundColor: '#DCA27B',
                        color: '#ffffff',
                        border: '0',
                        borderRadius: '50px',
                        padding: '12px 24px',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <span>{isChatOpen ? '✕' : '🤖'}</span>
                    <span>
                        {isChatOpen
                            ? 'إغلاق الشات'
                            : 'فيكتور (المعلم الذكي)'}
                    </span>
                </button>
            </div>

            {isChatOpen && chatBox}
        </div>
    )
}

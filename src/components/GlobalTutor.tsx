'use client'

import { useState, useRef, useEffect } from 'react'

interface GlobalTutorProps {
    courseId?: string | number
    currentModule?: number
    currentChapter?: string
    currentQuestion?: string
    initialPrompt?: string | null
    isAiAllowed?: boolean
    mode?: 'floating' | 'inline'
}

export default function GlobalTutor({
                                        courseId = '101',
                                        currentModule = 1,
                                        currentChapter = '1.5',
                                        currentQuestion = '',
                                        initialPrompt = null,
                                        isAiAllowed = true,
                                        mode = 'floating'
                                    }: GlobalTutorProps) {
    const [isChatOpen, setIsChatOpen] = useState(mode === 'inline')

    const [messages, setMessages] = useState([
        {
            role: 'ai',
            text: `أهلاً بك! أنا فيكتور (Vector)، معلمك الذكي لمقرر الرياضيات (Math ${courseId}). نحن الآن في الشابتر (${currentChapter})${currentQuestion ? ` الفكرة: (${currentQuestion})` : ''}. كيف أقدر أساعدك اليوم؟`
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (mode === 'inline') {
            setIsChatOpen(true)
        }
    }, [mode])

    useEffect(() => {
        if (isChatOpen) {
            scrollToBottom()
        }
    }, [messages, loading, isChatOpen])

    const sendDirectPrompt = async (promptText: string) => {
        if (!promptText.trim() || loading) return

        if (!isAiAllowed) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'ai',
                    text: '⚠️ عذراً، خدمة الذكاء الاصطناعي غير مسموحة أو غير مفعلة في حسابك حالياً.'
                }
            ])
            return
        }

        setIsChatOpen(true)
        setMessages(prev => [...prev, { role: 'user', text: promptText }])
        setLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId,
                    currentModule,
                    currentChapter,
                    currentQuestion,
                    messages: [
                        ...messages.map(m => ({
                            role: m.role === 'ai' ? 'assistant' : 'user',
                            content: m.text
                        })),
                        { role: 'user', content: promptText }
                    ]
                })
            })

            const data = await res.json()

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'ai', text: data.reply }])
            } else {
                throw new Error()
            }
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'ai',
                    text: 'عذراً، حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي. تأكد من إعداد المفتاح في .env.local'
                }
            ])
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

    async function sendMessage() {
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

    const chatBox = (
        <div
            style={{
                position: mode === 'floating' ? 'fixed' : 'relative',
                bottom: mode === 'floating' ? '85px' : 'auto',
                left: mode === 'floating' ? '24px' : 'auto',
                width: mode === 'floating' ? '380px' : '100%',
                maxWidth: mode === 'floating' ? 'calc(100vw - 48px)' : '100%',
                height: mode === 'floating' ? '480px' : '420px',
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
                border: '1px solid #e6dec5',
                fontFamily: 'sans-serif'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#DCA27B',
                    color: '#fff'
                }}
            >
                <span style={{ fontWeight: 'bold' }}>
                    🤖 فيكتور - Vector (Math {courseId} - Ch {currentChapter})
                </span>

                {mode === 'floating' && (
                    <button
                        type="button"
                        onClick={() => setIsChatOpen(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>

            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '12px',
                    whiteSpace: 'pre-line',
                    backgroundColor: '#FFF9E2',
                    backgroundImage: `
                        linear-gradient(to right, #e8dfc5 1px, transparent 1px),
                        linear-gradient(to bottom, #e8dfc5 1px, transparent 1px)
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
                        ⚠️ عذراً، ميزة المعلم الذكي غير مفعلة لديك حالياً.
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        style={{
                            margin: '8px 0',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            background: msg.role === 'ai' ? '#ffffff' : '#FEECD0',
                            border: '1px solid #e6dec5',
                            fontSize: '14px',
                            lineHeight: '1.4',
                            color: '#2C3531',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                    >
                        {msg.text}
                    </div>
                ))}

                {loading && (
                    <div
                        style={{
                            fontSize: '13px',
                            color: '#4A5550',
                            padding: '8px',
                            background: 'rgba(255,255,255,0.7)',
                            borderRadius: '6px',
                            display: 'inline-block'
                        }}
                    >
                        فيكتور جاري التفكير وتحليل السؤال... ⏳
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div
                style={{
                    padding: '10px',
                    display: 'flex',
                    gap: '8px',
                    borderTop: '1px solid #e6dec5',
                    backgroundColor: '#ffffff'
                }}
            >
                <input
                    type="text"
                    placeholder={
                        isAiAllowed
                            ? 'اسأل فيكتور عن هذا السؤال...'
                            : 'المحادثة غير مفعلة...'
                    }
                    value={input}
                    disabled={loading || !isAiAllowed}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        flex: 1,
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
                        backgroundColor: isAiAllowed ? '#DCA27B' : '#9ca3af',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: isAiAllowed ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold'
                    }}
                >
                    إرسال
                </button>
            </div>
        </div>
    )

    if (mode === 'inline') {
        return chatBox
    }

    return (
        <>
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
                        border: 'none',
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
        </>
    )
}
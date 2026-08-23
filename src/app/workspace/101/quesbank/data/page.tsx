'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

// عرض رياضيات واضح باستخدام MathML المدمج في المتصفح
// يدعم النهايات، الكسور، الجذور، الأسس، وإشارات +∞ / -∞ المستخدمة في أسئلة Module-1.
function MathFraction({ numerator, denominator }: { numerator: React.ReactNode, denominator: React.ReactNode }) {
    return (
        <math display="inline" style={{ fontSize: '1.25rem', direction: 'ltr' }}>
            <mfrac>
                <mrow>{numerator}</mrow>
                <mrow>{denominator}</mrow>
            </mfrac>
        </math>
    )
}

function renderMathContent(mathKey: string) {
    if (!mathKey) return null

    const wrap = (content: React.ReactNode) => (
        <div style={{
            direction: 'ltr',
            textAlign: 'center',
            padding: '8px 6px',
            color: '#2C3531',
            fontSize: '18px',
            lineHeight: 1.9,
            overflowX: 'auto'
        }}>
            {content}
        </div>
    )

    switch (mathKey) {
        case 'ex1':
            return wrap(
                <math display="block" style={{ fontSize: '1.35rem' }}>
                    <munder><mo>lim</mo><mrow><mi>t</mi><mo>→</mo><mn>0</mn></mrow></munder>
                    <mfrac>
                        <mrow>
                            <msqrt><mrow><msup><mi>t</mi><mn>2</mn></msup><mo>+</mo><mn>9</mn></mrow></msqrt>
                            <mo>−</mo><mn>3</mn>
                        </mrow>
                        <msup><mi>t</mi><mn>2</mn></msup>
                    </mfrac>
                </math>
            )

        case 'q20':
            return wrap(
                <>
                    <math display="block" style={{ fontSize: '1.35rem' }}>
                        <munder><mo>lim</mo><mrow><mi>x</mi><mo>→</mo><mo>−</mo><mn>3</mn></mrow></munder>
                        <mfrac>
                            <mrow><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>3</mn><mi>x</mi></mrow>
                            <mrow><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>9</mn></mrow>
                        </mfrac>
                    </math>
                    <div style={{ marginTop: '10px', fontSize: '14px', lineHeight: 1.8 }}>
                        x = -2.5, -2.9, -2.95, -2.99, -2.999, -2.9999,<br />
                        -3.5, -3.1, -3.05, -3.01, -3.001, -3.0001
                    </div>
                </>
            )

        case 'q4':
            return wrap(
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', textAlign: 'left' }}>
                    <div>a. lim x→2⁻ f(x)</div>
                    <div>b. lim x→2⁺ f(x)</div>
                    <div>c. lim x→2 f(x)</div>
                    <div>d. f(2)</div>
                    <div>e. lim x→4 f(x)</div>
                    <div>f. f(4)</div>
                </div>
            )

        case 'q27':
            return wrap(
                <math display="block" style={{ fontSize: '1.35rem' }}>
                    <munder><mo>lim</mo><mrow><mi>x</mi><mo>→</mo><msup><mn>5</mn><mo>+</mo></msup></mrow></munder>
                    <mfrac><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mrow><mi>x</mi><mo>−</mo><mn>5</mn></mrow></mfrac>
                </math>
            )

        case 'q31':
            return wrap(
                <math display="block" style={{ fontSize: '1.35rem' }}>
                    <munder><mo>lim</mo><mrow><mi>x</mi><mo>→</mo><msup><mrow><mo>−</mo><mn>2</mn></mrow><mo>+</mo></msup></mrow></munder>
                    <mfrac>
                        <mrow><mi>x</mi><mo>−</mo><mn>1</mn></mrow>
                        <mrow><msup><mi>x</mi><mn>2</mn></msup><mo>(</mo><mi>x</mi><mo>+</mo><mn>2</mn><mo>)</mo></mrow>
                    </mfrac>
                </math>
            )

        case 'q33':
            return wrap(
                <math display="block" style={{ fontSize: '1.35rem' }}>
                    <munder>
                        <mo>lim</mo>
                        <mrow><mi>x</mi><mo>→</mo><msup><mrow><mi>π</mi><mo>/</mo><mn>2</mn></mrow><mo>+</mo></msup></mrow>
                    </munder>
                    <mfrac><mn>1</mn><mi>x</mi></mfrac>
                    <mo>sec</mo><mi>x</mi>
                </math>
            )

        case 'q38':
            return wrap(
                <math display="block" style={{ fontSize: '1.35rem' }}>
                    <mi>y</mi><mo>=</mo>
                    <mfrac>
                        <mrow><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><mn>1</mn></mrow>
                        <mrow><mn>3</mn><mi>x</mi><mo>−</mo><mn>2</mn><msup><mi>x</mi><mn>2</mn></msup></mrow>
                    </mfrac>
                </math>
            )

        default:
            return wrap(mathKey)
    }
}

export default function QuestionBank101Page() {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [selectedChapter, setSelectedChapter] = useState<string>('all')

    useEffect(() => {
        async function checkAuth() {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                // استخدام مفتاح التحقق الخاص بكورس 101
                const cachedStatus = localStorage.getItem(`course_approved_${session.user.id}_101`)
                setIsAuthorized(cachedStatus === 'true')
            }
            setLoading(false)
        }
        checkAuth()
    }, [])

    // ضع ملف القراف module1-q4-graph.png داخل: public/questions/
    // أسئلة Module-1 الجديدة فقط — مرتبة حسب أفكار Chapter 1.5
    const questionsData = [
        {
            id: 1,
            chapter: '1.5',
            level: 'سهل',
            questionName: 'Example 1 (فهم مفهوم النهاية وإيجادها عددياً)',
            question: 'Estimate the value of',
            math: 'ex1',
            ideaLink: '/workspace/101/3',
            answer: ''
        },
        {
            id: 2,
            chapter: '1.5',
            level: 'متوسط',
            questionName: 'Q-20 (فهم مفهوم النهاية وإيجادها عددياً)',
            question: 'Guess the value of the limit (if it exists) by evaluating the function at the given numbers (correct to six decimal places).',
            math: 'q20',
            ideaLink: '/workspace/101/3',
            answer: ''
        },
        {
            id: 3,
            chapter: '1.5',
            level: 'متوسط',
            questionName: 'Q-4 (النهايات من اليمين واليسار وتحديد وجود النهاية)',
            question: 'Use the given graph of f to state the value of each quantity, if it exists. If it does not exist, explain why.',
            math: 'q4',
            image: '/questions/module1-q4-graph.png',
            ideaLink: '/workspace/101/3',
            answer: ''
        },
        {
            id: 4,
            chapter: '1.5',
            level: 'متوسط',
            questionName: 'Q-27 (النهايات من اليمين واليسار وتحديد وجود النهاية)',
            question: 'Determine the infinite limit.',
            math: 'q27',
            ideaLink: '/workspace/101/3',
            answer: ''
        },
        {
            id: 5,
            chapter: '1.5',
            level: 'متوسط',
            questionName: 'Q-31 (النهايات من اليمين واليسار وتحديد وجود النهاية)',
            question: 'Determine the infinite limit.',
            math: 'q31',
            ideaLink: '/workspace/101/3',
            answer: ''
        },
        {
            id: 6,
            chapter: '1.5',
            level: 'متوسط',
            questionName: 'Q-33 (النهايات من اليمين واليسار وتحديد وجود النهاية)',
            question: 'Determine the infinite limit.',
            math: 'q33',
            ideaLink: '/workspace/101/3',
            answer: ''
        },
        {
            id: 7,
            chapter: '1.5',
            level: 'متوسط',
            questionName: 'Q-38 (النهايات من اليمين واليسار وتحديد وجود النهاية)',
            question: '(a) Find the vertical asymptotes of the function using limits.',
            math: 'q38',
            ideaLink: '/workspace/101/3',
            answer: ''
        }
    ]

    const filteredQuestions = selectedChapter === 'all'
        ? questionsData
        : questionsData.filter(q => q.chapter === selectedChapter)

    if (loading) {
        return <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>جاري التحميل... ⏳</div>
    }

    if (!isAuthorized) {
        return (
            <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', color: '#2C3531', fontFamily: 'sans-serif' }}>
                <Navbar isLoggedIn={true} />
                <div style={{ maxWidth: '600px', margin: '80px auto', padding: '30px', background: '#ffffff', borderRadius: '16px', textAlign: 'center', border: '1px solid #e6dec5' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
                    <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>هذا القسم مقفل</h2>
                    <p style={{ color: '#4A5550', marginBottom: '20px' }}>بنك الأسئلة الشامل لمقرر Math 101 يتطلب اعتماد الكورس للوصول إليه.</p>
                    <Link href="/workspace/101" style={{ background: '#DCA27B', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                        العودة لصفحة الكورس ➔
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', color: '#2C3531', fontFamily: 'sans-serif', paddingBottom: '60px' }}>
            <Navbar isLoggedIn={true} />
            <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                        <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '6px' }}>❓ بنك الأسئلة الشامل - Math 101</h1>
                        <p style={{ color: '#4A5550', fontSize: '14px' }}>تدرب على أسئلة التفاضل والتكامل النموذجية مصنفة بأسماء واضحة ومرتبطة بأفكار المودل.</p>
                    </div>
                    <Link href="/workspace/101" style={{ textDecoration: 'none', background: '#CDD4B1', color: '#2C3531', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                        ← عودة للكورس
                    </Link>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {['all', '1.5'].map((ch) => (
                        <button
                            key={ch}
                            onClick={() => setSelectedChapter(ch)}
                            style={{
                                background: selectedChapter === ch ? '#DCA27B' : '#ffffff',
                                color: selectedChapter === ch ? '#ffffff' : '#2C3531',
                                border: '1px solid #e6dec5',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '13px'
                            }}
                        >
                            {ch === 'all' ? 'جميع الشباتر' : `Ch ${ch}`}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {filteredQuestions.map((q) => (
                        <div key={q.id} style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ background: '#FEECD0', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{q.chapter}</span>
                                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#2C3531' }}>{q.questionName}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ background: q.level === 'صعب' ? '#fee2e2' : q.level === 'متوسط' ? '#fef08a' : '#CDD4B1', color: '#2C3531', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{q.level}</span>
                                    {q.ideaLink && (
                                        <Link href={q.ideaLink} style={{ background: '#CDD4B1', color: '#2C3531', textDecoration: 'none', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                            ربط بالفكرة ➔
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <p style={{ fontSize: '14px', marginBottom: '8px', color: '#4A5550' }}>{q.question}</p>

                            {q.math && (
                                <div style={{ background: '#fdfbf7', padding: '12px', borderRadius: '8px', border: '1px dashed #e6dec5', marginBottom: '12px' }}>
                                    {renderMathContent(q.math)}
                                </div>
                            )}

                            {q.image && (
                                <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #e6dec5', marginBottom: '12px', textAlign: 'center' }}>
                                    <img
                                        src={q.image}
                                        alt="Question graph"
                                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '6px' }}
                                    />
                                </div>
                            )}

                            <details style={{ background: '#FFF9E2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e6dec5', cursor: 'pointer' }}>
                                <summary style={{ fontWeight: 'bold', fontSize: '14px', color: '#DCA27B' }}>عرض الإجابة النموذجية 💡</summary>
                                <div style={{ marginTop: '8px' }}>
                                    {renderMathContent(q.answer)}
                                </div>
                            </details>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
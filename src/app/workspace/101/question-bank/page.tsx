'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import type { QuizDataQuestion } from '@/app/workspace/101/exam-leaks/QuizEngine'

const math101Module1Questions: QuizDataQuestion[] = []

type FractionProps = {
    numerator: React.ReactNode
    denominator: React.ReactNode
}

function Fraction({ numerator, denominator }: FractionProps) {
    return (
        <span style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            verticalAlign: 'middle',
            margin: '0 6px',
            lineHeight: 1.25,
            minWidth: '42px'
        }}>
            <span style={{ padding: '0 6px 4px', borderBottom: '1.6px solid #2C3531' }}>
                {numerator}
            </span>
            <span style={{ padding: '4px 6px 0' }}>
                {denominator}
            </span>
        </span>
    )
}

function Limit({ variable, to }: { variable: string, to: React.ReactNode }) {
    return (
        <span style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            verticalAlign: 'middle',
            marginRight: '8px',
            lineHeight: 1
        }}>
            <span style={{ fontSize: '21px' }}>lim</span>
            <span style={{ fontSize: '11px', marginTop: '3px', whiteSpace: 'nowrap' }}>
                {variable} → {to}
            </span>
        </span>
    )
}

function SquareRoot({ children }: { children: React.ReactNode }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'flex-start', verticalAlign: 'middle' }}>
            <span style={{ fontSize: '27px', lineHeight: 1, transform: 'translateY(1px)' }}>√</span>
            <span style={{
                borderTop: '1.6px solid #2C3531',
                padding: '2px 3px 0 2px',
                marginLeft: '-2px',
                lineHeight: 1.2
            }}>
                {children}
            </span>
        </span>
    )
}

function MathLine({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            direction: 'ltr',
            textAlign: 'center',
            color: '#2C3531',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '19px',
            lineHeight: 1.8,
            padding: '8px 6px',
            overflowX: 'auto'
        }}>
            {children}
        </div>
    )
}

function Cases({ rows }: { rows: React.ReactNode[] }) {
    return (
        <span style={{display:'inline-flex',alignItems:'center',verticalAlign:'middle'}}>
            <span style={{fontSize:'50px',lineHeight:.8,marginRight:'6px'}}>{'{'}</span>
            <span style={{display:'inline-flex',flexDirection:'column',alignItems:'flex-start',gap:'4px'}}>
                {rows.map((r,i)=><span key={i}>{r}</span>)}
            </span>
        </span>
    )
}

function renderMathContent(k: string) {
    if (!k) return null
    const ML = ({children}:{children:React.ReactNode}) => <MathLine>{children}</MathLine>
    switch(k) {
        case 'm15ex1': return <ML><Limit variable="t" to="0"/><Fraction numerator={<><SquareRoot>t² + 9</SquareRoot> − 3</>} denominator="t²"/></ML>
        case 'm15q20': return <><ML><Limit variable="x" to="−3"/><Fraction numerator="x² − 3x" denominator="x² − 9"/></ML><div style={{direction:'ltr',textAlign:'center'}}>x = −2.5, −2.9, −2.95, −2.99, −2.999, −2.9999, −3.5, −3.1, −3.05, −3.01, −3.001, −3.0001</div></>
        case 'm15q4': return <ML>a. lim x→2⁻ f(x)　 b. lim x→2⁺ f(x)　 c. lim x→2 f(x)　 d. f(2)　 e. lim x→4 f(x)　 f. f(4)</ML>
        case 'm15q27': return <ML><Limit variable="x" to={<>5<sup>+</sup></>}/><Fraction numerator="x + 1" denominator="x − 5"/></ML>
        case 'm15q31': return <ML><Limit variable="x" to={<>−2<sup>+</sup></>}/><Fraction numerator="x − 1" denominator={<>x²(x + 2)</>}/></ML>
        case 'm15q33': return <ML><Limit variable="x" to={<>(π/2)<sup>+</sup></>}/><Fraction numerator="1" denominator="x"/> sec x</ML>
        case 'm15q38': return <ML>y = <Fraction numerator="x² + 1" denominator="3x − 2x²"/></ML>
        case 'm16ex2a': return <ML><Limit variable="x" to="5"/>(2x² − 3x + 4)</ML>
        case 'm16ex2b': return <ML><Limit variable="x" to="−2"/><Fraction numerator="x³ + 2x² − 1" denominator="5 − 3x"/></ML>
        case 'm16ex4': return <ML><Limit variable="x" to="1"/>g(x),　g(x)=<Cases rows={[<>x + 1　if x ≠ 1</>,<>π　if x = 1</>]}/></ML>
        case 'm16ex9': return <ML>f(x)=<Cases rows={[<><SquareRoot>x − 4</SquareRoot>　if x &gt; 4</>,<>8 − 2x　if x &lt; 4</>]}/>　; lim x→4 f(x)</ML>
        case 'm16q61': return <ML>If <Limit variable="x" to="1"/><Fraction numerator="f(x) − 8" denominator="x − 1"/> = 10, find lim x→1 f(x).</ML>
        case 'm16ex6': return <ML><Limit variable="t" to="0"/><Fraction numerator={<><SquareRoot>t² + 9</SquareRoot> − 3</>} denominator="t²"/></ML>
        case 'm16q23': return <ML><Limit variable="h" to="0"/><Fraction numerator={<><SquareRoot>9 + h</SquareRoot> − 3</>} denominator="h"/></ML>
        case 'm16q27': return <ML><Limit variable="t" to="0"/><Fraction numerator={<><SquareRoot>1 + t</SquareRoot> − <SquareRoot>1 − t</SquareRoot></>} denominator="t"/></ML>
        case 'm16q66': return <ML><Limit variable="x" to="2"/><Fraction numerator={<><SquareRoot>6 − x</SquareRoot> − 2</>} denominator={<><SquareRoot>3 − x</SquareRoot> − 1</>}/></ML>
        case 'm21ex1': return <ML>m = <Limit variable="x" to="a"/><Fraction numerator="f(x) − f(a)" denominator="x − a"/>　; y = x², P(1,1)</ML>
        case 'm21ex2': return <ML>m = <Limit variable="x" to="a"/><Fraction numerator="f(x) − f(a)" denominator="x − a"/>　; y = <Fraction numerator="3" denominator="x"/>, (3,1)</ML>
        case 'm18q13': return <ML>f(x)=3x²+(x+2)⁵,　a=−1</ML>
        case 'm18q15': return <ML>p(v)=2<SquareRoot>3v²+1</SquareRoot>,　a=1</ML>
        case 'm18q49': return <ML>g(2)=6,　<Limit variable="x" to="2"/>[3f(x)+f(x)g(x)]=36. Find f(2).</ML>
        case 'm18ex2a': return <ML>f(x)=<Fraction numerator="x² − x − 2" denominator="x − 2"/></ML>
        case 'm18ex2c': return <ML>f(x)=<Cases rows={[<><Fraction numerator="1" denominator="x²"/>　if x ≠ 0</>,<>1　if x = 0</>]}/></ML>
        case 'm18ex6a': return <ML>f(x)=x¹⁰⁰−2x³⁷+75</ML>
        case 'm18ex6b': return <ML>g(x)=<Fraction numerator="x²+2x+17" denominator="x²−1"/></ML>
        case 'm18ex8b': return <ML>F(x)=<Fraction numerator="1" denominator={<><SquareRoot>x²+7</SquareRoot>−4</>}/></ML>
        case 'm18q19': return <ML>f(x)=<Fraction numerator="1" denominator="x+2"/>,　a=−2</ML>
        case 'm18q23': return <ML>f(x)=<Cases rows={[<>cos x　if x &lt; 0</>,<>0　if x = 0</>,<>1−x²　if x &gt; 0</>]}/>,　a=0</ML>
        case 'm34ex2a': return <ML><Limit variable="x" to="∞"/><Fraction numerator="1" denominator="x"/></ML>
        case 'm34ex2b': return <ML><Limit variable="x" to="−∞"/><Fraction numerator="1" denominator="x"/></ML>
        case 'm34ex3': return <ML><Limit variable="x" to="∞"/><Fraction numerator="3x²−x−2" denominator="5x²+4x+1"/></ML>
        case 'm34ex5': return <ML><Limit variable="x" to="∞"/>(<SquareRoot>x²+1</SquareRoot>−x)</ML>
        case 'm34ex10': return <ML><Limit variable="x" to="∞"/><Fraction numerator="x²+x" denominator="3−x"/></ML>
        case 'm34q21': return <ML><Limit variable="x" to="−∞"/><Fraction numerator="2x⁵−x" denominator="x⁴+3"/></ML>
        case 'm34q23': return <ML><Limit variable="x" to="∞"/>cos x</ML>
        case 'm34ex4': return <ML>f(x)=<Fraction numerator={<SquareRoot>2x²+1</SquareRoot>} denominator="3x−5"/></ML>
        default: return <ML>{k}</ML>
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
    const questionsData = math101Module1Questions

    const filteredQuestions = selectedChapter === 'all'
    ? questionsData
    : questionsData.filter(
        (q: QuizDataQuestion) =>
            q.chapter === selectedChapter
    )

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
                    {['all', '1.5', '1.6', '2.1', '1.8', '3.4'].map((ch) => (
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
                    {filteredQuestions.map((q: QuizDataQuestion) => (
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
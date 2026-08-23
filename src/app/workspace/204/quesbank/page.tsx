'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

// دالة مساعدة لتحويل أكواد LaTeX الرياضية البسيطة إلى عناصر مرئية ومنسقة بوضوح
function renderMathContent(mathStr: string) {
    if (!mathStr) return null;

    // معالجة المصفوفات bmatrix
    if (mathStr.includes('\\begin{bmatrix}')) {
        const matrixContent = mathStr
            .replace(/\\begin\{bmatrix\}/g, '')
            .replace(/\\end\{bmatrix\}/g, '')
            .trim();

        const rows = matrixContent.split('\\\\').map(row =>
            row.split('&').map(cell => cell.trim())
        );

        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', direction: 'ltr' }}>
                <span style={{ fontSize: '24px', borderLeft: '2px solid #2C3531', borderTop: '2px solid #2C3531', borderBottom: '2px solid #2C3531', width: '8px', height: `${rows.length * 28}px`, borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px', marginRight: '4px' }}></span>
                <table style={{ borderCollapse: 'collapse', margin: '0 6px' }}>
                    <tbody>
                    {rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                                <td key={cIdx} style={{ padding: '4px 10px', textAlign: 'center', fontFamily: 'monospace', fontSize: '15px', color: '#2C3531' }}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <span style={{ fontSize: '24px', borderRight: '2px solid #2C3531', borderTop: '2px solid #2C3531', borderBottom: '2px solid #2C3531', width: '8px', height: `${rows.length * 28}px`, borderTopRightRadius: '4px', borderBottomRightRadius: '4px', marginLeft: '4px' }}></span>
            </div>
        );
    }

    // معالجة المصفوفات الموسعة array أو الشرطية cases
    if (mathStr.includes('\\begin{cases}') || mathStr.includes('\\begin{array}')) {
        const content = mathStr
            .replace(/\\begin\{(cases|array)\}(\[.*?\])?(\{.*?\})?/g, '')
            .replace(/\\end\{(cases|array)\}/g, '')
            .trim();

        const rows = content.split('\\\\').map(row => row.split('&').map(cell => cell.trim()));

        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', direction: 'ltr' }}>
                <span style={{ fontSize: '30px', borderLeft: '2px solid #2C3531', borderTop: '2px solid #2C3531', borderBottom: '2px solid #2C3531', width: '8px', height: `${rows.length * 28}px`, borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px', marginRight: '6px' }}></span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {rows.map((row, rIdx) => (
                        <div key={rIdx} style={{ fontFamily: 'monospace', fontSize: '15px', textAlign: 'left', color: '#2C3531' }}>
                            {row.join('  ')}
                        </div>
                    ))}
                </div>
                <span style={{ fontSize: '30px', borderRight: '2px solid #2C3531', borderTop: '2px solid #2C3531', borderBottom: '2px solid #2C3531', width: '8px', height: `${rows.length * 28}px`, borderTopRightRadius: '4px', borderBottomRightRadius: '4px', marginLeft: '6px' }}></span>
            </div>
        );
    }

    // المعادلات العادية
    return (
        <div style={{ fontFamily: 'monospace', fontSize: '15px', direction: 'ltr', textAlign: 'center', padding: '6px', color: '#2C3531', whiteSpace: 'pre-wrap' }}>
            {mathStr}
        </div>
    );
}

export default function QuestionBankPage() {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [selectedChapter, setSelectedChapter] = useState<string>('all')

    useEffect(() => {
        async function checkAuth() {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                const cachedStatus = localStorage.getItem(`course_approved_${session.user.id}_204`)
                setIsAuthorized(cachedStatus === 'true')
            }
            setLoading(false)
        }
        checkAuth()
    }, [])

    const questionsData = [
        {
            id: 1,
            chapter: 'Ch 7',
            level: 'سهل',
            question: 'Find the general solution of the differential equation',
            math: String.raw`y''-7y'+12y=0`,
            answer: ''
        },
        {
            id: 2,
            chapter: 'Ch 7',
            level: 'سهل',
            question: 'Find the characteristic equation',
            math: String.raw`y''-8y'+16y=0`,
            answer: ''
        },
        {
            id: 3,
            chapter: 'Ch 7',
            level: 'متوسط',
            question: 'Find the general solution of the differential equation',
            math: String.raw`y''-6y'+13y=0`,
            answer: ''
        },
        {
            id: 4,
            chapter: 'Ch 7',
            level: 'سهل',
            question: 'Find the integrating factor of',
            math: String.raw`\frac{dy}{dx}+P(x)y=Q(x)`,
            answer: ''
        },
        {
            id: 5,
            chapter: 'Ch 6',
            level: 'متوسط',
            question: 'Find the eigenvalues of the matrix',
            math: String.raw`A=\begin{bmatrix} 2 & 6 & 3\\ 1 & -4 & 1\\ 0 & 0 & -1 \end{bmatrix}`,
            answer: ''
        },
        {
            id: 6,
            chapter: 'Ch 2',
            level: 'صعب',
            question: 'Find adj(A) and A^{-1}',
            math: String.raw`A=\begin{bmatrix} -3 & -2 & 2\\ 4 & 5 & -3\\ 1 & 5 & -2 \end{bmatrix}`,
            answer: ''
        },
        {
            id: 7,
            chapter: 'Ch 1',
            level: 'متوسط',
            question: 'Find the echelon form of the augmented matrix and solve the system',
            math: String.raw`\begin{cases} x_1+2x_2+x_3=4\\ 3x_1+8x_2+7x_3=20\\ 2x_1+7x_2+9x_3=23 \end{cases}`,
            answer: ''
        },
        {
            id: 8,
            chapter: 'Ch 4',
            level: 'متوسط',
            question: 'Determine whether W is a subspace of R^4',
            math: String.raw`W=\{(x_1,x_2,x_3,x_4)\in R^4: x_1x_3=0\}`,
            answer: ''
        },
        {
            id: 9,
            chapter: 'Ch 4',
            level: 'متوسط',
            question: 'Find a basis for the solution space of the homogeneous system',
            math: String.raw`\left[\begin{array}{ccc|c} 1 & -2 & 3 & 0\\ 0 & 1 & -7 & 0 \end{array}\right]`,
            answer: ''
        },
        {
            id: 10,
            chapter: 'Ch 6',
            level: 'صعب',
            question: 'Find the eigenvalues and the associated eigenvectors',
            math: String.raw`A=\begin{bmatrix} 5 & 6\\ 3 & -4 \end{bmatrix}`,
            answer: ''
        },
        {
            id: 11,
            chapter: 'Ch 7',
            level: 'صعب',
            question: 'Solve the differential equation',
            math: String.raw`y\,dx=(5x-y^2)\,dy`,
            answer: ''
        },
        {
            id: 12,
            chapter: 'Ch 7',
            level: 'صعب',
            question: 'Solve using substitution',
            math: String.raw`\frac{dy}{dx}=(4x+y)^2`,
            answer: ''
        },
        {
            id: 13,
            chapter: 'Ch 7',
            level: 'متوسط',
            question: 'Solve the initial value problem',
            math: String.raw`\frac{dy}{dx}+\frac{1}{3}y=e^{-x/3},\qquad y(0)=1`,
            answer: ''
        },
        {
            id: 14,
            chapter: 'Ch 7',
            level: 'صعب',
            question: 'Find the complete solution satisfying the initial conditions',
            math: String.raw`y''-2y'-3y=6, \quad y(0)=1, \quad y'(0)=5`,
            answer: ''
        },
        {
            id: 15,
            chapter: 'Ch 7',
            level: 'متوسط',
            question: 'Rabbit population problem',
            math: String.raw`\frac{dP}{dt}\propto\sqrt{P}, \quad P(0)=100, \quad \text{Rate} = 25/\text{month}, \quad \text{Find } P(8)`,
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
                    <p style={{ color: '#4A5550', marginBottom: '20px' }}>بنك الأسئلة الشامل يتطلب اعتماد الكورس للوصول إليه.</p>
                    <Link href="/workspace/204" style={{ background: '#DCA27B', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
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
                        <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '6px' }}>❓ بنك الأسئلة الشامل</h1>
                        <p style={{ color: '#4A5550', fontSize: '14px' }}>تدرب على أسئلة متنوعة مصنفة حسب الشباتر ومستويات الصعوبة.</p>
                    </div>
                    <Link href="/workspace/204" style={{ textDecoration: 'none', background: '#CDD4B1', color: '#2C3531', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                        ← عودة للكورس
                    </Link>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {['all', 'Ch 1', 'Ch 2', 'Ch 4', 'Ch 6', 'Ch 7'].map((ch) => (
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
                            {ch === 'all' ? 'جميع الشباتر' : ch}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {filteredQuestions.map((q) => (
                        <div key={q.id} style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ background: '#FEECD0', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{q.chapter}</span>
                                <span style={{ background: q.level === 'صعب' ? '#fee2e2' : q.level === 'متوسط' ? '#fef08a' : '#CDD4B1', color: '#2C3531', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{q.level}</span>
                            </div>
                            <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#2C3531' }}>{q.question}</h3>

                            {/* عرض المعادلات والمصفوفات بشكل منظم واحترافي */}
                            {q.math && (
                                <div style={{ background: '#fdfbf7', padding: '12px', borderRadius: '8px', border: '1px dashed #e6dec5', marginBottom: '12px' }}>
                                    {renderMathContent(q.math)}
                                </div>
                            )}

                            <details style={{ background: '#FFF9E2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e6dec5', cursor: 'pointer' }}>
                                <summary style={{ fontWeight: 'bold', fontSize: '14px', color: '#DCA27B' }}>عرض الإجابة النموذجية 💡</summary>
                                <p style={{ marginTop: '8px', fontSize: '14px', color: '#4A5550' }}>{q.answer || 'قريباً...'}</p>
                            </details>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

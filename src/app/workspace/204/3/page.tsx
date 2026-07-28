'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import GlobalTutor from '@/components/GlobalTutor'

export default function Module3Page() {
    const [activeChapter, setActiveChapter] = useState<'ch-6.1' | 'ch-6.2'>('ch-6.1')
    const [activeIdea, setActiveIdea] = useState('idea-1')

    const [completed61, setCompleted61] = useState<string[]>([])
    const [completed62, setCompleted62] = useState<string[]>([])

    const [selected, setSelected] = useState<string | null>(null)

    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [isFadingOut, setIsFadingOut] = useState(false)

    const [errorMsg, setErrorMsg] = useState('')
    const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('last_studied_module', '3')

            const saved61 = localStorage.getItem('m3_ch61')
            const saved62 = localStorage.getItem('m3_ch62')
            if (saved61) setCompleted61(JSON.parse(saved61))
            if (saved62) setCompleted62(JSON.parse(saved62))
        }
    }, [])

    const currentCompleted = activeChapter === 'ch-6.1' ? completed61 : completed62
    const progress = Math.round((currentCompleted.length / 3) * 100)

    const totalCompletedCount = completed61.length + completed62.length
    const totalModuleProgress = Math.round((totalCompletedCount / 6) * 100)

    function handleChapterSwitch(ch: 'ch-6.1' | 'ch-6.2') {
        setActiveChapter(ch)
        setActiveIdea('idea-1')
        setSelected(null)
        setErrorMsg('')
    }

    function handleIdeaSwitch(ideaId: string) {
        setActiveIdea(ideaId)
        setSelected(null)
        setErrorMsg('')
    }

    function handleAskAIExample(conceptName: string) {
        const promptText = `Can you give me a clear, step-by-step mathematical example of "${conceptName}" in Linear Algebra, and explain how to solve it?`
        setTutorInitialPrompt(promptText)
    }

    function handleQuizVerify() {
        setErrorMsg('')
        const isCorrect61 = activeChapter === 'ch-6.1' && selected === 'λ = 3, λ = -2'
        const isCorrect62 = activeChapter === 'ch-6.2' && selected === 'A is diagonalizable because it has 3 linearly independent eigenvectors'

        if (isCorrect61 || isCorrect62) {
            setIsFadingOut(false)
            setShowSuccessToast(true)

            setTimeout(() => {
                setIsFadingOut(true)
            }, 2000)

            setTimeout(() => {
                setShowSuccessToast(false)
                setIsFadingOut(false)
            }, 2500)

            let new61 = [...completed61]
            let new62 = [...completed62]

            if (activeChapter === 'ch-6.1' && !new61.includes(activeIdea)) {
                new61.push(activeIdea)
                setCompleted61(new61)
                localStorage.setItem('m3_ch61', JSON.stringify(new61))
            } else if (activeChapter === 'ch-6.2' && !new62.includes(activeIdea)) {
                new62.push(activeIdea)
                setCompleted62(new62)
                localStorage.setItem('m3_ch62', JSON.stringify(new62))
            }

            const updatedTotalCount = new61.length + new62.length
            const overallPercent = Math.round((updatedTotalCount / 6) * 100)
            localStorage.setItem('module_3_progress', overallPercent.toString())

        } else {
            setErrorMsg('❌ إجابة خاطئة، حاول مرة أخرى!')
        }
    }

    const currentQuestionText = activeChapter === 'ch-6.1'
        ? "Find the eigenvalues of the matrix A = [ 5 7; -2 -4 ]"
        : "When is a 3x3 matrix A diagonalizable?"

    return (
        <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', color: '#2C3531', fontFamily: 'sans-serif', margin: 0, padding: 0, paddingBottom: '80px' }}>
            <Navbar isLoggedIn={true} />

            {showSuccessToast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#CDD4B1',
                    color: '#2C3531',
                    border: '1px solid #b8c29e',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    zIndex: 9999,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: isFadingOut ? 0 : 1,
                    transition: 'opacity 0.5s ease-in-out'
                }}>
                    <span>🎉 كفو! حليت صح وتم حفظ تقدمك</span>
                </div>
            )}

            <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '0 20px' }}>

                <div style={{ marginBottom: '16px' }}>
                    <Link href="/workspace/204" style={{ textDecoration: 'none', background: '#FEECD0', border: '1px solid #e6dec5', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', color: '#8c5521', fontSize: '13px' }}>
                        ⬅️ Back to Workspace
                    </Link>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#DCA27B' }}>
                          📘 Module 3 (Total Module Progress: {totalModuleProgress}%)
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={() => handleChapterSwitch('ch-6.1')}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
                                background: activeChapter === 'ch-6.1' ? '#DCA27B' : '#FFF9E2',
                                color: activeChapter === 'ch-6.1' ? '#fff' : '#2C3531', fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            📖 Chapter 6.1 {completed61.length === 3 && '✅'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleChapterSwitch('ch-6.2')}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
                                background: activeChapter === 'ch-6.2' ? '#DCA27B' : '#FFF9E2',
                                color: activeChapter === 'ch-6.2' ? '#fff' : '#2C3531', fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            📖 Chapter 6.2 {completed62.length === 3 && '✅'}
                        </button>
                    </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#2C3531' }}>
                        {activeChapter === 'ch-6.1' ? 'Chapter 6.1' : 'Chapter 6.2'} Progress: {progress}%
                    </div>
                    <div style={{ background: '#f0ebdc', borderRadius: '20px', height: '12px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, background: '#CDD4B1', height: '100%', transition: 'width 0.3s' }} />
                    </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#2C3531', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📖 Comprehensive Chapter Overview & Core Concepts ({activeChapter === 'ch-6.1' ? 'Chapter 6.1' : 'Chapter 6.2'})
                    </h3>

                    {activeChapter === 'ch-6.1' ? (
                        <div style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.7' }}>
                            <p style={{ margin: '0 0 10px 0' }}>
                                In this chapter, we study eigenvalues and eigenvectors, which are fundamental concepts in linear algebra used to understand linear transformations.
                            </p>
                            <ul style={{ margin: 0, paddingRight: '20px' }}>
                                <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                    <div style={{ flex: 1 }}>
                                        <strong>Eigenvalue (القيم الذاتية - λ):</strong> A scalar lambda such that the equation A*x = lambda*x has a non-trivial solution. Found by solving the characteristic equation: <code style={{ background: '#FFF9E2', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e6dec5' }}>det(A - λI) = 0</code> (المعادلة المميزة).
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleAskAIExample('Eigenvalues and Characteristic Equation det(A - lambda I) = 0')}
                                        style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        ✨ Example
                                    </button>
                                </li>
                                <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                    <div style={{ flex: 1 }}>
                                        <strong>Eigenvector (المتجهات الذاتية - x):</strong> A non-zero vector x that only changes by a scalar factor when a linear transformation is applied.
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleAskAIExample('Eigenvectors')}
                                        style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        ✨ Example
                                    </button>
                                </li>
                                <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                    <div style={{ flex: 1 }}>
                                        <strong>Triangular Matrices (المصفوفات المثلثية):</strong> Matrices where elements below or above the main diagonal are zero. For triangular matrices, the eigenvalues are simply the entries on the main diagonal (العناصر على القطر الرئيسي).
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleAskAIExample('Eigenvalues of Triangular Matrices')}
                                        style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        ✨ Example
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.7' }}>
                            <p style={{ margin: '0 0 10px 0' }}>
                                This chapter focuses on diagonalization and how to simplify matrix powers using eigenvector bases.
                            </p>
                            <ul style={{ margin: 0, paddingRight: '20px' }}>
                                <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                    <div style={{ flex: 1 }}>
                                        <strong>Diagonalization (التقطير):</strong> The process of rewriting a square matrix A in the form <code style={{ background: '#FFF9E2', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e6dec5' }}>P⁻¹AP = D</code>, where D is a diagonal matrix (مصفوفة قطرية) containing eigenvalues.
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleAskAIExample('Matrix Diagonalization P-1 A P = D')}
                                        style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        ✨ Example
                                    </button>
                                </li>
                                <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                    <div style={{ flex: 1 }}>
                                        <strong>Algebraic Multiplicity (التعدد الجبري):</strong> The multiplicity of an eigenvalue as a root of the characteristic polynomial.
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleAskAIExample('Algebraic and Geometric Multiplicity of Eigenvalues')}
                                        style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        ✨ Example
                                    </button>
                                </li>
                                <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                    <div style={{ flex: 1 }}>
                                        <strong>Geometric Multiplicity (التعدد الهندسي):</strong> The dimension of the eigenspace corresponding to an eigenvalue (عدد المتجهات الذاتية المستقلة المرتبطة بالقيمة الذاتية). A matrix is diagonalizable if and only if algebraic and geometric multiplicities match for all eigenvalues.
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleAskAIExample('Checking if a matrix is diagonalizable using multiplicities')}
                                        style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        ✨ Example
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {(activeChapter === 'ch-6.1' ? [
                        { id: 'idea-1', text: '💡 1. Concept of det(A - λI) = 0' },
                        { id: 'idea-2', text: '💡 2. Finding Eigenvalues & Eigenvectors' },
                        { id: 'idea-3', text: '💡 3. Triangular Matrices' }
                    ] : [
                        { id: 'idea-1', text: '💡 1. Diagonalization & P⁻¹AP = D' },
                        { id: 'idea-2', text: '💡 2. Algebraic & Geometric Multiplicity' },
                        { id: 'idea-3', text: '💡 3. Non-Diagonalizable Matrices' }
                    ]).map((idea) => (
                        <button
                            key={idea.id}
                            type="button"
                            onClick={() => handleIdeaSwitch(idea.id)}
                            style={{
                                flex: 1, minWidth: '180px', padding: '10px', borderRadius: '8px', border: '1px solid #e6dec5',
                                background: activeIdea === idea.id ? '#DCA27B' : '#ffffff',
                                color: activeIdea === idea.id ? '#ffffff' : '#2C3531', fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            {idea.text} {currentCompleted.includes(idea.id) && '✅'}
                        </button>
                    ))}
                </div>

                <div style={{ background: '#fff', border: '1px solid #e6dec5', padding: '20px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#2C3531' }}>📺 Explanatory Video ({activeChapter} - {activeIdea})</h4>
                    <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                        <iframe
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="Lesson Explanation"
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e6dec5', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#2C3531' }}>📝 Practice Question ({activeChapter} - {activeIdea})</h4>

                    {activeChapter === 'ch-6.1' ? (
                        <>
                            <p style={{ color: '#4A5550' }}>Find the eigenvalues of the following matrix:</p>
                            <pre style={{ background: '#FFF9E2', padding: '12px', borderRadius: '8px', border: '1px solid #e6dec5', color: '#2C3531' }}>{`A = [ 5   7 ]\n    [-2  -4 ]`}</pre>
                            <div style={{ margin: '16px 0' }}>
                                {['λ = 1, λ = 4', 'λ = 3, λ = -2', 'λ = 0, λ = 2'].map((opt) => (
                                    <label key={opt} style={{ display: 'block', margin: '8px 0', padding: '10px', background: selected === opt ? '#FEECD0' : '#FFF9E2', border: '1px solid #e6dec5', borderRadius: '8px', cursor: 'pointer', color: '#2C3531' }}>
                                        <input
                                            type="radio"
                                            name="opts"
                                            checked={selected === opt}
                                            onChange={() => setSelected(opt)}
                                            style={{ marginRight: '8px' }}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <p style={{ color: '#4A5550' }}>When is a 3x3 matrix A diagonalizable?</p>
                            <div style={{ margin: '16px 0' }}>
                                {[
                                    'A is diagonalizable because it has 3 linearly independent eigenvectors',
                                    'If the determinant of the matrix equals zero',
                                    'When all of its elements are positive numbers'
                                ].map((opt) => (
                                    <label key={opt} style={{ display: 'block', margin: '8px 0', padding: '10px', background: selected === opt ? '#FEECD0' : '#FFF9E2', border: '1px solid #e6dec5', borderRadius: '8px', cursor: 'pointer', color: '#2C3531' }}>
                                        <input
                                            type="radio"
                                            name="opts"
                                            checked={selected === opt}
                                            onChange={() => setSelected(opt)}
                                            style={{ marginRight: '8px' }}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </>
                    )}

                    {errorMsg && (
                        <p style={{ color: '#991b1b', fontWeight: 'bold', marginBottom: '12px' }}>{errorMsg}</p>
                    )}

                    <button type="button" onClick={handleQuizVerify} style={{ background: '#DCA27B', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        تحقق من الإجابة واحفظ التقدم
                    </button>
                </div>

                <GlobalTutor
                    currentModule={3}
                    currentChapter={activeChapter}
                    currentQuestion={currentQuestionText}
                    initialPrompt={tutorInitialPrompt}
                />

            </div>
        </div>
    )
}
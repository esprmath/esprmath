'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import GlobalTutor from '@/components/GlobalTutor'

export default function Module2Page() {
    const [activeChapter, setActiveChapter] = useState<'ch-2.1' | 'ch-2.2'>('ch-2.1')
    const [activeIdea, setActiveIdea] = useState('idea-1')

    const [completed21, setCompleted21] = useState<string[]>([])
    const [completed22, setCompleted22] = useState<string[]>([])

    const [selected, setSelected] = useState<string | null>(null)

    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [isFadingOut, setIsFadingOut] = useState(false)

    const [errorMsg, setErrorMsg] = useState('')
    const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('last_studied_module', '2')

            const saved21 = localStorage.getItem('m2_ch21')
            const saved22 = localStorage.getItem('m2_ch22')
            if (saved21) setCompleted21(JSON.parse(saved21))
            if (saved22) setCompleted22(JSON.parse(saved22))
        }
    }, [])

    const currentCompleted = activeChapter === 'ch-2.1' ? completed21 : completed22
    const progress = Math.round((currentCompleted.length / 2) * 100)

    const totalCompletedCount = completed21.length + completed22.length
    const totalModuleProgress = Math.round((totalCompletedCount / 4) * 100)

    function handleChapterSwitch(ch: 'ch-2.1' | 'ch-2.2') {
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
        const promptText = `Can you give me a clear, step-by-step mathematical example of "${conceptName}" in Population Models, and explain how to solve it?`
        setTutorInitialPrompt(promptText)
    }

    function handleQuizVerify() {
        setErrorMsg('')
        const isCorrect21 = activeChapter === 'ch-2.1' && (
            (activeIdea === 'idea-1' && selected === 'أ) P(t) = 1000 e^{0.03t}') ||
            (activeIdea === 'idea-2' && selected === 'أ) Approaches zero (\\frac{dP}{dt} \\to 0)')
        )
        const isCorrect22 = activeChapter === 'ch-2.2' && (
            (activeIdea === 'idea-1' && selected === 'أ) \\frac{dP}{dt} = 0') ||
            (activeIdea === 'idea-2' && selected === 'أ) Step size (حجم الخطوة الزمنية)')
        )

        if (isCorrect21 || isCorrect22) {
            setIsFadingOut(false)
            setShowSuccessToast(true)

            setTimeout(() => {
                setIsFadingOut(true)
            }, 2000)

            setTimeout(() => {
                setShowSuccessToast(false)
                setIsFadingOut(false)
            }, 2500)

            let new21 = [...completed21]
            let new22 = [...completed22]

            if (activeChapter === 'ch-2.1' && !new21.includes(activeIdea)) {
                new21.push(activeIdea)
                setCompleted21(new21)
                localStorage.setItem('m2_ch21', JSON.stringify(new21))
            } else if (activeChapter === 'ch-2.2' && !new22.includes(activeIdea)) {
                new22.push(activeIdea)
                setCompleted22(new22)
                localStorage.setItem('m2_ch22', JSON.stringify(new22))
            }

            const updatedTotalCount = new21.length + new22.length
            const overallPercent = Math.round((updatedTotalCount / 4) * 100)
            localStorage.setItem('module_2_progress', overallPercent.toString())

        } else {
            setErrorMsg('❌ إجابة خاطئة، حاول مرة أخرى!')
        }
    }

    const currentQuestionText = activeChapter === 'ch-2.1'
        ? (activeIdea === 'idea-1' ? "Given an initial population P_0 = 1000 and r = 0.03, what is P(t)?" : "What happens to dP/dt when P approaches K in logistic growth?")
        : (activeIdea === 'idea-1' ? "What is the mathematical condition for an equilibrium solution?" : "What does the parameter h represent in Euler's method?")

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
                          📘 Module 2 (Total Module Progress: {totalModuleProgress}%)
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={() => handleChapterSwitch('ch-2.1')}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
                                background: activeChapter === 'ch-2.1' ? '#DCA27B' : '#FFF9E2',
                                color: activeChapter === 'ch-2.1' ? '#fff' : '#2C3531', fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            📖 Chapter 2.1 {completed21.length === 2 && '✅'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleChapterSwitch('ch-2.2')}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
                                background: activeChapter === 'ch-2.2' ? '#DCA27B' : '#FFF9E2',
                                color: activeChapter === 'ch-2.2' ? '#fff' : '#2C3531', fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            📖 Chapter 2.2 {completed22.length === 2 && '✅'}
                        </button>
                    </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#2C3531' }}>
                        {activeChapter === 'ch-2.1' ? 'Chapter 2.1' : 'Chapter 2.2'} Progress: {progress}%
                    </div>
                    <div style={{ background: '#f0ebdc', borderRadius: '20px', height: '12px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, background: '#CDD4B1', height: '100%', transition: 'width 0.3s' }} />
                    </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '24px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#2C3531', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📖 Core Equations & Mathematical Concepts ({activeChapter === 'ch-2.1' ? 'Chapter 2.1' : 'Chapter 2.2'})
                    </h3>

                    {activeChapter === 'ch-2.1' ? (
                        <div style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.7' }}>
                            <ul style={{ margin: 0, paddingRight: '20px', listStyleType: 'none' }}>
                                <li style={{ marginBottom: '20px', background: '#FFF9E2', padding: '16px', borderRadius: '12px', border: '1px solid #e6dec5' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                                        <strong>Exponential Population Model:</strong>
                                        <button
                                            type="button"
                                            onClick={() => handleAskAIExample('Exponential Population Model')}
                                            style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            ✨ Example
                                        </button>
                                    </div>
                                    <p style={{ margin: '0 0 8px 0' }}>The rate of population growth is directly proportional to the current population size.</p>
                                    <p style={{ margin: '4px 0' }}>Differential equation: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e6dec5' }}>dP/dt = rP</code></p>
                                    <p style={{ margin: '4px 0' }}>Analytical solution: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e6dec5' }}>P(t) = P0 * e^(rt)</code></p>
                                </li>
                                <li style={{ marginBottom: '10px', background: '#FFF9E2', padding: '16px', borderRadius: '12px', border: '1px solid #e6dec5' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                                        <strong>Logistic Population Model:</strong>
                                        <button
                                            type="button"
                                            onClick={() => handleAskAIExample('Logistic Population Model')}
                                            style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            ✨ Example
                                        </button>
                                    </div>
                                    <p style={{ margin: '0 0 8px 0' }}>Introduces environmental carrying capacity (K) to limit unlimited exponential growth.</p>
                                    <p style={{ margin: '4px 0' }}>Differential equation: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e6dec5' }}>dP/dt = rP(1 - P/K)</code></p>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.7' }}>
                            <ul style={{ margin: 0, paddingRight: '20px', listStyleType: 'none' }}>
                                <li style={{ marginBottom: '20px', background: '#FFF9E2', padding: '16px', borderRadius: '12px', border: '1px solid #e6dec5' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                                        <strong>Equilibrium Solutions:</strong>
                                        <button
                                            type="button"
                                            onClick={() => handleAskAIExample('Equilibrium Solutions')}
                                            style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            ✨ Example
                                        </button>
                                    </div>
                                    <p style={{ margin: '0 0 8px 0' }}>Occur when the rate of change of population equals zero:</p>
                                    <p style={{ margin: '4px 0' }}>Condition: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e6dec5' }}>dP/dt = 0</code></p>
                                </li>
                                <li style={{ marginBottom: '10px', background: '#FFF9E2', padding: '16px', borderRadius: '12px', border: '1px solid #e6dec5' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                                        <strong>Numerical Methods (Euler & RK4):</strong>
                                        <button
                                            type="button"
                                            onClick={() => handleAskAIExample('Euler and Runge-Kutta RK4 Numerical Methods')}
                                            style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            ✨ Example
                                        </button>
                                    </div>
                                    <p style={{ margin: '0 0 8px 0' }}>Euler's Formula: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e6dec5' }}>P_(n+1) = P_n + h * f(t_n, P_n)</code></p>
                                    <p style={{ margin: '4px 0' }}>RK4 Formula: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e6dec5' }}>P_(n+1) = P_n + (h/6)(k1 + 2k2 + 2k3 + k4)</code></p>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {(activeChapter === 'ch-2.1' ? [
                        { id: 'idea-1', text: '💡 1. Exponential Model' },
                        { id: 'idea-2', text: '💡 2. Logistic Model' }
                    ] : [
                        { id: 'idea-1', text: '💡 1. Equilibrium Solutions' },
                        { id: 'idea-2', text: '💡 2. Numerical Methods' }
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

                    {activeChapter === 'ch-2.1' ? (
                        activeIdea === 'idea-1' ? (
                            <>
                                <p style={{ color: '#4A5550' }}>Given an initial population P_0 = 1000 and a relative growth rate r = 0.03, what is the equation for the population size at time t?</p>
                                <div style={{ margin: '16px 0' }}>
                                    {[
                                        'أ) P(t) = 1000 e^{0.03t}',
                                        'ب) P(t) = 1000 + 0.03t',
                                        'ج) P(t) = 0.03 e^{1000t}'
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
                        ) : (
                            <>
                                <p style={{ color: '#4A5550' }}>In the logistic growth model dP/dt = rP(1 - P/K), what happens to the growth rate dP/dt when the population P approaches the carrying capacity K?</p>
                                <div style={{ margin: '16px 0' }}>
                                    {[
                                        'أ) Approaches zero (\\frac{dP}{dt} \\to 0)',
                                        'ب) Approaches infinity (\\frac{dP}{dt} \\to \\infty)',
                                        'ج) Remains constant and maximum'
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
                        )
                    ) : (
                        activeIdea === 'idea-1' ? (
                            <>
                                <p style={{ color: '#4A5550' }}>What is the mathematical condition for an equilibrium solution in population models?</p>
                                <div style={{ margin: '16px 0' }}>
                                    {[
                                        'أ) \\frac{dP}{dt} = 0',
                                        'ب) \\frac{dP}{dt} = rP',
                                        'ج) P(t) = e^{rt}'
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
                        ) : (
                            <>
                                <p style={{ color: '#4A5550' }}>In Euler's numerical method formula P_(n+1) = P_n + h * f(t_n, P_n), what does the parameter h represent?</p>
                                <div style={{ margin: '16px 0' }}>
                                    {[
                                        'أ) Step size (حجم الخطوة الزمنية)',
                                        'ب) Carrying capacity (القدرة الاستيعابية)',
                                        'ج) Growth rate (معدل النمو)'
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
                        )
                    )}

                    {errorMsg && (
                        <p style={{ color: '#991b1b', fontWeight: 'bold', marginBottom: '12px' }}>{errorMsg}</p>
                    )}

                    <button type="button" onClick={handleQuizVerify} style={{ background: '#DCA27B', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        تحقق من الإجابة واحفظ التقدم
                    </button>
                </div>

                <GlobalTutor
                    currentModule={2}
                    currentChapter={activeChapter}
                    currentQuestion={currentQuestionText}
                    initialPrompt={tutorInitialPrompt}
                />

            </div>
        </div>
    )
}
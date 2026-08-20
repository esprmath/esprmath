'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import GlobalTutor from '@/components/GlobalTutor'
import { supabase } from '@/lib/supabase'

export default function Module5Page() {
    const [activeChapter, setActiveChapter] = useState<'ch-5.1' | 'ch-5.2'>('ch-5.1')
    const [activeIdea, setActiveIdea] = useState('idea-1')

    const [completed51, setCompleted51] = useState<string[]>([])
    const [completed52, setCompleted52] = useState<string[]>([])

    const [selected, setSelected] = useState<string | null>(null)
    const [hasAttempted, setHasAttempted] = useState(false)
    const [showSolutionBox, setShowSolutionBox] = useState(false)

    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [isFadingOut, setIsFadingOut] = useState(false)

    const [errorMsg, setErrorMsg] = useState('')
    const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | null>(null)

    const [userId, setUserId] = useState<string | null>(null)
    const [isAiAllowed, setIsAiAllowed] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('last_studied_module', '5')

            const saved51 = localStorage.getItem('m5_ch51')
            const saved52 = localStorage.getItem('m5_ch52')
            if (saved51) setCompleted51(JSON.parse(saved51))
            if (saved52) setCompleted52(JSON.parse(saved52))
        }

        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                const currentUserId = session.user.id
                setUserId(currentUserId)

                const { data, error } = await supabase
                    .from('user_courses')
                    .select('is_ai_allowed')
                    .eq('user_id', currentUserId)
                    .eq('course_id', '204')
                    .single()

                if (!error && data) {
                    setIsAiAllowed(data.is_ai_allowed)
                }
            }
        })
    }, [])

    const currentCompleted = activeChapter === 'ch-5.1' ? completed51 : completed52
    const currentTotalIdeas = activeChapter === 'ch-5.1' ? 2 : 1
    const progress = Math.round((currentCompleted.length / currentTotalIdeas) * 100)

    const totalCompletedCount = completed51.length + completed52.length
    const totalModuleProgress = Math.round((totalCompletedCount / 3) * 100)

    function handleIdeaSwitch(ch: 'ch-5.1' | 'ch-5.2', ideaId: string) {
        setActiveChapter(ch)
        setActiveIdea(ideaId)
        setSelected(null)
        setHasAttempted(false)
        setShowSolutionBox(false)
        setErrorMsg('')
    }

    function handleAskAIExample(conceptName: string) {
        const promptText = `Can you give me a clear, step-by-step mathematical example of "${conceptName}" in Differential Equations, and explain how to solve it?`
        setTutorInitialPrompt(promptText)
    }

    function handleQuizVerify() {
        setErrorMsg('')
        setHasAttempted(true)
        setShowSolutionBox(false)

        const isCorrect51_1 = activeChapter === 'ch-5.1' && activeIdea === 'idea-1' && selected === 'A) x(t) = (10e^(4t) + 4)/(5e^(4t) − 1)'
        const isCorrect51_2 = activeChapter === 'ch-5.1' && activeIdea === 'idea-2' && selected === 'A) 529 bacteria'
        const isCorrect52_1 = activeChapter === 'ch-5.2' && activeIdea === 'idea-1' && selected === 'A) x = 0 is unstable, x = M is stable'

        if (isCorrect51_1 || isCorrect51_2 || isCorrect52_1) {
            setIsFadingOut(false)
            setShowSuccessToast(true)

            setTimeout(() => {
                setIsFadingOut(true)
            }, 2000)

            setTimeout(() => {
                setShowSuccessToast(false)
                setIsFadingOut(false)
            }, 2500)

            let new51 = [...completed51]
            let new52 = [...completed52]

            if (activeChapter === 'ch-5.1' && !new51.includes(activeIdea)) {
                new51.push(activeIdea)
                setCompleted51(new51)
                localStorage.setItem('m5_ch51', JSON.stringify(new51))
            } else if (activeChapter === 'ch-5.2' && !new52.includes(activeIdea)) {
                new52.push(activeIdea)
                setCompleted52(new52)
                localStorage.setItem('m5_ch52', JSON.stringify(new52))
            }

            const updatedTotalCount = new51.length + new52.length
            const overallPercent = Math.round((updatedTotalCount / 3) * 100)
            localStorage.setItem('module_5_progress', overallPercent.toString())

        } else {
            setErrorMsg('❌ إجابة خاطئة، حاول مرة أخرى!')
        }
    }

    const currentQuestionText = activeChapter === 'ch-5.1'
        ? (activeIdea === 'idea-1' ? "Solve the initial value problem: dx/dt = 4 - x², x(0) = 3" : "Find bacterial population after 3 hours for dP/dt = k√P")
        : "Classify stability of x = 0 and x = M for the logistic equation dx/dt = kx(M - x)"

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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#DCA27B' }}>
                          📘 Module 5 (Total Module Progress: {totalModuleProgress}%)
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '280px', background: '#FFF9E2', border: '1px solid #e6dec5', borderRadius: '12px', padding: '14px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#2C3531', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>📖 Chapter 5.1 {completed51.length === 2 && '✅'}</span>
                                <span style={{ fontSize: '11px', color: '#8c5521' }}>فكريتان</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => handleIdeaSwitch('ch-5.1', 'idea-1')}
                                    style={{
                                        padding: '10px', borderRadius: '8px', border: '1px solid #e6dec5', textAlign: 'right',
                                        background: activeChapter === 'ch-5.1' && activeIdea === 'idea-1' ? '#DCA27B' : '#ffffff',
                                        color: activeChapter === 'ch-5.1' && activeIdea === 'idea-1' ? '#ffffff' : '#2C3531', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
                                    }}
                                >
                                    💡 1. Separation & Partial Fractions {completed51.includes('idea-1') && '✅'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleIdeaSwitch('ch-5.1', 'idea-2')}
                                    style={{
                                        padding: '10px', borderRadius: '8px', border: '1px solid #e6dec5', textAlign: 'right',
                                        background: activeChapter === 'ch-5.1' && activeIdea === 'idea-2' ? '#DCA27B' : '#ffffff',
                                        color: activeChapter === 'ch-5.1' && activeIdea === 'idea-2' ? '#ffffff' : '#2C3531', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
                                    }}
                                >
                                    💡 2. Population Growth Models {completed51.includes('idea-2') && '✅'}
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: 1, minWidth: '280px', background: '#FFF9E2', border: '1px solid #e6dec5', borderRadius: '12px', padding: '14px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#2C3531', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>📖 Chapter 5.2 {completed52.length === 1 && '✅'}</span>
                                <span style={{ fontSize: '11px', color: '#8c5521' }}>فكرة واحدة</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => handleIdeaSwitch('ch-5.2', 'idea-1')}
                                    style={{
                                        padding: '10px', borderRadius: '8px', border: '1px solid #e6dec5', textAlign: 'right',
                                        background: activeChapter === 'ch-5.2' && activeIdea === 'idea-1' ? '#DCA27B' : '#ffffff',
                                        color: activeChapter === 'ch-5.2' && activeIdea === 'idea-1' ? '#ffffff' : '#2C3531', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
                                    }}
                                >
                                    💡 1. Stability & Critical Points {completed52.includes('idea-1') && '✅'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#2C3531' }}>
                        {activeChapter === 'ch-5.1' ? 'Chapter 5.1' : 'Chapter 5.2'} Progress: {progress}%
                    </div>
                    <div style={{ background: '#f0ebdc', borderRadius: '20px', height: '12px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, background: '#CDD4B1', height: '100%', transition: 'width 0.3s' }} />
                    </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#2C3531', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📖 How to Solve (خطوات الحل) - ({activeChapter === 'ch-5.1' ? (activeIdea === 'idea-1' ? 'Separation & Partial Fractions' : 'Population Growth') : 'Stability Analysis'})
                    </h3>

                    {activeChapter === 'ch-5.1' ? (
                        activeIdea === 'idea-1' ? (
                            <div style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.7' }}>
                                <p style={{ margin: '0 0 10px 0', fontFamily: 'monospace', background: '#FFF9E2', padding: '6px 10px', borderRadius: '6px', display: 'inline-block' }}>
                                    dx / f(x) = dt
                                </p>
                                <ul style={{ margin: 0, paddingRight: '20px' }}>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 1: فصل المتغيرات (Separate Variables)</strong><br />
                                        ننقل جميع الحدود التي تحتوي على x إلى طرف مع dx، والحدود التي تحتوي على t إلى الطرف الآخر مع dt.
                                    </li>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 2: تحليل المقام (Factor the Denominator)</strong><br />
                                        نحلل المقام إلى عوامله، ثم نكتب الكسر الناتج بصيغة مناسبة للكسور الجزئية.
                                    </li>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 3: الكسور الجزئية (Partial Fractions)</strong><br />
                                        نفترض ثوابت للكسور الجزئية، ثم نوجد قيمها بمساواة المعاملات أو بالتعويض بقيم مناسبة لـ x.
                                    </li>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 4: التكامل (Integrate)</strong><br />
                                        نكامل الطرفين، مع استخدام القاعدة: <code style={{ background: '#FFF9E2', padding: '2px 6px', borderRadius: '4px' }}>∫ 1/(ax + b) dx = (1/a) ln|ax + b| + C</code>
                                    </li>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 5: تطبيق الشرط الابتدائي (Apply the Initial Condition)</strong><br />
                                        نعوّض بالقيمة المعطاة مثل x(0) = x₀ لإيجاد ثابت التكامل C.
                                    </li>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 6: كتابة الحل الصريح (Write the Explicit Solution)</strong><br />
                                        نستخدم الأسس واللوغاريتمات لعزل x وكتابة الحل على الصورة x(t).
                                    </li>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 7: فحص المجال وحلول الاتزان (Check Interval & Equilibrium)</strong><br />
                                        نتأكد أن مقام الحل لا يساوي صفراً، ونضيف أي حلول اتزان فُقدت عند القسمة على عوامل تحتوي على x أو f(x).
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.7' }}>
                                <ul style={{ margin: 0, paddingRight: '20px' }}>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 1: تكوين المعادلة التفاضلية (Form Differential Equation)</strong><br />
                                        بما أن معدل التغير يتناسب مع الجذر التربيعي للسكان، نكتب: <code style={{ background: '#FFF9E2', padding: '2px 6px', borderRadius: '4px' }}>dP/dt = k√P</code>
                                    </li>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 2: إيجاد ثابت التناسب k (Find k)</strong><br />
                                        نعوض بالشروط الابتدائية عند t = 0 لإيجاد قيمة k.
                                    </li>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 3: فصل المتغيرات والتكامل (Separate and Integrate)</strong><br />
                                        نفصل المتغيرات (<code style={{ background: '#FFF9E2', padding: '2px 6px', borderRadius: '4px' }}>dP/√P = k dt</code>) ونكامل الطرفين.
                                    </li>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 4: تطبيق الشرط الابتدائي (Apply Initial Condition)</strong><br />
                                        نعوض بالقيم الابتدائية لإيجاد ثابت التكامل C.
                                    </li>
                                    <li style={{ marginBottom: '10px' }}>
                                        <strong>Step 5: الحل الصريح وحساب المطلوب (Explicit Solution)</strong><br />
                                        نعزل P(t) ثم نعوض بالزمن المطلوب (مثل سنة أو ساعات) لإيجاد الناتج النهائي.
                                    </li>
                                </ul>
                            </div>
                        )
                    ) : (
                        <div style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.7' }}>
                            <ul style={{ margin: 0, paddingRight: '20px' }}>
                                <li style={{ marginBottom: '10px' }}>
                                    <strong>Step 1: إيجاد النقاط الحرجة (Find Critical Points)</strong><br />
                                    من المعادلة <code style={{ background: '#FFF9E2', padding: '2px 6px', borderRadius: '4px' }}>dx/dt = f(x)</code>، نضع <code style={{ background: '#FFF9E2', padding: '2px 6px', borderRadius: '4px' }}>f(x) = 0</code> ونحل لإيجاد قيم x.
                                </li>
                                <li style={{ marginBottom: '10px' }}>
                                    <strong>Step 2: فحص الإشارة حول كل نقطة (Check Signs)</strong><br />
                                    نختار قيم أقل وأكبر بقليل من النقطة الحرجة لنعرف اتجاه حركة الحلول (يميناً أو يساراً).
                                </li>
                                <li style={{ marginBottom: '10px' }}>
                                    <strong>Step 3: التصنيف (Classification)</strong><br />
                                    مستقرة (Funnel - تقترب الحلول منها) أو غير مستقرة (Spout - تبتعد الحلول عنها).
                                </li>
                                <li style={{ marginBottom: '10px' }}>
                                    <strong>Step 4: رسم مخطط الطور (Phase Diagram)</strong><br />
                                    نرسم خط أعداد مع أسهم توضح اتجاه الحركة وسلوك الحلول.
                                </li>
                            </ul>
                        </div>
                    )}
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

                    {activeChapter === 'ch-5.1' ? (
                        activeIdea === 'idea-1' ? (
                            <>
                                <p style={{ color: '#4A5550' }}>Solve the initial value problem using separation of variables and partial fractions:</p>
                                <pre style={{ background: '#FFF9E2', padding: '12px', borderRadius: '8px', border: '1px solid #e6dec5', color: '#2C3531' }}>{`dx/dt = 4 - x² , x(0) = 3`}</pre>
                                <div style={{ margin: '16px 0' }}>
                                    {[
                                        'A) x(t) = (10e^(4t) + 4)/(5e^(4t) − 1)',
                                        'B) x(t) = (10e^(4t) − 4)/(5e^(4t) + 1)',
                                        'C) x(t) = 4/(1 + 5e^(4t))'
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
                                <p style={{ color: '#4A5550' }}>The time rate of change of a bacterial population P is proportional to √P. At t = 0, P = 400 and rate = 40. How many bacteria after 3 hours?</p>
                                <div style={{ margin: '16px 0' }}>
                                    {[
                                        'A) 529 bacteria',
                                        'B) 625 bacteria',
                                        'C) 484 bacteria'
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
                        <>
                            <p style={{ color: '#4A5550' }}>For the logistic equation dx/dt = kx(M - x) with k {'>'} 0 and M {'>'} 0, classify stability:</p>
                            <div style={{ margin: '16px 0' }}>
                                {[
                                    'A) x = 0 is unstable, x = M is stable',
                                    'B) x = 0 is stable, x = M is unstable',
                                    'C) Both are stable'
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

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button type="button" onClick={handleQuizVerify} style={{ background: '#DCA27B', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            تحقق من الإجابة واحفظ التقدم
                        </button>

                        {hasAttempted && (
                            <button
                                type="button"
                                onClick={() => setShowSolutionBox(!showSolutionBox)}
                                style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #e6dec5', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                {showSolutionBox ? 'إخفاء الحل المفصل 🔼' : '🔍 إظهار الحل المفصل'}
                            </button>
                        )}
                    </div>

                    {showSolutionBox && (
                        <div style={{ marginTop: '20px', background: '#FFF9E2', border: '1px solid #e6dec5', padding: '16px', borderRadius: '12px', color: '#2C3531', lineHeight: '1.7' }}>
                            <h5 style={{ margin: '0 0 10px 0', color: '#8c5521', fontSize: '1.05rem' }}>💡 الحل المفصل والشرح:</h5>
                            {activeChapter === 'ch-5.1' ? (
                                activeIdea === 'idea-1' ? (
                                    <div style={{ fontSize: '0.95rem' }}>
                                        <p style={{ margin: '0 0 8px 0' }}><strong>1. فصل المتغيرات:</strong><br /> نعزل dx في طرف و dt في الطرف الآخر: <br /><code>dx / (4 - x²) = dt</code></p>
                                        <p style={{ margin: '0 0 8px 0' }}><strong>2. الكسور الجزئية:</strong><br /> نحلل المقام إلى عوامله: <code>4 - x² = (2 - x)(2 + x)</code><br />بإيجاد الثوابت نجد أن: <code>1 / (4 - x²) = 1/4 [ 1/(2 - x) + 1/(2 + x) ]</code></p>
                                        <p style={{ margin: '0 0 8px 0' }}><strong>3. التكامل:</strong><br /> تكامل الطرفين يعطينا: <code>-1/4 ln|2 - x| + 1/4 ln|2 + x| = t + C₁</code><br />باختصار اللوغاريتمات: <code>ln |(2 + x) / (2 - x)| = 4t + C</code></p>
                                        <p style={{ margin: '0 0 8px 0' }}><strong>4. تطبيق الشرط الابتدائي x(0) = 3:</strong><br /> <code>ln |(2 + 3) / (2 - 3)| = ln(5) = C</code></p>
                                        <p style={{ margin: 0 }}><strong>5. الحل الصريح:</strong><br /> بتبسيط المعادلة وأخذ الأس للطرفين نصل للحل الصحيح: <br /><strong>Option A: x(t) = (10e^(4t) + 4) / (5e^(4t) − 1)</strong></p>
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '0.95rem' }}>
                                        <p style={{ margin: '0 0 8px 0' }}><strong>1. تكوين المعادلة وإيجاد k:</strong><br /> المعدل يتناسب مع الجذر: <code>dP/dt = k√P</code><br />عند t = 0 فإن P = 400 ومعدل التغير = 40:<br /><code>40 = k√(400) = k(20) ⟹ k = 2</code></p>
                                        <p style={{ margin: '0 0 8px 0' }}><strong>2. التكامل وفصل المتغيرات:</strong><br /> <code>P^(-1/2) dP = 2 dt ⟹ 2√P = 2t + C</code></p>
                                        <p style={{ margin: '0 0 8px 0' }}><strong>3. إيجاد الثابت C:</strong><br /> بالتعويض بـ P(0) = 400 نجد أن <code>C = 40</code>، إذن: <code>√P = t + 20</code></p>
                                        <p style={{ margin: 0 }}><strong>4. حساب عدد البكتيريا بعد 3 ساعات:</strong><br /> عند t = 3: <code>√P = 3 + 20 = 23 ⟹ P = (23)² = 529</code><br />إذن الإجابة الصحيحة هي: <strong>Option A: 529 bacteria</strong></p>
                                    </div>
                                )
                            ) : (
                                <div style={{ fontSize: '0.95rem' }}>
                                    <p style={{ margin: '0 0 8px 0' }}><strong>1. إيجاد النقاط الحرجة:</strong><br /> نضع <code>f(x) = kx(M - x) = 0</code><br />إذن النقاط الحرجة هي: <strong>x = 0</strong> و <strong>x = M</strong>.</p>
                                    <p style={{ margin: '0 0 8px 0' }}><strong>2. دراسة إشارة f(x):</strong><br /> - بين 0 و M (مثل x = M/2): المشتقة موجبة (الحلول تتجه يميناً نحو M).<br /> - أكبر من M (حيث x {'>'} M): المشتقة سالبة (الحلول تتجه يساراً نحو M).</p>
                                    <p style={{ margin: 0 }}><strong>3. الاستنتاج والتصنيف:</strong><br /> - النقطة <strong>x = 0</strong> تبتعد عنها الحلول إذن هي <strong>غير مستقرة (Unstable / Spout)</strong>.<br /> - النقطة <strong>x = M</strong> تقترب منها الحلول إذن هي <strong>مستقرة (Stable / Funnel)</strong>.<br />الإجابة الصحيحة: <strong>Option A</strong></p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <GlobalTutor
                    currentModule={5}
                    currentChapter={activeChapter}
                    currentQuestion={currentQuestionText}
                    initialPrompt={tutorInitialPrompt}
                    isAiAllowed={isAiAllowed}
                />

            </div>
        </div>
    )
}
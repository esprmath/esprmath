'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

// الأفكار المستخرجة موزعة على الأقسام الثلاثة مع بيانات المودل والشابتر واسم الفكرة
const reviewSections = {
    firstReview: [
        {
            id: 101,
            module: 'المودل الثالث',
            chapter: 'Chapter 6.1',
            chapterLink: '/workspace/204/3', // تم تحديث رابط صفحة المودل إلى 204/3
            idea: 'Concept of det(A - λI) = 0',
            question: 'السؤال',
            options: ['أ) خيار تجريبي أول', 'ب) خيار تجريبي ثاني', 'ت) خيار تجريبي ثالث'],
            correctAnswer: 'أ) خيار تجريبي أول',
            solutionText: 'شرح الحل التفصيلي المرتبط بفكرة المعادلة المميزة والقيم الذاتية det(A - λI) = 0.'
        },
        {
            id: 102,
            module: 'المودل الثالث',
            chapter: 'Chapter 6.1',
            chapterLink: '/workspace/204/3',
            idea: 'Finding Eigenvalues & Eigenvectors',
            question: 'السؤال',
            options: ['أ) خيار تجريبي أول', 'ب) خيار تجريبي ثاني', 'ت) خيار تجريبي ثالث'],
            correctAnswer: 'ب) خيار تجريبي ثاني',
            solutionText: 'شرح الحل التفصيلي لكيفية إيجاد المتجهات الذاتية المرتبطة بالقيم الذاتية.'
        }
    ],
    secondReview: [
        {
            id: 103,
            module: 'المودل الثالث',
            chapter: 'Chapter 6.1',
            chapterLink: '/workspace/204/3',
            idea: 'Triangular Matrices',
            question: 'السؤال',
            options: ['أ) خيار تجريبي أول', 'ب) خيار تجريبي ثاني', 'ت) خيار تجريبي ثالث'],
            correctAnswer: 'ت) خيار تجريبي ثالث',
            solutionText: 'شرح الحل التفصيلي للمصفوفات المثلثية وكيف تكون قيمها الذاتية هي عناصر القطر الرئيسي.'
        },
        {
            id: 104,
            module: 'المودل الثالث',
            chapter: 'Chapter 6.2',
            chapterLink: '/workspace/204/3',
            idea: 'Diagonalization & P⁻¹AP = D',
            question: 'السؤال',
            options: ['أ) خيار تجريبي أول', 'ب) خيار تجريبي ثاني', 'ت) خيار تجريبي ثالث'],
            correctAnswer: 'أ) خيار تجريبي أول',
            solutionText: 'شرح الحل التفصيلي لعملية تقطير المصفوفة باستخدام مصفوفة المتجهات الذاتية P.'
        }
    ],
    leaks: [
        {
            id: 105,
            module: 'المودل الثالث',
            chapter: 'Chapter 6.2',
            chapterLink: '/workspace/204/3',
            idea: 'Algebraic & Geometric Multiplicity',
            question: 'السؤال',
            options: ['أ) خيار تجريبي أول', 'ب) خيار تجريبي ثاني', 'ت) خيار تجريبي ثالث'],
            correctAnswer: 'ب) خيار تجريبي ثاني',
            solutionText: 'شرح الحل التفصيلي للعلاقة بين التعدد الجبري والهندسي لمعرفة إمكانية تقطير المصفوفة.'
        },
        {
            id: 106,
            module: 'المودل الثالث',
            chapter: 'Chapter 6.2',
            chapterLink: '/workspace/204/3',
            idea: 'Non-Diagonalizable Matrices',
            question: 'السؤال',
            options: ['أ) خيار تجريبي أول', 'ب) خيار تجريبي ثاني', 'ت) خيار تجريبي ثالث'],
            correctAnswer: 'ت) خيار تجريبي ثالث',
            solutionText: 'شرح الحل التفصيلي للحالات التي تكون فيها المصفوفة غير قابلة للتقطير.'
        }
    ]
}

type ActiveSection = 'menu' | 'firstReview' | 'secondReview' | 'leaks'

export default function Quiz1HubPage() {
    const [currentSection, setCurrentSection] = useState<ActiveSection>('menu')
    const [currentIdx, setCurrentIdx] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string>('')
    const [showOptions, setShowOptions] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

    // تجميع الأخطاء في نهاية الكويز
    const [wrongItems, setWrongItems] = useState<any[]>([])
    const [sectionFinished, setSectionFinished] = useState(false)

    // عرض تفاصيل السؤال والحل لفكرة خاطئة تم النقر عليها من قائمة الأخطاء النهائية
    const [viewingErrorItem, setViewingErrorItem] = useState<any | null>(null)

    const activeQuestions = currentSection !== 'menu' ? reviewSections[currentSection] : []
    const currentQ = activeQuestions[currentIdx]

    const handleSelectSection = (section: ActiveSection) => {
        setCurrentSection(section)
        setCurrentIdx(0)
        setSelectedOption('')
        setShowOptions(false)
        setIsSubmitted(false)
        setIsCorrect(null)
        setWrongItems([])
        setSectionFinished(false)
        setViewingErrorItem(null)
    }

    const handleCheck = () => {
        const correct = selectedOption === currentQ.correctAnswer
        setIsCorrect(correct)
        setIsSubmitted(true)

        if (!correct) {
            if (!wrongItems.some(item => item.id === currentQ.id)) {
                setWrongItems([...wrongItems, currentQ])
            }
        }
    }

    const handleNext = () => {
        if (currentIdx + 1 < activeQuestions.length) {
            setCurrentIdx(currentIdx + 1)
            setSelectedOption('')
            setShowOptions(false)
            setIsSubmitted(false)
            setIsCorrect(null)
        } else {
            setSectionFinished(true)
        }
    }

    // شاشة عرض تفاصيل الفكرة الخاطئة المختارة من ملخص الأخطاء النهائي مع خيار "العودة للشابتر"
    if (viewingErrorItem) {
        return (
            <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0, paddingBottom: '60px' }}>
                <Navbar isLoggedIn={true} />
                <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e6dec5', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <span style={{ background: '#FEECD0', color: '#8c5521', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{viewingErrorItem.module}</span>
                            <span style={{ background: '#FEECD0', color: '#8c5521', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{viewingErrorItem.chapter}</span>
                        </div>
                        <h3 style={{ margin: '0 0 8px 0', color: '#2C3531' }}>الفكرة: {viewingErrorItem.idea}</h3>
                        <p style={{ color: '#4A5550', fontSize: '15px', fontWeight: 'bold', marginBottom: '12px' }}>السؤال: {viewingErrorItem.question}</p>
                        <p style={{ color: '#4A5550', lineHeight: '1.7', marginBottom: '24px', background: '#FFF9E2', padding: '15px', borderRadius: '8px' }}>
                            <strong>شرح الحل:</strong> {viewingErrorItem.solutionText}
                        </p>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => setViewingErrorItem(null)}
                                style={{ background: '#DCA27B', padding: '10px 20px', borderRadius: '8px', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                العودة لقائمة الأخطاء 🔄
                            </button>
                            <Link
                                href={viewingErrorItem.chapterLink}
                                style={{ background: '#CDD4B1', padding: '10px 20px', borderRadius: '8px', color: '#2C3531', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}
                            >
                                العودة للشابتر ➔
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // شاشة ملخص الأخطاء نهاية القسم
    if (sectionFinished) {
        return (
            <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0, paddingBottom: '60px' }}>
                <Navbar isLoggedIn={true} />
                <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e6dec5', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                        <h2 style={{ color: '#2C3531', marginBottom: '8px' }}>🎉 انتهيت من القسم بنجاح!</h2>
                        <p style={{ color: '#4A5550', marginBottom: '20px' }}>
                            {wrongItems.length === 0 ? 'رائع جداً! لم تخطئ في أي فكرة.' : `لديك ${wrongItems.length} أفكار أخطأت فيها (أسماء الأفكار):`}
                        </p>

                        {wrongItems.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                                {wrongItems.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        style={{ background: '#FEECD0', padding: '16px', borderRadius: '12px', border: '1px solid #e6dec5', display: 'flex', flexDirection: 'column', gap: '10px' }}
                                    >
                                        <div>
                                            <span style={{ fontSize: '12px', color: '#8c5521', fontWeight: 'bold' }}>{item.module} | {item.chapter}</span>
                                            <h4 style={{ margin: '4px 0 0 0', color: '#2C3531', fontSize: '15px' }}>{idx + 1}. {item.idea}</h4>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <button
                                                onClick={() => setViewingErrorItem(item)}
                                                style={{ background: '#DCA27B', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                                            >
                                                مراجعة الحل 💡
                                            </button>
                                            <Link
                                                href={item.chapterLink}
                                                style={{ background: '#CDD4B1', color: '#2C3531', textDecoration: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}
                                            >
                                                العودة للشابتر ➔
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => handleSelectSection('menu')}
                            style={{ background: '#DCA27B', color: '#fff', padding: '12px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                        >
                            العودة لقائمة الخيارات الرئيسية ➔
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0, paddingBottom: '60px' }}>
            <Navbar isLoggedIn={true} />

            <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>

                {/* الشاشة الرئيسية: اختيار القسم */}
                {currentSection === 'menu' && (
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e6dec5', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '22px', color: '#2C3531' }}>🎯 قسم الكويز الأول - اختر نوع المراجعة</h2>
                            <Link href="/workspace/204/exam-leaks" style={{ textDecoration: 'none', background: '#CDD4B1', color: '#2C3531', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' }}>
                                ← عودة
                            </Link>
                        </div>
                        <p style={{ color: '#4A5550', marginBottom: '24px', fontSize: '14px' }}>اختر أحد الأقسام التالية لبدء التدريب التفاعلي:</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <button
                                onClick={() => handleSelectSection('firstReview')}
                                style={{ background: '#FEECD0', color: '#8c5521', padding: '16px', borderRadius: '12px', border: '1px solid #e6dec5', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <span>📖 المراجعة الأولى</span>
                                <span>➔</span>
                            </button>
                            <button
                                onClick={() => handleSelectSection('secondReview')}
                                style={{ background: '#FEECD0', color: '#8c5521', padding: '16px', borderRadius: '12px', border: '1px solid #e6dec5', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <span>📖 المراجعة الثانية</span>
                                <span>➔</span>
                            </button>
                            <button
                                onClick={() => handleSelectSection('leaks')}
                                style={{ background: '#FEECD0', color: '#8c5521', padding: '16px', borderRadius: '12px', border: '1px solid #e6dec5', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <span>🔥 التسريبات</span>
                                <span>➔</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* شاشة الأسئلة التفاعلية للقسم المحدد */}
                {currentSection !== 'menu' && (
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e6dec5', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                <span style={{ background: '#FEECD0', color: '#8c5521', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                    {currentQ.module}
                                </span>
                                <span style={{ background: '#FEECD0', color: '#8c5521', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                    {currentQ.chapter}
                                </span>
                                <span style={{ background: '#E0DFD5', color: '#2C3531', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                    {currentQ.idea}
                                </span>
                            </div>
                            <button
                                onClick={() => handleSelectSection('menu')}
                                style={{ background: 'none', border: 'none', color: '#8c5521', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                            >
                                ✕ الخروج للقائمة
                            </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '14px', color: '#4A5550', fontWeight: 'bold' }}>السؤال {currentIdx + 1} من {activeQuestions.length}</span>
                        </div>

                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2C3531', marginBottom: '20px' }}>{currentQ.question}</h2>

                        {!showOptions ? (
                            <button
                                onClick={() => setShowOptions(true)}
                                style={{ background: '#CDD4B1', color: '#2C3531', padding: '12px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                            >
                                إظهار الخيارات ➔
                            </button>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {currentQ.options.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setSelectedOption(opt)}
                                        style={{
                                            background: selectedOption === opt ? '#DCA27B' : '#FFF9E2',
                                            color: selectedOption === opt ? '#fff' : '#2C3531',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e6dec5',
                                            textAlign: 'right',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                                <button
                                    onClick={handleCheck}
                                    disabled={!selectedOption || isSubmitted}
                                    style={{ marginTop: '10px', background: selectedOption && !isSubmitted ? '#DCA27B' : '#e0dfd5', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: selectedOption && !isSubmitted ? 'pointer' : 'not-allowed' }}
                                >
                                    تحقق من الإجابة
                                </button>
                            </div>
                        )}

                        {isSubmitted && (
                            <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', background: isCorrect ? '#d1fae5' : '#fee2e2', border: `1px solid ${isCorrect ? '#6ee7b7' : '#fca5a5'}` }}>
                                <p style={{ margin: 0, fontWeight: 'bold', color: isCorrect ? '#065f46' : '#991b1b', marginBottom: '4px' }}>
                                    {isCorrect ? '✅ إجابة صحيحة!' : '❌ إجابة خاطئة!'}
                                </p>
                                <p style={{ margin: 0, fontSize: '13px', color: isCorrect ? '#065f46' : '#991b1b' }}>
                                    الفكرة: {currentQ.idea} | {currentQ.chapter} | {currentQ.module}
                                </p>
                            </div>
                        )}

                        {isSubmitted && (
                            <button
                                onClick={handleNext}
                                style={{ marginTop: '20px', width: '100%', background: '#2C3531', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                السؤال التالي ➔
                            </button>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

type FinalSectionId = 'part-12' | 'part-3' | 'part-4'

type FinalSection = {
    id: FinalSectionId
    title: string
    subtitle: string
    icon: string
    path: string
    ideasCount: number
}

type SectionProgress = {
    reviewedIdeas?: string[]
    reviewCompleted?: boolean
    practiceCompleted?: boolean
}

const sections: FinalSection[] = [
    {
        id: 'part-12',
        title: 'الجزء الأول — Module 1 + Module 2',
        subtitle: 'راجع أفكار المودلين الأول والثاني ثم تدرب عليها مباشرة.',
        icon: '📘',
        path: '/workspace/101/final-review/part-12',
        ideasCount: 17
    },
    {
        id: 'part-3',
        title: 'الجزء الثاني — Module 3',
        subtitle: 'مراجعة شاملة للمودل الثالث ثم تدريب مباشر على جميع أفكاره.',
        icon: '📗',
        path: '/workspace/101/final-review/part-3',
        ideasCount: 7
    },
    {
        id: 'part-4',
        title: 'الجزء الثالث — Module 4',
        subtitle: 'مراجعة شاملة للمودل الرابع ثم تدريب مباشر على جميع أفكاره.',
        icon: '📙',
        path: '/workspace/101/final-review/part-4',
        ideasCount: 5
    }
]

export default function FinalReviewPage() {
    const [progressMap, setProgressMap] = useState<Record<string, SectionProgress>>({})

    useEffect(() => {
        if (typeof window === 'undefined') return

        const next: Record<string, SectionProgress> = {}

        sections.forEach((section) => {
            try {
                const saved = localStorage.getItem(`math101_final_${section.id}_progress`)
                next[section.id] = saved ? JSON.parse(saved) : {}
            } catch {
                next[section.id] = {}
            }
        })

        setProgressMap(next)
    }, [])

    return (
        <div
            style={{
                backgroundColor: '#FFF9E2',
                minHeight: '100vh',
                color: '#2C3531',
                fontFamily: 'sans-serif',
                paddingBottom: '70px'
            }}
        >
            <Navbar isLoggedIn={true} />

            <div style={{ maxWidth: '920px', margin: '36px auto', padding: '0 20px' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '14px',
                        flexWrap: 'wrap',
                        marginBottom: '22px'
                    }}
                >
                    <div>
                        <h1 style={{ margin: '0 0 7px', fontSize: '27px', fontWeight: 'bold' }}>
                            🏆 خطة مراجعة الفاينل - Math 101
                        </h1>

                        <p style={{ margin: 0, color: '#4A5550', fontSize: '14px', lineHeight: 1.7 }}>
                            راجع كل جزء ثم تدرب عليه مباشرة. جميع الأجزاء متاحة وتقدر تكمل من مكانك في أي وقت.
                        </p>
                    </div>

                    <Link
                        href="/workspace/101"
                        style={{
                            textDecoration: 'none',
                            background: '#CDD4B1',
                            color: '#2C3531',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 'bold'
                        }}
                    >
                        ← عودة للكورس
                    </Link>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '24px'
                    }}
                >
                    <Link
                        href="/workspace/101"
                        style={{
                            textDecoration: 'none',
                            color: '#2C3531',
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '7px'
                        }}
                    >
                        <div
                            style={{
                                width: '62px',
                                height: '62px',
                                borderRadius: '50%',
                                background: '#FEECD0',
                                border: '1px solid #e6dec5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '27px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                            }}
                        >
                            📚
                        </div>

                        <span
                            style={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: '#8c5521'
                            }}
                        >
                            بنك الأسئلة والقوانين
                        </span>
                    </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {sections.map((section) => {
                        const item = progressMap[section.id] || {}
                        const reviewed = Array.isArray(item.reviewedIdeas)
                            ? item.reviewedIdeas.length
                            : 0

                        return (
                            <div
                                key={section.id}
                                style={{
                                    background: '#ffffff',
                                    border: '1px solid #e6dec5',
                                    borderRadius: '18px',
                                    padding: '22px',
                                    boxShadow: '0 2px 7px rgba(0,0,0,0.03)'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '16px',
                                        alignItems: 'center',
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '14px',
                                            alignItems: 'center',
                                            flex: 1,
                                            minWidth: '260px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '14px',
                                                background: '#FEECD0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '25px',
                                                flexShrink: 0
                                            }}
                                        >
                                            {section.icon}
                                        </div>

                                        <div>
                                            <h2 style={{ margin: '0 0 6px', fontSize: '19px' }}>
                                                {section.title}
                                            </h2>

                                            <p
                                                style={{
                                                    margin: 0,
                                                    color: '#4A5550',
                                                    fontSize: '13px',
                                                    lineHeight: 1.7
                                                }}
                                            >
                                                {section.subtitle}
                                            </p>

                                            <div
                                                style={{
                                                    marginTop: '8px',
                                                    color: '#8c5521',
                                                    fontSize: '11px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                المراجعة: {reviewed}/{section.ideasCount}
                                                {item.practiceCompleted
                                                    ? ' • التدريب ✅'
                                                    : ' • التدريب غير مكتمل'}
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={section.path}
                                        style={{
                                            background: '#DCA27B',
                                            color: '#ffffff',
                                            textDecoration: 'none',
                                            padding: '10px 16px',
                                            borderRadius: '9px',
                                            fontWeight: 'bold',
                                            fontSize: '13px'
                                        }}
                                    >
                                        دخول الجزء ➔
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div
                    style={{
                        marginTop: '28px',
                        background: '#ffffff',
                        border: '1px solid #DCA27B',
                        borderRadius: '18px',
                        padding: '22px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '16px',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}
                    >
                        <div style={{ flex: 1, minWidth: '260px' }}>
                            <h2 style={{ margin: '0 0 7px', fontSize: '19px' }}>
                                🔥 تسريبات الفاينل
                            </h2>

                            <p
                                style={{
                                    margin: 0,
                                    color: '#4A5550',
                                    fontSize: '13px',
                                    lineHeight: 1.7
                                }}
                            >
                                أسئلة التدريب + مقطع شرح أسئلة التسريبات + مراجعة الأخطاء، كلها داخل صفحة واحدة.
                            </p>
                        </div>

                        <Link
                            href="/workspace/101/final-review/leaks"
                            style={{
                                background: '#DCA27B',
                                color: '#ffffff',
                                textDecoration: 'none',
                                padding: '10px 16px',
                                borderRadius: '9px',
                                fontWeight: 'bold',
                                fontSize: '13px'
                            }}
                        >
                            دخول تسريبات الفاينل ➔
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface GuideTipProps {
    id: string
    text: string
    position?: string
}

export default function GuideTip({ id, text }: GuideTipProps) {
    const [show, setShow] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const seen = localStorage.getItem(`esprmath_guide_${id}`)

        if (!seen) {
            const timer = setTimeout(() => {
                setShow(true)
            }, 600)
            return () => clearTimeout(timer)
        }
    }, [id])

    const closeTip = () => {
        localStorage.setItem(`esprmath_guide_${id}`, 'true')
        setShow(false)
    }

    if (!show || !mounted) return null

    // نستخدم createPortal لضمان ظهور الرسالة مباشرة في أعلى الهيكل العام وخارج أي حاويات قد تحجبها
    return createPortal(
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 999999,
                margin: 0,
                padding: '20px',
                boxSizing: 'border-box'
            }}
        >
            <div
                style={{
                    background: '#FFF9E2',
                    border: '2px solid #DCA27B',
                    borderRadius: '20px',
                    padding: '32px 28px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    color: '#2C3531',
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '450px',
                    fontFamily: 'sans-serif'
                }}
            >
                <div style={{ fontSize: '36px', marginBottom: '14px' }}>
                    👋
                </div>

                <p
                    style={{
                        whiteSpace: 'pre-line',
                        fontSize: '16px',
                        lineHeight: '1.8',
                        marginBottom: '24px',
                        fontWeight: '600'
                    }}
                >
                    {text}
                </p>

                <button
                    onClick={closeTip}
                    style={{
                        background: '#3A4D39',
                        color: '#fff',
                        border: 'none',
                        padding: '12px 30px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        width: '100%',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}
                >
                    تمام ✓
                </button>
            </div>
        </div>,
        document.body
    )
}
'use client'

import { useEffect, useState } from 'react'

interface GuideTipProps {
    id: string
    text: string
    position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function GuideTip({
                                     id,
                                     text,
                                     position = 'right'
                                 }: GuideTipProps) {

    const [show, setShow] = useState(false)

    useEffect(() => {
        const seen = localStorage.getItem(`esprmath_guide_${id}`)

        if (!seen) {
            setTimeout(() => {
                setShow(true)
            }, 800)
        }
    }, [id])


    const closeTip = () => {
        localStorage.setItem(
            `esprmath_guide_${id}`,
            'true'
        )

        setShow(false)
    }


    if (!show) return null


    const positions = {
        right: {
            left: '105%',
            top: '50%',
            transform: 'translateY(-50%)'
        },
        left: {
            right: '105%',
            top: '50%',
            transform: 'translateY(-50%)'
        },
        top: {
            bottom: '105%',
            left: '50%',
            transform: 'translateX(-50%)'
        },
        bottom: {
            top: '105%',
            left: '50%',
            transform: 'translateX(-50%)'
        }
    }


    return (
        <div
            style={{
                position: 'absolute',
                ...positions[position],
                width: '240px',
                zIndex: 1000
            }}
        >

            <div
                style={{
                    background: '#FFF9E2',
                    border: '1px solid #DCA27B',
                    borderRadius: '14px',
                    padding: '16px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                    color: '#2C3531',
                    textAlign: 'center'
                }}
            >

                <div
                    style={{
                        fontSize: '22px',
                        marginBottom: '8px'
                    }}
                >
                    👋
                </div>


                <p
                    style={{
                        whiteSpace: 'pre-line',
                        fontSize: '14px',
                        lineHeight: '1.7',
                        marginBottom: '12px'
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
                        padding: '8px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    تمام ✓
                </button>

            </div>


            {/* السهم */}
            <div
                style={{
                    position: 'absolute',
                    fontSize: '24px',
                    color: '#DCA27B',
                    [position === 'right'
                        ? 'left'
                        : position === 'left'
                            ? 'right'
                            : 'left']: '50%',
                    [position === 'top'
                        ? 'bottom'
                        : position === 'bottom'
                            ? 'top'
                            : 'auto']: '-25px'
                }}
            >
                ➜
            </div>


        </div>
    )
}
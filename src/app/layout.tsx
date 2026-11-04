'use client'

import { SpeedInsights } from "@vercel/speed-insights/next"
import './globals.css'
import 'katex/dist/katex.min.css'
import PWAInitializer from './PWAInitializer'
import { useEffect } from 'react'

export const dynamic = 'force-dynamic'

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    // تفعيل وتثبيت الـ Service Worker الخاص بالإشعارات والـ PWA تلقائياً عند فتح الموقع
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }, []);

    return (
        <html lang="ar" dir="rtl">
        <head>
            <title>منصة المعلم الذكي | نظام إدارة الغيابات والجدول الدراسي</title>
            <meta name="description" content="منصة ذكية لمتابعة الحصص الدراسية، رصيد الغيابات، وحدود الحرمان لطلاب الجامعة." />
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#8B5E3C" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="EsprMath" />
        </head>
        <body>
        {children}
        <PWAInitializer />
        <SpeedInsights />
        </body>
        </html>
    )
}
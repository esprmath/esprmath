export const dynamic = 'force-dynamic'
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata, Viewport } from 'next'
import './globals.css'
import 'katex/dist/katex.min.css'
import PWAInitializer from './PWAInitializer'

export const metadata: Metadata = {
    title: 'منصة المعلم الذكي | نظام إدارة الغيابات والجدول الدراسي',
    description: 'منصة ذكية لمتابعة الحصص الدراسية، رصيد الغيابات، وحدود الحرمان لطلاب الجامعة.',
    manifest: '/manifest.json',
}

export const viewport: Viewport = {
    themeColor: '#2F5233', // تم تغيير اللون ليتناسب مع الهوية البصرية (اللون الأخضر الزيتي الخاص بالمنصة)
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ar" dir="rtl">
        <body>
        {children}
        <PWAInitializer />
        <SpeedInsights />
        </body>
        </html>
    )
}
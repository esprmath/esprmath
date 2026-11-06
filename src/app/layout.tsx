import type { Metadata, Viewport } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import 'katex/dist/katex.min.css'

export const metadata: Metadata = {
    title: 'EsprMath | شرح وتدريب الرياضيات الجامعية',
    description: 'شرح مبسط لمقررات الرياضيات الجامعية، مع تدريبات تفاعلية واختبارات ومعلم ذكي يساعدك خطوة بخطوة.',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'EsprMath',
    },
}

export const viewport: Viewport = {
    // لون شريط حالة الجوال بلون الصفحة، حتى يبان الشريط البني بنفس المسافة فوق الأزرار وتحتها
    themeColor: '#FFF9E2',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ar" dir="rtl">
            <body>
                {children}
                <SpeedInsights />
            </body>
        </html>
    )
}

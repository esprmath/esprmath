import type { Metadata, Viewport } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import 'katex/dist/katex.min.css'

const SITE_TITLE = 'EsprMath | شرح وتدريب الرياضيات الجامعية'
const SITE_DESCRIPTION = 'شرح مبسط لمقررات الرياضيات الجامعية، مع تدريبات تفاعلية واختبارات ومعلم ذكي يساعدك خطوة بخطوة.'

export const metadata: Metadata = {
    metadataBase: new URL('https://esprmath.com'),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    openGraph: {
        type: 'website',
        url: '/',
        siteName: 'EsprMath',
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        locale: 'ar_SA',
    },
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'EsprMath',
    },
}

export const viewport: Viewport = {
    // لون شريط حالة الجوال وما فوق الصفحة عند السحب لتحت بلون النافبار
    themeColor: '#8B5E3C',
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

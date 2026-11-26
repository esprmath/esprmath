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
    // رابط manifest ينضاف تلقائياً من app/manifest.ts
    icons: {
        icon: [
            { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    // الآيفون: يفتح بملء الشاشة من الشاشة الرئيسية وباسم قصير تحت الأيقونة
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'EsprMath',
    },
}

export const viewport: Viewport = {
    // لون شريط حالة الجوال وما فوق الصفحة عند السحب لتحت بلون النافبار (فاتح وداكن)
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#8B5E3C' },
        { media: '(prefers-color-scheme: dark)', color: '#4A3426' },
    ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <body>
                {/* الوضع الليلي: يطبقه قبل ما تنرسم الصفحة حتى ما تومض بالفاتح (يُحذف مع إلغاء الوضع الليلي) */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: "try{if(localStorage.getItem('theme')==='dark'){var r=document.documentElement;r.setAttribute('data-theme','dark');if(location.pathname==='/')r.setAttribute('data-dark-native','')}}catch(e){}",
                    }}
                />
                {/* حدث تثبيت التطبيق يوصل بدري قبل ما تجهز الجولة، فنحفظه لها (OnboardingTour) */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: "window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__esprInstall=e})",
                    }}
                />
                {children}
                <SpeedInsights />
            </body>
        </html>
    )
}

import type { MetadataRoute } from 'next'

// ملف التطبيق (PWA): يخلي الموقع ينضاف للشاشة الرئيسية ويفتح كتطبيق بدون شريط المتصفح
export default function manifest(): MetadataRoute.Manifest {
    return {
        id: '/',
        name: 'EsprMath | شرح وتدريب الرياضيات الجامعية',
        short_name: 'EsprMath',
        description: 'شرح مبسط لمقررات الرياضيات الجامعية، مع تدريبات تفاعلية واختبارات ومعلم ذكي يساعدك خطوة بخطوة.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        lang: 'ar',
        dir: 'rtl',
        background_color: '#FFF9E2',
        theme_color: '#8B5E3C',
        icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
    }
}

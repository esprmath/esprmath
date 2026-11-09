import type { MetadataRoute } from 'next'

const BASE = 'https://esprmath.com'

// الصفحات العامة فقط، وصفحات الكورسات تحتاج تسجيل دخول فما تنفهرس
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
        { url: `${BASE}/signup`, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    ]
}

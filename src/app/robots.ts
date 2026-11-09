import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/workspace', '/api', '/absence', '/update-password'],
        },
        sitemap: 'https://esprmath.com/sitemap.xml',
        host: 'https://esprmath.com',
    }
}

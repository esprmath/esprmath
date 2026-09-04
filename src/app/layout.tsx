export const dynamic = 'force-dynamic'
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from 'next'
import './globals.css'
import 'katex/dist/katex.min.css'

export const metadata: Metadata = {
  title: 'منصة المعلم الذكي',
  description: 'تعلم الجبر الخطي مع مساعد ذكاء اصطناعي',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}

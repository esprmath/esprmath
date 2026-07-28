'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) router.push('/login')
        })
    }, [router])

    return <>{children}</>
}
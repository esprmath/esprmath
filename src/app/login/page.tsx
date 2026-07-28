'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      setLoading(false)
      return
    }

    window.location.href = '/workspace/204'
  }

  return (
      <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0, paddingBottom: '60px' }}>
        <Navbar isLoggedIn={false} />
        <div style={{ maxWidth: '440px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e6dec5',
            borderRadius: '16px',
            padding: '32px 24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            textAlign: 'right',
            color: '#2C3531'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2C3531', marginBottom: '8px', textAlign: 'center' }}>
              تسجيل الدخول
            </h2>
            <p style={{ color: '#4A5550', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
              ادخل بياناتك للوصول إلى الكورس والمعلم الذكي
            </p>

            {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                  {error}
                </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#2C3531', marginBottom: '6px' }}>
                  البريد الإلكتروني
                </label>
                <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #e6dec5',
                      backgroundColor: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#2C3531',
                      direction: 'ltr',
                      textAlign: 'right'
                    }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#2C3531', marginBottom: '6px' }}>
                  كلمة المرور
                </label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #e6dec5',
                      backgroundColor: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#2C3531',
                      direction: 'ltr',
                      textAlign: 'right'
                    }}
                />
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#DCA27B',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(220, 162, 123, 0.3)',
                    transition: 'opacity 0.2s'
                  }}
              >
                {loading ? 'جاري الدخول...' : 'دخول'}
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#4A5550' }}>
              <p style={{ margin: 0 }}>
                ليس لديك حساب؟{' '}
                <Link href="/signup" style={{ color: '#DCA27B', fontWeight: 'bold', textDecoration: 'none' }}>
                  إنشاء حساب
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}
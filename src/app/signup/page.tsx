'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)


    async function handleSignup(e: React.FormEvent) {

        e.preventDefault()

        setLoading(true)
        setError('')
        setSuccess('')


        const { error: signUpError } = await supabase.auth.signUp({

            email,

            password,

            options: {

                data: {
                    full_name: fullName,
                }

            }

        })


        if (signUpError) {

            setError(signUpError.message)

            setLoading(false)

            return
        }


        // بعد إنشاء الحساب ننتظر تأكيد البريد
        setSuccess(
            'تم إنشاء الحساب بنجاح ✅ تم إرسال رابط تأكيد إلى بريدك الإلكتروني. قم بتأكيد البريد ثم سجل الدخول.'
        )


        setLoading(false)

    }


    return (

        <div
            style={{
                backgroundColor:'#FFF9E2',
                minHeight:'100vh',
                fontFamily:'sans-serif',
                paddingBottom:'60px'
            }}
        >

            <Navbar isLoggedIn={false}/>


            <div
                style={{
                    maxWidth:'440px',
                    margin:'40px auto',
                    padding:'0 20px'
                }}
            >


                <div
                    style={{
                        background:'#fff',
                        border:'1px solid #e6dec5',
                        borderRadius:'16px',
                        padding:'32px 24px',
                        textAlign:'right'
                    }}
                >


                    <h2
                        style={{
                            textAlign:'center',
                            color:'#2C3531'
                        }}
                    >
                        إنشاء حساب جديد
                    </h2>


                    <p
                        style={{
                            textAlign:'center',
                            color:'#4A5550'
                        }}
                    >
                        سجل الآن وابدأ رحلتك التعليمية
                    </p>



                    {error && (

                        <div
                            style={{
                                background:'#fee2e2',
                                color:'#991b1b',
                                padding:'10px',
                                borderRadius:'8px',
                                marginBottom:'20px',
                                textAlign:'center'
                            }}
                        >
                            {error}
                        </div>

                    )}



                    {success && (

                        <div
                            style={{
                                background:'#dcfce7',
                                color:'#166534',
                                padding:'10px',
                                borderRadius:'8px',
                                marginBottom:'20px',
                                textAlign:'center'
                            }}
                        >
                            {success}
                        </div>

                    )}



                    <form onSubmit={handleSignup}>


                        <label>
                            الاسم الكامل
                        </label>

                        <input

                            type="text"

                            value={fullName}

                            onChange={(e)=>setFullName(e.target.value)}

                            required

                            style={inputStyle}

                        />



                        <label>
                            البريد الإلكتروني
                        </label>

                        <input

                            type="email"

                            value={email}

                            onChange={(e)=>setEmail(e.target.value)}

                            required

                            style={{
                                ...inputStyle,
                                direction:'ltr'
                            }}

                        />



                        <label>
                            كلمة المرور
                        </label>

                        <input

                            type="password"

                            value={password}

                            onChange={(e)=>setPassword(e.target.value)}

                            required

                            style={{
                                ...inputStyle,
                                direction:'ltr'
                            }}

                        />



                        <button

                            type="submit"

                            disabled={loading}

                            style={{
                                width:'100%',
                                padding:'12px',
                                background:'#DCA27B',
                                color:'#fff',
                                border:'none',
                                borderRadius:'8px',
                                fontWeight:'bold',
                                marginTop:'20px',
                                cursor:'pointer'
                            }}

                        >

                            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}

                        </button>


                    </form>



                    <div
                        style={{
                            textAlign:'center',
                            marginTop:'20px'
                        }}
                    >

                        عندك حساب؟

                        {' '}

                        <Link
                            href="/login"
                            style={{
                                color:'#DCA27B',
                                fontWeight:'bold'
                            }}
                        >
                            سجل دخول
                        </Link>

                    </div>


                </div>


            </div>


        </div>

    )

}



const inputStyle = {

    width:'100%',

    padding:'10px 14px',

    borderRadius:'8px',

    border:'1px solid #e6dec5',

    marginBottom:'16px',

    marginTop:'6px',

    boxSizing:'border-box' as const,

    fontSize:'14px'

}
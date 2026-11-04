'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { isAdminEmail } from '@/lib/admin'
import GuideTip from '@/components/GuideTip'

interface Course {
    id: string
    title: string
    description: string
    badge_color: string
    badge_text_color: string
    is_active: boolean
    requires_approval: boolean
}

const PRIMARY = '#8c5521'

export default function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState<string>('')
    const [userId, setUserId] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)

    const [courses, setCourses] = useState<Course[]>([])
    const [coursesLoading, setCoursesLoading] = useState(true)
    const [courseStatuses, setCourseStatuses] = useState<Record<string, string>>({})
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const isAdmin = isAdminEmail(userEmail)

    const fetchCourses = async (currentEmail?: string | null) => {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('id')
        setCoursesLoading(false)

        if (!error && data) {
            const visibleCourses = data.filter(course => isAdminEmail(currentEmail) || course.is_active === true)

            setCourses(visibleCourses)
            const initialStatuses: Record<string, string> = {}
            visibleCourses.forEach(course => {
                initialStatuses[course.id] = 'none'
            })
            setCourseStatuses(initialStatuses)
        }
    }

    const fetchUserApprovals = async (currentUserId: string, activeCourses: Course[]) => {
        const { data, error } = await supabase
            .from('user_courses')
            .select('course_id, is_approved')
            .eq('user_id', currentUserId)

        if (!error && data) {
            const statuses: Record<string, string> = {}
            activeCourses.forEach(course => {
                statuses[course.id] = 'none'
            })

            data.forEach((item) => {
                statuses[item.course_id] = item.is_approved ? 'approved' : 'pending'
            })

            setCourseStatuses(statuses)
        }
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const email = session?.user?.email || null
            setIsLoggedIn(!!session)
            setUserEmail(email)
            if (session?.user) {
                setUserId(session.user.id)
                const fullName = session.user.user_metadata?.full_name
                setUserName(fullName || '')
            }
            fetchCourses(email)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const email = session?.user?.email || null
            setIsLoggedIn(!!session)
            setUserEmail(email)
            if (session?.user) {
                setUserId(session.user.id)
                const fullName = session.user.user_metadata?.full_name
                setUserName(fullName || '')
                fetchCourses(email)
            } else {
                setUserId(null)
                setUserName('')
                setUserEmail(null)
                fetchCourses(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        if (userId && courses.length > 0) {
            fetchUserApprovals(userId, courses)
        }
    }, [userId, courses])

    const handleDirectCourseAccess = async (courseId: string) => {
        if (!userId) {
            setAlertMessage('يجب تسجيل الدخول أولاً.')
            setShowAlertModal(true)
            return
        }

        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
            setAlertMessage('يجب تسجيل الدخول أولاً.')
            setShowAlertModal(true)
            return
        }

        const studentName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || ''
        const studentEmail = session.user.email || ''

        const { data: existingRows, error: checkError } = await supabase
            .from('user_courses')
            .select('user_id, course_id')
            .eq('user_id', session.user.id)
            .eq('course_id', courseId)
            .limit(1)

        if (checkError) {
            setAlertMessage(`حدث خطأ أثناء التحقق من الكورس: ${checkError.message}`)
            setShowAlertModal(true)
            return
        }

        let accessError = null
        if (existingRows && existingRows.length > 0) {
            const { error } = await supabase
                .from('user_courses')
                .update({ is_approved: true, full_name: studentName, email: studentEmail })
                .eq('user_id', session.user.id)
                .eq('course_id', courseId)
            accessError = error
        } else {
            const { error } = await supabase
                .from('user_courses')
                .insert([{ user_id: session.user.id, course_id: courseId, is_approved: true, full_name: studentName, email: studentEmail }])
            accessError = error
        }

        if (accessError) {
            setAlertMessage(`حدث خطأ أثناء تفعيل الكورس: ${accessError.message}`)
            setShowAlertModal(true)
            return
        }

        localStorage.setItem(`course_approved_${session.user.id}_${courseId}`, 'true')
        localStorage.setItem('approved_course', courseId)
        window.location.href = `/workspace/${courseId}`
    }

    const handleRequestCourse = async (courseId: string) => {
        if (!userId) return

        const hasActiveOrPendingCourse = Object.values(courseStatuses).some(
            status => status === 'pending' || status === 'approved'
        )

        if (hasActiveOrPendingCourse) {
            setAlertMessage('⚠️ عذراً، يمكنك التقديم على كورس واحد فقط في نفس الوقت. يرجى إلغاء طلبك الحالي إذا أردت التبديل لكورس آخر.')
            setShowAlertModal(true)
            return
        }

        // الاسم والإيميل يظهران للمشرف في لوحة التحكم
        const { data: { session } } = await supabase.auth.getSession()
        const { error } = await supabase
            .from('user_courses')
            .insert([{
                user_id: userId,
                course_id: courseId,
                is_approved: false,
                full_name: session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || '',
                email: session?.user?.email || ''
            }])

        if (error) {
            setAlertMessage('حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى.')
            setShowAlertModal(true)
        } else {
            setAlertMessage('تم إرسال طلب الانضمام بنجاح! يمكنك تجربة الموديول الأول مجاناً الآن ⏳')
            setShowAlertModal(true)

            const updatedStatuses = { ...courseStatuses, [courseId]: 'pending' }
            setCourseStatuses(updatedStatuses)
        }
    }

    const handleCancelRequest = async (courseId: string) => {
        if (!userId) return

        const { error } = await supabase
            .from('user_courses')
            .delete()
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .eq('is_approved', false)

        if (error) {
            setAlertMessage('حدث خطأ أثناء إلغاء الطلب من قاعدة البيانات، حاول مرة أخرى.')
            setShowAlertModal(true)
        } else {
            setAlertMessage('🗑️ تم إلغاء الطلب وحذفه بنجاح من النظام.')
            setShowAlertModal(true)

            const updatedStatuses = { ...courseStatuses, [courseId]: 'none' }
            setCourseStatuses(updatedStatuses)
        }
    }

    const renderCourseActions = (course: Course) => {
        const courseId = course.id

        if (!isLoggedIn) {
            return (
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <Link href="/login" style={{ textDecoration: 'none', width: '100%' }}>
                        <button
                            style={{
                                background: PRIMARY,
                                color: '#ffffff',
                                border: 'none',
                                padding: '12px 15px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                width: '100%',
                                fontSize: '0.95rem'
                            }}
                        >
                            تسجيل الدخول لدخول الكورس 🔐
                        </button>
                    </Link>
                </div>
            )
        }

        if (!course.requires_approval) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={() => handleDirectCourseAccess(courseId)}
                        style={{
                            background: PRIMARY,
                            color: '#ffffff',
                            border: 'none',
                            padding: '11px 20px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        دخول الكورس مباشرة 🚀
                    </button>
                </div>
            )
        }

        const status = courseStatuses[courseId] || 'none'

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link href={`/workspace/${courseId}`} style={{ textDecoration: 'none' }}>
                    <button
                        style={{
                            background: PRIMARY,
                            color: '#ffffff',
                            border: 'none',
                            padding: '11px 20px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        {status === 'approved' ? 'دخول الكورس 🚀' : 'جرّب الموديول الأول مجانًا ✨'}
                    </button>
                </Link>

                {status === 'none' && (
                    <button
                        onClick={() => handleRequestCourse(courseId)}
                        style={{
                            background: '#ffffff',
                            color: PRIMARY,
                            border: `1px solid ${PRIMARY}`,
                            padding: '9px 20px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            width: '100%',
                            fontSize: '0.9rem'
                        }}
                    >
                        طلب انضمام لكامل الكورس 📬
                    </button>
                )}

                {status === 'pending' && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#FEECD0',
                            color: '#8c5521',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                        }}
                    >
                        <span>⏳ طلب الانضمام بانتظار موافقة المشرف</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                                type="button"
                                onClick={() => handleCancelRequest(courseId)}
                                title="إلغاء الطلب"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '32px',
                                    backgroundColor: '#b91c1c',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', color: '#2C3531', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
            <Navbar isLoggedIn={isLoggedIn} />

            {/* قسم الترحيب: مرفوع للأعلى، بالنص تماماً، وبحجم أكبر */}
            <header className="hero-container" style={{ textAlign: 'center', margin: '28px 0 0', padding: '10px 20px 15px 20px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* زر لوحة التحكم للمشرف فقط */}
                {isAdmin && (
                    <div style={{ marginBottom: '10px' }}>
                        <Link href="/admin" style={{ display: 'inline-block', background: '#ffffff', color: PRIMARY, border: '1px solid #dccfb2', padding: '6px 14px', borderRadius: '999px', fontWeight: 'bold', fontSize: '0.85rem', textDecoration: 'none' }}>
                            ⚙️ لوحة التحكم
                        </Link>
                    </div>
                )}

                <div style={{ position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
                    <GuideTip
                        id="home-welcome-general"
                        text="أهلاً بك في منصة EsprMath! 🚀 منصتك الذكية لتبسيط وتسهيل مقررات الرياضيات الجامعية."
                        position="bottom"
                    />
                </div>

                {isLoggedIn && (
                    <h2 style={{ fontSize: '1.2rem', color: PRIMARY, fontWeight: 'bold', marginBottom: '6px', marginTop: '4px', textAlign: 'center' }}>
                        مرحباً {userName || 'طالبنا العزيز'} 👋
                    </h2>
                )}

                <h1 className="hero-title" style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#2C3531', marginBottom: '6px', marginTop: isLoggedIn ? '0' : '4px', textAlign: 'center' }}>
                    {isLoggedIn ? 'رحلتك للـ A+ 🚀' : 'تبي الـ A+ ؟'}
                </h1>
                <p className="hero-subtitle" style={{ fontSize: '1.05rem', color: '#4A5550', margin: 0, textAlign: 'center', maxWidth: '600px' }}>
                    هنا اضمن لك تفهم كل سؤال يمر عليك بدون ما تضيع بالمصادر
                </p>
            </header>

            {/* قسم الكورسات: بمكان ثابت ومنفصل مع مسافة فاصلة أوسع */}
            <section className="courses-section" style={{ maxWidth: '1100px', margin: '22px auto 30px auto', padding: '0 20px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.3rem', color: '#2C3531', fontWeight: 'bold', margin: 0 }}>
                        📚 كورساتك المتاحة
                    </h3>
                </div>

                {coursesLoading && (
                    <p style={{ textAlign: 'center', color: '#4A5550', fontWeight: 'bold', padding: '30px 0' }}>جاري تحميل الكورسات... ⏳</p>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '16px' }}>
                    {courses.map((course) => {
                        return (
                            <div
                                key={course.id}
                                className="course-card"
                                style={{
                                    background: '#ffffff',
                                    border: '1px solid #e6dec5',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <div>
                                    <div className="course-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#2C3531' }}>{course.title}</h3>

                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {!course.is_active && (
                                                <span style={{ background: '#FEECD0', color: '#8c5521', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                    مخفي عن الطلاب 🔒
                                                </span>
                                            )}

                                            <span className="course-badge" style={{ background: course.badge_color, color: course.badge_text_color, padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                Math{course.id}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="course-description" style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                                        {course.description}
                                    </p>
                                </div>

                                <div>
                                    {renderCourseActions(course)}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* قسم قريباً في المنصة */}
            <section style={{ maxWidth: '1100px', margin: '0 auto 40px auto', padding: '0 20px', width: '100%' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.3rem', color: '#2C3531', fontWeight: 'bold', marginBottom: '8px' }}>
                        🚀 قريباً في EsprMath
                    </h3>
                    <p style={{ color: '#4A5550', fontSize: '0.95rem', margin: 0 }}>
                        كورسات جديدة قادمة قريباً بإذن الله ✨
                    </p>
                </div>
            </section>

            {showAlertModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <div style={{ backgroundColor: '#FFF9E2', border: '1px solid #d8dfb8', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px', textAlign: 'center', color: '#2C3531' }}>
                        <div style={{ fontSize: '36px', marginBottom: '12px' }}>📬</div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>حالة الطلب</h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#4A5550', lineHeight: '1.5' }}>{alertMessage}</p>
                        <button type="button" onClick={() => setShowAlertModal(false)} style={{ width: '100%', padding: '10px 16px', backgroundColor: PRIMARY, color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            حسناً، فهمت 👍
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
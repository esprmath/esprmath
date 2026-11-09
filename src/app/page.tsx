'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BrandName from '@/components/BrandName'
import { supabase } from '@/lib/supabase'
import { checkIsAdmin } from '@/lib/admin'

interface Course {
    id: string
    title: string
    description: string
    badge_color: string
    badge_text_color: string
    is_active: boolean
    requires_approval: boolean
}

const PRIMARY = 'var(--home-primary, #8c5521)'

const FEATURES = [
    {
        icon: '📖',
        title: 'كل فكرة بثلاث خطوات',
        text: 'شرح نظري مختصر، ثم مقطع فيديو يوضحها، ثم سؤال تطبيقي مباشرة. بسيطة وواضحة وبدون تشتت.',
    },
    {
        icon: '🤖',
        title: 'معلم ذكي معك أي وقت',
        text: 'فيكتور يشوف السؤال اللي قدامك، ويعطيك تلميح أو يحل معك خطوة بخطوة متى ما احتجته.',
    },
    {
        icon: '🔄',
        title: 'أكبر عدد من الأسئلة',
        text: 'أسئلة بأرقام وأشكال مختلفة تغطي كل أنماط الفكرة، عشان يثبت الفهم مو الحفظ.',
    },
    {
        icon: '🎯',
        title: 'جاهز ليوم الاختبار',
        text: 'اختبارات تجريبية بوقت، أفكار جاءت في اختبارات سابقة، ومراجعة لأخطائك قبل الاختبار.',
    },
]

// روابط تيليقرام أسفل الصفحة: الرابط الفارغ تظهر دائرته بدون ما تنضغط
const CONTACT_LINKS = [
    { title: 'تواصل معنا', href: 'https://t.me/Natlus_1' },
    { title: 'قناة التحديثات', href: 'https://t.me/esprmath' },
]

const sectionStyle: React.CSSProperties = { maxWidth: '1100px', margin: '0 auto 40px auto', padding: '0 20px', width: '100%' }
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }
const boxStyle: React.CSSProperties = { background: 'var(--home-card, #ffffff)', border: '1px solid var(--home-border, #e6dec5)', borderRadius: '16px', padding: '22px', textAlign: 'center' }
const sectionTitleStyle: React.CSSProperties = { fontSize: '1.4rem', color: 'var(--home-text, #2C3531)', fontWeight: 'bold', textAlign: 'center', margin: '0 0 18px 0' }

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

    const [isAdmin, setIsAdmin] = useState(false)

    const fetchCourses = async (currentEmail?: string | null) => {
        const [{ data, error }, admin] = await Promise.all([
            supabase.from('courses').select('*').order('id'),
            checkIsAdmin(currentEmail),
        ])
        setIsAdmin(admin)
        setCoursesLoading(false)

        if (!error && data) {
            const visibleCourses = data.filter(course => admin || course.is_active === true)

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
                            background: 'var(--home-card, #ffffff)',
                            color: 'var(--home-accent, #8c5521)',
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
                            background: 'var(--home-chip, #FEECD0)',
                            color: 'var(--home-accent, #8c5521)',
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
        // سكرول الصفحة العادي، وشريط التواصل ينزل لآخر الشاشة إذا كان المحتوى قصير
        <div style={{ backgroundColor: 'var(--home-bg, #FFF9E2)', minHeight: '100dvh', display: 'flex', flexDirection: 'column', color: 'var(--home-text, #2C3531)', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
            <Navbar isLoggedIn={isLoggedIn} />

            {/* قسم الترحيب: مرفوع للأعلى، بالنص تماماً، وبحجم أكبر */}
            <header className="hero-container" style={{ textAlign: 'center', margin: '28px 0 0', padding: '10px 20px 15px 20px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* زر لوحة التحكم للمشرف فقط */}
                {isAdmin && (
                    <div style={{ marginBottom: '10px' }}>
                        <Link href="/admin" style={{ display: 'inline-block', background: 'var(--home-card, #ffffff)', color: 'var(--home-accent, #8c5521)', border: '1px solid var(--home-border, #dccfb2)', padding: '6px 14px', borderRadius: '999px', fontWeight: 'bold', fontSize: '0.85rem', textDecoration: 'none' }}>
                            ⚙️ لوحة التحكم
                        </Link>
                    </div>
                )}

                {isLoggedIn && (
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--home-accent, #8c5521)', fontWeight: 'bold', marginBottom: '6px', marginTop: '4px', textAlign: 'center' }}>
                        مرحباً {userName || 'طالبنا العزيز'} 👋
                    </h2>
                )}

                <h1 className="hero-title" style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--home-text, #2C3531)', marginBottom: '6px', marginTop: isLoggedIn ? '0' : '4px', textAlign: 'center' }}>
                    {isLoggedIn ? 'رحلتك للـ A+ 🚀' : 'تبي الـ A+ ؟'}
                </h1>
                <p className="hero-subtitle" style={{ fontSize: '1.05rem', color: 'var(--home-muted, #4A5550)', margin: 0, textAlign: 'center', maxWidth: '600px' }}>
                    هنا اضمن لك تفهم كل سؤال يمر عليك بدون ما تضيع بالمصادر
                </p>
            </header>

            {/* قسم الكورسات: بمكان ثابت ومنفصل مع مسافة فاصلة أوسع */}
            <section className="courses-section" style={{ maxWidth: '1100px', margin: '22px auto 30px auto', padding: '0 20px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--home-text, #2C3531)', fontWeight: 'bold', margin: 0 }}>
                        📚 كورساتك المتاحة
                    </h3>
                </div>

                {coursesLoading && (
                    <p style={{ textAlign: 'center', color: 'var(--home-muted, #4A5550)', fontWeight: 'bold', padding: '30px 0' }}>جاري تحميل الكورسات... ⏳</p>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '16px' }}>
                    {courses.map((course) => {
                        return (
                            <div
                                key={course.id}
                                className="course-card"
                                style={{
                                    background: 'var(--home-card, #ffffff)',
                                    border: '1px solid var(--home-border, #e6dec5)',
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
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--home-text, #2C3531)' }}>{course.title}</h3>

                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {!course.is_active && (
                                                <span style={{ background: 'var(--home-chip, #FEECD0)', color: 'var(--home-accent, #8c5521)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                    مخفي عن الطلاب 🔒
                                                </span>
                                            )}

                                            <span className="course-badge" style={{ background: course.badge_color, color: course.badge_text_color, padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                Math{course.id}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="course-description" style={{ color: 'var(--home-muted, #4A5550)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
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
                <div style={{ background: 'var(--home-card, #ffffff)', border: '1px solid var(--home-border, #e6dec5)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--home-text, #2C3531)', fontWeight: 'bold', marginBottom: '8px' }}>
                        🚀 قريباً في <BrandName black />
                    </h3>
                    <p style={{ color: 'var(--home-muted, #4A5550)', fontSize: '0.95rem', margin: 0 }}>
                        كورسات جديدة قادمة قريباً بإذن الله ✨
                    </p>
                </div>
            </section>

            {/* ليه EsprMath */}
            <section style={{ ...sectionStyle, marginBottom: '50px' }}>
                <h2 style={sectionTitleStyle}>ليه <BrandName black />؟</h2>
                <div style={gridStyle}>
                    {FEATURES.map((f) => (
                        <div key={f.title} style={boxStyle}>
                            <div style={{ fontSize: '34px', marginBottom: '10px' }}>{f.icon}</div>
                            <h3 style={{ fontSize: '1.05rem', color: 'var(--home-accent, #8c5521)', fontWeight: 'bold', margin: '0 0 8px 0' }}>{f.title}</h3>
                            <p style={{ color: 'var(--home-muted, #4A5550)', fontSize: '0.92rem', lineHeight: 1.7, margin: 0 }}>{f.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* شريط التواصل في آخر الصفحة، ينزل لتحت إذا كان المحتوى قصير */}
            {/* خط متقطع بني بعرض الصفحة كامل، القطع أطول من dashed العادي */}
            <div style={{ marginTop: 'auto', height: '2px', backgroundImage: `repeating-linear-gradient(to left, ${PRIMARY} 0 18px, transparent 18px 30px)` }} />
            <footer dir="rtl" style={{ padding: '20px 24px 28px', display: 'flex', justifyContent: 'flex-start', gap: '28px', flexWrap: 'wrap' }}>
                {CONTACT_LINKS.map((c) => {
                    const circle = (
                        <span style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--home-card, #ffffff)', border: '2px solid #DCA27B', boxShadow: '0 2px 6px rgba(140,85,33,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* سهم الرسالة مثل شعار تيليقرام بلون الموقع */}
                            <svg width="26" height="26" viewBox="3 4 18.5 16" aria-hidden="true" style={{ display: 'block', fill: PRIMARY }}>
                                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                            </svg>
                        </span>
                    )
                    return (
                        <div key={c.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px' }}>
                            <span style={{ color: 'var(--home-accent, #8c5521)', fontWeight: 'bold', fontSize: '0.85rem' }}>{c.title}</span>
                            {c.href ? (
                                <a href={c.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.title} على تيليقرام`}>
                                    {circle}
                                </a>
                            ) : (
                                <span title="قريبًا">{circle}</span>
                            )}
                        </div>
                    )
                })}
                <div style={{ display: 'flex', alignItems: 'flex-end', marginInlineStart: 'auto' }}>
                    <Link href="/terms" style={{ color: 'var(--home-accent, #8c5521)', fontSize: '0.85rem', fontWeight: 'bold' }}>الشروط والأحكام</Link>
                </div>
            </footer>

            {showAlertModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <div style={{ backgroundColor: 'var(--home-bg, #FFF9E2)', border: '1px solid var(--home-border, #d8dfb8)', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px', textAlign: 'center', color: 'var(--home-text, #2C3531)' }}>
                        <div style={{ fontSize: '36px', marginBottom: '12px' }}>📬</div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>حالة الطلب</h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--home-muted, #4A5550)', lineHeight: '1.5' }}>{alertMessage}</p>
                        <button type="button" onClick={() => setShowAlertModal(false)} style={{ width: '100%', padding: '10px 16px', backgroundColor: PRIMARY, color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            حسناً، فهمت 👍
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
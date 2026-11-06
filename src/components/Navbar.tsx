'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { TOUR_EVENTS } from '@/components/OnboardingTour'
import { authErrorText, MIN_PASSWORD } from '@/lib/authErrors'

interface NavbarProps {
    isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const isHomePage = pathname === '/'

    const [userName, setUserName] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [studentId, setStudentId] = useState<string | null>(null)
    const [courseApprovalStatus, setCourseApprovalStatus] = useState<boolean>(false)
    const [approvedCourseId, setApprovedCourseId] = useState<string | null>(null)
    const [showMenu, setShowMenu] = useState(false)
    const [showAuthDropdown, setShowAuthDropdown] = useState(false)

    const [showEditModal, setShowEditModal] = useState(false)
    const [newFullName, setNewFullName] = useState('')
    const [newStudentId, setNewStudentId] = useState('')
    const [loadingName, setLoadingName] = useState(false)

    // حالات مودال تغيير كلمة المرور المستقل
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [loadingPassword, setLoadingPassword] = useState(false)

    const [showCalendarModal, setShowCalendarModal] = useState(false)
    const [examDate, setExamDate] = useState<string | null>(null)
    const [loadingExamDate, setLoadingExamDate] = useState(false)

    const [isExamPromptMinimized, setIsExamPromptMinimized] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('exam_prompt_minimized') === 'true'
        }
        return false
    })

    const handleToggleMinimize = (minimized: boolean) => {
        setIsExamPromptMinimized(minimized)
        if (typeof window !== 'undefined') {
            localStorage.setItem('exam_prompt_minimized', String(minimized))
        }
    }

    const [currentMonthOffset, setCurrentMonthOffset] = useState<number>(0)
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const menuRef = useRef<HTMLDivElement>(null)
    const authDropdownRef = useRef<HTMLDivElement>(null)

    const fetchUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const fullName = user.user_metadata?.full_name
            setUserName(fullName || 'طالبنا العزيز')
            setUserEmail(user.email || '')
            setNewFullName(fullName || '')

            const { data: coursesData, error: coursesError } = await supabase
                .from('user_courses')
                .select('course_id, exam_date, is_approved, username')
                .eq('user_id', user.id)

            if (!coursesError && coursesData && coursesData.length > 0) {
                const activeCourse = coursesData.find(c => c.is_approved) || coursesData[0]
                if (activeCourse.is_approved) {
                    setCourseApprovalStatus(true)
                    setApprovedCourseId(activeCourse.course_id)
                }
                if (activeCourse.exam_date) {
                    setExamDate(activeCourse.exam_date)
                }
                if (activeCourse.username) {
                    setStudentId(activeCourse.username)
                    setNewStudentId(activeCourse.username)
                }
            }
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserData()
        }
    }, [isLoggedIn])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
            if (authDropdownRef.current && !authDropdownRef.current.contains(event.target as Node)) {
                setShowAuthDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            setShowMenu(false)
            window.location.href = '/'
        } catch (err) {
            console.error('خطأ في تسجيل الخروج:', err)
        }
    }

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newFullName.trim()) return

        // اسم المستخدم اختياري: الفارغ يعني بدون اسم مستخدم
        const cleanStudentId = newStudentId.trim().replace(/^@/, '').toLowerCase()
        if (cleanStudentId && !/^[a-z0-9_]{3,30}$/.test(cleanStudentId)) {
            setAlertMessage('اسم المستخدم من 3 إلى 30 خانة: حروف إنجليزية أو أرقام أو _ فقط.')
            setShowAlertModal(true)
            return
        }

        setLoadingName(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            if (cleanStudentId !== (studentId ?? '')) {
                if (cleanStudentId) {
                    // الفحص من قاعدة البيانات لأن الطالب لا يرى سجلات غيره
                    const { data: available, error: checkError } = await supabase.rpc('username_available', { p_username: cleanStudentId })
                    if (!checkError && available === false) {
                        setAlertMessage('❌ اسم المستخدم هذا مأخوذ، اختر اسمًا ثانيًا.')
                        setShowAlertModal(true)
                        return
                    }
                }

                const { data: updated, error: usernameError } = await supabase
                    .from('user_courses')
                    .update({ username: cleanStudentId || null })
                    .eq('user_id', user.id)
                    .select('id')

                if (usernameError) {
                    setAlertMessage(usernameError.message.includes('USERNAME_TAKEN')
                        ? '❌ اسم المستخدم هذا مأخوذ، اختر اسمًا ثانيًا.'
                        : 'تعذر حفظ اسم المستخدم، جرب مرة ثانية.')
                    setShowAlertModal(true)
                    return
                }
                if (!updated || updated.length === 0) {
                    setAlertMessage('اسم المستخدم يُحفظ بعد ما تسجل في كورس. سجّل في كورس من الصفحة الرئيسية ثم جرّب.')
                    setShowAlertModal(true)
                    return
                }
            }

            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: newFullName.trim()
                }
            })

            if (error) {
                setAlertMessage('فشل تحديث البيانات، جرب مرة أخرى.')
                setShowAlertModal(true)
            } else {
                setUserName(newFullName.trim())
                setStudentId(cleanStudentId || null)
                setShowEditModal(false)
                setShowMenu(false)
                setAlertMessage('✅ تم تحديث الملف الشخصي بنجاح!')
                setShowAlertModal(true)
            }
        } catch (err) {
            console.error('خطأ أثناء تحديث البيانات:', err)
        } finally {
            setLoadingName(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmNewPassword) {
            setAlertMessage('❌ كلمة المرور الجديدة وتأكيدها غير متطابقتين.')
            setShowAlertModal(true)
            return
        }

        if (newPassword.length < MIN_PASSWORD) {
            setAlertMessage(`⚠️ كلمة المرور الجديدة يجب ألا تقل عن ${MIN_PASSWORD} أحرف أو أرقام.`)
            setShowAlertModal(true)
            return
        }

        setLoadingPassword(true)
        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: userEmail || '',
                password: oldPassword
            })

            if (signInError) {
                setAlertMessage(signInError.code === 'invalid_credentials'
                    ? '❌ كلمة المرور الحالية غير صحيحة. يرجى التأكد وإعادة المحاولة.'
                    : `❌ ${authErrorText(signInError)}`)
                setShowAlertModal(true)
                setLoadingPassword(false)
                return
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (updateError) {
                setAlertMessage(`❌ ${authErrorText(updateError)}`)
                setShowAlertModal(true)
            } else {
                setAlertMessage('✅ تم تغيير كلمة المرور بنجاح!')
                setShowAlertModal(true)
                setShowPasswordModal(false)
                setOldPassword('')
                setNewPassword('')
                setConfirmNewPassword('')
            }
        } catch (err) {
            console.error('خطأ أثناء تغيير كلمة المرور:', err)
            setAlertMessage('❌ حدث خطأ غير متوقع.')
            setShowAlertModal(true)
        } finally {
            setLoadingPassword(false)
        }
    }

    const saveSelectedDateToSupabase = async (dateStr: string) => {
        setLoadingExamDate(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setAlertMessage('⚠️ يجب تسجيل الدخول أولاً.')
                setShowAlertModal(true)
                return
            }

            if (!approvedCourseId) {
                setAlertMessage('⚠️ لا يوجد كورس مفعل لحفظ موعد الاختبار عليه.')
                setShowAlertModal(true)
                return
            }

            const { error } = await supabase
                .from('user_courses')
                .update({ exam_date: dateStr })
                .eq('user_id', user.id)
                .eq('course_id', approvedCourseId)

            if (error) {
                setAlertMessage(`❌ حدث خطأ أثناء حفظ تاريخ الاختبار: ${error.message}`)
                setShowAlertModal(true)
            } else {
                setExamDate(dateStr)
                setShowCalendarModal(false)
                window.dispatchEvent(new Event(TOUR_EVENTS.examDateSaved)) // تنقل جولة أول دخول للخطوة التالية
                setAlertMessage('✅ تم حفظ موعد اختبارك بنجاح!')
                setShowAlertModal(true)
            }
        } catch (err) {
            console.error('خطأ في حفظ تاريخ الاختبار:', err)
            setAlertMessage('❌ حدث خطأ غير متوقع.')
            setShowAlertModal(true)
        } finally {
            setLoadingExamDate(false)
        }
    }

    const getDaysRemaining = () => {
        if (!examDate) return null
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const exam = new Date(examDate)
        exam.setHours(0, 0, 0, 0)
        const diffTime = exam.getTime() - today.getTime()
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const daysLeft = getDaysRemaining()
    const isUrgent = daysLeft !== null && (daysLeft === 1 || daysLeft === 2)
    const hasUpcomingExam = daysLeft !== null && daysLeft >= 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const targetMonthDate = new Date(today.getFullYear(), today.getMonth() + currentMonthOffset, 1)
    const year = targetMonthDate.getFullYear()
    const month = targetMonthDate.getMonth()

    const monthNames = [
        'يناير (January)', 'فبراير (February)', 'مارس (March)', 'أبريل (April)',
        'مايو (May)', 'يونيو (June)', 'يوليو (July)', 'أغسطس (August)',
        'سبتمبر (September)', 'أكتوبر (October)', 'نوفمبر (November)', 'ديسمبر (December)'
    ]

    const firstDayIndex = targetMonthDate.getDay()
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate()

    const calendarDays = []
    for (let i = 0; i < firstDayIndex; i++) {
        calendarDays.push(null)
    }
    for (let d = 1; d <= totalDaysInMonth; d++) {
        const formattedMonth = String(month + 1).padStart(2, '0')
        const formattedDay = String(d).padStart(2, '0')
        calendarDays.push(`${year}-${formattedMonth}-${formattedDay}`)
    }

    return (
        <>
            <style jsx>{`
                .nav-container {
                    --btn-height: 36px;
                    --btn-font-size: 0.85rem;
                    --btn-padding-x: 0.75rem;
                    
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: nowrap;
                    padding: 1rem 1.5rem;
                    background-color: #8B5E3C;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    border-bottom: 1px solid #6B5744;
                    margin-bottom: 1.5rem;
                    position: relative;
                    z-index: 1000;
                    font-family: sans-serif;
                    box-sizing: border-box;
                }
                .nav-logo {
                    flex-shrink: 0;
                }
                .nav-left-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-shrink: 0;
                }

                @media (max-width: 768px) {
                    .nav-container {
                        padding: 0.5rem 0.75rem;
                        --btn-height: 32px;
                        --btn-font-size: 0.75rem;
                        --btn-padding-x: 0.5rem;
                    }
                    .nav-left-group {
                        gap: 8px;
                    }
                }
            `}</style>

            <nav className="nav-container">
                {/* 1. الشعار أقصى اليمين */}
                <div className="nav-logo">
                    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ffffff', lineHeight: '1.2' }}>
                            EsprMath 📐
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#FEECD0', letterSpacing: '1.5px', marginTop: '2px' }}>
                            YIC
                        </span>
                    </Link>
                </div>

                {/* 2. مجموعة اليسار: موعد الاختبار (بجانب الملف الشخصي مباشرة) + الملف الشخصي */}
                <div className="nav-left-group">
                    {/* زر موعد الاختبار يأتي يمين الملف الشخصي مباشرة */}
                    {isLoggedIn && !isHomePage && courseApprovalStatus && (
                        <>
                            {isExamPromptMinimized ? (
                                <button
                                    type="button"
                                    onClick={() => handleToggleMinimize(false)}
                                    title="إظهار مؤشر موعد الاختبار"
                                    data-tour="exam-date"
                                    style={{
                                        height: 'var(--btn-height)',
                                        padding: '0 var(--btn-padding-x)',
                                        borderRadius: '8px',
                                        backgroundColor: examDate ? (isUrgent ? '#fee2e2' : '#ffffff') : '#ffffff',
                                        border: '1px solid #6B5744',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'var(--btn-font-size)',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                        flexShrink: 0,
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    📝
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowCalendarModal(true)}
                                    data-tour="exam-date"
                                    style={{
                                        height: 'var(--btn-height)',
                                        padding: '0 var(--btn-padding-x)',
                                        backgroundColor: hasUpcomingExam ? (isUrgent ? '#fee2e2' : '#ffffff') : '#ffffff',
                                        color: hasUpcomingExam ? (isUrgent ? '#991b1b' : '#2C3531') : '#2C3531',
                                        border: '1px solid #6B5744',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        fontSize: 'var(--btn-font-size)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        whiteSpace: 'nowrap',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <span>{hasUpcomingExam ? (isUrgent ? '🚨' : '⏳') : '📌'}</span>
                                    <span>
                                        {/* بعد مرور الموعد يرجع الزر يطلب موعدًا جديدًا */}
                                        {hasUpcomingExam
                                            ? (daysLeft === 0
                                                ? 'اختبارك اليوم 🎯'
                                                : daysLeft === 1
                                                    ? 'باقي: يوم 🎯'
                                                    : daysLeft === 2
                                                        ? 'باقي: يومين 🎯'
                                                        : daysLeft! >= 3 && daysLeft! <= 10
                                                            ? `باقي: ${daysLeft} أيام 🎯`
                                                            : `باقي: ${daysLeft} يوم 🎯`)
                                            : 'تحديد موعد الاختبار'}
                                    </span>
                                </button>
                            )}
                        </>
                    )}

                    {isLoggedIn ? (
                        <div style={{ position: 'relative' }} ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setShowMenu(!showMenu)}
                                style={{
                                    height: 'var(--btn-height)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0 var(--btn-padding-x)',
                                    backgroundColor: '#ffffff',
                                    color: '#2C3531',
                                    border: '1px solid #6B5744',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: 'var(--btn-font-size)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    whiteSpace: 'nowrap',
                                    boxSizing: 'border-box'
                                }}
                            >
                                👤 {userName || 'الملف الشخصي'} ▾
                            </button>

                            {showMenu && (
                                <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: '120%',
                                    width: '280px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    zIndex: 50,
                                    border: '1px solid #6B5744',
                                    textAlign: 'right',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ marginBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B5744' }}>الحساب المسجل:</p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 0' }}>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: '#2C3531' }}>{userName}</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#7C9E6B', fontWeight: 'bold' }}>
                                                    {studentId ? <span dir="ltr">@{studentId}</span> : 'بدون اسم مستخدم'}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowEditModal(true)}
                                                title="تعديل بيانات الملف الشخصي"
                                                style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    backgroundColor: '#ffffff',
                                                    border: '2px solid #C4863A',
                                                    borderRadius: '50%',
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <span style={{ fontSize: '11px', lineHeight: 1 }}>✏️</span>
                                            </button>
                                        </div>
                                        <p style={{ margin: '4px 0 6px 0', fontSize: '0.75rem', color: '#6B5744', wordBreak: 'break-all' }}>{userEmail}</p>

                                        <div style={{
                                            marginTop: '8px',
                                            padding: '6px 10px',
                                            backgroundColor: '#f8fafc',
                                            borderRadius: '6px',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ fontSize: '0.75rem', color: '#6B5744', fontWeight: 'bold' }}>حالة الكورس:</span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: courseApprovalStatus ? '#e2f8ec' : '#fef3c7',
                                                color: courseApprovalStatus ? '#166534' : '#b45309'
                                            }}>
                                                {courseApprovalStatus ? '✅ مفعل' : '⏳ بانتظار الموافقة'}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => { setShowMenu(false); setShowPasswordModal(true); }}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            marginBottom: '8px',
                                            backgroundColor: '#FEECD0',
                                            color: '#8B5E3C',
                                            border: '1px solid #8B5E3C',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        🔑 تغيير كلمة المرور
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            backgroundColor: '#b91c1c',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        تسجيل الخروج 🚪
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ position: 'relative' }} ref={authDropdownRef} onMouseEnter={() => setShowAuthDropdown(true)} onMouseLeave={() => setShowAuthDropdown(false)}>
                            <button
                                type="button"
                                onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                                style={{
                                    height: 'var(--btn-height)',
                                    padding: '0 var(--btn-padding-x)',
                                    backgroundColor: '#ffffff',
                                    color: '#2C3531',
                                    border: '1px solid #6B5744',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontSize: 'var(--btn-font-size)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    whiteSpace: 'nowrap',
                                    boxSizing: 'border-box'
                                }}
                            >
                                تسجيل الدخول ▾
                            </button>
                            {showAuthDropdown && (
                                <div style={{ position: 'absolute', left: 0, top: '100%', paddingTop: '8px', width: '160px', zIndex: 50 }}>
                                    <div style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '12px', padding: '0.5rem', border: '1px solid #6B5744', display: 'flex', flexDirection: 'column', gap: '4px', boxSizing: 'border-box' }}>
                                        <Link href="/login" onClick={() => setShowAuthDropdown(false)} style={{ textDecoration: 'none', color: '#2C3531', padding: '0.5rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                                            🔑 تسجيل دخول
                                        </Link>
                                        <Link href="/signup" onClick={() => setShowAuthDropdown(false)} style={{ textDecoration: 'none', color: '#ffffff', backgroundColor: '#7C9E6B', padding: '0.5rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 'bold', textAlign: 'center' }}>
                                            ✨ إنشاء حساب
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* مودال تعديل الملف الشخصي */}
            {showEditModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2500, fontFamily: 'sans-serif', padding: '16px', boxSizing: 'border-box' }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #6B5744', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '380px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', color: '#2C3531', textAlign: 'right', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#2C3531' }}>✏️ تعديل بيانات الملف الشخصي</h3>
                            <button type="button" onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6B5744' }}>✕</button>
                        </div>
                        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>الاسم الكامل:</label>
                                <input type="text" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>اسم المستخدم (اختياري):</label>
                                <input type="text" dir="ltr" value={newStudentId} onChange={(e) => setNewStudentId(e.target.value)} placeholder="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', textAlign: 'right' }} />
                                <div style={{ fontSize: '0.72rem', color: '#6B5744', marginTop: '4px' }}>حروف إنجليزية وأرقام و _ فقط. اتركه فاضي إذا ما تبي.</div>
                            </div>
                            <button type="submit" disabled={loadingName} style={{ width: '100%', padding: '10px', backgroundColor: '#7C9E6B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', boxSizing: 'border-box' }}>
                                {loadingName ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* مودال تغيير كلمة المرور */}
            {showPasswordModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2500, fontFamily: 'sans-serif', padding: '16px', boxSizing: 'border-box' }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #6B5744', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '380px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', color: '#2C3531', textAlign: 'right', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#2C3531' }}>🔑 تغيير كلمة المرور</h3>
                            <button type="button" onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6B5744' }}>✕</button>
                        </div>
                        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>كلمة المرور الحالية:</label>
                                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', direction: 'ltr', textAlign: 'right' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>كلمة المرور الجديدة:</label>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder={`${MIN_PASSWORD} أحرف على الأقل`} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', direction: 'ltr', textAlign: 'right' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>تأكيد كلمة المرور الجديدة:</label>
                                <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', direction: 'ltr', textAlign: 'right' }} />
                            </div>
                            <button type="submit" disabled={loadingPassword} style={{ width: '100%', padding: '10px', backgroundColor: '#8B5E3C', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', boxSizing: 'border-box' }}>
                                {loadingPassword ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* مودال التقويم لتحديد موعد الاختبار */}
            {showCalendarModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2500, fontFamily: 'sans-serif', padding: '16px', boxSizing: 'border-box' }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #6B5744', padding: '20px', borderRadius: '16px', width: '100%', maxWidth: '340px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', color: '#2C3531', textAlign: 'center', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', color: '#2C3531' }}>📅 تحديد موعد الاختبار</h3>
                            <button type="button" onClick={() => setShowCalendarModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6B5744' }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            <button
                                type="button"
                                onClick={() => setCurrentMonthOffset(prev => Math.max(0, prev - 1))}
                                disabled={currentMonthOffset === 0}
                                style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', cursor: currentMonthOffset === 0 ? 'not-allowed' : 'pointer', opacity: currentMonthOffset === 0 ? 0.4 : 1 }}
                            >
                                ▶
                            </button>
                            <span>{monthNames[month]} {year}</span>
                            <button
                                type="button"
                                onClick={() => setCurrentMonthOffset(prev => Math.min(1, prev + 1))}
                                disabled={currentMonthOffset === 1}
                                style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', cursor: currentMonthOffset === 1 ? 'not-allowed' : 'pointer', opacity: currentMonthOffset === 1 ? 0.4 : 1 }}
                            >
                                ◀
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: '#6B5744' }}>
                            <span>أحد</span><span>إثنين</span><span>ثلاثاء</span><span>أربعاء</span><span>خميس</span><span>جمعة</span><span>سبت</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '16px' }}>
                            {calendarDays.map((dayStr, idx) => {
                                if (!dayStr) return <div key={idx} />
                                const dayNum = parseInt(dayStr.split('-')[2])
                                const isSelected = examDate === dayStr
                                const isToday = dayStr === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

                                const dayDate = new Date(dayStr)
                                dayDate.setHours(0, 0, 0, 0)
                                const isPast = dayDate < today

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={isPast}
                                        onClick={() => !isPast && saveSelectedDateToSupabase(dayStr)}
                                        style={{
                                            padding: '8px 0',
                                            backgroundColor: isSelected ? '#8B5E3C' : isToday ? '#FEECD0' : '#f8fafc',
                                            color: isSelected ? '#fff' : isPast ? '#cbd5e1' : '#2C3531',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                            cursor: isPast ? 'not-allowed' : 'pointer',
                                            opacity: isPast ? 0.5 : 1
                                        }}
                                    >
                                        {dayNum}
                                    </button>
                                )
                            })}
                        </div>
                        {examDate && (
                            <button
                                type="button"
                                onClick={() => handleToggleMinimize(true)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: '#f1f5f9',
                                    color: '#475569',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxSizing: 'border-box'
                                }}
                            >
                                تصغير المؤشر للشاشة 📉
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* مودال التنبيهات العامة */}
            {showAlertModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, fontFamily: 'sans-serif', padding: '16px', boxSizing: 'border-box' }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #6B5744', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '320px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', color: '#2C3531', textAlign: 'center', boxSizing: 'border-box' }}>
                        <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', fontWeight: 'bold', lineHeight: '1.5' }}>{alertMessage}</p>
                        <button
                            type="button"
                            onClick={() => setShowAlertModal(false)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#8B5E3C',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxSizing: 'border-box'
                            }}
                        >
                            حسناً
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
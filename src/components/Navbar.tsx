'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
                .select('course_id, exam_date, is_approved, "students-id"')
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
                if (activeCourse['students-id']) {
                    setStudentId(activeCourse['students-id'])
                    setNewStudentId(activeCourse['students-id'])
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

        const cleanStudentId = newStudentId.trim().toLowerCase()
        const idRegex = /^[a-z0-9_]*$/
        if (cleanStudentId && !idRegex.test(cleanStudentId)) {
            setAlertMessage('معرف الطالب يجب أن يتكون من أحرف إنجليزية، أرقام، أو شرطة سفلى (_) فقط.')
            setShowAlertModal(true)
            return
        }

        setLoadingName(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            if (cleanStudentId) {
                const { data: existingRecords, error: checkError } = await supabase
                    .from('user_courses')
                    .select('user_id, "students-id"')
                    .eq('"students-id"', cleanStudentId)

                if (!checkError && existingRecords && existingRecords.length > 0) {
                    const isUsedBySomeoneElse = existingRecords.some(record => record.user_id !== user.id)

                    if (isUsedBySomeoneElse) {
                        setAlertMessage('❌ عذراً، معرف الطالب (Student ID) هذا مستخدم من قبل طالب آخر. يرجى اختيار معرف مختلف.')
                        setShowAlertModal(true)
                        setLoadingName(false)
                        return
                    }
                }

                await supabase
                    .from('user_courses')
                    .update({ 'students-id': cleanStudentId })
                    .eq('user_id', user.id)
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
                setStudentId(cleanStudentId)
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

        if (newPassword.length < 6) {
            setAlertMessage('⚠️ كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف أو أرقام.')
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
                setAlertMessage('❌ كلمة المرور الحالية غير صحيحة. يرجى التأكد وإعادة المحاولة.')
                setShowAlertModal(true)
                setLoadingPassword(false)
                return
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (updateError) {
                setAlertMessage(`❌ حدث خطأ أثناء تحديث كلمة المرور: ${updateError.message}`)
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
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                backgroundColor: '#8B5E3C',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                borderBottom: '1px solid #6B5744',
                marginBottom: '2rem',
                position: 'relative',
                zIndex: 1000,
                fontFamily: 'sans-serif'
            }}>
                <div>
                    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', lineHeight: '1.2' }}>
                            EsprMath 📐
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#FEECD0', letterSpacing: '2px', marginTop: '3px' }}>
                            YIC
                        </span>
                    </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* زر "الضمير الغائب" يظهر دائماً في الشريط العلوي */}
                    <Link
                        href="/absence"
                        style={{
                            padding: '0.5rem 0.9rem',
                            backgroundColor: '#FEECD0',
                            color: '#8B5E3C',
                            border: '1px solid #6B5744',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>👤</span>
                        <span>الضمير الغائب</span>
                    </Link>

                    {isLoggedIn ? (
                        <>
                            {!isHomePage && courseApprovalStatus && (
                                <>
                                    {isExamPromptMinimized ? (
                                        <button
                                            type="button"
                                            onClick={() => handleToggleMinimize(false)}
                                            title="إظهار مؤشر موعد الاختبار"
                                            style={{
                                                width: '38px',
                                                height: '38px',
                                                borderRadius: '50%',
                                                backgroundColor: examDate ? (isUrgent ? '#fee2e2' : '#ffffff') : '#ffffff',
                                                border: '1px solid #6B5744',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.1rem',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            📝
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setShowCalendarModal(true)}
                                            style={{
                                                padding: '0.5rem 0.8rem',
                                                backgroundColor: examDate ? (isUrgent ? '#fee2e2' : '#ffffff') : '#ffffff',
                                                color: examDate ? (isUrgent ? '#991b1b' : '#2C3531') : '#2C3531',
                                                border: '1px solid #6B5744',
                                                borderRadius: '8px',
                                                fontWeight: 'bold',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <span>{examDate ? (isUrgent ? '🚨' : '⏳') : '📌'}</span>
                                            <span>
                                                {examDate
                                                    ? (daysLeft !== null && daysLeft >= 0
                                                        ? (daysLeft === 0
                                                            ? 'اختبارك اليوم 🎯'
                                                            : daysLeft === 1
                                                                ? 'باقي على اختبارك: يوم 🎯'
                                                                : daysLeft === 2
                                                                    ? 'باقي على اختبارك: يومين 🎯'
                                                                    : daysLeft >= 3 && daysLeft <= 10
                                                                        ? `باقي على اختبارك: ${daysLeft} ايام 🎯`
                                                                        : `باقي على اختبارك: ${daysLeft} يوم 🎯`)
                                                        : 'تم تحديد موعد الاختبار')
                                                    : 'تحديد موعد الاختبار'}
                                            </span>
                                        </button>
                                    )}
                                </>
                            )}

                            <div style={{ position: 'relative' }} ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowMenu(!showMenu)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 0.8rem',
                                        backgroundColor: '#ffffff',
                                        color: '#2C3531',
                                        border: '1px solid #6B5744',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    👤 {userName || 'الملف الشخصي'} ▾
                                </button>

                                {showMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '120%',
                                        width: '290px',
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        zIndex: 50,
                                        border: '1px solid #6B5744',
                                        textAlign: 'right'
                                    }}>
                                        <div style={{ marginBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B5744' }}>الحساب المسجل:</p>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 0' }}>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: '#2C3531' }}>{userName}</p>
                                                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#7C9E6B', fontWeight: 'bold' }}>
                                                        ID: {studentId || 'غير محدد'}
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
                                            <p style={{ margin: '4px 0 6px 0', fontSize: '0.75rem', color: '#6B5744' }}>{userEmail}</p>

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
                                                    {courseApprovalStatus ? '✅ مفعل وموافق عليه' : '⏳ بانتظار الموافقة'}
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
                                                fontWeight: 'bold'
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
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            تسجيل الخروج 🚪
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ position: 'relative' }} ref={authDropdownRef} onMouseEnter={() => setShowAuthDropdown(true)} onMouseLeave={() => setShowAuthDropdown(false)}>
                            <button
                                type="button"
                                onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#ffffff',
                                    color: '#2C3531',
                                    border: '1px solid #6B5744',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                            >
                                تسجيل الدخول ▾
                            </button>
                            {showAuthDropdown && (
                                <div style={{ position: 'absolute', left: 0, top: '100%', paddingTop: '8px', width: '160px', zIndex: 50 }}>
                                    <div style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '12px', padding: '0.5rem', border: '1px solid #6B5744', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <Link href="/login" onClick={() => setShowAuthDropdown(false)} style={{ textDecoration: 'none', color: '#2C3531', padding: '0.5rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                                            🔑 تسجيل دخول
                                        </Link>
                                        <Link href="/signup" onClick={() => setShowAuthDropdown(false)} style={{ textDecoration: 'none', color: '#ffffff', backgroundColor: '#7C9E6B', padding: '0.5rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 'bold' }}>
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
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2500, fontFamily: 'sans-serif' }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #6B5744', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '380px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', color: '#2C3531', textAlign: 'right' }}>
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
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>معرف الطالب (Student ID):</label>
                                <input type="text" value={newStudentId} onChange={(e) => setNewStudentId(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                            </div>
                            <button type="submit" disabled={loadingName} style={{ width: '100%', padding: '10px', backgroundColor: '#7C9E6B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
                                {loadingName ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* مودال تغيير كلمة المرور */}
            {showPasswordModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2500, fontFamily: 'sans-serif' }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #6B5744', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '380px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', color: '#2C3531', textAlign: 'right' }}>
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
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="6 أحرف على الأقل" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', direction: 'ltr', textAlign: 'right' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>تأكيد كلمة المرور الجديدة:</label>
                                <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', direction: 'ltr', textAlign: 'right' }} />
                            </div>
                            <button type="submit" disabled={loadingPassword} style={{ width: '100%', padding: '10px', backgroundColor: '#8B5E3C', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
                                {loadingPassword ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* مودال التقويم لتحديد موعد الاختبار */}
            {showCalendarModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2500, fontFamily: 'sans-serif' }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #6B5744', padding: '20px', borderRadius: '16px', width: '90%', maxWidth: '340px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', color: '#2C3531', textAlign: 'center' }}>
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
                                    cursor: 'pointer'
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
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, fontFamily: 'sans-serif' }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #6B5744', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '320px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', color: '#2C3531', textAlign: 'center' }}>
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
                                cursor: 'pointer'
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
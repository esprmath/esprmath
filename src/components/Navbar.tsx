'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface NavbarProps {
    isLoggedIn: boolean;
}

interface UserCourseInfo {
    courseId: string;
    isApproved: boolean;
    examDate: string | null;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
    const router = useRouter()
    const [userName, setUserName] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [studentId, setStudentId] = useState<string | null>(null)

    const [userCourse, setUserCourse] = useState<UserCourseInfo | null>(null)
    const [hasCourseRecord, setHasCourseRecord] = useState<boolean>(false)

    const [showMenu, setShowMenu] = useState(false)
    const [showAuthDropdown, setShowAuthDropdown] = useState(false)

    const [showEditModal, setShowEditModal] = useState(false)
    const [newFullName, setNewFullName] = useState('')
    const [newStudentId, setNewStudentId] = useState('')
    const [loadingName, setLoadingName] = useState(false)

    const [showCalendarModal, setShowCalendarModal] = useState(false)
    const [loadingExamDate, setLoadingExamDate] = useState(false)

    const [calendarMonthOffset, setCalendarMonthOffset] = useState<number>(0)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)

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

    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const menuRef = useRef<HTMLDivElement>(null)
    const authDropdownRef = useRef<HTMLDivElement>(null)

    const fetchUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const fullName = user.user_metadata?.full_name
            const sId = user.user_metadata?.student_id

            setUserName(fullName || 'طالبنا العزيز')
            setUserEmail(user.email || '')
            setStudentId(sId || '')

            setNewFullName(fullName || '')
            setNewStudentId(sId || '')

            const { data: courseData } = await supabase
                .from('user_courses')
                .select('course_id, exam_date, is_approved, created_at')
                .eq('user_id', user.id)
                .not('exam_date', 'is', null)
                .order('created_at', { ascending: false })
                .limit(1)

            // لو ما لقى سجل بـ exam_date، جيب أي سجل
            const { data: fallbackData } = !courseData?.length ? await supabase
                .from('user_courses')
                .select('course_id, exam_date, is_approved, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1) : { data: null }

            const finalRecord = courseData?.[0] || fallbackData?.[0]

            if (finalRecord) {
                setHasCourseRecord(true)
                setUserCourse({
                    courseId: finalRecord.course_id || '204',
                    isApproved: finalRecord.is_approved ?? false,
                    examDate: finalRecord.exam_date || null
                })
                if (finalRecord.exam_date) {
                    setSelectedDate(finalRecord.exam_date)
                }
            } else {
                setHasCourseRecord(false)
                setUserCourse(null)
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
            setAlertMessage('معرف الطالب (Student ID) يجب أن يتكون من أحرف إنجليزية، أرقام، أو شرطة سفلى (_) فقط بدون مسافات.')
            setShowAlertModal(true)
            return
        }

        setLoadingName(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: newFullName.trim(),
                    student_id: cleanStudentId
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
                setAlertMessage('✅ تم تحديث الملف الشخصي ومعرف الطالب بنجاح!')
                setShowAlertModal(true)
            }
        } catch (err) {
            console.error('خطأ أثناء تحديث البيانات:', err)
        } finally {
            setLoadingName(false)
        }
    }

    const handleConfirmExamDate = async () => {
        if (!selectedDate) {
            setAlertMessage('⚠️ يرجى اختيار تاريخ من التقويم أولاً.')
            setShowAlertModal(true)
            return
        }

        setLoadingExamDate(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setAlertMessage('⚠️ يجب تسجيل الدخول أولاً.')
                setShowAlertModal(true)
                return
            }

            const currentCourseId = userCourse?.courseId || '204'

            const { data: existingData, error: fetchError } = await supabase
                .from('user_courses')
                .select('id')
                .eq('user_id', user.id)
                .eq('course_id', currentCourseId)
                .maybeSingle()

            if (fetchError) {
                console.error('Fetch Error:', fetchError)
                setAlertMessage(`❌ خطأ في التحقق من البيانات: ${fetchError.message}`)
                setShowAlertModal(true)
                return
            }

            let error = null

            if (existingData) {
                const res = await supabase
                    .from('user_courses')
                    .update({ exam_date: selectedDate })
                    .eq('user_id', user.id)
                    .eq('course_id', currentCourseId)
                error = res.error
            } else {
                const res = await supabase
                    .from('user_courses')
                    .insert({
                        user_id: user.id,
                        course_id: currentCourseId,
                        exam_date: selectedDate,
                        is_approved: false
                    })
                error = res.error
            }

            if (error) {
                console.error('Supabase Save Error:', error)
                setAlertMessage(`❌ حدث خطأ أثناء حفظ تاريخ الاختبار: ${error.message}`)
                setShowAlertModal(true)
            } else {
                setUserCourse(prev => prev ? { ...prev, examDate: selectedDate } : { courseId: currentCourseId, isApproved: userCourse?.isApproved ?? false, examDate: selectedDate })
                setHasCourseRecord(true)
                setShowCalendarModal(false)
                setAlertMessage('✅ تم حفظ موعد اختبارك بنجاح وبدأ العد التنازلي!')
                setShowAlertModal(true)
            }
        } catch (err) {
            console.error('خطأ غير متوقع في حفظ تاريخ الاختبار:', err)
            setAlertMessage('❌ حدث خطأ غير متوقع أثناء الحفظ.')
            setShowAlertModal(true)
        } finally {
            setLoadingExamDate(false)
        }
    }

    const handleProtectedCourseClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        const { data, error } = await supabase
            .from('user_courses')
            .select('course_id')
            .eq('user_id', user.id)
            .eq('is_approved', true)

        if (error || !data || data.length === 0) {
            setAlertMessage('🚫 عذراً، لا تمتلك أي كورس مفعل حالياً. يرجى طلب الانضمام لأحد الكورسات من الصفحة الرئيسية وانتظار موافقة المشرف.')
            setShowAlertModal(true)
            return
        }

        const approvedCourseId = data[0].course_id
        router.push(`/workspace/${approvedCourseId}`)
    }

    const getDaysRemaining = () => {
        if (!userCourse?.examDate) return null

        const now = new Date()
        const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())

        const [year, month, day] = userCourse.examDate.split('-').map(Number)
        const examUTC = Date.UTC(year, month - 1, day)

        const diffTime = examUTC - todayUTC
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const daysLeft = getDaysRemaining()
    const examDate = userCourse?.examDate

    const getExamButtonContent = () => {
        if (!examDate) {
            return {
                text: `تحديد موعد اختبار Math ${userCourse?.courseId || '204'}`,
                bgColor: '#ffffff',
                textColor: '#2C3531',
                icon: '📌'
            }
        }

        if (daysLeft === null || daysLeft < 0) {
            return {
                text: 'تم موعد الاختبار',
                bgColor: '#ffffff',
                textColor: '#2C3531',
                icon: '⏳'
            }
        }

        if (daysLeft === 0) {
            return {
                text: 'الاختبار اليوم!',
                bgColor: '#fee2e2',
                textColor: '#991b1b',
                icon: '🚨'
            }
        }

        if (daysLeft === 1) {
            return {
                text: 'باقي يوم على الاختبار',
                bgColor: '#fee2e2',
                textColor: '#991b1b',
                icon: '🚨'
            }
        }

        if (daysLeft === 2) {
            return {
                text: 'باقي يومين على الاختبار',
                bgColor: '#fee2e2',
                textColor: '#991b1b',
                icon: '🚨'
            }
        }

        if (daysLeft >= 3 && daysLeft <= 10) {
            return {
                text: `باقي ${daysLeft} ايام على الاختبار`,
                bgColor: '#ffffff',
                textColor: '#2C3531',
                icon: '⏳'
            }
        }

        return {
            text: `باقي ${daysLeft} يوم على الاختبار`,
            bgColor: '#ffffff',
            textColor: '#2C3531',
            icon: '⏳'
        }
    }

    const examButtonInfo = getExamButtonContent()

    const renderCalendarDays = () => {
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth()
        const currentDay = now.getDate()

        const targetDate = new Date(currentYear, currentMonth + calendarMonthOffset, 1)
        const year = targetDate.getFullYear()
        const month = targetDate.getMonth()

        const firstDayIndex = targetDate.getDay()
        const totalDays = new Date(year, month + 1, 0).getDate()

        const days = []
        for (let i = 0; i < firstDayIndex; i++) {
            days.push(<div key={`empty-${i}`} style={{ padding: '10px', color: '#cbd5e1' }}></div>)
        }

        for (let day = 1; day <= totalDays; day++) {
            const formattedMonth = String(month + 1).padStart(2, '0')
            const formattedDay = String(day).padStart(2, '0')
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`

            const cellDateUTC = Date.UTC(year, month, day)
            const todayUTC = Date.UTC(currentYear, currentMonth, currentDay)

            const isPast = cellDateUTC < todayUTC
            const isSelected = selectedDate === dateStr

            days.push(
                <button
                    key={dateStr}
                    type="button"
                    disabled={isPast}
                    onClick={() => !isPast && setSelectedDate(dateStr)}
                    style={{
                        padding: '10px 4px',
                        backgroundColor: isSelected ? '#C4863A' : 'transparent',
                        color: isPast ? '#cbd5e1' : (isSelected ? '#ffffff' : '#2C3531'),
                        border: isSelected ? '2px solid #8B5E3C' : '1px solid #f1f5f9',
                        borderRadius: '8px',
                        fontWeight: isSelected ? 'bold' : 'normal',
                        cursor: isPast ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        opacity: isPast ? 0.4 : 1,
                        transition: 'all 0.2s'
                    }}
                >
                    {day}
                </button>
            )
        }
        return days
    }

    const targetCalendarDate = new Date()
    targetCalendarDate.setMonth(targetCalendarDate.getMonth() + calendarMonthOffset)
    const monthNamesArabic = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    const currentMonthTitle = `${monthNamesArabic[targetCalendarDate.getMonth()]} (${targetCalendarDate.getFullYear()})`

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
                    {isLoggedIn ? (
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
                                        backgroundColor: examButtonInfo.bgColor,
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
                                        backgroundColor: examButtonInfo.bgColor,
                                        color: examButtonInfo.textColor,
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
                                    <span>{examButtonInfo.icon}</span>
                                    <span>{examButtonInfo.text}</span>
                                </button>
                            )}

                            <button
                                onClick={handleProtectedCourseClick}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#ffffff',
                                    color: '#2C3531',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem',
                                    border: '1px solid #6B5744',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                            >
                                📚 كورسك الحالي
                            </button>

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
                                                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#7C9E6B', fontWeight: 'bold' }}>ID: {studentId || 'غير محدد'}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowEditModal(true)}
                                                    title="تعديل البيانات"
                                                    style={{ width: '28px', height: '28px', backgroundColor: '#ffffff', border: '2px solid #C4863A', borderRadius: '50%', cursor: 'pointer', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}
                                                >
                                                    <span style={{ fontSize: '11px', lineHeight: 1 }}>✏️</span>
                                                </button>
                                            </div>
                                            <p style={{ margin: '4px 0 6px 0', fontSize: '0.75rem', color: '#6B5744' }}>{userEmail}</p>

                                            <div style={{ marginTop: '8px', padding: '6px 10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#6B5744', fontWeight: 'bold' }}>حالة الكورس:</span>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    backgroundColor: !hasCourseRecord ? '#f1f5f9' : (userCourse?.isApproved ? '#e2f8ec' : '#fef3c7'),
                                                    color: !hasCourseRecord ? '#475569' : (userCourse?.isApproved ? '#166534' : '#b45309')
                                                }}>
                                                    {!hasCourseRecord ? 'غير مشترك 🚫' : (userCourse?.isApproved ? `كورس ${userCourse.courseId} موافق عليه ✅` : `كورس ${userCourse?.courseId || '204'} بانتظار الموافقة ⏳`)}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            style={{ width: '100%', padding: '0.5rem', backgroundColor: '#b91c1c', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 'bold' }}
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
                                style={{ padding: '0.5rem 1rem', backgroundColor: '#ffffff', color: '#2C3531', border: '1px solid #6B5744', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                            >
                                تسجيل الدخول ▾
                            </button>
                            {showAuthDropdown && (
                                <div style={{ position: 'absolute', left: 0, top: '100%', paddingTop: '8px', width: '160px', zIndex: 50 }}>
                                    <div style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: '12px', padding: '0.5rem', border: '1px solid #6B5744', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <Link href="/login" onClick={() => setShowAuthDropdown(false)} style={{ textDecoration: 'none', color: '#2C3531', padding: '0.5rem', borderRadius: '8px', fontSize: '0.875rem' }}>🔑 تسجيل دخول</Link>
                                        <Link href="/signup" onClick={() => setShowAuthDropdown(false)} style={{ textDecoration: 'none', color: '#ffffff', backgroundColor: '#7C9E6B', padding: '0.5rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 'bold' }}>✨ إنشاء حساب</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {showCalendarModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2500,
                    fontFamily: 'sans-serif'
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #6B5744',
                        padding: '24px',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '400px',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                        color: '#2C3531',
                        textAlign: 'right'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowCalendarModal(false)}
                                    style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6B5744' }}
                                >
                                    ✕
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleToggleMinimize(true)
                                        setShowCalendarModal(false)
                                    }}
                                    style={{ padding: '2px 8px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', color: '#2C3531' }}
                                >
                                    تصغير ◀◀
                                </button>
                            </div>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#2C3531', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>اختيار موعد اختبار Math {userCourse?.courseId || '204'}</span>
                                <span>📅</span>
                            </h3>
                        </div>

                        <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: '#64748b', textAlign: 'right' }}>
                            حدد يوم الاختبار من الأيام القادمة:
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <button
                                type="button"
                                onClick={() => setCalendarMonthOffset(1)}
                                disabled={calendarMonthOffset === 1}
                                style={{ background: 'none', border: 'none', fontSize: '0.85rem', fontWeight: 'bold', cursor: calendarMonthOffset === 1 ? 'not-allowed' : 'pointer', color: calendarMonthOffset === 1 ? '#94a3b8' : '#8B5E3C' }}
                            >
                                الشهر القادم ▶
                            </button>

                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#2C3531' }}>
                                {currentMonthTitle}
                            </span>

                            <button
                                type="button"
                                onClick={() => setCalendarMonthOffset(0)}
                                disabled={calendarMonthOffset === 0}
                                style={{ background: 'none', border: 'none', fontSize: '0.85rem', fontWeight: 'bold', cursor: calendarMonthOffset === 0 ? 'not-allowed' : 'pointer', color: calendarMonthOffset === 0 ? '#94a3b8' : '#8B5E3C' }}
                            >
                                ◀ الشهر الحالي
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: '#6B5744', marginBottom: '8px' }}>
                            <div>أحد</div>
                            <div>إثنين</div>
                            <div>ثلاثاء</div>
                            <div>أربعاء</div>
                            <div>خميس</div>
                            <div>جمعة</div>
                            <div>سبت</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '16px' }}>
                            {renderCalendarDays()}
                        </div>

                        <button
                            type="button"
                            onClick={handleConfirmExamDate}
                            disabled={loadingExamDate || !selectedDate}
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                backgroundColor: selectedDate ? '#7C9E6B' : '#cbd5e1',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: selectedDate ? 'pointer' : 'not-allowed',
                                fontSize: '0.9rem'
                            }}
                        >
                            {loadingExamDate ? 'جاري الحفظ...' : 'تأكيد الموعد البدء 🚀'}
                        </button>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2500,
                    fontFamily: 'sans-serif'
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #6B5744',
                        padding: '24px',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '400px',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                        color: '#2C3531',
                        textAlign: 'right'
                    }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#8B5E3C' }}>تعديل بيانات الملف الشخصي ✏️</h3>
                        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>الاسم الكامل:</label>
                                <input
                                    type="text"
                                    value={newFullName}
                                    onChange={(e) => setNewFullName(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>معرف الطالب (Student ID):</label>
                                <input
                                    type="text"
                                    value={newStudentId}
                                    onChange={(e) => setNewStudentId(e.target.value)}
                                    placeholder="مثال: s12345"
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <button
                                    type="submit"
                                    disabled={loadingName}
                                    style={{ flex: 1, padding: '0.6rem', backgroundColor: '#7C9E6B', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    {loadingName ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    style={{ flex: 1, padding: '0.6rem', backgroundColor: '#f1f5f9', color: '#2C3531', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAlertModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 3000,
                    fontFamily: 'sans-serif'
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #6B5744',
                        padding: '20px',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '350px',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: '0 0 16px 0', fontSize: '0.95rem', color: '#2C3531', lineHeight: '1.5' }}>
                            {alertMessage}
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowAlertModal(false)}
                            style={{
                                width: '100%',
                                padding: '0.6rem',
                                backgroundColor: '#8B5E3C',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            حسناً 👍
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
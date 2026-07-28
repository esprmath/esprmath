'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface NavbarProps {
    isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
    const router = useRouter()
    const [userName, setUserName] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [studentId, setStudentId] = useState<string | null>(null)
    const [courseApprovalStatus, setCourseApprovalStatus] = useState<boolean | null>(null)
    const [showMenu, setShowMenu] = useState(false)
    const [showAuthDropdown, setShowAuthDropdown] = useState(false)

    // حالات نافذة تعديل الاسم ومعرف الطالب
    const [showEditModal, setShowEditModal] = useState(false)
    const [newFullName, setNewFullName] = useState('')
    const [newStudentId, setNewStudentId] = useState('')
    const [loadingName, setLoadingName] = useState(false)

    // حالات نافذة التقويم المخصصة لاختيار موعد الاختبار وتاريخ الاختبار
    const [showCalendarModal, setShowCalendarModal] = useState(false)
    const [examDate, setExamDate] = useState<string | null>(null)
    const [loadingExamDate, setLoadingExamDate] = useState(false)

    // حالة لتصغير شريط الاختبار إلى دائرة صغيرة (يتم استرجاعها من localStorage)
    const [isExamPromptMinimized, setIsExamPromptMinimized] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('exam_prompt_minimized') === 'true'
        }
        return false
    })

    // دالة لتغيير وحفظ حالة التصغير في localStorage
    const handleToggleMinimize = (minimized: boolean) => {
        setIsExamPromptMinimized(minimized)
        if (typeof window !== 'undefined') {
            localStorage.setItem('exam_prompt_minimized', String(minimized))
        }
    }

    // حالة التنقل بين الشهر الحالي والشهر القادم (0 = الشهر الحالي، 1 = الشهر القادم)
    const [currentMonthOffset, setCurrentMonthOffset] = useState<number>(0)

    // حالة التنبيهات
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const menuRef = useRef<HTMLDivElement>(null)
    const authDropdownRef = useRef<HTMLDivElement>(null)

    // جلب بيانات المستخدم وتاريخ الاختبار وحالة الكورس من Supabase عبر الـ View الجديد
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

            // جلب تفاصيل الكورس وحالة الموافقة وتاريخ الاختبار من الـ View الجديد
            const { data: profileData, error } = await supabase
                .from('student_profiles_view')
                .select('is_course_approved, exam_date') // أو حقل is_approved حسب ما أسميته في الـ View
                .eq('user_uid', user.id)
                .maybeSingle()

            // بديل آطمن إذا تم الاعتماد على جدول user_courses المباشر لضمان دقة البيانات
            const { data: courseData, error: courseError } = await supabase
                .from('user_courses')
                .select('exam_date, is_approved')
                .eq('user_id', user.id)
                .eq('course_id', '204')
                .maybeSingle()

            if (!courseError && courseData) {
                if (courseData.exam_date) setExamDate(courseData.exam_date)
                setCourseApprovalStatus(courseData.is_approved)
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

            // التحقق مما إذا كان student_id مستخدماً من قبل مستخدم آخر عبر الـ View الذي أنشأناه
            if (cleanStudentId) {
                const { data: existingUsers, error: checkError } = await supabase
                    .from('student_profiles_view')
                    .select('user_uid')
                    .eq('student_id', cleanStudentId)
                    .neq('user_uid', user.id) // استثناء المستخدم الحالي

                if (!checkError && existingUsers && existingUsers.length > 0) {
                    setAlertMessage('❌ عذراً، معرف الطالب (Student ID) هذا مستخدم بالفعل من قبل طالب آخر. يرجى اختيار معرف مختلف.')
                    setShowAlertModal(true)
                    setLoadingName(false)
                    return
                }
            }

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

    // حفظ موعد الاختبار المختار في Supabase
    const saveSelectedDateToSupabase = async (dateStr: string) => {
        setLoadingExamDate(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setAlertMessage('⚠️ يجب تسجيل الدخول أولاً.')
                setShowAlertModal(true)
                return
            }

            const { error } = await supabase
                .from('user_courses')
                .update({ exam_date: dateStr })
                .eq('user_id', user.id)
                .eq('course_id', '204')

            if (error) {
                console.error('Supabase Error:', error)
                setAlertMessage(`❌ حدث خطأ أثناء حفظ تاريخ الاختبار: ${error.message}`)
                setShowAlertModal(true)
            } else {
                setExamDate(dateStr)
                setShowCalendarModal(false)
                setAlertMessage('✅ تم حفظ موعد اختبارك بنجاح وسيبدأ العد التنازلي في المنصة!')
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
        if (!examDate) return null
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const exam = new Date(examDate)
        exam.setHours(0, 0, 0, 0)
        const diffTime = exam.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const daysLeft = getDaysRemaining()
    const isUrgent = daysLeft !== null && (daysLeft === 1 || daysLeft === 2)

    // --- منطق التقويم المخصص داخل النافذة المنبثقة ---
    const today = new Date()
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
                {/* الشعار */}
                <div>
                    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', lineHeight: '1.2' }}>
                            EsprMath 📐
                        </span>
                        <span style={{
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            color: '#FEECD0',
                            letterSpacing: '2px',
                            marginTop: '3px'
                        }}>
                            YIC
                        </span>
                    </Link>
                </div>

                {/* أزرار التنقل */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {isLoggedIn ? (
                        <>
                            {/* زر تنبيه موعد الاختبار */}
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
                                                ? (daysLeft === 1
                                                    ? 'باقي على اختبارك: يوم 🎯'
                                                    : daysLeft === 2
                                                        ? 'باقي على اختبارك: يومين 🎯'
                                                        : `باقي على اختبارك: ${daysLeft} يوم 🎯`)
                                                : 'تم تحديد موعد الاختبار')
                                            : 'تحديد موعد اختبار Math 204'}
                                    </span>
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
                                                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: '#2C3531' }}>
                                                        {userName}
                                                    </p>
                                                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#7C9E6B', fontWeight: 'bold' }}>
                                                        ID: {studentId || 'غير محدد'}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setShowEditModal(true)}
                                                    title="تعديل البيانات"
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

                                            <p style={{ margin: '4px 0 6px 0', fontSize: '0.75rem', color: '#6B5744' }}>
                                                {userEmail}
                                            </p>

                                            {/* عرض حالة الموافقة على الكورس */}
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
                        <div
                            style={{ position: 'relative' }}
                            ref={authDropdownRef}
                            onMouseEnter={() => setShowAuthDropdown(true)}
                            onMouseLeave={() => setShowAuthDropdown(false)}
                        >
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
                                    <div style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: '12px', padding: '0.5rem', border: '1px solid #6B5744', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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

            {/* --- نافذة تعديل بيانات الملف الشخصي (Modal) --- */}
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
                        maxWidth: '380px',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                        color: '#2C3531',
                        textAlign: 'right'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#2C3531' }}>
                                ✏️ تعديل بيانات الملف الشخصي
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6B5744' }}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>
                                    الاسم الكامل:
                                </label>
                                <input
                                    type="text"
                                    value={newFullName}
                                    onChange={(e) => setNewFullName(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.9rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>
                                    معرف الطالب (Student ID):
                                </label>
                                <input
                                    type="text"
                                    value={newStudentId}
                                    onChange={(e) => setNewStudentId(e.target.value)}
                                    placeholder="أحرف أو أرقام بدون مسافات"
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.9rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                                    يتم التحقق من عدم تكراره فورياً عبر قاعدة البيانات.
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <button
                                    type="submit"
                                    disabled={loadingName}
                                    style={{
                                        flex: 1,
                                        padding: '0.6rem',
                                        backgroundColor: '#7C9E6B',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        cursor: loadingName ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {loadingName ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        backgroundColor: '#f1f5f9',
                                        color: '#334155',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- نافذة التقويم المنبثقة لاختيار موعد الاختبار --- */}
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
                    zIndex: 2000,
                    fontFamily: 'sans-serif'
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #6B5744',
                        padding: '24px',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '380px',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                        boxSizing: 'border-box',
                        color: '#2C3531'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', color: '#2C3531' }}>
                                📅 اختر موعد اختبار Math 204
                            </h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleToggleMinimize(true)
                                        setShowCalendarModal(false)
                                    }}
                                    title="تصغير إلى دائرة"
                                    style={{
                                        background: '#f3f4f6',
                                        border: '1px solid #6B5744',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        color: '#2C3531',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ◄◄ تصغير
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowCalendarModal(false)}
                                    style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6B5744' }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#6B5744' }}>
                            حدد يوم الاختبار من الشهر الحالي أو الشهر القادم:
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e5e7eb' }}>
                            <button
                                type="button"
                                onClick={() => setCurrentMonthOffset(0)}
                                disabled={currentMonthOffset === 0}
                                style={{
                                    background: 'none', border: 'none', cursor: currentMonthOffset === 0 ? 'not-allowed' : 'pointer',
                                    fontSize: '0.75rem', fontWeight: 'bold', color: currentMonthOffset === 0 ? '#94a3b8' : '#2C3531'
                                }}
                            >
                                ◀ الشهر الحالي
                            </button>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2C3531' }}>
                                {monthNames[month]} {year}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentMonthOffset(1)}
                                disabled={currentMonthOffset === 1}
                                style={{
                                    background: 'none', border: 'none', cursor: currentMonthOffset === 1 ? 'not-allowed' : 'pointer',
                                    fontSize: '0.75rem', fontWeight: 'bold', color: currentMonthOffset === 1 ? '#94a3b8' : '#2C3531'
                                }}
                            >
                                الشهر القادم ▶
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.75rem', color: '#6B5744', fontWeight: 'bold', marginBottom: '6px' }}>
                            <span>أحد</span><span>إثنين</span><span>ثلاثاء</span><span>أربعاء</span><span>خميس</span><span>جمعة</span><span>سبت</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '16px' }}>
                            {calendarDays.map((dateStr, idx) => {
                                if (!dateStr) return <div key={idx} />

                                const dayNum = parseInt(dateStr.split('-')[2], 10)
                                const cellDate = new Date(dateStr)
                                cellDate.setHours(0, 0, 0, 0)
                                const todayNormalized = new Date()
                                todayNormalized.setHours(0, 0, 0, 0)

                                const isPast = cellDate < todayNormalized
                                const isSelected = examDate === dateStr

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={isPast || loadingExamDate}
                                        onClick={() => saveSelectedDateToSupabase(dateStr)}
                                        style={{
                                            aspectRatio: '1',
                                            backgroundColor: isSelected ? '#C4863A' : (isPast ? '#f1f5f9' : '#ffffff'),
                                            color: isSelected ? '#ffffff' : (isPast ? '#cbd5e1' : '#2C3531'),
                                            border: isSelected ? '2px solid #8B5E3C' : '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            fontWeight: isSelected ? 'bold' : 'normal',
                                            cursor: isPast ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {dayNum}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* --- نافذة التنبيهات العامة (Modal) --- */}
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
                        padding: '24px',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '320px',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                        textAlign: 'center',
                        color: '#2C3531'
                    }}>
                        <p style={{ margin: '0 0 16px 0', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            {alertMessage}
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowAlertModal(false)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                backgroundColor: '#8B5E3C',
                                color: '#ffffff',
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
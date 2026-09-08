'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import GuideTip from '@/components/GuideTip'

// تعريف هيكل الكورس القادم من Supabase
interface Course {
  id: string
  title: string
  description: string
  badge_color: string
  badge_text_color: string
  is_active: boolean
  requires_approval: boolean
}

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string>('')
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // حالة صلاحية الذكاء الاصطناعي للطالب من جدول profiles
  const [isAiAllowed, setIsAiAllowed] = useState(false)

  // حالة الكورسات القادمة من قاعدة البيانات
  const [courses, setCourses] = useState<Course[]>([])

  // حالات حالة الموافقة لكل كورس ديناميكياً
  const [courseStatuses, setCourseStatuses] = useState<Record<string, string>>({})

  // حالات نافذة التنبيه المخصصة داخل الموقع
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  // 🛑 ضع إيميلك الشخصي هنا الذي تسجل به دخولك كأدمن في المنصة
  const ADMIN_EMAIL = 'sofe@gmail.com'

  // دالة لجلب الكورسات (محدثة لتضمن ظهور الكورسات المعطلة للأدمن حصرياً)
  const fetchCourses = async (currentEmail?: string | null) => {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('id')

    if (!error && data) {
      console.log("All courses fetched from DB:", data);

      // تصفية الكورسات:
      const visibleCourses = data.filter(course => {
        if (currentEmail && currentEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          return true
        }
        return course.is_active === true
      })

      setCourses(visibleCourses)
      const initialStatuses: Record<string, string> = {}
      visibleCourses.forEach(course => {
        initialStatuses[course.id] = 'none'
      })
      setCourseStatuses(initialStatuses)
    } else {
      console.error("Error fetching courses:", error);
    }
  }

  // دالة لجلب بيانات الملف الشخصي وصلاحية الـ AI للمستخدم الحالي من جدول profiles
  const fetchUserProfile = async (currentUserId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('is_ai_allowed')
        .eq('id', currentUserId)
        .single()

    if (!error && data) {
      setIsAiAllowed(data.is_ai_allowed)
    }
  }

  // دالة لجلب حالة الاعتماد لكل كورس للمستخدم الحالي
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

      localStorage.setItem(`user_courses_statuses_${currentUserId}`, JSON.stringify(statuses))
      data.forEach((item) => {
        localStorage.setItem(`course_approved_${currentUserId}_${item.course_id}`, item.is_approved ? 'true' : 'false')
      })
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
        fetchUserProfile(session.user.id)
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
        fetchUserProfile(session.user.id)
        fetchCourses(email)
      } else {
        setUserId(null)
        setUserName('')
        setUserEmail(null)
        setIsAiAllowed(false)
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

  // تفعيل الدخول المباشر للكورس الذي لا يتطلب موافقة
  const handleDirectCourseAccess = async (courseId: string) => {
    if (!userId) {
      setAlertMessage('يجب تسجيل الدخول أولاً.')
      setShowAlertModal(true)
      return
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      setAlertMessage('يجب تسجيل الدخول أولاً.')
      setShowAlertModal(true)
      return
    }

    const studentName =
        session.user.user_metadata?.full_name ||
        session.user.user_metadata?.name ||
        ''

    const studentEmail = session.user.email || ''

    const { data: existingRows, error: checkError } = await supabase
        .from('user_courses')
        .select('user_id, course_id')
        .eq('user_id', session.user.id)
        .eq('course_id', courseId)
        .limit(1)

    if (checkError) {
      console.error('Check user_courses error:', checkError)
      setAlertMessage(`حدث خطأ أثناء التحقق من الكورس: ${checkError.message}`)
      setShowAlertModal(true)
      return
    }

    let accessError = null

    if (existingRows && existingRows.length > 0) {
      const { error } = await supabase
          .from('user_courses')
          .update({
            is_approved: true,
            full_name: studentName,
            email: studentEmail,
          })
          .eq('user_id', session.user.id)
          .eq('course_id', courseId)

      accessError = error
    } else {
      const { error } = await supabase
          .from('user_courses')
          .insert([
            {
              user_id: session.user.id,
              course_id: courseId,
              is_approved: true,
              full_name: studentName,
              email: studentEmail,
            },
          ])

      accessError = error
    }

    if (accessError) {
      console.error('Direct course access error:', accessError)
      setAlertMessage(`حدث خطأ أثناء تفعيل الكورس: ${accessError.message}`)
      setShowAlertModal(true)
      return
    }

    localStorage.setItem(
        `course_approved_${session.user.id}_${courseId}`,
        'true'
    )

    localStorage.setItem('approved_course', courseId)

    window.location.href = `/workspace/${courseId}`
  }

  // دالة طلب الانضمام للكورس مع التحقق من عدم امتلاك الطالب لكورس آخر مسبقاً
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

    const { error } = await supabase
        .from('user_courses')
        .insert([{ user_id: userId, course_id: courseId, is_approved: false }])

    if (error) {
      setAlertMessage('حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى.')
      setShowAlertModal(true)
    } else {
      setAlertMessage('تم إرسال طلب الانضمام بنجاح! يمكنك تجربة الموديول الأول مجاناً الآن ⏳')
      setShowAlertModal(true)

      const updatedStatuses = { ...courseStatuses, [courseId]: 'pending' }
      setCourseStatuses(updatedStatuses)
      localStorage.setItem(`user_courses_statuses_${userId}`, JSON.stringify(updatedStatuses))
      localStorage.setItem(`course_approved_${userId}_${courseId}`, 'false')
    }
  }

  // دالة إلغاء الطلب وحذفه نهائياً من قاعدة البيانات Supabase
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
      localStorage.setItem(`user_courses_statuses_${userId}`, JSON.stringify(updatedStatuses))
      localStorage.removeItem(`course_approved_${userId}_${courseId}`)
      localStorage.removeItem("approved_course")
    }
  }

  // دالة عرض الأزرار لكل كورس
  const renderCourseActions = (course: Course, buttonColor: string) => {
    const courseId = course.id

    if (!isLoggedIn) {
      return (
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <Link href="/login" style={{ textDecoration: 'none', width: '100%' }}>
              <button
                  style={{
                    background: buttonColor,
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
                  background: '#2F5233',
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
                  background: status === 'approved' ? '#2F5233' : buttonColor,
                  color: '#ffffff',
                  border: 'none',
                  padding: '11px 20px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '100%'
                }}
            >
              {status === 'approved'
                  ? 'دخول الكورس الكامل 🚀'
                  : 'دخول التجربة (Module 1 Free) ✨'}
            </button>
          </Link>

          {status === 'none' && (
              <button
                  onClick={() => handleRequestCourse(courseId)}
                  style={{
                    background: '#3A4D39',
                    color: '#ffffff',
                    border: 'none',
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
                  <a
                      href="https://t.me/YOUR_USERNAME"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="تواصل معي عبر تيليجرام لتسريع الموافقة"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#DCA27B',
                        color: '#ffffff',
                        borderRadius: '50%',
                        textDecoration: 'none',
                        fontSize: '15px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        flexShrink: 0
                      }}
                  >
                    💬
                  </a>

                  <button
                      type="button"
                      onClick={() => handleCancelRequest(courseId)}
                      title="إلغاء الطلب من قاعدة البيانات"
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
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        flexShrink: 0
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

        <header className="hero-container" style={{ textAlign: 'center', padding: '40px 20px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            <GuideTip
                id="home-welcome-general"
                text="أهلاً بك في منصة EsprMath! 🚀 منصتك الذكية لتبسيط وتسهيل مقررات الرياضيات الجامعية بخطوات منظمة وواضحة."
                position="bottom"
            />
          </div>

          {isLoggedIn && (
              <h2 style={{ fontSize: '1.25rem', color: '#DCA27B', fontWeight: 'bold', marginBottom: '15px', marginTop: '20px' }}>
                مرحباً {userName || 'طالبنا العزيز'} 👋 {isAiAllowed && <span style={{ fontSize: '0.85rem', background: '#2F5233', color: '#fff', padding: '2px 8px', borderRadius: '4px', marginLeft: '5px' }}>🤖 ميزة الـ AI مفعلة</span>} {userEmail === ADMIN_EMAIL && <span style={{ fontSize: '0.8rem', background: '#b91c1c', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>وضع الأدمن (الكورسات المعطلة ظاهرة لك وحدك)</span>}
              </h2>
          )}

          <h1 className="hero-title" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2C3531', marginBottom: '10px', marginTop: isLoggedIn ? '0' : '20px' }}>
            {isLoggedIn ? 'رحلتك للـ A+ 🚀' : 'تبي الـ A+ ؟'}
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.1rem', color: '#4A5550' }}>
            هنا اضمن لك تفهم كل سؤال يمر عليك بدون ما تضيع بالمصادر
          </p>
        </header>

        {/* قسم كورسات الطالب الديناميكي */}
        <section className="courses-section" style={{ maxWidth: '800px', margin: '0 auto 40px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#2C3531', fontWeight: 'bold', margin: 0 }}>
              📚 كورساتك المتاحة
            </h3>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {courses.map((course) => (
                <div key={course.id} className="course-card" style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
                  <div className="course-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#2C3531' }}>{course.title}</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {!course.is_active && (
                          <span style={{ background: '#FEECD0', color: '#8c5521', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        مخفي عن الطلاب 🔒
                      </span>
                      )}
                      {/* تم إزالة كلمة Math وعرض كود الكورس المحفوظ في الـ id مباشرة (مثل 101) */}
                      <span className="course-badge" style={{ background: course.badge_color, color: course.badge_text_color, padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {course.id}
                      </span>
                    </div>
                  </div>

                  <p className="course-description" style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                    {course.description}
                  </p>

                  <div>
                    {renderCourseActions(course, '#DCA27B')}
                  </div>
                </div>
            ))}
          </div>
        </section>

        {/* باقي الأقسام */}
        <section style={{ maxWidth: '800px', margin: '0 auto 40px auto', padding: '0 20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#2C3531', fontWeight: 'bold', marginBottom: '8px' }}>
              🚀 قريباً في EsprMath
            </h3>
            <p style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
              كورسات جديدة قادمة قريباً بإذن الله ✨
            </p>
          </div>
        </section>

        <section style={{ maxWidth: '800px', margin: '0 auto 40px auto', padding: '0 20px' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#2C3531', fontWeight: 'bold', marginBottom: '16px' }}>
            💡 عن EsprMath
          </h3>
          <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
            <p style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
              منصة تعليمية متخصصة صُممت خصيصاً لطلاب الجامعات لتسهيل فهم مواد الرياضيات المعقدة. نقدم شروحات مبسطة، ومسائل محلولة خطوة بخطوة، مع متابعة دقيقة لمستوى تقدمك لتضمن التفوق وتحقيق أعلى الدرجات بكل إتقان.
            </p>
          </div>
        </section>

        <section style={{ maxWidth: '800px', margin: '0 auto 60px auto', padding: '0 20px' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#2C3531', fontWeight: 'bold', marginBottom: '16px' }}>
            ⭐ Why EsprMath ؟
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2C3531', fontSize: '1.05rem' }}>🎯 شرح مبسط ومباشر</h4>
              <p style={{ margin: 0, color: '#4A5550', fontSize: '0.9rem', lineHeight: '1.5' }}>نختصر عليك تشتت المصادر ونعطيك الزبدة لتفهم بسرعة.</p>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2C3531', fontSize: '1.05rem' }}>🎁 Module 1 مجاني</h4>
              <p style={{ margin: 0, color: '#4A5550', fontSize: '0.9rem', lineHeight: '1.5' }}>جرب بنفسك احكم على جودة الشرح بعد تسجيل الدخول.</p>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2C3531', fontSize: '1.05rem' }}>📊 متابعة تقدمك</h4>
              <p style={{ margin: 0, color: '#4A5550', fontSize: '0.9rem', lineHeight: '1.5' }}>تتبع إنجازك لكل شابتر أول بأول وبكل سهولة.</p>
            </div>
            <div style={{ background: `ffffff`, border: '1px solid #e6dec5', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2C3531', fontSize: '1.05rem' }}>💡 أمثلة واختبارات</h4>
              <p style={{ margin: 0, color: '#4A5550', fontSize: '0.9rem', lineHeight: '1.5' }}>تدرب على أسئلة اختبارات سابقة تضمن لك الـ A+ بإذن الله.</p>
            </div>
          </div>
        </section>

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
              zIndex: 2000
            }}>
              <div style={{
                backgroundColor: '#FFF9E2',
                border: '1px solid #d8dfb8',
                padding: '24px',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '400px',
                boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                fontFamily: 'sans-serif',
                textAlign: 'center',
                color: '#2C3531'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📬</div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#2C3531' }}>
                  حالة الطلب
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#4A5550', lineHeight: '1.5' }}>
                  {alertMessage}
                </p>
                <button
                    type="button"
                    onClick={() => setShowAlertModal(false)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      backgroundColor: '#DCA27B',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                >
                  حسناً، فهمت 👍
                </button>
              </div>
            </div>
        )}
      </div>
  )
}
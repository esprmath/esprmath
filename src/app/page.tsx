'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string>('')
  const [userId, setUserId] = useState<string | null>(null)

  // حالات حالة الموافقة لكل كورس { '204': 'approved' | 'pending' | 'none', ... }
  const [courseStatuses, setCourseStatuses] = useState<Record<string, string>>({
    '204': 'none',
    '203': 'none'
  })

  // حالات نافذة التنبيه المخصصة داخل الموقع بدلاً من تنبيه المتصفح
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  // دالة لجلب حالة الكورسات مع الاعتماد الفوري على الذاكرة المحلية لتجنب البطء
  const fetchUserApprovals = async (currentUserId: string) => {
    const cacheKey = `user_courses_statuses_${currentUserId}`
    const cachedStatuses = localStorage.getItem(cacheKey)

    // ⚡ إذا كانت الحالات مخزنة مسبقاً، نستخدمها فوراً ونتجاوز اتصال القاعدة تماماً للسرعة الخارقة
    if (cachedStatuses) {
      try {
        const parsed = JSON.parse(cachedStatuses)
        setCourseStatuses(parsed)
        return
      } catch (e) {
        // تجاوز الخطأ إذا وجد
      }
    }

    // إذا لم تكن مخزنة نهائياً في المتصفح، نسأل القاعدة مرة واحدة فقط
    const { data, error } = await supabase
        .from('user_courses')
        .select('course_id, is_approved')
        .eq('user_id', currentUserId)

    if (!error && data) {
      const statuses: Record<string, string> = { '204': 'none', '203': 'none' }
      data.forEach((item) => {
        statuses[item.course_id] = item.is_approved ? 'approved' : 'pending'
      })

      setCourseStatuses(statuses)
      localStorage.setItem(cacheKey, JSON.stringify(statuses))

      data.forEach((item) => {
        localStorage.setItem(`course_approved_${currentUserId}_${item.course_id}`, item.is_approved ? 'true' : 'false')
      })
    }
  }

  useEffect(() => {
    // 1. التحقق من حالة تسجيل الدخول وجلب بيانات المستخدم
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
      if (session?.user) {
        setUserId(session.user.id)
        const fullName = session.user.user_metadata?.full_name
        setUserName(fullName || '')
        fetchUserApprovals(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
      if (session?.user) {
        setUserId(session.user.id)
        const fullName = session.user.user_metadata?.full_name
        setUserName(fullName || '')
        fetchUserApprovals(session.user.id)
      } else {
        setUserId(null)
        setUserName('')
        setCourseStatuses({ '204': 'none', '203': 'none' })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // دالة طلب الانضمام للكورس (تضيف سجل في Supabase بـ is_approved = false)
  const handleRequestCourse = async (courseId: string) => {
    if (!userId) return

    const { error } = await supabase
        .from('user_courses')
        .insert([{ user_id: userId, course_id: courseId, is_approved: false }])

    if (error) {
      setAlertMessage('حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى.')
      setShowAlertModal(true)
    } else {
      setAlertMessage('تم إرسال طلب الانضمام بنجاح! يمكنك تجربة الموديول الأول مجاناً الآن ⏳')
      setShowAlertModal(true)

      // تحديث الحالة محلياً وقاعدة البيانات فوراً
      const updatedStatuses = { ...courseStatuses, [courseId]: 'pending' }
      setCourseStatuses(updatedStatuses)
      localStorage.setItem(`user_courses_statuses_${userId}`, JSON.stringify(updatedStatuses))
      localStorage.setItem(`course_approved_${userId}_${courseId}`, 'false')
    }
  }

  // دالة عرض الأزرار لكل كورس (تشترط تسجيل الدخول للوصول للتجربة المجانية)
  const renderCourseActions = (courseId: string, buttonColor: string) => {
    if (!isLoggedIn) {
      return (
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <Link href="/login" style={{ textDecoration: 'none', width: '100%' }}>
              <button style={{ background: buttonColor, color: '#ffffff', border: 'none', padding: '12px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '0.95rem' }}>
                تسجيل الدخول لتجربة Module 1 مجاناً 🎁
              </button>
            </Link>
          </div>
      )
    }

    const status = courseStatuses[courseId]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* زر الدخول متاح للمسجلين لكي يتمكنوا من رؤية الموديول الأول المجاني أو محتوى الكورس المعتمد */}
          <Link href={`/workspace/${courseId}`} style={{ textDecoration: 'none' }}>
            <button style={{ background: buttonColor, color: '#ffffff', border: 'none', padding: '11px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
              {status === 'approved' ? 'دخول الكورس الكامل 🚀' : 'دخول الكورس (Module 1 Free) ✨'}
            </button>
          </Link>

          {/* زر طلب الانضمام يظهر فقط إذا لم يطلب مسبقاً */}
          {status === 'none' && (
              <button
                  onClick={() => handleRequestCourse(courseId)}
                  style={{ background: '#3A4D39', color: '#ffffff', border: 'none', padding: '9px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '0.9rem' }}>
                طلب انضمام لكامل الكورس 📬
              </button>
          )}

          {status === 'pending' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#FEECD0',
                color: '#8c5521',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}>
                <span>⏳ طلب الانضمام بانتظار موافقة المشرف</span>
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
              </div>
          )}
        </div>
    )
  }

  return (
      <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', color: '#2C3531', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
        <Navbar isLoggedIn={isLoggedIn} />

        <header className="hero-container" style={{ textAlign: 'center', padding: '40px 20px' }}>
          {isLoggedIn && (
              <h2 style={{ fontSize: '1.25rem', color: '#DCA27B', fontWeight: 'bold', marginBottom: '15px' }}>
                مرحباً {userName || 'طالبنا العزيز'} 👋
              </h2>
          )}

          <h1 className="hero-title" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2C3531', marginBottom: '10px' }}>
            {isLoggedIn ? 'رحلتك للـ A+ 🚀' : 'تبي الـ A+ ؟'}
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.1rem', color: '#4A5550' }}>
            هنا اضمن لك تفهم كل سؤال يمر عليك بدون ما تضيع بالمصادر
          </p>
        </header>

        {/* قسم كورسات الطالب */}
        <section className="courses-section" style={{ maxWidth: '800px', margin: '0 auto 40px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#2C3531', fontWeight: 'bold', margin: 0 }}>
              📚 كورساتك المتاحة
            </h3>
            <span className="section-label" style={{ background: '#CDD4B1', color: '#2C3531', border: '1px solid #b8c29e', padding: '5px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
              Module 1 مجاني للمسجلين 🎁
            </span>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>

            {/* الكورس الأول: الجبر الخطي Math204 */}
            <div className="course-card" style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
              <div className="course-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#2C3531' }}>الجبر الخطي</h3>
                <span className="course-badge" style={{ background: '#CDD4B1', color: '#2C3531', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Math204
                </span>
              </div>

              <p className="course-description" style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                دراسة المتجهات، المصفوفات، القيم الذاتية، والتحويلات الخطية من الصفر حتى الاحتراف.
              </p>

              <div>
                {renderCourseActions('204', '#DCA27B')}
              </div>
            </div>

            {/* الكورس الثاني التجريبي: كالك 3 Math203 */}
            <div className="course-card" style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
              <div className="course-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#2C3531' }}>التفاضل والتكامل المتقدم (كالك 3)</h3>
                <span className="course-badge" style={{ background: '#FEECD0', color: '#8c5521', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Math203
                </span>
              </div>

              <p className="course-description" style={{ color: '#4A5550', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                متجهات الفضاء ثلاثي الأبعاد، الدوال متعدّدة المتغيرات، التكاملات الثنائية والثلاثية.
              </p>

              <div>
                {renderCourseActions('203', '#DCA27B')}
              </div>
            </div>

          </div>
        </section>

        {/* قسم عن EsprMath */}
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

        {/* قسم Why EsprMath (المربعات الأربعة) */}
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

            <div style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2C3531', fontSize: '1.05rem' }}>💡 أمثلة واختبارات</h4>
              <p style={{ margin: 0, color: '#4A5550', fontSize: '0.9rem', lineHeight: '1.5' }}>تدرب على أسئلة اختبارات سابقة تضمن لك الـ A+ بإذن الله.</p>
            </div>

          </div>
        </section>

        {/* نافذة التنبيه المخصصة داخل الموقع (Modal) */}
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
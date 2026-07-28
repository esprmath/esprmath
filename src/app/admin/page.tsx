'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface CourseRequest {
    request_id: string;
    course_id: string;
    is_approved: boolean;
    user_id: string;
    email: string;
    full_name: string;
    created_at: string;
}

export default function AdminPage() {
    const [requests, setRequests] = useState<CourseRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    // جلب الطلبات المعلقة التي لم يتم قبولها بعد
    const fetchPendingRequests = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('admin_course_requests')
            .select('*')
            .eq('is_approved', false)

        if (error) {
            console.error('خطأ في جلب الطلبات:', error)
            setAlertMessage('فشل جلب الطلبات، تأكد من إنشاء الـ View في قاعدة البيانات.')
            setShowAlertModal(true)
        } else {
            setRequests(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchPendingRequests()
    }, [])

    // دالة الموافقة على طلب الطالب
    const handleApprove = async (requestId: string) => {
        const { error } = await supabase
            .from('user_courses')
            .update({ is_approved: true })
            .eq('id', requestId)

        if (error) {
            setAlertMessage('فشل قبول الطلب، حاول مرة أخرى.')
            setShowAlertModal(true)
        } else {
            setAlertMessage('تمت الموافقة على طلب الطالب بنجاح! 🎉')
            setShowAlertModal(true)
            fetchPendingRequests() // تحديث القائمة فوراً
        }
    }

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif', direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#1e293b', fontSize: '1.8rem', margin: 0 }}>
                    🛠️ لوحة تحكم المشرف - طلبات الانضمام
                </h1>
                <button
                    onClick={fetchPendingRequests}
                    style={{ padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    🔄 تحديث القائمة
                </button>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.1rem' }}>جاري تحميل الطلبات...</p>
            ) : requests.length === 0 ? (
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    <p style={{ fontSize: '1.2rem', margin: 0 }}>لا توجد طلبات انضمام معلقة حالياً ☕</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {requests.map((req) => (
                        <div key={req.request_id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <div>
                                <h3 style={{ margin: '0 0 6px 0', color: '#1e293b', fontSize: '1.1rem' }}>
                                    👤 {req.full_name || 'بدون اسم'}
                                </h3>
                                <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.9rem' }}>
                                    📧 البريد: <span dir="ltr" style={{ display: 'inline-block' }}>{req.email}</span>
                                </p>
                                <p style={{ margin: 0, color: '#4f46e5', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                    📚 الكورس المطلـوب: {req.course_id === '204' ? 'الجبر الخطي (Math204)' : req.course_id === '203' ? 'الكالكولاس (Math203)' : req.course_id}
                                </p>
                            </div>

                            <button
                                onClick={() => handleApprove(req.request_id)}
                                style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                            >
                                موافقة ✅
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* نافذة التنبيه المخصصة */}
            {showAlertModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1e293b' }}>تنبيه النظام</h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>{alertMessage}</p>
                        <button
                            onClick={() => setShowAlertModal(false)}
                            style={{ width: '100%', padding: '10px 16px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                        >
                            حسناً 👍
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
// src/lib/admin.ts
// قائمة المشرفين لإظهار لوحة التحكم في الواجهة.
// الحماية الفعلية للبيانات يجب أن تكون من صلاحيات قاعدة البيانات (RLS)، وليس من هذا الفحص.
const ADMIN_EMAILS = ['sofe@gmail.com', 'osamhjix@gmail.com'];

export const isAdminEmail = (email?: string | null) => Boolean(email && ADMIN_EMAILS.includes(email));

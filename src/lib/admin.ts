// src/lib/admin.ts
// يحدد هل المستخدم مشرف لإظهار لوحة التحكم في الواجهة.
// قائمة المشرفين في جدول admin_users، وتُدار من تبويب «المشرفون» في لوحة التحكم.
// الحماية الفعلية للبيانات من صلاحيات قاعدة البيانات (RLS)، وليس من هذا الفحص.
import { supabase } from './supabase';

const cache = new Map<string, Promise<boolean>>();

/** يسأل قاعدة البيانات مرة واحدة لكل حساب في الزيارة */
export function checkIsAdmin(email?: string | null): Promise<boolean> {
    if (!email) return Promise.resolve(false);
    const key = email.toLowerCase();
    let result = cache.get(key);
    if (!result) {
        // إذا فشل الاتصال نعتبره غير مشرف، ولا نحفظ النتيجة حتى يُعاد الفحص في المرة الجاية
        const forget = () => {
            cache.delete(key);
            return false;
        };
        result = Promise.resolve(supabase.rpc('is_admin')).then(
            ({ data, error }) => (error ? forget() : data === true),
            forget,
        );
        cache.set(key, result);
    }
    return result;
}

/** بعد إضافة أو إزالة مشرف، حتى يُعاد الفحص */
export function clearAdminCache() {
    cache.clear();
}

export interface AdminEntry {
    email: string;
    created_at: string;
    is_me: boolean;
}

const ERRORS: Record<string, string> = {
    NO_ACCOUNT: 'لا يوجد حساب بهذا الإيميل. خلّه يسجل في المنصة أولًا ثم أضفه.',
    ALREADY_ADMIN: 'هذا الإيميل مشرف من قبل.',
    NOT_ADMIN: 'هذا الإيميل ليس مشرفًا.',
    CANNOT_REMOVE_SELF: 'ما تقدر تزيل نفسك من المشرفين.',
};

export function adminErrorText(message: string) {
    const code = Object.keys(ERRORS).find((k) => message.includes(k));
    if (code) return ERRORS[code];
    if (message.includes('admin_list') || message.includes('admin_add') || message.includes('admin_remove')) {
        return 'شغّل ملف SQL الخاص بإدارة المشرفين في Supabase أولًا.';
    }
    return 'تعذر تنفيذ العملية، حاول مرة ثانية.';
}

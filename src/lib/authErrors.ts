// src/lib/authErrors.ts
// رسائل أخطاء الحساب بالعربي بدل رسائل Supabase الإنجليزية.

export const MIN_PASSWORD = 8;

interface AuthErrorLike {
    message?: string;
    code?: string;
    status?: number;
}

export function authErrorText(error: AuthErrorLike | null | undefined): string {
    if (!error) return '';
    const code = error.code ?? '';
    const message = (error.message ?? '').toLowerCase();

    if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
        return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
    }
    if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
        return 'لازم تأكد بريدك أولًا. افتح رسالة التأكيد اللي وصلتك، أو اطلب رسالة جديدة.';
    }
    if (code === 'user_already_exists' || code === 'email_exists' || message.includes('already registered')) {
        return 'هذا البريد مسجل من قبل. سجّل دخول، أو استعد كلمة المرور إذا نسيتها.';
    }
    if (code === 'same_password' || message.includes('different from the old password')) {
        return 'كلمة المرور الجديدة لازم تختلف عن القديمة.';
    }
    if (code === 'weak_password' || message.includes('password should be')) {
        return `كلمة المرور ضعيفة. استخدم ${MIN_PASSWORD} أحرف على الأقل، وخلط حروف وأرقام.`;
    }
    if (code === 'email_address_invalid' || message.includes('invalid format') || message.includes('email address') && message.includes('invalid')) {
        return 'البريد الإلكتروني غير صحيح.';
    }
    if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' || error.status === 429 || message.includes('rate limit') || message.includes('security purposes')) {
        return 'محاولات كثيرة. انتظر دقيقة وجرب مرة ثانية.';
    }
    if (code === 'otp_expired' || message.includes('expired')) {
        return 'انتهت صلاحية الرابط. اطلب رابطًا جديدًا.';
    }
    if (code === 'signup_disabled') {
        return 'التسجيل مقفل حاليًا.';
    }
    if (message.includes('failed to fetch') || message.includes('network')) {
        return 'تعذر الاتصال. تأكد من الإنترنت وجرب مرة ثانية.';
    }
    return 'صار خطأ غير متوقع، جرب مرة ثانية.';
}

/** يقبل فقط مسارًا داخل الموقع، حتى لا يُستغل رابط الدخول للتحويل لموقع ثاني */
export function safeNextPath(value: string | null | undefined): string {
    if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return '/';
    if (/^\/(login|signup|forgot-password|update-password)\b/.test(value)) return '/';
    return value;
}

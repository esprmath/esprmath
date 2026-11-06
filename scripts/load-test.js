// اختبار ضغط: يحاكي طلاب يتصفحون الموقع في نفس الوقت (أداة k6).
//
// التشغيل (من مجلد المشروع): k6 run scripts/load-test.js
//
// - أضف في .env.local ثلاث أسطر: LOADTEST_URL و LOADTEST_EMAIL و LOADTEST_PASSWORD
// - رابط Supabase والمفتاح العام يُقرآن من .env.local تلقائيًا.
// - كل الطلاب الوهميين يستخدمون حساب تجربة واحد (طالب عادي، مو مشرف، ومعتمد في 101)،
//   فيسجل دخول مرة وحدة فقط ولا نصطدم بحدود تسجيل الدخول في الخطة المجانية.
// - فيكتور غير داخل في الاختبار حتى لا يكلّف رسائل OpenAI، ويُجرَّب يدويًا.
// - STUDENTS يغيّر العدد (الافتراضي 50).

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const env = Object.fromEntries(
    open('../.env.local')
        .split(/\r?\n/)
        .map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/))
        .filter(Boolean)
        .map((m) => [m[1], m[2]])
);

// بيانات التجربة: من سطر الأوامر أو من .env.local (LOADTEST_URL و LOADTEST_EMAIL و LOADTEST_PASSWORD)
const RAW_URL = (__ENV.BASE_URL || env.LOADTEST_URL || 'http://localhost:3000').trim().replace(/\/$/, '');
const BASE_URL = /^https?:\/\//.test(RAW_URL) ? RAW_URL : `https://${RAW_URL}`;
const TEST_EMAIL = __ENV.TEST_EMAIL || env.LOADTEST_EMAIL;
const TEST_PASSWORD = __ENV.TEST_PASSWORD || env.LOADTEST_PASSWORD;
const SUPABASE_URL = __ENV.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = __ENV.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const STUDENTS = Number(__ENV.STUDENTS || 50);
const COURSE = '101';

// وقت الرد من Supabase لوحده، حتى نفرّق بينه وبين الموقع
const dbTime = new Trend('supabase_time', true);

export const options = {
    stages: [
        { duration: '1m', target: STUDENTS }, // الطلاب يدخلون بالتدريج
        { duration: '3m', target: STUDENTS }, // الكل داخل في نفس الوقت
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'], // أقل من 1% أخطاء
        http_req_duration: ['p(95)<1500'], // 95% من الطلبات أسرع من 1.5 ثانية
        supabase_time: ['p(95)<800'],
    },
};

export function setup() {
    if (!SUPABASE_URL || !ANON_KEY) throw new Error('رابط Supabase أو المفتاح غير موجود في .env.local');
    if (!TEST_EMAIL || !TEST_PASSWORD) throw new Error('أضف LOADTEST_EMAIL و LOADTEST_PASSWORD في .env.local');

    const res = http.post(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
        { headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' } }
    );
    if (res.status !== 200) throw new Error(`فشل تسجيل دخول حساب التجربة: ${res.status} ${res.body}`);
    const body = res.json();
    return { token: body.access_token, userId: body.user.id };
}

function db(path, token, name, method = 'GET') {
    const params = {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        tags: { name },
    };
    const res = method === 'POST' ? http.post(`${SUPABASE_URL}${path}`, '{}', params) : http.get(`${SUPABASE_URL}${path}`, params);
    dbTime.add(res.timings.duration);
    check(res, { [`${name} ok`]: (r) => r.status === 200 });
    return res;
}

function page(path) {
    const res = http.get(`${BASE_URL}${path}`, { tags: { name: `page ${path.split('?')[0]}` } });
    check(res, { [`page ${path.split('?')[0]} ok`]: (r) => r.status === 200 });
}

// نفس الطلبات اللي يرسلها الشريط العلوي في كل صفحة
function navbar(token, userId) {
    db('/auth/v1/user', token, 'auth user');
    db(`/rest/v1/user_courses?select=course_id,exam_date,is_approved,username&user_id=eq.${userId}`, token, 'navbar enrollment');
}

// بوابة صفحات الكورس (workspace/layout.tsx)
function gate(token, userId, extra) {
    db(`/rest/v1/user_courses?select=is_approved&user_id=eq.${userId}&course_id=eq.${COURSE}`, token, 'gate enrollment');
    if (extra) db(extra.path, token, extra.name);
}

export default function ({ token, userId }) {
    group('الصفحة الرئيسية', () => {
        page('/');
        navbar(token, userId);
        db('/rest/v1/courses?select=*&order=id.asc', token, 'courses');
        db('/rest/v1/rpc/is_admin', token, 'is_admin', 'POST');
        db(`/rest/v1/user_courses?select=course_id,is_approved&user_id=eq.${userId}`, token, 'home enrollments');
    });
    sleep(3 + Math.random() * 4);

    group('صفحة الكورس', () => {
        page(`/workspace/${COURSE}`);
        navbar(token, userId);
        db(`/rest/v1/course_modules?select=*&course_id=eq.${COURSE}&order=module_number.asc`, token, 'course modules');
        db(`/rest/v1/quiz_settings?select=quiz_id,title,is_open,opens_at,closes_at&course_id=eq.${COURSE}`, token, 'quiz settings');
        db(`/rest/v1/user_courses?select=is_approved&user_id=eq.${userId}&course_id=eq.${COURSE}`, token, 'hub enrollment');
    });
    sleep(3 + Math.random() * 4);

    group('الموديول', () => {
        page(`/workspace/${COURSE}/1?chapter=1.5`);
        navbar(token, userId);
        gate(token, userId, {
            path: `/rest/v1/course_modules?select=is_open,is_free,opens_at,closes_at&course_id=eq.${COURSE}&module_number=eq.1`,
            name: 'gate module',
        });
        db(`/rest/v1/user_courses?select=is_ai_allowed&user_id=eq.${userId}&course_id=eq.${COURSE}`, token, 'ai allowed');
    });
    // يقرأ الفكرة ويحل الأسئلة: كله داخل جواله بدون طلبات للخادم
    sleep(30 + Math.random() * 30);

    group('الكويز', () => {
        page(`/workspace/${COURSE}/quizzes/quiz-1`);
        navbar(token, userId);
        gate(token, userId, {
            path: `/rest/v1/quiz_settings?select=is_open,opens_at,closes_at&course_id=eq.${COURSE}&quiz_id=eq.quiz-1`,
            name: 'gate quiz',
        });
        db(`/rest/v1/user_courses?select=is_ai_allowed&user_id=eq.${userId}&course_id=eq.${COURSE}`, token, 'ai allowed');
    });
    sleep(20 + Math.random() * 20);
}

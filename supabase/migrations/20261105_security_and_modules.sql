-- EsprMath: إصلاح صلاحيات قاعدة البيانات وإضافة جدول الموديولات
--
-- طريقة التشغيل: Supabase > SQL Editor > الصق الملف كاملًا > Run
-- يعمل كله أو لا يطبق منه شيء، لأنه داخل begin/commit، ويمكن إعادة تشغيله.
--
-- ما يصلحه (نتائج الفحص بتاريخ 2026-11-05):
--   * بدون تسجيل دخول: كان يمكن قراءة أسماء وإيميلات الطلاب وسجل ai_logs.
--   * بدون تسجيل دخول: كان يمكن تعديل courses و quiz_settings و system_settings.
--   * الطالب يقدر يعدّل سجله، بما فيه is_approved و is_ai_allowed.
--   * المشرف لا يقدر يعدّل سجلات الطلاب في user_courses.

begin;

-- ===== المشرفون =====
create table if not exists public.admin_users (
    user_id uuid primary key references auth.users (id) on delete cascade,
    created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

insert into public.admin_users (user_id)
select id from auth.users where email in ('osamhjix@gmail.com', 'sofe@gmail.com')
on conflict (user_id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- ===== الموديولات =====
create table if not exists public.course_modules (
    id bigint generated always as identity primary key,
    course_id text not null references public.courses (id) on delete cascade,
    module_number integer not null,
    title text not null,
    description text not null default '',
    chapters text[] not null default '{}',
    is_open boolean not null default false,
    is_free boolean not null default false,
    opens_at timestamptz,
    closes_at timestamptz,
    created_at timestamptz not null default now(),
    unique (course_id, module_number)
);

insert into public.course_modules (course_id, module_number, title, description, chapters, is_open, is_free)
select v.course_id, v.module_number, v.title, v.description, v.chapters, v.is_open, v.is_free
from (values
    ('101', 1, 'Module 1 - Limits Foundations', 'مراجعة النهايات، الاتصال، المماس ومعدل التغير، والنهايات عند اللانهاية.', array['1.5','1.6','2.1','1.8','3.4'], true, true),
    ('101', 2, 'Module 2 - Applications of Differentiation', 'معدلات التغير المرتبطة، القيم العظمى والصغرى، وتطبيقات الهندسة.', array['2.3','2.4','2.5','2.6','2.7'], false, false),
    ('101', 3, 'Module 3 - Advanced Functions & Applications', 'الدوال الأسية واللوغاريتمية، الدوال المثلثية العكسية، النمو والاضمحلال، والدوال الزائدية.', array['6.2','6.4','6.6','6.5','6.7','2.9'], false, false),
    ('101', 4, 'Module 4 - L''Hospital & Optimization', 'صيغ عدم التعيين، قاعدة لوبيتال، القيم العظمى والصغرى، وطريقة نيوتن لتقدير الجذور.', array['6.8','3.1','3.8'], false, false),
    ('203', 1, 'Module 1: 3D Vectors & Space Geometry', 'Vectors, dot/cross products, lines and planes.', array[]::text[], false, false),
    ('203', 2, 'Module 2: Partial Derivatives', 'Limits, continuity, and chain rule.', array[]::text[], false, false)
) as v(course_id, module_number, title, description, chapters, is_open, is_free)
where exists (select 1 from public.courses c where c.id = v.course_id)
on conflict (course_id, module_number) do nothing;

-- ===== نحذف السياسات القديمة ونكتب الصحيحة =====
do $$
declare
    p record;
begin
    for p in
        select schemaname, tablename, policyname
        from pg_policies
        where schemaname = 'public'
          and tablename in ('user_courses', 'courses', 'quiz_settings', 'system_settings', 'ai_logs', 'course_modules', 'admin_users')
    loop
        execute format('drop policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);
    end loop;
end $$;

alter table public.user_courses enable row level security;
alter table public.courses enable row level security;
alter table public.quiz_settings enable row level security;
alter table public.system_settings enable row level security;
alter table public.ai_logs enable row level security;
alter table public.course_modules enable row level security;

create policy "admins read admins" on public.admin_users
    for select to authenticated using (public.is_admin());

-- بيانات الكورسات عامة للقراءة، والتعديل للمشرف فقط
create policy "public read courses" on public.courses for select using (true);
create policy "admin writes courses" on public.courses for all to authenticated
    using (public.is_admin()) with check (public.is_admin());

create policy "public read modules" on public.course_modules for select using (true);
create policy "admin writes modules" on public.course_modules for all to authenticated
    using (public.is_admin()) with check (public.is_admin());

create policy "public read quizzes" on public.quiz_settings for select using (true);
create policy "admin writes quizzes" on public.quiz_settings for all to authenticated
    using (public.is_admin()) with check (public.is_admin());

create policy "users read settings" on public.system_settings for select to authenticated using (true);
create policy "admin writes settings" on public.system_settings for all to authenticated
    using (public.is_admin()) with check (public.is_admin());

-- سجل فيكتور: الطالب يرى سجله ويضيف له فقط، والمشرف يرى الكل
create policy "read own logs" on public.ai_logs for select to authenticated
    using (user_id = auth.uid() or public.is_admin());
create policy "insert own logs" on public.ai_logs for insert to authenticated
    with check (user_id = auth.uid());

-- تسجيلات الطلاب
create policy "read own enrollment" on public.user_courses for select to authenticated
    using (user_id = auth.uid() or public.is_admin());

create policy "create own enrollment" on public.user_courses for insert to authenticated
    with check (
        public.is_admin()
        or (
            user_id = auth.uid()
            and (
                is_approved = false
                or exists (select 1 from public.courses c where c.id = course_id and c.requires_approval = false)
            )
        )
    );

create policy "update own enrollment" on public.user_courses for update to authenticated
    using (user_id = auth.uid() or public.is_admin())
    with check (user_id = auth.uid() or public.is_admin());

create policy "delete own pending enrollment" on public.user_courses for delete to authenticated
    using (public.is_admin() or (user_id = auth.uid() and is_approved = false));

-- الطالب يعدّل موعد اختباره ورقمه الجامعي فقط، وليس الاعتماد أو صلاحية فيكتور
create or replace function public.guard_user_courses()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    -- auth.uid() فارغ عند التشغيل من SQL Editor
    if auth.uid() is null or public.is_admin() then
        return new;
    end if;

    if new.user_id is distinct from old.user_id or new.course_id is distinct from old.course_id then
        raise exception 'لا يمكن تغيير صاحب التسجيل أو الكورس';
    end if;

    if new.is_ai_allowed is distinct from old.is_ai_allowed then
        raise exception 'صلاحية فيكتور يغيرها المشرف فقط';
    end if;

    if new.is_approved is distinct from old.is_approved
       and not (
           new.is_approved = true
           and exists (select 1 from public.courses c where c.id = new.course_id and c.requires_approval = false)
       ) then
        raise exception 'اعتماد التسجيل يغيره المشرف فقط';
    end if;

    return new;
end;
$$;

drop trigger if exists guard_user_courses on public.user_courses;
create trigger guard_user_courses
    before update on public.user_courses
    for each row execute function public.guard_user_courses();

-- ===== بيانات الطلاب للمشرف فقط =====
revoke all on public.student_profiles_view from anon, authenticated;

create or replace function public.admin_students()
returns setof public.student_profiles_view
language plpgsql
stable
security definer
set search_path = public
as $$
begin
    if not public.is_admin() then
        raise exception 'للمشرفين فقط';
    end if;
    return query select * from public.student_profiles_view;
end;
$$;

revoke all on function public.admin_students() from public, anon;
grant execute on function public.admin_students() to authenticated;

commit;

-- للتأكد بعد التشغيل: يجب أن يظهر مشرف واحد على الأقل، و6 صفوف موديولات لكورسي 101 و203
-- select count(*) from public.admin_users;
-- select course_id, count(*) from public.course_modules group by course_id;

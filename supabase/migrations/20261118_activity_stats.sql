-- EsprMath: إحصائيات استخدام الطلاب (وقت التفاعل، وقت إنهاء الدروس، الأخطاء) للمشرف فقط
--
-- طريقة التشغيل: Supabase > SQL Editor > الصق الملف كاملًا > Run
-- يحتاج ملف 20261105_security_and_modules.sql قبله (الدالة is_admin وجدول courses).
-- يمكن إعادة تشغيله بأمان.
--
-- التصميم خفيف عمدًا:
--   * المتصفح يعدّ الثواني عنده، ويرسل دفعة واحدة كل 3 دقايق تقريبًا (طلب واحد للدالة track_activity).
--   * التخزين مجمّع: صف لكل طالب باليوم (study_daily)، وصف لكل طالب ولكل فكرة (idea_stats).
--     فعدد الصفوف يبقى صغيرًا وثابتًا تقريبًا، ولا نسجل كل سؤال لحاله.
--   * الطالب لا يكتب في الجداول مباشرة: فقط عبر الدالة، وهي تقصّ القيم الكبيرة وتحدد سقفًا يوميًا.
--   * المشرف لا يُحسب نشاطه (حتى لا تتلوث الأرقام بتجربتك أنت).
--   * المتوسطات تُحسب لما تفتح تبويب الإحصائيات فقط.

begin;

-- ===== وقت التفاعل اليومي =====
create table if not exists public.study_daily (
    user_id uuid not null references auth.users (id) on delete cascade,
    course_id text not null,
    day date not null,
    active_seconds integer not null default 0,
    video_seconds integer not null default 0,
    updated_at timestamptz not null default now(),
    primary key (user_id, course_id, day)
);

-- ===== إحصائيات كل فكرة لكل طالب =====
create table if not exists public.idea_stats (
    user_id uuid not null references auth.users (id) on delete cascade,
    course_id text not null,
    idea_key text not null,
    opens integer not null default 0,
    lesson_seconds integer not null default 0,
    answered integer not null default 0,
    correct integer not null default 0,
    completed_at timestamptz,
    first_seen_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (user_id, course_id, idea_key)
);

create index if not exists study_daily_course_day on public.study_daily (course_id, day);
create index if not exists idea_stats_course on public.idea_stats (course_id, idea_key);

alter table public.study_daily enable row level security;
alter table public.idea_stats enable row level security;

drop policy if exists "read own or admin study_daily" on public.study_daily;
create policy "read own or admin study_daily" on public.study_daily
    for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "read own or admin idea_stats" on public.idea_stats;
create policy "read own or admin idea_stats" on public.idea_stats
    for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- لا توجد سياسة كتابة: الكتابة عبر track_activity فقط (security definer)

-- ===== استلام دفعة نشاط من المتصفح =====
-- p_ideas: مصفوفة JSON، كل عنصر: {key, lesson, opens, answered, correct, completed}
create or replace function public.track_activity(
    p_course text,
    p_active integer,
    p_video integer,
    p_ideas jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    uid uuid := auth.uid();
    today date := (now() at time zone 'Asia/Riyadh')::date;
    active_add integer;
    video_add integer;
    item record;
begin
    if uid is null then return; end if;
    if public.is_admin() then return; end if;
    if p_course is null or length(p_course) > 20 then return; end if;
    if not exists (select 1 from public.courses where id = p_course) then return; end if;

    -- حد أقصى لكل دفعة: 15 دقيقة (الدفعة العادية 3 دقايق)
    active_add := greatest(0, least(coalesce(p_active, 0), 900));
    video_add := greatest(0, least(coalesce(p_video, 0), active_add));

    if active_add > 0 then
        insert into public.study_daily (user_id, course_id, day, active_seconds, video_seconds)
        values (uid, p_course, today, active_add, video_add)
        on conflict (user_id, course_id, day) do update
            set active_seconds = least(public.study_daily.active_seconds + excluded.active_seconds, 21600), -- سقف 6 ساعات باليوم
                video_seconds = least(public.study_daily.video_seconds + excluded.video_seconds, 21600),
                updated_at = now();
    end if;

    for item in
        select *
        from jsonb_to_recordset(coalesce(p_ideas, '[]'::jsonb))
             as x(key text, lesson integer, opens integer, answered integer, correct integer, completed boolean)
        limit 50
    loop
        continue when item.key is null or length(item.key) > 80;

        insert into public.idea_stats (user_id, course_id, idea_key, opens, lesson_seconds, answered, correct, completed_at)
        values (
            uid, p_course, item.key,
            greatest(0, least(coalesce(item.opens, 0), 50)),
            greatest(0, least(coalesce(item.lesson, 0), 900)),
            greatest(0, least(coalesce(item.answered, 0), 200)),
            greatest(0, least(coalesce(item.correct, 0), 200)),
            case when item.completed then now() end
        )
        on conflict (user_id, course_id, idea_key) do update
            set opens = public.idea_stats.opens + excluded.opens,
                lesson_seconds = least(public.idea_stats.lesson_seconds + excluded.lesson_seconds, 36000),
                answered = public.idea_stats.answered + excluded.answered,
                correct = least(public.idea_stats.correct + excluded.correct, public.idea_stats.answered + excluded.answered),
                completed_at = coalesce(public.idea_stats.completed_at, excluded.completed_at),
                updated_at = now();
    end loop;
end;
$$;

revoke all on function public.track_activity(text, integer, integer, jsonb) from public, anon;
grant execute on function public.track_activity(text, integer, integer, jsonb) to authenticated;

-- ===== للمشرف: ملخص كل طالب في كورس =====
create or replace function public.admin_activity_students(p_course text, p_days integer default 30)
returns table (
    user_id uuid,
    full_name text,
    email text,
    active_seconds bigint,
    video_seconds bigint,
    days_active bigint,
    last_day date
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
    if not public.is_admin() then
        raise exception 'للمشرفين فقط';
    end if;

    return query
        select
            uc.user_id,
            coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email::text, '@', 1))::text,
            u.email::text,
            coalesce(sum(d.active_seconds), 0)::bigint,
            coalesce(sum(d.video_seconds), 0)::bigint,
            count(d.day)::bigint,
            max(d.day)
        from public.user_courses uc
        join auth.users u on u.id = uc.user_id
        left join public.study_daily d
               on d.user_id = uc.user_id
              and d.course_id = uc.course_id
              and d.day >= (now() at time zone 'Asia/Riyadh')::date - greatest(coalesce(p_days, 30), 1)
        where uc.course_id = p_course
        group by uc.user_id, u.raw_user_meta_data, u.email
        order by coalesce(sum(d.active_seconds), 0) desc;
end;
$$;

-- ===== للمشرف: إحصائيات كل فكرة في كورس =====
create or replace function public.admin_activity_ideas(p_course text)
returns table (
    idea_key text,
    students_opened bigint,
    students_completed bigint,
    avg_lesson_seconds numeric,
    median_lesson_seconds numeric,
    answered_total bigint,
    correct_total bigint,
    students_no_answer bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
    if not public.is_admin() then
        raise exception 'للمشرفين فقط';
    end if;

    return query
        select
            s.idea_key,
            count(*) filter (where s.opens > 0 or s.answered > 0)::bigint,
            count(*) filter (where s.completed_at is not null)::bigint,
            round(avg(s.lesson_seconds) filter (where s.completed_at is not null and s.lesson_seconds > 0), 0),
            round((percentile_cont(0.5) within group (order by s.lesson_seconds)
                   filter (where s.completed_at is not null and s.lesson_seconds > 0))::numeric, 0),
            coalesce(sum(s.answered), 0)::bigint,
            coalesce(sum(s.correct), 0)::bigint,
            count(*) filter (where s.opens > 0 and s.answered = 0)::bigint
        from public.idea_stats s
        where s.course_id = p_course
        group by s.idea_key
        order by s.idea_key;
end;
$$;

revoke all on function public.admin_activity_students(text, integer) from public, anon;
revoke all on function public.admin_activity_ideas(text) from public, anon;
grant execute on function public.admin_activity_students(text, integer) to authenticated;
grant execute on function public.admin_activity_ideas(text) to authenticated;

commit;

-- للتأكد بعد التشغيل:
-- select count(*) from public.study_daily;   -- يبدأ بصفر، ويزيد بعد ما يتفاعل الطلاب
-- select * from public.admin_activity_ideas('101');  -- من حساب مشرف في الموقع (لوحة التحكم > الإحصائيات)

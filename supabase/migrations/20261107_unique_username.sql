-- EsprMath: اسم المستخدم اختياري، لكن لا يتكرر بين طالبين
--
-- طريقة التشغيل: Supabase > SQL Editor > الصق الملف كاملًا > Run
-- يمكن إعادة تشغيله بأمان.
--
-- العمود القديم "students-id" نوعه في قاعدة البيانات ليس نصًا، فكانت أسماء المستخدمين
-- لا تُحفظ فيه أصلًا. نضيف عمودًا نصيًا جديدًا username ونترك القديم كما هو.

begin;

alter table public.user_courses add column if not exists username text;

-- ننقل أي قيمة قديمة صالحة كاسم مستخدم (إن وجدت)
update public.user_courses
set username = lower(trim("students-id"::text))
where username is null
  and "students-id" is not null
  and lower(trim("students-id"::text)) ~ '^[a-z0-9_]{3,30}$';

-- يوحّد الكتابة: حروف صغيرة بدون مسافات، والفارغ يصير null (بدون اسم مستخدم)
create or replace function public.guard_username()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    existing text;
begin
    new.username := nullif(lower(trim(coalesce(new.username, ''))), '');

    -- تسجيل كورس جديد: ياخذ اسم المستخدم المحفوظ في تسجيلاته السابقة
    if tg_op = 'INSERT' and new.username is null then
        select username into existing
        from public.user_courses
        where user_id::text = new.user_id::text and username is not null
        limit 1;
        new.username := existing;
    end if;

    if new.username is null then
        return new;
    end if;

    if new.username !~ '^[a-z0-9_]{3,30}$' then
        raise exception 'USERNAME_INVALID';
    end if;

    if exists (
        select 1 from public.user_courses
        where username = new.username and user_id::text <> new.user_id::text
    ) then
        raise exception 'USERNAME_TAKEN';
    end if;

    return new;
end;
$$;

drop trigger if exists guard_username on public.user_courses;
create trigger guard_username
    before insert or update of username on public.user_courses
    for each row execute function public.guard_username();

-- للواجهة: هل الاسم متاح؟ يرجع true/false فقط بدون كشف صاحبه
create or replace function public.username_available(p_username text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select not exists (
        select 1 from public.user_courses
        where username = lower(trim(p_username)) and user_id::text <> auth.uid()::text
    );
$$;

revoke all on function public.username_available(text) from public, anon;
grant execute on function public.username_available(text) to authenticated;

commit;

-- EsprMath: إدارة المشرفين من لوحة التحكم
--
-- طريقة التشغيل: Supabase > SQL Editor > الصق الملف كاملًا > Run
-- يحتاج ملف 20261105_security_and_modules.sql قبله (جدول admin_users والدالة is_admin).
-- يمكن إعادة تشغيله بأمان.
--
-- الإضافة تكون بإيميل حساب موجود: الشخص يسجل في المنصة أولًا، ثم تضيفه.

begin;

-- قائمة المشرفين مع إيميلاتهم، للمشرف فقط
create or replace function public.admin_list()
returns table (email text, created_at timestamptz, is_me boolean)
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
        select u.email::text, a.created_at, a.user_id = auth.uid()
        from public.admin_users a
        join auth.users u on u.id = a.user_id
        order by a.created_at;
end;
$$;

-- إضافة مشرف بالإيميل
create or replace function public.admin_add(p_email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
    target uuid;
begin
    if not public.is_admin() then
        raise exception 'للمشرفين فقط';
    end if;

    select id into target from auth.users where lower(email) = lower(trim(p_email)) limit 1;
    if target is null then
        raise exception 'NO_ACCOUNT';
    end if;

    if exists (select 1 from public.admin_users where user_id = target) then
        raise exception 'ALREADY_ADMIN';
    end if;

    insert into public.admin_users (user_id) values (target);
    return lower(trim(p_email));
end;
$$;

-- إزالة مشرف بالإيميل. لا يمكن إزالة نفسك، فيبقى دائمًا مشرف واحد على الأقل
create or replace function public.admin_remove(p_email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
    target uuid;
begin
    if not public.is_admin() then
        raise exception 'للمشرفين فقط';
    end if;

    select id into target from auth.users where lower(email) = lower(trim(p_email)) limit 1;
    if target is null or not exists (select 1 from public.admin_users where user_id = target) then
        raise exception 'NOT_ADMIN';
    end if;

    if target = auth.uid() then
        raise exception 'CANNOT_REMOVE_SELF';
    end if;

    delete from public.admin_users where user_id = target;
    return lower(trim(p_email));
end;
$$;

revoke all on function public.admin_list() from public, anon;
revoke all on function public.admin_add(text) from public, anon;
revoke all on function public.admin_remove(text) from public, anon;
grant execute on function public.admin_list() to authenticated;
grant execute on function public.admin_add(text) to authenticated;
grant execute on function public.admin_remove(text) to authenticated;

-- الواجهة تسأل is_admin() لتعرف هل تظهر لوحة التحكم
grant execute on function public.is_admin() to authenticated;

commit;

-- للتأكد بعد التشغيل (من حساب مشرف في الموقع): تبويب «المشرفون» في لوحة التحكم يعرض القائمة.

create table public.review_waitlist (
  email text primary key,
  stage text not null check(stage in ('learning','property','offer')),
  focus text not null check(focus in ('undecided','deposit','loan')),
  source text not null check(source in ('sample','results','direct')),
  consent_version text not null default '2026-11-24',
  confirm_hash text unique, cancel_hash text unique,
  requested_at timestamptz not null default now(),
  confirmed_at timestamptz, cancelled_at timestamptz
);
alter table public.review_waitlist enable row level security;
revoke all on public.review_waitlist from public, anon, authenticated;

create function public.reserve_review_waitlist(p_email text,p_stage text,p_focus text,p_source text,p_confirm text,p_cancel text)
returns boolean language plpgsql set search_path = public as $$
begin
  insert into review_waitlist(email,stage,focus,source,confirm_hash,cancel_hash)
  values(p_email,p_stage,p_focus,p_source,p_confirm,p_cancel)
  on conflict(email) do update set stage=excluded.stage,focus=excluded.focus,source=excluded.source,
    confirm_hash=excluded.confirm_hash,cancel_hash=excluded.cancel_hash,requested_at=now(),confirmed_at=null,cancelled_at=null
    where (review_waitlist.confirmed_at is null or review_waitlist.cancelled_at is not null)
      and review_waitlist.requested_at < now()-interval '2 minutes';
  return found;
end $$;

create function public.review_waitlist_action(p_action text,p_hash text)
returns boolean language plpgsql set search_path = public as $$
begin
  if p_action='confirm' then
    update review_waitlist set confirmed_at=now(),confirm_hash=null
      where confirm_hash=p_hash and cancelled_at is null and confirmed_at is null and requested_at > now()-interval '48 hours';
  elsif p_action='cancel' then
    update review_waitlist set cancelled_at=now(),cancel_hash=null,confirm_hash=null where cancel_hash=p_hash;
  elsif p_action='delivery_failed' then
    update review_waitlist set requested_at=now()-interval '3 minutes',confirm_hash=null,cancel_hash=null
      where confirm_hash=p_hash and confirmed_at is null;
  else return false;
  end if;
  return found;
end $$;
revoke all on function public.reserve_review_waitlist(text,text,text,text,text,text),public.review_waitlist_action(text,text) from public, anon, authenticated;
grant execute on function public.reserve_review_waitlist(text,text,text,text,text,text),public.review_waitlist_action(text,text) to service_role;
grant select,insert,update on public.review_waitlist to service_role;
create view public.review_waitlist_progress with (security_invoker=true) as
select stage,focus,source,count(*) as confirmed, count(*) filter(where stage in ('property','offer')) as qualified
from public.review_waitlist where confirmed_at is not null and cancelled_at is null group by stage,focus,source;
revoke all on public.review_waitlist_progress from public, anon, authenticated;
grant select on public.review_waitlist_progress to service_role;

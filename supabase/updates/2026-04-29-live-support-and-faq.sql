-- Adds private live support DMs, realtime publication, and FAQ navigation.
-- Apply after the base schema or any existing production-copy refresh.

begin;

create table if not exists public.support_conversations (
  id uuid primary key default gen_random_uuid(),
  customer_user_id uuid not null references auth.users (id) on delete cascade,
  customer_name text not null,
  customer_email text,
  subject text not null default 'Support request',
  status text not null default 'open' check (status in ('open', 'closed')),
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists support_conversations_customer_user_id_idx
on public.support_conversations (customer_user_id, last_message_at desc);

create index if not exists support_conversations_status_idx
on public.support_conversations (status, last_message_at desc);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.support_conversations (id) on delete cascade,
  sender_user_id uuid references auth.users (id) on delete set null,
  sender_role text not null check (sender_role in ('customer', 'admin')),
  sender_name text not null,
  body text not null check (char_length(trim(body)) > 0 and char_length(body) <= 2000),
  created_at timestamptz not null default now()
);

create index if not exists support_messages_conversation_id_idx
on public.support_messages (conversation_id, created_at);

create or replace function public.touch_support_conversation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.support_conversations
  set last_message_at = new.created_at,
      status = case when status = 'closed' then 'open' else status end
  where id = new.conversation_id;

  return new;
end;
$$;

drop trigger if exists support_messages_touch_conversation on public.support_messages;
create trigger support_messages_touch_conversation
after insert on public.support_messages
for each row execute function public.touch_support_conversation();

alter table public.support_conversations enable row level security;
alter table public.support_messages enable row level security;

drop policy if exists "customers read own support conversations" on public.support_conversations;
create policy "customers read own support conversations"
on public.support_conversations
for select
to authenticated
using (customer_user_id = auth.uid());

drop policy if exists "customers create own support conversations" on public.support_conversations;
create policy "customers create own support conversations"
on public.support_conversations
for insert
to authenticated
with check (customer_user_id = auth.uid());

drop policy if exists "customers update own open support conversations" on public.support_conversations;
create policy "customers update own open support conversations"
on public.support_conversations
for update
to authenticated
using (customer_user_id = auth.uid())
with check (customer_user_id = auth.uid());

drop policy if exists "admins manage support conversations" on public.support_conversations;
create policy "admins manage support conversations"
on public.support_conversations
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "customers read own support messages" on public.support_messages;
create policy "customers read own support messages"
on public.support_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.support_conversations
    where support_conversations.id = support_messages.conversation_id
      and support_conversations.customer_user_id = auth.uid()
  )
);

drop policy if exists "customers create own support messages" on public.support_messages;
create policy "customers create own support messages"
on public.support_messages
for insert
to authenticated
with check (
  sender_user_id = auth.uid()
  and sender_role = 'customer'
  and exists (
    select 1
    from public.support_conversations
    where support_conversations.id = support_messages.conversation_id
      and support_conversations.customer_user_id = auth.uid()
  )
);

drop policy if exists "admins manage support messages" on public.support_messages;
create policy "admins manage support messages"
on public.support_messages
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

alter table public.support_conversations replica identity full;
alter table public.support_messages replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.support_conversations;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.support_messages;
exception
  when duplicate_object then null;
end $$;

insert into public.navbar (id, title, link, sort_order, is_active)
values
  ('nav-faq', 'FAQ', '/faq', 7, true),
  ('nav-support', 'Support', '/account?next=/', 8, true)
on conflict (id) do update
set
  title = excluded.title,
  link = excluded.link,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

commit;

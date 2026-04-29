begin;

create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  body text not null,
  href text not null default '/admin/notifications',
  entity_type text,
  entity_id text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists admin_notifications_created_at_idx
on public.admin_notifications (created_at desc);

create index if not exists admin_notifications_unread_idx
on public.admin_notifications (read_at, created_at desc);

create or replace function public.is_active_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid() and is_active = true
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
      and is_active = true
      and role = 'super_admin'
  );
$$;

alter table public.admin_notifications enable row level security;

drop policy if exists "super admins manage admin profiles" on public.admin_profiles;
create policy "super admins manage admin profiles"
on public.admin_profiles
for all
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

drop policy if exists "admins read admin notifications" on public.admin_notifications;
create policy "admins read admin notifications"
on public.admin_notifications
for select
to authenticated
using (public.is_active_admin());

drop policy if exists "admins update admin notifications" on public.admin_notifications;
create policy "admins update admin notifications"
on public.admin_notifications
for update
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

create or replace function public.create_admin_notification(
  notification_type text,
  notification_title text,
  notification_body text,
  notification_href text,
  notification_entity_type text,
  notification_entity_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_notifications (
    type,
    title,
    body,
    href,
    entity_type,
    entity_id
  )
  values (
    notification_type,
    notification_title,
    notification_body,
    notification_href,
    notification_entity_type,
    notification_entity_id
  );
end;
$$;

create or replace function public.notify_order_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.create_admin_notification(
    'order_created',
    'New order received',
    new.reference || ' from ' || new.customer_name || ' for ' || new.product_name,
    '/admin/orders/' || new.reference,
    'order',
    new.id::text
  );

  return new;
end;
$$;

drop trigger if exists orders_notify_created on public.orders;
create trigger orders_notify_created
after insert on public.orders
for each row execute function public.notify_order_created();

create or replace function public.notify_order_status_changed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status then
    perform public.create_admin_notification(
      'order_status_changed',
      'Order status updated',
      new.reference || ' changed from ' || replace(old.status, '_', ' ') || ' to ' || replace(new.status, '_', ' '),
      '/admin/orders/' || new.reference,
      'order',
      new.id::text
    );
  end if;

  return new;
end;
$$;

drop trigger if exists orders_notify_status_changed on public.orders;
create trigger orders_notify_status_changed
after update of status on public.orders
for each row execute function public.notify_order_status_changed();

create or replace function public.notify_support_conversation_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.create_admin_notification(
    'support_conversation_created',
    'New support conversation',
    new.customer_name || ': ' || new.subject,
    '/admin/support/' || new.id::text,
    'support_conversation',
    new.id::text
  );

  return new;
end;
$$;

drop trigger if exists support_conversations_notify_created on public.support_conversations;
create trigger support_conversations_notify_created
after insert on public.support_conversations
for each row execute function public.notify_support_conversation_created();

create or replace function public.notify_support_message_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.create_admin_notification(
    'support_message_created',
    case
      when new.sender_role = 'admin' then 'Admin support reply sent'
      else 'Customer support message received'
    end,
    new.sender_name || ': ' || left(new.body, 180),
    '/admin/support/' || new.conversation_id::text,
    'support_message',
    new.id::text
  );

  return new;
end;
$$;

drop trigger if exists support_messages_notify_created on public.support_messages;
create trigger support_messages_notify_created
after insert on public.support_messages
for each row execute function public.notify_support_message_created();

create or replace function public.notify_product_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.create_admin_notification(
      'product_created',
      'Product created',
      new.name || ' was added to the product library.',
      '/admin/products',
      'product',
      new.id::text
    );
  elsif old.is_listed is distinct from new.is_listed then
    perform public.create_admin_notification(
      'product_listing_changed',
      'Product listing changed',
      new.name || case when new.is_listed then ' is now listed.' else ' is now hidden.' end,
      '/admin/products',
      'product',
      new.id::text
    );
  elsif old.name is distinct from new.name
    or old.base_price is distinct from new.base_price
    or old.sale_price is distinct from new.sale_price then
    perform public.create_admin_notification(
      'product_updated',
      'Product updated',
      new.name || ' product details were updated.',
      '/admin/products',
      'product',
      new.id::text
    );
  end if;

  return new;
end;
$$;

drop trigger if exists products_notify_activity on public.products;
create trigger products_notify_activity
after insert or update of name, base_price, sale_price, is_listed on public.products
for each row execute function public.notify_product_activity();

alter table public.admin_notifications replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.admin_notifications;
exception
  when duplicate_object then null;
end $$;

commit;

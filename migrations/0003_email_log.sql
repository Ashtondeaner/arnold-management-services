-- Outbound reservation emails (guest confirmations, host notices, cancellations).

alter table reservations
  add column if not exists guest_email_status text;

alter table reservations
  add column if not exists guest_email_sent_at timestamptz;

create table if not exists email_log (
  id text primary key,
  reservation_id text not null,
  kind text not null,
  to_email text not null,
  subject text not null,
  html text not null,
  text_body text not null,
  status text not null,
  provider text,
  provider_id text,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists email_log_reservation_idx
  on email_log (reservation_id, created_at desc);

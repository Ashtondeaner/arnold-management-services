-- Guest vacation-rental reservations (public booking engine).
-- Dates use exclusive checkout (check_out is the departure day, not a night of stay).

create table if not exists reservations (
  id text primary key,
  confirmation_code text not null unique,
  property_id text not null,
  property_slug text not null,
  property_name text not null,
  check_in date not null,
  check_out date not null,
  nights integer not null,
  guests integer not null,
  subtotal numeric(10, 2) not null,
  cleaning_fee numeric(10, 2) not null,
  tax numeric(10, 2) not null,
  total numeric(10, 2) not null,
  security_deposit numeric(10, 2) not null,
  currency text not null default 'USD',
  status text not null default 'confirmed',
  guest_name text not null,
  guest_email text not null,
  guest_phone text,
  guest_message text,
  created_at timestamptz not null default now()
);

create index if not exists reservations_property_dates_idx
  on reservations (property_id, status, check_in, check_out);

create index if not exists reservations_code_idx
  on reservations (confirmation_code);

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  username_display text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists profiles_username_normalized_idx
  on public.profiles (lower(username));

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- Supabase schema for UniRes VOT Management

create schema if not exists public;

-- Users (only SUPER_ADMIN)
create table if not exists public.users (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  password_hash text not null,
  role text not null default 'SUPER_ADMIN',
  created_at timestamp with time zone default now()
);

-- VOT entries
create table if not exists public.vots (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.users(id),
  name text not null,
  budget numeric not null,
  year int not null,
  created_at timestamp with time zone default now()
);

-- Tabung Amanah (trust fund)
create table if not exists public.tabung_amanah (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.users(id),
  name text not null,
  amount numeric not null,
  year int not null,
  created_at timestamp with time zone default now()
);

-- Akaun Amanah (trust account)
create table if not exists public.akaun_amanah (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.users(id),
  name text not null,
  amount numeric not null,
  year int not null,
  created_at timestamp with time zone default now()
);

-- Expenses (auto‑payment records)
create table if not exists public.expenses (
  id uuid default uuid_generate_v4() primary key,
  vot_id uuid references public.vots(id),
  month int not null,
  description text,
  amount numeric not null,
  created_at timestamp with time zone default now()
);

-- Enable pgcrypto for uuid_generate_v4 if not present
create extension if not exists "pgcrypto";

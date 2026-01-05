-- Create a table for public profiles
create table if not exists public.sajulatte_users (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  gender text, -- 'male' or 'female'
  birth_year int,
  birth_month int,
  birth_day int,
  birth_hour int,
  birth_minute int,
  calendar_type text default 'solar', -- 'solar' or 'lunar'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.sajulatte_users enable row level security;

-- Create policies
create policy "Users can view their own profile."
  on public.sajulatte_users for select
  using (auth.uid() = id);

create policy "Users can insert their own profile."
  on public.sajulatte_users for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile."
  on public.sajulatte_users for update
  using (auth.uid() = id);

-- Create a function to handle new user signup (optional, if we want to auto-create profiles)
-- For this app, we might create the profile when the user saves their Saju info.

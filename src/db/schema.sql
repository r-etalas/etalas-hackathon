-- Drop existing table and type if they exist
drop table if exists public.users;
drop type if exists user_role;

-- Create enum type for user roles
create type user_role as enum ('admin', 'member');

-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  name text,
  avatar_url text,
  role user_role default 'member' not null,
  primary key (id)
);

-- Enable RLS
alter table public.users enable row level security;

-- Create policies
create policy "Public users are viewable by everyone."
  on users for select
  using ( true );

create policy "Enable insert for authenticated users only"
  on users for insert
  with check (auth.role() = 'authenticated');

create policy "Enable update for users based on id"
  on users for update
  using ( auth.uid() = id );

create policy "Enable delete for users based on id"
  on users for delete
  using ( auth.uid() = id ); 
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

-- Drop existing wedding_video table if exists
drop table if exists public.wedding_video;

-- Create wedding_video table
create table public.wedding_video (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  video_path text not null,
  video_filename text not null,
  video_size bigint not null,
  video_type text not null,
  video_url text not null,
  thumbnail_url text,
  duration integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null
);

-- Enable RLS
alter table public.wedding_video enable row level security;

-- Create policies
create policy "Public wedding videos are viewable by everyone."
  on wedding_video for select
  using ( true );

create policy "Users can insert their own wedding videos"
  on wedding_video for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own wedding videos"
  on wedding_video for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

create policy "Users can delete their own wedding videos"
  on wedding_video for delete
  using ( auth.uid() = user_id );

-- Create trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger wedding_video_updated_at
  before update on public.wedding_video
  for each row
  execute procedure public.handle_updated_at(); 
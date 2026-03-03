-- USERS (mirrors Supabase auth.users)

create table public.users (

  id uuid primary key references auth.users(id) on delete cascade,

  name text not null,

  email text unique not null,

  role text default 'user' check (role in ('user', 'candidate', 'admin')),

  avatar_url text,

  governorate text,

  created_at timestamptz default now()

);

alter table public.users enable row level security;

create policy "Public read users" on public.users for select using (true);

create policy "Users insert self" on public.users for insert with check (auth.uid() = id);

create policy "Users update self" on public.users for update using (auth.uid() = id);



-- Trigger: auto-create user row on signup

create or replace function public.handle_new_user()

returns trigger as $$

begin

  insert into public.users (id, email, name)

  values (new.id, new.email, new.raw_user_meta_data->>'name');

  return new;

end;

$$ language plpgsql security definer;

create trigger on_auth_user_created

  after insert on auth.users

  for each row execute procedure public.handle_new_user();



-- POSTS

create table public.posts (

  id uuid primary key default gen_random_uuid(),

  author_id uuid references public.users(id) on delete cascade,

  content text not null,

  image_url text,

  governorate text,

  type text default 'post' check (type in ('post', 'reel', 'event', 'debate')),

  likes_count integer default 0,

  comments_count integer default 0,

  created_at timestamptz default now()

);

alter table public.posts enable row level security;

create policy "Public read posts" on public.posts for select using (true);

create policy "Auth users create posts" on public.posts for insert with check (auth.uid() = author_id);

create policy "Authors update posts" on public.posts for update using (auth.uid() = author_id);

create policy "Authors delete posts" on public.posts for delete using (auth.uid() = author_id);



-- CANDIDATES

create table public.candidates (

  id uuid primary key default gen_random_uuid(),

  user_id uuid references public.users(id),

  name text not null,

  name_ku text,

  name_ar text,

  bio text,

  bio_ku text,

  bio_ar text,

  governorate text,

  party text,

  image_url text,

  verified boolean default false,

  created_at timestamptz default now()

);

alter table public.candidates enable row level security;

create policy "Public read candidates" on public.candidates for select using (true);

create policy "Admin manage candidates" on public.candidates 

  for all using (

    exists (select 1 from public.users where id = auth.uid() and role = 'admin')

  );



-- EVENTS

create table public.events (

  id uuid primary key default gen_random_uuid(),

  created_by uuid references public.users(id),

  title text not null,

  description text,

  location text,

  governorate text,

  date timestamptz,

  image_url text,

  created_at timestamptz default now()

);

alter table public.events enable row level security;

create policy "Public read events" on public.events for select using (true);

create policy "Auth users create events" on public.events for insert with check (auth.uid() = created_by);

create policy "Owners manage events" on public.events for all using (auth.uid() = created_by);



-- STORAGE: create bucket named 'media' with public access in Supabase dashboard

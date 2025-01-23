-- Create a table for user profiles
create table profiles (
    id uuid references auth.users on delete cascade,
    full_name text,
    updated_at timestamp with time zone,
    email_notifications boolean default true,
    paper_alerts boolean default true,
    auto_download boolean default false,
    save_history boolean default true,
    primary key (id)
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a function to handle new user profiles
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to automatically create profiles for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create types for download history
create type download_source as enum (
    'Google Scholar',
    'PubMed',
    'ResearchGate',
    'CORE',
    'DOAJ',
    'Semantic Scholar',
    'arXiv',
    'Sci-Hub',
    'Academia.edu',
    'Open Access Button',
    'Zenodo',
    'LibGen',
    'PLOS',
    'BASE',
    'ScienceOpen',
    'Custom URL',
    'DOI Search'
);

-- Create table for download history
create table downloads (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users on delete cascade,
    url text not null,
    sci_hub_url text,
    title text not null,
    source download_source not null,
    downloaded_at timestamp with time zone default now(),
    created_at timestamp with time zone default now()
);

-- Enable RLS on downloads
alter table downloads enable row level security;

-- Create policies for downloads
create policy "Users can view own downloads"
  on downloads for select
  using ( auth.uid() = user_id );

create policy "Users can insert own downloads"
  on downloads for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete own downloads"
  on downloads for delete
  using ( auth.uid() = user_id );
-- Quest Board Schema

-- Enums
create type quest_status as enum ('backlog', 'active', 'done', 'failed');
create type quest_difficulty as enum ('trivial', 'easy', 'medium', 'hard', 'legendary');
create type quest_category as enum ('feature', 'bugfix', 'refactor', 'study', 'planning', 'communication', 'other');

-- Characters (RPG profile)
create table characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null default 'Hero',
  level integer not null default 1,
  xp_total integer not null default 0,
  hp integer not null default 100,
  hp_max integer not null default 100,
  mp integer not null default 50,
  mp_max integer not null default 50,
  stat_str integer not null default 10,
  stat_dex integer not null default 10,
  stat_con integer not null default 10,
  stat_int integer not null default 10,
  stat_wis integer not null default 10,
  stat_cha integer not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- Projects (buildings on the map)
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  slug text not null,
  color text not null default '#8B5CF6',
  sprite text not null default 'default',
  map_x integer not null default 0,
  map_y integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, slug)
);

-- Quests (tasks per project)
create table quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  description text not null default '',
  status quest_status not null default 'backlog',
  difficulty quest_difficulty not null default 'medium',
  category quest_category not null default 'other',
  xp_reward integer not null default 50,
  stat_bonus text,
  due_date date,
  is_boss boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Pomodoro sessions
create table pomodoro_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  duration integer not null default 1500,
  project_id uuid references projects(id) on delete set null,
  quest_id uuid references quests(id) on delete set null,
  completed boolean not null default false,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

-- Daily logs (aggregated stats per day)
create table daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  coffee_count integer not null default 0,
  water_count integer not null default 0,
  work_minutes integer not null default 0,
  xp_earned integer not null default 0,
  quests_completed integer not null default 0,
  pomodoros_completed integer not null default 0,
  unique(user_id, date)
);

-- Achievements (unlocked)
create table achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  achievement_key text not null,
  unlocked_at timestamptz not null default now(),
  unique(user_id, achievement_key)
);

-- Inventory items
create table inventory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  item_key text not null,
  quantity integer not null default 0,
  unique(user_id, item_key)
);

-- Work sessions (time tracking)
create table work_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references projects(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

-- RLS policies
alter table characters enable row level security;
alter table projects enable row level security;
alter table quests enable row level security;
alter table pomodoro_sessions enable row level security;
alter table daily_logs enable row level security;
alter table achievements enable row level security;
alter table inventory_items enable row level security;
alter table work_sessions enable row level security;

create policy "Users manage own characters" on characters for all using (user_id = auth.uid());
create policy "Users manage own projects" on projects for all using (user_id = auth.uid());
create policy "Users manage own quests" on quests for all using (user_id = auth.uid());
create policy "Users manage own pomodoros" on pomodoro_sessions for all using (user_id = auth.uid());
create policy "Users manage own daily logs" on daily_logs for all using (user_id = auth.uid());
create policy "Users manage own achievements" on achievements for all using (user_id = auth.uid());
create policy "Users manage own inventory" on inventory_items for all using (user_id = auth.uid());
create policy "Users manage own work sessions" on work_sessions for all using (user_id = auth.uid());

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger characters_updated_at before update on characters for each row execute function update_updated_at();
create trigger projects_updated_at before update on projects for each row execute function update_updated_at();

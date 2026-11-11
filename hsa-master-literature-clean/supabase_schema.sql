-- ==============================================================================
-- HSA MASTER - DATABASE SCHEMA FOR SUPABASE / POSTGRESQL
-- Copy and run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_salt TEXT NOT NULL,
  password_digest TEXT NOT NULL,
  requires_password_setup BOOLEAN DEFAULT FALSE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'super_admin')),
  class_name TEXT DEFAULT '12A03',
  school_name TEXT DEFAULT 'Trường THPT Yên Lãng',
  academic_year TEXT DEFAULT '2026–2027',
  joined_at TEXT NOT NULL DEFAULT CURRENT_DATE::text,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked')),
  preferences JSONB DEFAULT '{"theme": "light"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  passage TEXT DEFAULT '',
  passage_source TEXT DEFAULT '',
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  related_knowledge TEXT DEFAULT '',
  memory_tip TEXT DEFAULT '',
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  source_note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Exams Table
CREATE TABLE IF NOT EXISTS public.exams (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  question_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  max_score NUMERIC NOT NULL DEFAULT 100,
  difficulty TEXT NOT NULL DEFAULT 'Trung bình',
  topic TEXT NOT NULL DEFAULT 'Tổng hợp toàn diện',
  category_type TEXT NOT NULL DEFAULT 'Đề mô phỏng cấu trúc HSA',
  knowledge_outline JSONB DEFAULT '[]'::jsonb,
  instructions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Exam Attempts Table
CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  exam_code TEXT NOT NULL,
  exam_title TEXT NOT NULL,
  user_id TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  wrong_count INTEGER NOT NULL,
  unanswered_count INTEGER NOT NULL,
  score NUMERIC NOT NULL,
  max_score NUMERIC NOT NULL,
  accuracy_percent NUMERIC NOT NULL,
  answers JSONB DEFAULT '{}'::jsonb,
  flagged_questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Wrong Question Records Table
CREATE TABLE IF NOT EXISTS public.wrong_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  wrong_count INTEGER NOT NULL DEFAULT 1,
  correct_streak INTEGER NOT NULL DEFAULT 0,
  last_attempted_at TEXT NOT NULL,
  mastered BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Row Level Security (RLS) Configuration
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wrong_records ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for client application
DROP POLICY IF EXISTS "Public Access Users" ON public.users;
CREATE POLICY "Public Access Users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Questions" ON public.questions;
CREATE POLICY "Public Access Questions" ON public.questions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Exams" ON public.exams;
CREATE POLICY "Public Access Exams" ON public.exams FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Exam Attempts" ON public.exam_attempts;
CREATE POLICY "Public Access Exam Attempts" ON public.exam_attempts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Wrong Records" ON public.wrong_records;
CREATE POLICY "Public Access Wrong Records" ON public.wrong_records FOR ALL USING (true) WITH CHECK (true);

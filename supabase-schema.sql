-- 프로필 테이블 (사용자 정보 확장)
CREATE TABLE IF NOT EXISTS profiles (
id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
name TEXT,
avatar_url TEXT,
role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 사용자가 생성될 때 프로필 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO public.profiles (id, name, avatar_url, role, status)
VALUES (
  NEW.id,
  NEW.raw_user_meta_data->>'name',
  NEW.raw_user_meta_data->>'avatar_url',
  'user',
  'active'
);
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 강의 테이블
CREATE TABLE IF NOT EXISTS courses (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
title TEXT NOT NULL,
description TEXT NOT NULL,
long_description TEXT,
category TEXT NOT NULL,
level TEXT NOT NULL,
duration TEXT NOT NULL,
price DECIMAL(10, 2) NOT NULL,
image_url TEXT,
instructor_id UUID REFERENCES auth.users NOT NULL,
published BOOLEAN DEFAULT FALSE,
for_text TEXT,
not_for TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 첨부파일 테이블
CREATE TABLE IF NOT EXISTS attachments (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
course_id UUID REFERENCES courses ON DELETE CASCADE NOT NULL,
name TEXT NOT NULL,
url TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 모듈 테이블
CREATE TABLE IF NOT EXISTS modules (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
course_id UUID REFERENCES courses ON DELETE CASCADE NOT NULL,
title TEXT NOT NULL,
"order" INTEGER NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 강의 테이블
CREATE TABLE IF NOT EXISTS lectures (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
module_id UUID REFERENCES modules ON DELETE CASCADE NOT NULL,
title TEXT NOT NULL,
description TEXT,
video_url TEXT,
duration TEXT,
"order" INTEGER NOT NULL,
type TEXT NOT NULL CHECK (type IN ('video', 'assignment', 'quiz')),
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 수강 등록 테이블
CREATE TABLE IF NOT EXISTS enrollments (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
course_id UUID REFERENCES courses ON DELETE CASCADE NOT NULL,
enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
UNIQUE(user_id, course_id)
);

-- 강의 진행 상황 테이블
CREATE TABLE IF NOT EXISTS lecture_progress (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
lecture_id UUID REFERENCES lectures ON DELETE CASCADE NOT NULL,
completed BOOLEAN DEFAULT FALSE,
last_accessed TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
UNIQUE(user_id, lecture_id)
);

-- RLS 정책 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_progress ENABLE ROW LEVEL SECURITY;

-- 프로필 정책
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- 관리자 정책
CREATE POLICY "Admins can do anything" ON profiles
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do anything" ON courses
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do anything" ON attachments
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do anything" ON modules
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do anything" ON lectures
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do anything" ON enrollments
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do anything" ON lecture_progress
USING (auth.jwt() ->> 'role' = 'admin');

-- 강의 정책
CREATE POLICY "Published courses are viewable by everyone" ON courses
FOR SELECT USING (published = true);

-- 첨부파일 정책
CREATE POLICY "Attachments of published courses are viewable by everyone" ON attachments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = attachments.course_id AND courses.published = true
  )
);

-- 모듈 및 강의 정책
CREATE POLICY "Modules of published courses are viewable by everyone" ON modules
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = modules.course_id AND courses.published = true
  )
);

CREATE POLICY "Lectures of published courses are viewable by everyone" ON lectures
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM modules
    JOIN courses ON courses.id = modules.course_id
    WHERE modules.id = lectures.module_id AND courses.published = true
  )
);

-- 수강 등록 정책
CREATE POLICY "Users can view their own enrollments" ON enrollments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" ON enrollments
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 강의 진행 상황 정책
CREATE POLICY "Users can view their own progress" ON lecture_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON lecture_progress
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON lecture_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE payments (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  payment_key TEXT NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  message TEXT,
  amount BIGINT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX payments_user_id_idx ON payments (user_id);


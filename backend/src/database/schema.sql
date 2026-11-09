-- ========================================================
-- SCHEMA CHO SUPABASE / NEON POSTGRESQL (MIỄN PHÍ)
-- Copy toàn bộ nội dung này dán vào mục SQL Editor của Supabase hoặc Neon
-- ========================================================

-- 1. Bảng Thông tin Học viên
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'default_user',
    username VARCHAR(100) DEFAULT 'Learner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Thống kê & Tiến độ tổng quan
CREATE TABLE IF NOT EXISTS user_stats (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    daily_goal INTEGER DEFAULT 50,
    level VARCHAR(10) DEFAULT 'B1',
    last_active_date DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Điểm theo ngày (Lưu chuỗi 7 ngày và lịch sử)
CREATE TABLE IF NOT EXISTS daily_points (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    points INTEGER DEFAULT 0,
    UNIQUE(user_id, date)
);

-- 4. Bảng Tỉ lệ chính xác theo từng chế độ học
CREATE TABLE IF NOT EXISTS mode_stats (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    mode VARCHAR(30) NOT NULL,
    correct_count INTEGER DEFAULT 0,
    total_count INTEGER DEFAULT 0,
    UNIQUE(user_id, mode)
);

-- 5. Bảng Sổ tay từ cần ôn
CREATE TABLE IF NOT EXISTS notebook_words (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    en VARCHAR(100) NOT NULL,
    vi VARCHAR(255) NOT NULL,
    ipa VARCHAR(100),
    lv VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, en)
);

-- 6. Bảng Sổ tay ghi chép lỗi sai (Dịch, Sắp xếp, Nghe chép...)
CREATE TABLE IF NOT EXISTS notebook_notes (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    wrong TEXT NOT NULL,
    fix TEXT NOT NULL,
    why TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bảng Đoạn văn tự thêm của người dùng
CREATE TABLE IF NOT EXISTS custom_passages (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    vi TEXT NOT NULL,
    en TEXT,
    lv VARCHAR(50) DEFAULT 'Của bạn',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Bảng Cài đặt người dùng
CREATE TABLE IF NOT EXISTS user_settings (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chèn dữ liệu mặc định ban đầu nếu chưa có
INSERT INTO users (id, username) 
VALUES ('default_user', 'Learner') 
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_stats (user_id, total_points, streak, daily_goal, level) 
VALUES ('default_user', 0, 0, 50, 'B1') 
ON CONFLICT (user_id) DO NOTHING;

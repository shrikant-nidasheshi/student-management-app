-- config/initDB.sql
-- Run this in pgAdmin Query Tool OR via psql
-- HOW TO USE IN pgAdmin:
--   1. Open pgAdmin → right-click Databases → Create → Database → name it "student_management"
--   2. Click on student_management → click "Query Tool"
--   3. Paste this entire file and press F5 (Execute)

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  course_name VARCHAR(200) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments table (many-to-many: students <-> courses)
CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (student_id, course_id)
);

-- Default admin account
-- Email: admin@school.com | Password: password
-- CHANGE THIS PASSWORD after first login!
INSERT INTO users (name, email, password, role)
VALUES (
  'Admin User',
  'admin@school.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
) ON CONFLICT (email) DO NOTHING;

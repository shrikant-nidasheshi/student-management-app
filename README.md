# 🎓 Student Management System (PostgreSQL Edition)

Full-stack app: Node.js + Express backend, React frontend, PostgreSQL database (pgAdmin compatible).

---

## ⚡ Quick Start

### 1. Setup Database in pgAdmin
1. Open pgAdmin → right-click **Databases** → **Create** → **Database**
2. Name it: `student_management` → Save
3. Click on `student_management` → click **Query Tool** (toolbar)
4. Open file `backend/config/initDB.sql`, paste contents → press **F5**
5. You should see tables created + default admin inserted ✅

### 2. Run Backend
```bash
cd backend
npm install
cp .env.example .env
```
Edit `.env`:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_pgadmin_password
DB_NAME=student_management
JWT_SECRET=any_long_random_string_here
```
Then:
```bash
npm start
```
✅ Backend runs at: http://localhost:5000

### 3. Run Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start
```
✅ Frontend runs at: http://localhost:3000

---

## 🔑 Default Login
| Role  | Email               | Password |
|-------|---------------------|----------|
| Admin | admin@school.com    | password |

---

## 📋 API Endpoints

| Method | Endpoint                        | Access  |
|--------|---------------------------------|---------|
| POST   | /api/auth/register              | Public  |
| POST   | /api/auth/login                 | Public  |
| GET    | /api/student/profile            | Student |
| GET    | /api/student/courses            | Student |
| GET    | /api/admin/students             | Admin   |
| POST   | /api/admin/create-student       | Admin   |
| PUT    | /api/admin/update-student/:id   | Admin   |
| DELETE | /api/admin/delete-student/:id   | Admin   |
| GET    | /api/admin/courses              | Admin   |
| POST   | /api/admin/create-course        | Admin   |
| PUT    | /api/admin/update-course/:id    | Admin   |
| DELETE | /api/admin/delete-course/:id    | Admin   |
| POST   | /api/admin/assign-course        | Admin   |

---

## 🗄️ Database Tables
- **users** — id, name, email, password, role, created_at
- **courses** — id, course_name, description, created_at
- **enrollments** — id, student_id, course_id, enrolled_at

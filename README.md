# 🎓 Trung Tâm Gia Sư (Tutoring Center Platform)

**Skeleton project** cho nền tảng kết nối học sinh với gia sư trực tuyến.

> ⚠️ **Đây là SKELETON** - chỉ có cấu trúc, config, templates. Chưa có implementation logic.

## ✨ Tính năng

### Học sinh

- ✅ Đăng ký & đăng nhập
- ✅ Tạo hồ sơ (trường, lớp, môn học)
- ✅ Tìm kiếm gia sư theo môn + giá
- ✅ Đặt lịch học

### Gia sư

- ✅ Đăng ký & đăng nhập
- ✅ Tạo hồ sơ (chuyên ngành, giá dạy)
- ✅ Xác nhận lịch học
- ✅ Quản lý lịch dạy

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL 16 + Prisma ORM
- **Auth**: JWT + bcryptjs
- **DevOps**: Docker + Docker Compose

---

## 🚀 Quick Start

### Docker (Recommended)

```bash
# 1. Start services
docker-compose up -d

# 2. Database migrations (first time)
docker-compose exec backend npm run prisma:migrate

# 3. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Database GUI: npm run prisma:studio
```

### Manual Setup

**Backend:**

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:migrate
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## 📁 Cấu trúc dự án

```
TrungTamGiaSu/
├── backend/
│   ├── src/
│   │   ├── controllers/  # Business logic templates
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, error handler
│   │   ├── config/       # Prisma Client
│   │   └── utils/        # Helpers (response, validators)
│   ├── prisma/
│   │   └── schema.prisma # Database schema ✅ (DETAILED)
│   ├── .env              # Environment config ✅
│   ├── Dockerfile        # Container config ✅
│   └── package.json      # Dependencies ✅
│
├── frontend/
│   ├── src/
│   │   ├── components/   # UI components (templates)
│   │   ├── pages/        # Page components (to create)
│   │   ├── services/     # API calls ✅
│   │   ├── hooks/        # Custom hooks (templates)
│   │   ├── types/        # Enums & types ✅
│   │   └── utils/        # Constants ✅
│   ├── vite.config.js    # Build config ✅
│   ├── Dockerfile        # Container config ✅
│   └── package.json      # Dependencies ✅
│
├── docker-compose.yml    # Multi-container setup ✅
├── DATABASE.md           # Schema & Prisma guide
├── SETUP.md              # Detailed setup guide
├── SKELETON_GUIDE.md     # Implementation guide
└── README.md             # (This file)
```

---

## 🗄️ Database Schema

**4 Models:**

```
User ──→ Student (1-1)
    └──→ Tutor (1-1)

Student ┐
        ├──→ Booking (N-N)
Tutor ──┘
```

**Models:**

- **User**: email, password, role (STUDENT|TUTOR|ADMIN)
- **Student**: grade, school, subjects, bio
- **Tutor**: specialization, experience, hourlyRate, isVerified
- **Booking**: studentId, tutorId, subject, status, scheduledDate

Status flow: `PENDING → CONFIRMED → COMPLETED` (or `CANCELLED`)

👉 See: **[DATABASE.md](./DATABASE.md)** for detailed schema with examples

---

## 🔌 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token

GET    /api/users/me
PUT    /api/users/me
DELETE /api/users/me

GET    /api/tutors
GET    /api/tutors/:id
POST   /api/tutors
PUT    /api/tutors/:id

POST   /api/bookings
GET    /api/bookings/me
PUT    /api/bookings/:id
DELETE /api/bookings/:id
```

Response format:

```json
{
  "success": true,
  "message": "...",
  "data": {...},
  "error": null
}
```

---

## 💻 Development

### Backend

```bash
cd backend

npm run dev              # Start dev server
npm run prisma:migrate  # Create migrations
npm run prisma:studio   # View database GUI
npm run prisma:reset    # Reset database
```

**Implement:**

1. `src/controllers/*.js` - Add business logic
2. `src/middleware/*.js` - Add auth/error handling
3. Tests & validation

### Frontend

```bash
cd frontend

npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview build
```

**Create:**

1. `src/pages/*.jsx` - Page components
2. `src/services/*.js` - Complete API calls
3. Context/state management
4. More UI components

---

## 🐳 Docker

```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f backend

# Migrations
docker-compose exec backend npm run prisma:migrate

# Stop
docker-compose down

# Full reset
docker-compose down -v
```

Services:

- **postgres:5432** - Database
- **backend:5000** - API Server
- **frontend:3000** - React App

---

## 📚 Documentation

| File                                         | Content                          |
| -------------------------------------------- | -------------------------------- |
| **[DATABASE.md](./DATABASE.md)**             | Schema, Prisma queries, examples |
| **[SETUP.md](./SETUP.md)**                   | Detailed setup (Docker & Manual) |
| **[SKELETON_GUIDE.md](./SKELETON_GUIDE.md)** | Step-by-step implementation      |

---

## 🔑 Environment Variables

**Backend** (`.env`):

```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/trung_tam_gia_su
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
API_URL=http://localhost:5000
```

**Frontend** (`.env`):

```
VITE_API_URL=http://localhost:5000
```

---

## 📋 Implementation Checklist

- [ ] Backend: Implement auth (register, login, JWT)
- [ ] Backend: Implement CRUD controllers
- [ ] Backend: Add input validation
- [ ] Backend: Add error handling
- [ ] Database: Run migrations
- [ ] Frontend: Create page components
- [ ] Frontend: Implement auth flow
- [ ] Frontend: Connect to API
- [ ] Frontend: Add state management
- [ ] Testing & deployment

3. Tạo `.env` file và điền các biến:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://...
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=7d
   ```
4. Chạy dev: `npm run dev`

### Frontend

1. Vào thư mục frontend: `cd frontend`
2. Install packages: `npm install`
3. Chạy dev: `npm run dev`

## Các file cần implement

### Backend

- Controllers: Business logic cho auth, user, tutor, booking
- Models: MongoDB schemas
- Routes: API endpoints
- Middleware: Authentication, validation, error handling

### Frontend

- Pages: HomePage, LoginPage, TutorListPage, TutorDetailPage, BookingPage
- Services: API calls (đã setup structure)
- Context: Global state management
- Components: Reusable UI

## Notes

- Skeleton này chỉ là nền tảng, không có logic implementation
- CSS được tổ chức tách biệt theo components
- Frontend có type definitions sẵn
- Backend config cơ bản sẵn có

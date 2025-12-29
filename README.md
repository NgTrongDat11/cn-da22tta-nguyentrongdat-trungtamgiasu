# 🎓 Trung Tâm Gia Sư

Nền tảng kết nối học viên với gia sư trực tuyến.

## ✨ Tính năng

### 👨‍🎓 Học Viên

- ✅ Đăng ký & đăng nhập với JWT authentication
- ✅ Quản lý hồ sơ cá nhân (thông tin, và đổi mật khẩu)
- ✅ Tìm kiếm và đăng ký lớp học theo môn
- ✅ Xem danh sách lớp học đã đăng ký
- ✅ Xem đánh giá của gia sư
- ✅ Dashboard theo dõi tiến độ học tập

### 👨‍🏫 Gia Sư

- ✅ Đăng ký & xác thực tài khoản
- ✅ Tạo và quản lý hồ sơ (chuyên môn, kinh nghiệm, trình độ)
- ✅ Nhận đăng ký từ học viên
- ✅ Quản lý lịch giảng dạy
- ✅ Ký hợp đồng giảng dạy
- ✅ Dashboard thống kê học viên và thu nhập

### 👨‍💼 Admin

- ✅ Quản lý tài khoản (học viên, gia sư)
- ✅ Quản lý môn học
- ✅ Quản lý lớp học
- ✅ Duyệt đăng ký học viên vào lớp
- ✅ Phân công gia sư cho lớp học
- ✅ Thống kê hệ thống

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Recharts** - Charts & visualizations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma ORM** - Database toolkit
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Database
- **PostgreSQL 16** - Primary database

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nodemon** - Hot reload (development)

---

## 🚀 Quick Start với Docker (Recommended)

### Yêu cầu
- Docker & Docker Compose
- Git

### Khởi động hệ thống

```bash
# 1. Clone repository
git clone <repository-url>
cd TrungTamGiaSu

# 2. Tạo file .env cho backend
cp backend/.env.example backend/.env

# 3. Start all services
docker-compose up -d

# 4. Database migrations (chỉ lần đầu)
docker-compose exec backend npx prisma migrate deploy

# 5. Seed initial data (optional)
docker-compose exec backend npm run seed

# 6. Truy cập ứng dụng
```

### URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432
- **Prisma Studio** (Database GUI):
  ```bash
  cd backend
  npm run prisma:studio
  ```

### Tài khoản test

Sau khi seed data:

**Admin:**
- Email: `admin@trungtamgiasu.vn`
- Password: `admin123`

**Gia Sư:**
- Email: `giasu1@gmail.com`
- Password: `123456`

**Học Viên:**
- Email: `hocvien1@gmail.com`
- Password: `123456`

### Manual Setup (Không dùng Docker)

#### Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Cập nhật DATABASE_URL trong .env

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed data (optional)
npm run seed

# Start development server
npm run dev
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Setup environment (optional)
cp .env.example .env

# Start development server
npm run dev
```

#### PostgreSQL
Đảm bảo PostgreSQL đang chạy và cập nhật `DATABASE_URL` trong `backend/.env`:
```
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/trung_tam_gia_su?schema=public
```

---

## 📁 Cấu trúc dự án

```
TrungTamGiaSu/
├── backend/
│   ├── src/
│   │   ├── config/           # Database & environment config
│   │   │   ├── prisma.js     # Prisma client instance
│   │   │   ├── minio.js      # MinIO storage setup
│   │   │   └── database.js   # Database connection
│   │   ├── controllers/      # Business logic
│   │   │   ├── authController.js
│   │   │   ├── adminController.js
│   │   │   ├── giaSuController.js
│   │   │   ├── hocVienController.js
│   │   │   ├── lopHocController.js
│   │   │   ├── monHocController.js
│   │   │   └── ratingController.js
│   │   ├── middleware/       # Express middleware
│   │   │   ├── auth.js       # JWT authentication
│   │   │   ├── errorHandler.js
│   │   │   ├── upload.js     # File upload (Multer)
│   │   │   └── validate.js   # Request validation
│   │   ├── routes/           # API endpoints
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   ├── giaSu.js
│   │   │   ├── hocVien.js
│   │   │   ├── lopHoc.js
│   │   │   └── monHoc.js
│   │   ├── services/         # External services
│   │   │   └── uploadService.js
│   │   ├── utils/            # Helper functions
│   │   │   ├── response.js   # Standardized API responses
│   │   │   ├── jwt.js        # JWT utilities
│   │   │   ├── pagination.js # Pagination helper
│   │   │   └── validators.js # Custom validators
│   │   ├── validators/       # Validation schemas
│   │   ├── constants/        # App constants
│   │   ├── index.js          # Entry point
│   │   └── seed.js           # Database seeder
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # Migration history
│   ├── .env                  # Environment variables
│   ├── Dockerfile            # Backend container
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   └── Landing.jsx
│   │   │   └── Pagination/
│   │   ├── pages/            # Page components
│   │   │   ├── Landing/      # Homepage
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Dashboard/    # Role-based dashboards
│   │   │   ├── Admin/        # Admin pages
│   │   │   ├── Tutor/        # Gia sư pages
│   │   │   └── Student/      # Học viên pages
│   │   ├── api/              # API integration
│   │   │   ├── client.js     # Axios instance
│   │   │   └── services.js   # API service functions
│   │   ├── contexts/         # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/            # Custom hooks
│   │   ├── utils/            # Helper functions
│   │   ├── styles/           # Global styles
│   │   ├── App.jsx           # Root component
│   │   └── main.jsx          # Entry point
│   ├── Dockerfile            # Frontend container
│   ├── vite.config.js        # Vite configuration
│   └── package.json
│
├── docker-compose.yml        # Multi-container orchestration
├── schema.sql                # Database schema backup
├── seed.sql                  # Seed data backup
├── .gitignore
└── README.md                 # This file
```

---

## 🗄️ Database Schema

### Models (9 tables)

1. **TaiKhoan** - User accounts với role-based access
2. **GiaSu** - Tutor profiles
3. **HocVien** - Student profiles  
4. **MonHoc** - Subjects/Courses
5. **LopHoc** - Classes với trạng thái workflow
6. **DangKy** - Student registrations
7. **HopDongGiangDay** - Teaching contracts
8. **LichHoc** - Class schedules
9. **DanhGia** - Ratings & reviews

### Relationships

```
TaiKhoan (1:1) → GiaSu
         (1:1) → HocVien

HocVien (N:M) → LopHoc (qua DangKy)
GiaSu   (N:M) → LopHoc (qua HopDongGiangDay)
MonHoc  (1:N) → LopHoc

LopHoc  (1:N) → DanhGia
        (1:N) → LichHoc
```

### Status Workflows

**LopHoc (Classes):**
```
DangTuyen → DangDay
           ↘ DaHuy
```

**DangKy (Registrations):**
```
ChoDuyet → DaDuyet
         ↘ TuChoi
```

**HopDongGiangDay (Contracts):**
```
DangChoDuyet → DaDuyet → DangThucHien
             ↘ BiTuChoi ↘ DaHuy
```

👉 Chi tiết: [backend/DATABASE.md](backend/DATABASE.md)

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register        # Đăng ký tài khoản
POST   /api/auth/login           # Đăng nhập
POST   /api/auth/logout          # Đăng xuất
GET    /api/auth/me              # Lấy thông tin user hiện tại
```

### Admin
```
GET    /api/admin/dashboard      # Thống kê tổng quan
GET    /api/admin/users          # Danh sách tài khoản
PUT    /api/admin/users/:id      # Cập nhật tài khoản
DELETE /api/admin/users/:id      # Xóa tài khoản
GET    /api/admin/classes        # Quản lý lớp học
POST   /api/admin/classes        # Tạo lớp học
PUT    /api/admin/approve/:id    # Duyệt đăng ký
```

### Môn Học
```
GET    /api/monhoc               # Danh sách môn học
POST   /api/monhoc               # Tạo môn học (admin)
PUT    /api/monhoc/:id           # Cập nhật môn học (admin)
DELETE /api/monhoc/:id           # Xóa môn học (admin)
```

### Lớp Học
```
GET    /api/lophoc               # Danh sách lớp học (có filter)
GET    /api/lophoc/:id           # Chi tiết lớp học
POST   /api/lophoc               # Tạo lớp học (admin)
PUT    /api/lophoc/:id           # Cập nhật lớp học
DELETE /api/lophoc/:id           # Xóa lớp học
```

### Gia Sư
```
GET    /api/giasu                # Danh sách gia sư
GET    /api/giasu/:id            # Chi tiết gia sư
POST   /api/giasu/profile        # Tạo/Cập nhật profile
POST   /api/giasu/avatar         # Upload avatar
GET    /api/giasu/classes        # Lớp học của gia sư
GET    /api/giasu/contracts      # Hợp đồng của gia sư
```

### Học Viên
```
GET    /api/hocvien              # Danh sách học viên
GET    /api/hocvien/:id          # Chi tiết học viên
POST   /api/hocvien/profile      # Tạo/Cập nhật profile
POST   /api/hocvien/avatar       # Upload avatar
POST   /api/hocvien/register     # Đăng ký lớp học
GET    /api/hocvien/registrations # Các lớp đã đăng ký
POST   /api/hocvien/rate         # Đánh giá gia sư
```

### Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

---

## 💻 Development

### Backend Commands

```bash
cd backend

npm run dev              # Start dev server (nodemon)
npm run start            # Production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create & apply migrations
npm run prisma:studio    # Open Prisma Studio (DB GUI)
npm run prisma:push      # Push schema changes (dev)
npm run seed             # Seed initial data
```

### Frontend Commands

```bash
cd frontend

npm run dev     # Start dev server (Vite)
npm run build   # Build for production
npm run preview # Preview production build
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild containers
docker-compose up -d --build

# Execute commands in container
docker-compose exec backend npm run prisma:studio
docker-compose exec backend npm run seed

# Remove all data (volumes)
docker-compose down -v
```

---

## 🐳 Docker Services

Container orchestration với Docker Compose:

### Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| **postgres** | ttgs-postgres | 5432 | PostgreSQL 16 database |
| **backend** | ttgs-backend | 5000 | Node.js API server |
| **frontend** | ttgs-frontend | 3000 | React + Vite app |

### Networks
- **ttgs-network** - Bridge network kết nối các services

### Volumes
- **postgres_data** - Persistent database storage

### Health Checks
- PostgreSQL có health check để đảm bảo backend khởi động sau khi DB ready

---

##  Environment Variables

### Backend `.env`

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/trung_tam_gia_su?schema=public

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# MinIO Storage (Optional)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=avatars
```

### Frontend `.env` (Optional)

```env
VITE_API_URL=http://localhost:5000/api
```
> ⚠️ **Security**: Đổi `JWT_SECRET` trong production!
### Authentication & Authorization
- JWT-based authentication với Bearer token
- Role-based access control (Admin, GiaSu, HocVien)
- Protected routes & middleware
- Password hashing với bcryptjs

### File Upload
- Avatar upload với Multer
- MinIO integration cho object storage
- File validation & size limits

### API Design
- RESTful API structure
- Standardized response format
- Comprehensive error handling
- Request validation với express-validator
- Pagination support

### Frontend Architecture
- Component-based structure
- Context API cho global state (AuthContext)
- Protected routes với React Router
- Role-based dashboards
- Responsive design

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:migrate:deploy
```


## 📝 Documentation

| File | Description |
|------|-------------|
| [backend/DATABASE.md](backend/DATABASE.md) | Database schema & Prisma details |
| [backend/HUONG_DAN.md](backend/HUONG_DAN.md) | Backend implementation guide |
| [backend/README.md](backend/README.md) | Backend-specific documentation |
| [frontend/README.md](frontend/README.md) | Frontend-specific documentation |

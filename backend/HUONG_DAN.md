# Hướng dẫn chạy Backend - Trung Tâm Gia Sư

## Yêu cầu
- Docker & Docker Compose
- Node.js 18+ (nếu chạy local)

## Cấu trúc Backend

```
backend/
├── src/
│   ├── index.js              # Entry point
│   ├── seed.js               # Seed database
│   ├── config/
│   │   ├── prisma.js         # Prisma client
│   │   └── minio.js          # MinIO client
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── giaSuController.js
│   │   ├── hocVienController.js
│   │   ├── lopHocController.js
│   │   ├── monHocController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   ├── upload.js         # Multer upload
│   │   ├── validate.js       # Request validation
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── giaSu.js
│   │   ├── hocVien.js
│   │   ├── lopHoc.js
│   │   ├── monHoc.js
│   │   └── admin.js
│   ├── services/
│   │   └── uploadService.js  # MinIO upload
│   └── utils/
│       ├── jwt.js
│       ├── pagination.js
│       └── response.js
└── prisma/
    └── schema.prisma
```

## Chạy với Docker (Khuyến nghị)

### 1. Tạo file .env
```bash
# Từ thư mục gốc
cp .env.example .env
```

### 2. Khởi chạy Docker
```bash
docker-compose up -d
```

### 3. Chạy migration Prisma
```bash
docker-compose exec backend npx prisma migrate deploy
```

### 4. Seed dữ liệu mẫu
```bash
docker-compose exec backend npm run seed
```

### 5. Kiểm tra
- API: http://localhost:5000/api
- Health: http://localhost:5000/health
- MinIO Console: http://localhost:9001

## Chạy Local (Development)

### 1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 2. Tạo file .env
```bash
cp .env.example .env
# Chỉnh sửa DATABASE_URL và các config khác
```

### 3. Chạy PostgreSQL & MinIO
```bash
docker-compose up -d postgres minio minio-setup
```

### 4. Chạy migration
```bash
npm run prisma:migrate
```

### 5. Seed database
```bash
npm run seed
```

### 6. Chạy server
```bash
npm run dev
```

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/register` | Đăng ký tài khoản |
| POST | `/login` | Đăng nhập |
| GET | `/profile` | Lấy thông tin profile |
| PUT | `/change-password` | Đổi mật khẩu |
| POST | `/logout` | Đăng xuất |

### Gia Sư (`/api/gia-su`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Danh sách gia sư |
| GET | `/:id` | Chi tiết gia sư |
| PUT | `/profile` | Cập nhật profile (auth) |
| POST | `/avatar` | Upload ảnh đại diện (auth) |
| GET | `/me/lop-hoc` | Danh sách lớp của mình (auth) |

### Học Viên (`/api/hoc-vien`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/profile` | Lấy profile |
| PUT | `/profile` | Cập nhật profile |
| GET | `/dang-ky` | Danh sách đăng ký |
| POST | `/dang-ky` | Đăng ký lớp học |
| DELETE | `/dang-ky/:id` | Hủy đăng ký |
| POST | `/danh-gia` | Đánh giá gia sư |

### Lớp Học (`/api/lop-hoc`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Danh sách lớp học |
| GET | `/:id` | Chi tiết lớp học |
| POST | `/` | Tạo lớp học (GiaSu/Admin) |
| PUT | `/:id` | Cập nhật lớp học |
| PUT | `/:id/lich-hoc` | Cập nhật lịch học |
| GET | `/:id/dang-ky` | Danh sách đăng ký |
| PUT | `/:id/duyet-dang-ky/:dangKyId` | Duyệt đăng ký |

### Môn Học (`/api/mon-hoc`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Danh sách môn học |
| GET | `/all` | Tất cả môn học (dropdown) |
| GET | `/:id` | Chi tiết môn học |
| POST | `/` | Tạo môn học (Admin) |
| PUT | `/:id` | Cập nhật môn học (Admin) |
| DELETE | `/:id` | Xóa môn học (Admin) |

### Admin (`/api/admin`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/dashboard` | Thống kê tổng quan |
| GET | `/tai-khoan` | Danh sách tài khoản |
| POST | `/tai-khoan/admin` | Tạo tài khoản Admin |
| PUT | `/tai-khoan/:id/trang-thai` | Khóa/Mở khóa TK |
| GET | `/lop-hoc` | Danh sách lớp học |
| POST | `/lop-hoc/:id/gan-gia-su` | Gán gia sư cho lớp |
| GET | `/dang-ky` | Danh sách đăng ký |

## Tài khoản Test

Sau khi chạy seed:

| Role | Email | Mật khẩu |
|------|-------|----------|
| Admin | admin@trungtamgiasu.vn | admin123 |
| Gia Sư | giasu1@gmail.com | 123456 |
| Học Viên | hocvien1@gmail.com | 123456 |

## Cấu hình môi trường

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/trung_tam_gia_su
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=avatars
MINIO_USE_SSL=false
```

## Lưu ý

1. **JWT Token**: Gửi trong header `Authorization: Bearer <token>`
2. **Phân trang**: Sử dụng query params `?page=1&limit=10`
3. **Upload file**: Sử dụng `multipart/form-data`, field name: `avatar`

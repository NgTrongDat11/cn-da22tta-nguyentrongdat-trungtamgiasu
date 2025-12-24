# Hướng dẫn sử dụng Database

## Cấu trúc Database (Prisma Schema)

File: `backend/prisma/schema.prisma`

### Các bảng chính:

1. **User** - Người dùng chung

   - id, email, password, fullName, phone, avatar
   - role: STUDENT | TUTOR | ADMIN
   - Relationships: studentProfile, tutorProfile, bookings

2. **Student** - Hồ sơ học sinh

   - id, userId, grade, school, subjects (array), bio
   - Relationships: user, bookings

3. **Tutor** - Hồ sơ gia sư

   - id, userId, specialization (array), experience, qualification, bio, hourlyRate
   - rating, totalReviews, isVerified
   - Relationships: user, bookings

4. **Booking** - Lịch học
   - id, studentId, tutorId, subject, status
   - scheduledDate, duration, notes, totalPrice
   - Status: PENDING | CONFIRMED | COMPLETED | CANCELLED

## Setup Database

### Lần đầu tiên

```bash
cd backend
npm install

# Setup Prisma migrations
npm run prisma:migrate
```

### Thêm/Sửa schema

1. Sửa `backend/prisma/schema.prisma`
2. Chạy: `npm run prisma:migrate`
3. Nhập tên migration: vd: `add_field_name`

### Xem database visually

```bash
npm run prisma:studio
```

Sẽ mở browser với Prisma Studio (GUI quản lý database)

### Reset database (xoá tất cả dữ liệu)

```bash
npx prisma migrate reset
```

## Sử dụng trong code

```javascript
import prisma from "./config/database.js";

// Create
const user = await prisma.user.create({
  data: {
    email: "user@example.com",
    password: "hashed_password",
    fullName: "John Doe",
    role: "STUDENT",
  },
});

// Read
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
});

// Update
const user = await prisma.user.update({
  where: { id: 1 },
  data: { fullName: "Jane Doe" },
});

// Delete
await prisma.user.delete({
  where: { id: 1 },
});

// With relations
const tutor = await prisma.tutor.findUnique({
  where: { id: 1 },
  include: {
    user: true,
    bookings: true,
  },
});
```

## Relations

- User 1 -> 0/1 Student
- User 1 -> 0/1 Tutor
- User 1 -> N Bookings (as student)
- Tutor 1 -> N Bookings
- Student 1 -> N Bookings

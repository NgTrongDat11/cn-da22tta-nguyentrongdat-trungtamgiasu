# Backend - Trung Tâm Gia Sư

## Cấu trúc thư mục

```
src/
├── config/          # Cấu hình (database, environment)
├── models/          # Mongoose schemas
├── controllers/     # Logic xử lý request
├── routes/          # API endpoints
├── middleware/      # Express middleware
├── utils/           # Utilities (response, jwt, etc)
└── validators/      # Validation rules
```

## Các file cần implement

- **index.js** - Khởi tạo server Express
- **config/database.js** - Kết nối MongoDB
- **Models** - User, Tutor, Student, Booking schemas
- **Controllers** - Logic business
- **Routes** - API endpoints
- **Middleware** - Auth, error handling

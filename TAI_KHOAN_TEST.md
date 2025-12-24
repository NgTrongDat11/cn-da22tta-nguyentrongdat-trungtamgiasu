# 🔐 TÀI KHOẢN TEST - TRUNG TÂM GIA SƯ

> **⚠️ Tất cả tài khoản đều có mật khẩu:** `123456` (trừ admin: `admin123`)
> 
> **📌 Nguồn dữ liệu:** Đã được import vào hệ thống qua `backend/src/seed.js`

---

## 👨‍💼 ADMIN

| Email | Mật khẩu | Role | Ghi chú |
|-------|----------|------|---------|
| `admin@trungtamgiasu.vn` | `admin123` | Admin | Tài khoản quản trị chính |

---

## 👨‍🏫 GIA SƯ (TUTORS)

| STT | Họ tên | Email | Mật khẩu | Chuyên môn | Kinh nghiệm | Trình độ |
|-----|--------|-------|----------|------------|-------------|----------|
| 1 | **Nguyễn Văn A** | `giasu1@gmail.com` | `123456` | Toán, Vật Lý | 5 năm | Thạc sĩ Toán học |
| 2 | **Trần Thị B** | `giasu2@gmail.com` | `123456` | Tiếng Anh, IELTS | 3 năm | Cử nhân Ngôn ngữ Anh, IELTS 8.0 |
| 3 | **Lê Văn C** | `giasu3@gmail.com` | `123456` | Tin Học, Lập trình | 4 năm | Kỹ sư CNTT |

---

## 👨‍🎓 HỌC VIÊN (STUDENTS)

| STT | Họ tên | Email | Mật khẩu | Năm sinh | Số điện thoại | Địa chỉ |
|-----|--------|-------|----------|----------|---------------|---------|
| 1 | **Phạm Văn D** | `hocvien1@gmail.com` | `123456` | 2005 | 0904567890 | Quận 1, TP.HCM |
| 2 | **Hoàng Thị E** | `hocvien2@gmail.com` | `123456` | 2006 | 0905678901 | Quận 3, TP.HCM |

---

## 🔗 URL ĐĂNG NHẬP

- **Frontend:** http://localhost:3000
- **API Backend:** http://localhost:5000/api
- **Endpoint Login:** http://localhost:5000/api/auth/login

---

## � DỮ LIỆU SEED ĐÃ TẠO

- ✅ **10 môn học**: Toán, Vật Lý, Hóa Học, Tiếng Anh, Ngữ Văn, Tin Học, Sinh Học, Lịch Sử, Địa Lý, IELTS
- ✅ **1 Admin**: admin@trungtamgiasu.vn
- ✅ **3 Gia sư**: giasu1-3@gmail.com (có lớp học và hợp đồng)
- ✅ **2 Học viên**: hocvien1-2@gmail.com
- ✅ **16 lớp học** được tạo với các môn khác nhau
- ✅ **Hợp đồng giảng dạy** giữa gia sư và lớp học
- ✅ Mật khẩu đã được hash với bcrypt (salt rounds: 12)

---

## 🔗 URL ĐĂNG NHẬP

- **Frontend:** http://localhost:3000
- **API Backend:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

---

## 📝 CÁCH ĐĂNG NHẬP

### 1. Qua giao diện web:
```
http://localhost:3000
- Email: giasu1@gmail.com
- Mật khẩu: 123456
```

### 2. Test qua API (PowerShell):
```powershell
# Login gia sư
$login = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method Post -ContentType "application/json" `
  -Body '{"email":"giasu1@gmail.com","matKhau":"123456"}'
$token = $login.data.token

# Lấy profile
$headers = @{Authorization="Bearer $token"}
Invoke-RestMethod -Uri "http://localhost:5000/api/gia-su/me" -Headers $headers

# Lấy lớp học
Invoke-RestMethod -Uri "http://localhost:5000/api/gia-su/me/lop-hoc" -Headers $headers
```

### 3. Test scripts nhanh:
```powershell
# Test nhanh tất cả endpoints
.\test-quick.ps1

# Test đầy đủ (bao gồm tạo account mới)
.\test-api.ps1

# Test deployment production
.\test-deployment.ps1
```

---

## 🗂️ FILE LIÊN QUAN

- **Seed script**: `backend/src/seed.js` - Nguồn dữ liệu chính thức
- **Test scripts**: `test-quick.ps1`, `test-api.ps1`, `test-deployment.ps1`
- **API Documentation**: `TEST_MON_HOC_FIX.md`, `fix_v2_completed.md`

---

**Cập nhật lần cuối:** 13/12/2025  
**Trạng thái:** ✅ Production Ready - Đã verify tất cả endpoints hoạt động

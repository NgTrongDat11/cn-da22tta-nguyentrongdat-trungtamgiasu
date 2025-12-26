# 🔄 REFACTOR: QUẢN LÝ TRẠNG THÁI LỚP HỌC & DOANH THU

> **Ngày tạo:** 26/12/2025  
> **Người thực hiện:** Dev Team  
> **Ưu tiên:** 🔴 HIGH  
> **Estimated Time:** 2-3 ngày

---

## 📋 MỤC LỤC

1. [Tổng Quan Vấn Đề](#1-tổng-quan-vấn-đề)
2. [Phân Tích Code Hiện Tại](#2-phân-tích-code-hiện-tại)
3. [Task List Chi Tiết](#3-task-list-chi-tiết)
4. [Implementation Guide](#4-implementation-guide)
5. [Testing Checklist](#5-testing-checklist)
6. [Rollback Plan](#6-rollback-plan)

---

## 1. TỔNG QUAN VẤN ĐỀ

### 1.1. Vấn Đề Chính

| # | Vấn đề | Mức độ | Ảnh hưởng |
|---|--------|--------|-----------|
| 1 | Trạng thái `KetThuc` không được sử dụng | 🔴 Critical | Không track được lớp hoàn thành |
| 2 | Doanh thu tính SAI (tính tất cả lớp) | 🔴 Critical | Báo cáo tài chính sai |
| 3 | Không có API kết thúc lớp | 🟡 Major | Admin không thể đóng lớp |
| 4 | Không auto-close lớp hết hạn | 🟡 Major | Dữ liệu không chính xác |
| 5 | Thiếu thống kê lớp đã kết thúc | 🟢 Minor | Dashboard không đầy đủ |

### 1.2. Schema Hiện Tại

```sql
-- Bảng lophoc (schema.sql:68-82)
CREATE TABLE lophoc (
    malop UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mamon UUID NOT NULL,
    tenlop VARCHAR(150) NOT NULL,
    hocphi DECIMAL(12, 2) NOT NULL,
    mota TEXT,
    hinhthuc VARCHAR(20) DEFAULT 'Offline' CHECK (hinhthuc IN ('Offline', 'Online')),
    sobuoidukien INT,
    trangthai VARCHAR(20) DEFAULT 'DangTuyen' 
        CHECK (trangthai IN ('DangTuyen', 'DangDay', 'KetThuc', 'Huy')),  -- ✅ KetThuc đã có
    ngaybatdau DATE,
    ngayketthuc DATE,
    ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mamon) REFERENCES monhoc(mamon) ON DELETE CASCADE
);

-- Bảng hopdonggiangday (schema.sql:108-118)
CREATE TABLE hopdonggiangday (
    mahopdong UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    magiasu UUID NOT NULL,
    malop UUID NOT NULL,
    ngaynhanlop TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trangthai VARCHAR(20) DEFAULT 'DangDay' 
        CHECK (trangthai IN ('DangDay', 'DaKetThuc', 'TamDung')),  -- ✅ DaKetThuc đã có
    FOREIGN KEY (magiasu) REFERENCES giasu(magiasu) ON DELETE CASCADE,
    FOREIGN KEY (malop) REFERENCES lophoc(malop) ON DELETE CASCADE,
    UNIQUE (magiasu, malop)
);
```

---

## 2. PHÂN TÍCH CODE HIỆN TẠI

### 2.1. Dashboard Statistics

**File:** `backend/src/controllers/adminController.js`  
**Function:** `getDashboard()` (Line 14-51)

```javascript
// ❌ CODE HIỆN TẠI (Line 14-51)
export const getDashboard = async (req, res, next) => {
  try {
    const [
      tongTaiKhoan,
      tongGiaSu,
      tongHocVien,
      tongLopHoc,
      lopDangTuyen,
      lopDangDay,
      dangKyChoDuyet,
      // ❌ THIẾU: lopDaKetThuc, lopDaHuy
    ] = await Promise.all([
      prisma.taiKhoan.count(),
      prisma.giaSu.count(),
      prisma.hocVien.count(),
      prisma.lopHoc.count(),
      prisma.lopHoc.count({ where: { trangThai: "DangTuyen" } }),
      prisma.lopHoc.count({ where: { trangThai: "DangDay" } }),
      prisma.dangKy.count({ where: { trangThai: "ChoDuyet" } }),
      // ❌ THIẾU count KetThuc, Huy
    ]);

    // ❌ BUG: Tính tổng TẤT CẢ lớp (kể cả Huy, DangTuyen)
    const tongDoanhThu = await prisma.lopHoc.aggregate({
      _sum: {
        hocPhi: true,
      },
    });

    return successResponse(res, {
      tongTaiKhoan,
      tongGiaSu,
      tongHocVien,
      tongLopHoc,
      lopDangTuyen,
      lopDangDay,
      dangKyChoDuyet,
      tongDoanhThu: Math.round(Number(tongDoanhThu._sum.hocPhi || 0)),
      // ❌ THIẾU: lopDaKetThuc, lopDaHuy
    });
  } catch (error) {
    next(error);
  }
};
```

**Vấn đề cụ thể:**
1. Không đếm lớp đã kết thúc (`KetThuc`)
2. Không đếm lớp đã hủy (`Huy`)
3. `tongDoanhThu` tính TẤT CẢ lớp → SAI

---

### 2.2. Revenue Stats

**File:** `backend/src/controllers/adminController.js`  
**Function:** `getRevenueStats()` (Line 526-651)

```javascript
// ❌ CODE HIỆN TẠI (Line 561-576)
// Lấy dữ liệu thô - KHÔNG FILTER theo trạng thái
const lopHocList = await prisma.lopHoc.findMany({
  where: dateFilter,  // ❌ Chỉ filter theo ngày, KHÔNG filter trạng thái
  select: {
    hocPhi: true,
    ngayTao: true,
  },
  orderBy: {
    ngayTao: "asc",
  },
});
```

**Vấn đề cụ thể:**
- Tính cả lớp `DangTuyen` (chưa có học viên, chưa thu tiền)
- Tính cả lớp `Huy` (đã hủy, không thu tiền)

---

### 2.3. Duyệt Đăng Ký → Chuyển Trạng Thái

**File:** `backend/src/controllers/lopHocController.js`  
**Function:** `duyetDangKy()` (Line 397-504)

```javascript
// ✅ CODE ĐÚNG - Tự động chuyển DangDay khi duyệt học viên (Line 482-493)
if (trangThai === "DaDuyet") {
  const approvedCountAfter = approvedCountBefore + 1;
  const lopHocUpdated = await prisma.lopHoc.update({
    where: { maLop: id },
    data: { trangThai: "DangDay" },  // ✅ OK - Chuyển sang DangDay
    select: { maLop: true, trangThai: true },
  });
  lopHocMeta = {
    maLop: lopHocUpdated.maLop,
    trangThai: lopHocUpdated.trangThai,
    soHocVien: approvedCountAfter,
    isFull: approvedCountAfter >= 1,
  };
}
```

**Trạng thái:** ✅ OK - Logic này đúng rồi

---

### 2.4. Cập Nhật Lớp Học

**File:** `backend/src/controllers/lopHocController.js`  
**Function:** `capNhatLopHoc()` (Line 237-310)

```javascript
// ❌ CODE HIỆN TẠI - Cho phép update trangThai bất kỳ, KHÔNG validate
const { maMon, tenLop, hocPhi, moTa, hinhThuc, soBuoiDuKien, trangThai, lichHocs } = req.body;

// Update lớp học - KHÔNG kiểm tra trangThai hợp lệ
const lopHoc = await prisma.lopHoc.update({
  where: { maLop: id },
  data: {
    tenLop,
    hocPhi,
    moTa,
    hinhThuc,
    soBuoiDuKien,
    trangThai,  // ❌ Không validate, không sync hợp đồng
    ...(maMon && { maMon }),
  },
  // ...
});
```

**Vấn đề cụ thể:**
1. Không validate `trangThai` có hợp lệ không
2. Không sync trạng thái với `HopDongGiangDay`
3. Không có logic đặc biệt khi chuyển sang `KetThuc`

---

### 2.5. Gán Gia Sư Cho Lớp

**File:** `backend/src/controllers/adminController.js`  
**Function:** `ganGiaSuChoLop()` (Line 354-414)

```javascript
// CODE HIỆN TẠI (Line 376-393)
const hopDong = await prisma.hopDongGiangDay.create({
  data: {
    maGiaSu,
    maLop: id,
    // trangThai mặc định = 'DangDay'
  },
  // ...
});

// Không tự đổi trạng thái lớp; vẫn giữ DangTuyen cho đến khi có học viên
// ✅ OK - Logic này đúng theo business rule
```

**Trạng thái:** ✅ OK - Đúng logic (lớp vẫn DangTuyen cho đến khi có học viên)

---

### 2.6. Frontend - Status Badge Mapping

**File:** `frontend/src/pages/Admin/AdminClasses.jsx`  
**Function:** `getStatusClass()` (Line 686-693)

```javascript
// ✅ CODE ĐÚNG - Đã có mapping cho KetThuc
const getStatusClass = (status) => {
  const map = {
    DangTuyen: 'warning',
    DangDay: 'success',
    KetThuc: 'secondary',  // ✅ Đã có
    Huy: 'danger',         // ✅ Đã có
  };
  return map[status] || 'default';
};
```

**Trạng thái:** ✅ OK

---

### 2.7. Frontend - Filter Options

**File:** `frontend/src/pages/Admin/AdminClasses.jsx`  
**Line:** 251-258

```jsx
// ❌ CODE HIỆN TẠI - Thiếu options KetThuc, Huy
<select 
  value={filter.trangThai} 
  onChange={(e) => setFilter({...filter, trangThai: e.target.value})}
>
  <option value="">Tất cả trạng thái</option>
  <option value="DangTuyen">Đang Tuyển</option>
  <option value="DangDay">Đang Dạy</option>
  {/* ❌ THIẾU: KetThuc, Huy */}
</select>
```

---

### 2.8. Frontend - Tutor Ratings Filter

**File:** `frontend/src/pages/Tutor/TutorRatings.jsx`  
**Line:** 82-86

```javascript
// ✅ CODE ĐÚNG - Đã filter lớp KetThuc
const teachingClasses = contracts
  .map(c => c.lopHoc)
  .filter(cls => cls.trangThai === 'DangDay' || cls.trangThai === 'KetThuc');
```

**Trạng thái:** ✅ OK - Frontend đã dùng đúng

---

## 3. TASK LIST CHI TIẾT

### Phase 1: Backend Core (Ưu tiên cao)

#### Task 1.1: ✅ Tạo Constants File
- [ ] **Status:** NOT STARTED
- [ ] **File:** `backend/src/constants/status.js` (NEW)
- [ ] **Estimated:** 15 mins

```javascript
// backend/src/constants/status.js
/**
 * Constants cho các trạng thái trong hệ thống
 */

// Trạng thái lớp học
export const TRANG_THAI_LOP = {
  DANG_TUYEN: 'DangTuyen',    // Đang tuyển gia sư/học viên
  DANG_DAY: 'DangDay',         // Đang dạy (có hợp đồng và học viên)
  KET_THUC: 'KetThuc',         // Đã kết thúc khóa học
  HUY: 'Huy'                   // Đã hủy (không diễn ra)
};

// Trạng thái đăng ký học viên
export const TRANG_THAI_DANG_KY = {
  CHO_DUYET: 'ChoDuyet',       // Chờ duyệt
  DA_DUYET: 'DaDuyet',         // Đã duyệt, được học
  TU_CHOI: 'TuChoi',           // Bị từ chối
  HUY: 'Huy'                   // Học viên tự hủy
};

// Trạng thái hợp đồng giảng dạy
export const TRANG_THAI_HOP_DONG = {
  DANG_DAY: 'DangDay',         // Đang giảng dạy
  DA_KET_THUC: 'DaKetThuc',    // Đã kết thúc hợp đồng
  TAM_DUNG: 'TamDung'          // Tạm dừng
};

// Trạng thái tài khoản
export const TRANG_THAI_TAI_KHOAN = {
  ACTIVE: 'Active',            // Hoạt động
  LOCKED: 'Locked',            // Bị khóa
  UNVERIFIED: 'Unverified'     // Chưa xác thực
};

// Helper functions
export const isValidTrangThaiLop = (status) => 
  Object.values(TRANG_THAI_LOP).includes(status);

export const isValidTrangThaiDangKy = (status) => 
  Object.values(TRANG_THAI_DANG_KY).includes(status);

export const isValidTrangThaiHopDong = (status) => 
  Object.values(TRANG_THAI_HOP_DONG).includes(status);

// Trạng thái lớp được tính doanh thu (đã thu tiền)
export const TRANG_THAI_TINH_DOANH_THU = [
  TRANG_THAI_LOP.DANG_DAY,
  TRANG_THAI_LOP.KET_THUC
];
```

---

#### Task 1.2: 🔴 Fix Dashboard Statistics
- [ ] **Status:** NOT STARTED
- [ ] **File:** `backend/src/controllers/adminController.js`
- [ ] **Function:** `getDashboard()` (Line 14-51)
- [ ] **Estimated:** 30 mins

**Code cần sửa:**

```javascript
// ✅ CODE MỚI - getDashboard() (thay thế Line 14-51)
import { TRANG_THAI_LOP, TRANG_THAI_DANG_KY, TRANG_THAI_TINH_DOANH_THU } from "../constants/status.js";

export const getDashboard = async (req, res, next) => {
  try {
    const [
      tongTaiKhoan,
      tongGiaSu,
      tongHocVien,
      tongLopHoc,
      lopDangTuyen,
      lopDangDay,
      lopDaKetThuc,    // ← NEW
      lopDaHuy,        // ← NEW
      dangKyChoDuyet,
    ] = await Promise.all([
      prisma.taiKhoan.count(),
      prisma.giaSu.count(),
      prisma.hocVien.count(),
      prisma.lopHoc.count(),
      prisma.lopHoc.count({ where: { trangThai: TRANG_THAI_LOP.DANG_TUYEN } }),
      prisma.lopHoc.count({ where: { trangThai: TRANG_THAI_LOP.DANG_DAY } }),
      prisma.lopHoc.count({ where: { trangThai: TRANG_THAI_LOP.KET_THUC } }),  // NEW
      prisma.lopHoc.count({ where: { trangThai: TRANG_THAI_LOP.HUY } }),       // NEW
      prisma.dangKy.count({ where: { trangThai: TRANG_THAI_DANG_KY.CHO_DUYET } }),
    ]);

    // ✅ FIX: Chỉ tính doanh thu từ lớp đang dạy + đã kết thúc
    const tongDoanhThu = await prisma.lopHoc.aggregate({
      where: {
        trangThai: {
          in: TRANG_THAI_TINH_DOANH_THU
        }
      },
      _sum: {
        hocPhi: true,
      },
    });

    return successResponse(res, {
      tongTaiKhoan,
      tongGiaSu,
      tongHocVien,
      tongLopHoc,
      lopDangTuyen,
      lopDangDay,
      lopDaKetThuc,    // NEW
      lopDaHuy,        // NEW
      dangKyChoDuyet,
      tongDoanhThu: Math.round(Number(tongDoanhThu._sum.hocPhi || 0)),
    });
  } catch (error) {
    next(error);
  }
};
```

---

#### Task 1.3: 🔴 Fix Revenue Stats
- [ ] **Status:** NOT STARTED
- [ ] **File:** `backend/src/controllers/adminController.js`
- [ ] **Function:** `getRevenueStats()` (Line 561-576)
- [ ] **Estimated:** 20 mins

**Code cần sửa:**

```javascript
// ✅ FIX Line 561-576 - Thêm filter trangThai
const lopHocList = await prisma.lopHoc.findMany({
  where: {
    ...dateFilter,
    trangThai: {
      in: TRANG_THAI_TINH_DOANH_THU  // ← ADD THIS
    }
  },
  select: {
    hocPhi: true,
    ngayTao: true,
  },
  orderBy: {
    ngayTao: "asc",
  },
});
```

**Tương tự cho period === "year" (Line 601-619):**

```javascript
// ✅ FIX Line 601-619
const allLopHoc = await prisma.lopHoc.findMany({
  where: {
    ngayTao: {
      gte: new Date(currentYear - 4, 0, 1),
      lte: new Date(currentYear, 11, 31, 23, 59, 59),
    },
    trangThai: {
      in: TRANG_THAI_TINH_DOANH_THU  // ← ADD THIS
    }
  },
  select: {
    hocPhi: true,
    ngayTao: true,
  },
});
```

---

#### Task 1.4: 🟡 Tạo API Kết Thúc Lớp
- [ ] **Status:** NOT STARTED
- [ ] **File:** `backend/src/controllers/lopHocController.js`
- [ ] **New Function:** `ketThucLopHoc()`
- [ ] **Estimated:** 45 mins

**Code mới cần thêm:**

```javascript
// Thêm vào cuối file lopHocController.js

import { TRANG_THAI_LOP, TRANG_THAI_HOP_DONG } from "../constants/status.js";

/**
 * Kết thúc lớp học
 * PUT /api/lop-hoc/:id/ket-thuc
 * Body: { lyDoKetThuc?: string, ghiChu?: string }
 */
export const ketThucLopHoc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lyDoKetThuc, ghiChu } = req.body;
    const { role } = req.user;

    // 1. Kiểm tra quyền
    if (!["GiaSu", "Admin"].includes(role)) {
      return errorResponse(res, "Bạn không có quyền thực hiện thao tác này", 403);
    }

    // 2. Tìm lớp học
    const lopHoc = await prisma.lopHoc.findUnique({
      where: { maLop: id },
      include: {
        hopDongs: {
          where: { trangThai: TRANG_THAI_HOP_DONG.DANG_DAY }
        },
        dangKys: {
          where: { trangThai: "DaDuyet" }
        }
      },
    });

    if (!lopHoc) {
      return errorResponse(res, "Không tìm thấy lớp học", 404);
    }

    // 3. Kiểm tra trạng thái hiện tại
    if (lopHoc.trangThai === TRANG_THAI_LOP.KET_THUC) {
      return errorResponse(res, "Lớp học đã kết thúc trước đó", 400);
    }

    if (lopHoc.trangThai === TRANG_THAI_LOP.HUY) {
      return errorResponse(res, "Không thể kết thúc lớp đã bị hủy", 400);
    }

    if (lopHoc.trangThai === TRANG_THAI_LOP.DANG_TUYEN) {
      return errorResponse(res, "Lớp chưa bắt đầu, hãy hủy thay vì kết thúc", 400);
    }

    // 4. Nếu là Gia sư, kiểm tra có phải gia sư của lớp không
    if (role === "GiaSu") {
      const giaSu = await prisma.giaSu.findUnique({
        where: { taiKhoanId: req.user.id },
      });

      const isOwner = lopHoc.hopDongs.some((hd) => hd.maGiaSu === giaSu?.maGiaSu);
      if (!isOwner) {
        return errorResponse(res, "Bạn không phải gia sư của lớp này", 403);
      }
    }

    // 5. Thực hiện transaction: Update lớp + hợp đồng
    const result = await prisma.$transaction(async (tx) => {
      // Update trạng thái lớp học
      const updatedLop = await tx.lopHoc.update({
        where: { maLop: id },
        data: {
          trangThai: TRANG_THAI_LOP.KET_THUC,
          ngayKetThuc: new Date(),  // Ghi nhận ngày kết thúc thực tế
        },
        include: {
          monHoc: true,
        },
      });

      // Update tất cả hợp đồng đang active của lớp này
      await tx.hopDongGiangDay.updateMany({
        where: {
          maLop: id,
          trangThai: TRANG_THAI_HOP_DONG.DANG_DAY,
        },
        data: {
          trangThai: TRANG_THAI_HOP_DONG.DA_KET_THUC,
        },
      });

      return updatedLop;
    });

    return successResponse(res, {
      lopHoc: result,
      soHocVien: lopHoc.dangKys.length,
      lyDoKetThuc: lyDoKetThuc || "Hoàn thành khóa học",
    }, "Đã kết thúc lớp học thành công");
  } catch (error) {
    next(error);
  }
};

/**
 * Hủy lớp học (Chưa bắt đầu)
 * PUT /api/lop-hoc/:id/huy
 * Body: { lyDoHuy: string }
 */
export const huyLopHoc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lyDoHuy } = req.body;
    const { role } = req.user;

    // Validate
    if (!lyDoHuy) {
      return errorResponse(res, "Vui lòng cung cấp lý do hủy lớp", 400);
    }

    // Kiểm tra quyền
    if (!["GiaSu", "Admin"].includes(role)) {
      return errorResponse(res, "Bạn không có quyền thực hiện thao tác này", 403);
    }

    const lopHoc = await prisma.lopHoc.findUnique({
      where: { maLop: id },
      include: {
        hopDongs: true,
        dangKys: {
          where: { trangThai: "DaDuyet" }
        }
      },
    });

    if (!lopHoc) {
      return errorResponse(res, "Không tìm thấy lớp học", 404);
    }

    // Chỉ cho phép hủy lớp đang tuyển
    if (lopHoc.trangThai !== TRANG_THAI_LOP.DANG_TUYEN) {
      return errorResponse(res, "Chỉ có thể hủy lớp đang trong giai đoạn tuyển sinh", 400);
    }

    // Nếu là Gia sư, kiểm tra có phải gia sư của lớp không
    if (role === "GiaSu") {
      const giaSu = await prisma.giaSu.findUnique({
        where: { taiKhoanId: req.user.id },
      });

      const isOwner = lopHoc.hopDongs.some((hd) => hd.maGiaSu === giaSu?.maGiaSu);
      if (!isOwner) {
        return errorResponse(res, "Bạn không phải gia sư của lớp này", 403);
      }
    }

    // Update trạng thái
    const result = await prisma.lopHoc.update({
      where: { maLop: id },
      data: {
        trangThai: TRANG_THAI_LOP.HUY,
      },
    });

    return successResponse(res, result, `Đã hủy lớp học. Lý do: ${lyDoHuy}`);
  } catch (error) {
    next(error);
  }
};
```

---

#### Task 1.5: 🟡 Thêm Routes Mới
- [ ] **Status:** NOT STARTED
- [ ] **File:** `backend/src/routes/lopHoc.js`
- [ ] **Estimated:** 10 mins

**Code cần thêm:**

```javascript
// Thêm vào cuối phần import
import {
  // ... existing imports
  ketThucLopHoc,
  huyLopHoc,
} from "../controllers/lopHocController.js";

// Thêm routes mới (trước export default)

// Kết thúc lớp học
router.put(
  "/:id/ket-thuc",
  auth,
  authorize("GiaSu", "Admin"),
  ketThucLopHoc
);

// Hủy lớp học
router.put(
  "/:id/huy",
  auth,
  authorize("GiaSu", "Admin"),
  [body("lyDoHuy").notEmpty().withMessage("Vui lòng cung cấp lý do hủy")],
  validateRequest,
  huyLopHoc
);
```

---

### Phase 2: Frontend Updates

#### Task 2.1: 🟡 Update Dashboard Stats Display
- [ ] **Status:** NOT STARTED
- [ ] **File:** `frontend/src/pages/Dashboard/AdminDashboard.jsx`
- [ ] **Estimated:** 20 mins

**Code cần thêm (sau Line 86-89):**

```jsx
{/* Thêm sau stat-card "Đăng Ký Chờ Duyệt" */}
<div className="stat-card">
  <h3>✅ Lớp Đã Kết Thúc</h3>
  <p className="stat-value">{stats?.lopDaKetThuc || 0}</p>
</div>
<div className="stat-card">
  <h3>❌ Lớp Đã Hủy</h3>
  <p className="stat-value">{stats?.lopDaHuy || 0}</p>
</div>
```

---

#### Task 2.2: 🟡 Update Filter Options
- [ ] **Status:** NOT STARTED
- [ ] **File:** `frontend/src/pages/Admin/AdminClasses.jsx`
- [ ] **Line:** 251-258
- [ ] **Estimated:** 10 mins

**Code cần sửa:**

```jsx
<select 
  value={filter.trangThai} 
  onChange={(e) => setFilter({...filter, trangThai: e.target.value})}
>
  <option value="">Tất cả trạng thái</option>
  <option value="DangTuyen">Đang Tuyển</option>
  <option value="DangDay">Đang Dạy</option>
  <option value="KetThuc">Đã Kết Thúc</option>  {/* ← ADD */}
  <option value="Huy">Đã Hủy</option>            {/* ← ADD */}
</select>
```

---

#### Task 2.3: 🟡 Add Action Buttons
- [ ] **Status:** NOT STARTED
- [ ] **File:** `frontend/src/pages/Admin/AdminClasses.jsx`
- [ ] **Estimated:** 30 mins

**Thêm handler functions:**

```jsx
// Thêm vào component (khoảng line 160)
const handleFinishClass = async (cls) => {
  if (!window.confirm(`Xác nhận kết thúc lớp "${cls.tenLop}"?\n\nHành động này không thể hoàn tác.`)) {
    return;
  }
  
  try {
    await adminAPI.finishClass(cls.maLop);
    toast.success('Đã kết thúc lớp học thành công');
    loadClasses();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Lỗi kết thúc lớp');
  }
};

const handleCancelClass = async (cls) => {
  const lyDo = window.prompt(`Nhập lý do hủy lớp "${cls.tenLop}":`);
  if (!lyDo) return;
  
  try {
    await adminAPI.cancelClass(cls.maLop, lyDo);
    toast.success('Đã hủy lớp học');
    loadClasses();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Lỗi hủy lớp');
  }
};
```

**Thêm buttons vào table (khoảng line 340-360):**

```jsx
{/* Thêm sau các button hiện có */}
{cls.trangThai === 'DangDay' && (
  <button 
    className="btn btn-warning btn-sm"
    onClick={() => handleFinishClass(cls)}
    title="Kết thúc lớp học"
  >
    🏁 Kết Thúc
  </button>
)}
{cls.trangThai === 'DangTuyen' && (
  <button 
    className="btn btn-danger btn-sm"
    onClick={() => handleCancelClass(cls)}
    title="Hủy lớp học"
  >
    ❌ Hủy Lớp
  </button>
)}
```

---

#### Task 2.4: 🟢 Update API Services
- [ ] **Status:** NOT STARTED
- [ ] **File:** `frontend/src/api/services.js`
- [ ] **Estimated:** 10 mins

**Thêm vào adminAPI:**

```javascript
// Trong object adminAPI
finishClass: (maLop) => apiClient.put(`/lop-hoc/${maLop}/ket-thuc`),
cancelClass: (maLop, lyDoHuy) => apiClient.put(`/lop-hoc/${maLop}/huy`, { lyDoHuy }),
```

---

### Phase 3: Advanced Features (Optional)

#### Task 3.1: 🟢 Auto-Close Scheduler (Cron Job)
- [ ] **Status:** NOT STARTED
- [ ] **Priority:** LOW
- [ ] **Estimated:** 1 hour

**Note:** Implement sau khi Phase 1-2 hoàn thành

---

## 4. IMPLEMENTATION GUIDE

### 4.1. Thứ Tự Triển Khai

```
┌─────────────────────────────────────────────────────────────┐
│                     PHASE 1: BACKEND                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Step 1: Task 1.1 - Tạo constants/status.js                │
│     ↓                                                       │
│  Step 2: Task 1.2 - Fix getDashboard()                     │
│     ↓                                                       │
│  Step 3: Task 1.3 - Fix getRevenueStats()                  │
│     ↓                                                       │
│  Step 4: Task 1.4 - Tạo ketThucLopHoc(), huyLopHoc()       │
│     ↓                                                       │
│  Step 5: Task 1.5 - Thêm routes                            │
│     ↓                                                       │
│  Step 6: TEST BACKEND (Postman/Insomnia)                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    PHASE 2: FRONTEND                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Step 7: Task 2.4 - Update API services                    │
│     ↓                                                       │
│  Step 8: Task 2.1 - Update Dashboard display               │
│     ↓                                                       │
│  Step 9: Task 2.2 - Update Filter options                  │
│     ↓                                                       │
│  Step 10: Task 2.3 - Add action buttons                    │
│     ↓                                                       │
│  Step 11: FULL TEST (E2E)                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2. Commands Checklist

```bash
# Backend
cd backend

# 1. Install dependencies (nếu cần)
npm install

# 2. Restart server sau mỗi thay đổi
npm run dev

# 3. Test API với curl
curl http://localhost:5000/api/admin/dashboard -H "Authorization: Bearer <token>"
```

```bash
# Frontend
cd frontend

# 1. Start dev server
npm run dev

# 2. Build production
npm run build
```

---

## 5. TESTING CHECKLIST

### 5.1. Unit Tests

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 1 | Dashboard trả về `lopDaKetThuc` | Number >= 0 | ⬜ |
| 2 | Dashboard trả về `lopDaHuy` | Number >= 0 | ⬜ |
| 3 | `tongDoanhThu` chỉ tính DangDay + KetThuc | Correct sum | ⬜ |
| 4 | Revenue stats filter theo trạng thái | Correct data | ⬜ |
| 5 | API kết thúc lớp DangDay → KetThuc | Success | ⬜ |
| 6 | API kết thúc lớp DangTuyen → Error | 400 error | ⬜ |
| 7 | API hủy lớp DangTuyen → Huy | Success | ⬜ |
| 8 | API hủy lớp DangDay → Error | 400 error | ⬜ |
| 9 | Hợp đồng sync khi kết thúc lớp | DaKetThuc | ⬜ |

### 5.2. Integration Tests

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 1 | Kết thúc lớp từ Admin | Login Admin → Chọn lớp DangDay → Click "Kết Thúc" | Lớp chuyển KetThuc | ⬜ |
| 2 | Kết thúc lớp từ Gia sư | Login GiaSu → Lớp của mình → Kết thúc | Success | ⬜ |
| 3 | Hủy lớp chưa bắt đầu | Login Admin → Lớp DangTuyen → Hủy | Lớp chuyển Huy | ⬜ |
| 4 | Dashboard sau khi kết thúc | Kết thúc 1 lớp → Check dashboard | lopDaKetThuc +1 | ⬜ |
| 5 | Doanh thu sau hủy lớp | Hủy 1 lớp → Check tongDoanhThu | Không đổi | ⬜ |

### 5.3. Edge Cases

| # | Case | Expected |
|---|------|----------|
| 1 | Kết thúc lớp đã kết thúc | Error: "Lớp đã kết thúc trước đó" |
| 2 | Gia sư kết thúc lớp người khác | Error 403 |
| 3 | Hủy lớp đang dạy | Error: "Chỉ có thể hủy lớp đang tuyển" |
| 4 | Hủy lớp không có lý do | Error 400 |

---

## 6. ROLLBACK PLAN

### 6.1. Backup Commands

```bash
# Trước khi deploy
# 1. Backup database
pg_dump -U postgres giasudb > backup_$(date +%Y%m%d).sql

# 2. Backup code
git stash
# hoặc
git checkout -b backup-before-refactor
```

### 6.2. Rollback Steps

```bash
# Nếu cần rollback
# 1. Revert code
git revert HEAD~<số commits>
# hoặc
git checkout <commit-hash>

# 2. Restore database (nếu cần)
psql -U postgres giasudb < backup_YYYYMMDD.sql

# 3. Restart services
pm2 restart all
```

### 6.3. Breaking Changes

| Change | Impact | Migration |
|--------|--------|-----------|
| Dashboard response mới | Frontend cần update | Add null checks |
| API mới `/ket-thuc`, `/huy` | Không breaking | N/A |
| Doanh thu logic thay đổi | Số liệu sẽ khác | Thông báo user |

---

## 📝 NOTES

### Conventions
- Sử dụng constants thay vì hardcode strings
- Luôn dùng transaction khi update nhiều bảng
- Validate input trước khi xử lý
- Log đầy đủ cho debugging

### Questions to Clarify
1. ❓ Có cần gửi email notification khi lớp kết thúc?
2. ❓ Có cần tạo báo cáo/certificate khi hoàn thành?
3. ❓ Auto-close lớp sau bao lâu không hoạt động?

---

## ✅ PROGRESS TRACKER

| Phase | Task | Assignee | Status | Date |
|-------|------|----------|--------|------|
| 1 | 1.1 Constants | Dev | ✅ Completed | 26/12/2025 |
| 1 | 1.2 Dashboard Fix | Dev | ✅ Completed | 26/12/2025 |
| 1 | 1.3 Revenue Fix | Dev | ✅ Completed | 26/12/2025 |
| 1 | 1.4 API Kết Thúc | Dev | ✅ Completed | 26/12/2025 |
| 1 | 1.5 Routes | Dev | ✅ Completed | 26/12/2025 |
| 2 | 2.1 Dashboard UI | Dev | ✅ Completed | 26/12/2025 |
| 2 | 2.2 Filter UI | Dev | ✅ Completed | 26/12/2025 |
| 2 | 2.3 Action Buttons | Dev | ✅ Completed | 26/12/2025 |
| 2 | 2.4 API Services | Dev | ✅ Completed | 26/12/2025 |
| 3 | 3.1 Cron Job | - | ⬜ Not Started | - |

---

**Last Updated:** 26/12/2025  
**Next Review:** After Phase 1 completion

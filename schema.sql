-- Lưu ý: Trong Postgres, bạn cần tạo database trước bằng tay hoặc lệnh riêng, 
-- sau đó kết nối vào database đó rồi mới chạy đoạn script dưới đây.

-- Cài đặt extension để hỗ trợ sinh UUID tự động (Chạy 1 lần)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================================
-- 1. BẢNG TÀI KHOẢN (lowercase convention)
-- PostgreSQL tự động convert identifiers sang lowercase khi không có quotes
-- ========================================================
CREATE TABLE taikhoan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) NOT NULL UNIQUE,
    matkhau VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'GiaSu', 'HocVien')),
    trangthai VARCHAR(20) DEFAULT 'Active' CHECK (trangthai IN ('Active', 'Locked', 'Unverified')),
    ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 2. BẢNG MÔN HỌC
-- ========================================================
CREATE TABLE monhoc (
    mamon UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenmon VARCHAR(100) NOT NULL UNIQUE,
    mota TEXT
);

-- ========================================================
-- 3. BẢNG GIA SƯ
-- ========================================================
CREATE TABLE giasu (
    magiasu UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    taikhoanid UUID NOT NULL UNIQUE,
    hoten VARCHAR(100) NOT NULL,
    sodienthoai VARCHAR(15),
    hinhanh VARCHAR(255),
    chuyenmon VARCHAR(255),
    kinhnghiem VARCHAR(50),
    trinhdo VARCHAR(100),
    gioithieu TEXT,
    ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diachi VARCHAR(255),
    namsinh INT,
    
    FOREIGN KEY (taikhoanid) REFERENCES taikhoan(id) ON DELETE CASCADE
);

-- ========================================================
-- 4. BẢNG HỌC VIÊN
-- ========================================================
CREATE TABLE hocvien (
    mahocvien UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    taikhoanid UUID NOT NULL UNIQUE,
    hoten VARCHAR(100) NOT NULL,
    namsinh INT,
    sodienthoai VARCHAR(15),
    diachi VARCHAR(255),
    hinhanh VARCHAR(255),
    ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (taikhoanid) REFERENCES taikhoan(id) ON DELETE CASCADE
);

-- ========================================================
-- 5. BẢNG LỚP HỌC
-- ========================================================
CREATE TABLE lophoc (
    malop UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mamon UUID NOT NULL,
    tenlop VARCHAR(150) NOT NULL,
    hocphi DECIMAL(12, 2) NOT NULL,
    mota TEXT,
    hinhthuc VARCHAR(20) DEFAULT 'Offline' CHECK (hinhthuc IN ('Offline', 'Online')),
    sobuoidukien INT,
    trangthai VARCHAR(20) DEFAULT 'DangTuyen' CHECK (trangthai IN ('DangTuyen', 'DangDay', 'KetThuc', 'Huy')),
    ngaybatdau DATE,
    ngayketthuc DATE,
    ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (mamon) REFERENCES monhoc(mamon) ON DELETE CASCADE
);

-- ========================================================
-- 6. BẢNG ĐĂNG KÝ
-- ========================================================
CREATE TABLE dangky (
    madangky UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mahocvien UUID NOT NULL,
    malop UUID NOT NULL,
    yeucauthem TEXT,
    ngaydangky TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trangthai VARCHAR(20) DEFAULT 'ChoDuyet' CHECK (trangthai IN ('ChoDuyet', 'DaDuyet', 'TuChoi', 'Huy')),
    nguoiduyet UUID,
    ngayduyet TIMESTAMP,
    lydotuchoi TEXT,
    
    FOREIGN KEY (mahocvien) REFERENCES hocvien(mahocvien) ON DELETE CASCADE,
    FOREIGN KEY (malop) REFERENCES lophoc(malop) ON DELETE CASCADE,
    FOREIGN KEY (nguoiduyet) REFERENCES taikhoan(id),
    UNIQUE (mahocvien, malop)
);

-- ========================================================
-- 7. BẢNG HỢP ĐỒNG GIẢNG DẠY
-- ========================================================
CREATE TABLE hopdonggiangday (
    mahopdong UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    magiasu UUID NOT NULL,
    malop UUID NOT NULL,
    ngaynhanlop TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trangthai VARCHAR(20) DEFAULT 'DangDay' CHECK (trangthai IN ('DangDay', 'DaKetThuc', 'TamDung')),
    
    FOREIGN KEY (magiasu) REFERENCES giasu(magiasu) ON DELETE CASCADE,
    FOREIGN KEY (malop) REFERENCES lophoc(malop) ON DELETE CASCADE,
    UNIQUE (magiasu, malop)
);

-- ========================================================
-- 8. BẢNG LỊCH HỌC
-- ========================================================
CREATE TABLE lichhoc (
    malich UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    malop UUID NOT NULL,
    thu INT CHECK (thu >= 2 AND thu <= 8),
    giobatdau TIME NOT NULL,
    gioketthuc TIME NOT NULL,
    phonghoc VARCHAR(50),
    linkhoconline VARCHAR(255),
    
    FOREIGN KEY (malop) REFERENCES lophoc(malop) ON DELETE CASCADE
);

-- ========================================================
-- 9. BẢNG ĐÁNH GIÁ
-- ========================================================
CREATE TABLE danhgia (
    madanhgia UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mahocvien UUID NOT NULL,
    magiasu UUID NOT NULL,
    malop UUID, 
    diem FLOAT CHECK (diem >= 0 AND diem <= 5),
    nhanxet TEXT,
    ngaydanhgia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (mahocvien) REFERENCES hocvien(mahocvien),
    FOREIGN KEY (magiasu) REFERENCES giasu(magiasu),
    FOREIGN KEY (malop) REFERENCES lophoc(malop)
);
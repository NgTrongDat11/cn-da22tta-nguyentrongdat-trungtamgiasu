-- ========================================================
-- SEED DATA FOR TRUNG TÂM GIA SƯ
-- Sử dụng gen_random_uuid() để tự động tạo UUID
-- ========================================================

-- Xóa dữ liệu cũ (nếu có)
TRUNCATE TABLE danhgia CASCADE;
TRUNCATE TABLE lichhoc CASCADE;
TRUNCATE TABLE hopdonggiangday CASCADE;
TRUNCATE TABLE dangky CASCADE;
TRUNCATE TABLE lophoc CASCADE;
TRUNCATE TABLE monhoc CASCADE;
TRUNCATE TABLE giasu CASCADE;
TRUNCATE TABLE hocvien CASCADE;
TRUNCATE TABLE taikhoan CASCADE;

-- ========================================================
-- 1. TÀI KHOẢN (TaiKhoan)
-- Password: 123456 (đã hash bằng bcrypt - cost 10)
-- ========================================================

-- Admin
INSERT INTO taikhoan (email, matkhau, role, trangthai) VALUES 
('admin@trungtamgiasu.vn', '$2b$10$rZ7qhQX5OYJ3vK8mW2nZYeLxL7jX6L8VqN9XnZ5L8VqN9XnZ5L8Vq', 'Admin', 'Active');

-- Gia sư
INSERT INTO taikhoan (email, matkhau, role, trangthai) VALUES 
('nguyenvana@gmail.com', '$2b$10$rZ7qhQX5OYJ3vK8mW2nZYeLxL7jX6L8VqN9XnZ5L8VqN9XnZ5L8Vq', 'GiaSu', 'Active'),
('tranthib@gmail.com', '$2b$10$rZ7qhQX5OYJ3vK8mW2nZYeLxL7jX6L8VqN9XnZ5L8VqN9XnZ5L8Vq', 'GiaSu', 'Active'),
('levanc@gmail.com', '$2b$10$rZ7qhQX5OYJ3vK8mW2nZYeLxL7jX6L8VqN9XnZ5L8VqN9XnZ5L8Vq', 'GiaSu', 'Active');

-- Học viên
INSERT INTO taikhoan (email, matkhau, role, trangthai) VALUES 
('hocvien1@gmail.com', '$2b$10$rZ7qhQX5OYJ3vK8mW2nZYeLxL7jX6L8VqN9XnZ5L8VqN9XnZ5L8Vq', 'HocVien', 'Active'),
('hocvien2@gmail.com', '$2b$10$rZ7qhQX5OYJ3vK8mW2nZYeLxL7jX6L8VqN9XnZ5L8VqN9XnZ5L8Vq', 'HocVien', 'Active'),
('hocvien3@gmail.com', '$2b$10$rZ7qhQX5OYJ3vK8mW2nZYeLxL7jX6L8VqN9XnZ5L8VqN9XnZ5L8Vq', 'HocVien', 'Active'),
('hocvien4@gmail.com', '$2b$10$rZ7qhQX5OYJ3vK8mW2nZYeLxL7jX6L8VqN9XnZ5L8VqN9XnZ5L8Vq', 'HocVien', 'Active'),
('hocvien5@gmail.com', '$2b$10$rZ7qhQX5OYJ3vK8mW2nZYeLxL7jX6L8VqN9XnZ5L8VqN9XnZ5L8Vq', 'HocVien', 'Active');

-- ========================================================
-- 2. GIA SƯ (GiaSu)
-- ========================================================

INSERT INTO giasu (taikhoanid, hoten, sodienthoai, chuyenmon, kinhnghiem, trinhdo, gioithieu, diachi, namsinh) 
SELECT 
    id,
    'Nguyễn Văn A',
    '0912345678',
    'Toán học, Vật lý',
    '5 năm',
    'Thạc sĩ Toán học - ĐH Khoa học Tự nhiên',
    'Chuyên dạy Toán THCS, THPT. Có kinh nghiệm ôn thi THPT Quốc gia. Phương pháp giảng dạy dễ hiểu, tận tâm với học sinh.',
    'Hà Nội',
    1990
FROM taikhoan WHERE email = 'nguyenvana@gmail.com';

INSERT INTO giasu (taikhoanid, hoten, sodienthoai, chuyenmon, kinhnghiem, trinhdo, gioithieu, diachi, namsinh) 
SELECT 
    id,
    'Trần Thị B',
    '0923456789',
    'Tiếng Anh, IELTS',
    '7 năm',
    'Cử nhân Ngôn ngữ Anh - ĐH Ngoại ngữ, IELTS 8.5',
    'Chuyên luyện thi IELTS, TOEIC. Đã giúp nhiều học sinh đạt IELTS 7.0+. Phương pháp học theo hướng giao tiếp thực tế.',
    'Hồ Chí Minh',
    1988
FROM taikhoan WHERE email = 'tranthib@gmail.com';

INSERT INTO giasu (taikhoanid, hoten, sodienthoai, chuyenmon, kinhnghiem, trinhdo, gioithieu, diachi, namsinh) 
SELECT 
    id,
    'Lê Văn C',
    '0934567890',
    'Lập trình, Tin học',
    '4 năm',
    'Kỹ sư Khoa học Máy tính - ĐH Bách Khoa',
    'Dạy lập trình Python, Java, C++. Hướng dẫn làm dự án thực tế. Phù hợp cho học sinh THPT và sinh viên năm nhất.',
    'Đà Nẵng',
    1992
FROM taikhoan WHERE email = 'levanc@gmail.com';

-- ========================================================
-- 3. HỌC VIÊN (HocVien)
-- ========================================================

INSERT INTO hocvien (taikhoanid, hoten, namsinh, sodienthoai, diachi) 
SELECT 
    id,
    'Phạm Minh Đức',
    2010,
    '0945678901',
    '123 Nguyễn Huệ, Quận 1, TP.HCM'
FROM taikhoan WHERE email = 'hocvien1@gmail.com';

INSERT INTO hocvien (taikhoanid, hoten, namsinh, sodienthoai, diachi) 
SELECT 
    id,
    'Võ Thị Lan',
    2009,
    '0956789012',
    '456 Lê Lợi, Quận 3, TP.HCM'
FROM taikhoan WHERE email = 'hocvien2@gmail.com';

INSERT INTO hocvien (taikhoanid, hoten, namsinh, sodienthoai, diachi) 
SELECT 
    id,
    'Hoàng Văn Nam',
    2008,
    '0967890123',
    '789 Trần Hưng Đạo, Quận 5, TP.HCM'
FROM taikhoan WHERE email = 'hocvien3@gmail.com';

INSERT INTO hocvien (taikhoanid, hoten, namsinh, sodienthoai, diachi) 
SELECT 
    id,
    'Lý Thị Mai',
    2011,
    '0978901234',
    '321 Võ Văn Tần, Quận 3, TP.HCM'
FROM taikhoan WHERE email = 'hocvien4@gmail.com';

INSERT INTO hocvien (taikhoanid, hoten, namsinh, sodienthoai, diachi) 
SELECT 
    id,
    'Đặng Minh Tuấn',
    2010,
    '0989012345',
    '654 Pasteur, Quận 1, TP.HCM'
FROM taikhoan WHERE email = 'hocvien5@gmail.com';

-- ========================================================
-- 4. MÔN HỌC (MonHoc)
-- ========================================================

INSERT INTO monhoc (tenmon, mota) VALUES 
('Toán học', 'Toán THCS, THPT - Đại số, Hình học, Giải tích'),
('Vật lý', 'Vật lý THCS, THPT - Cơ học, Điện học, Quang học'),
('Tiếng Anh', 'Tiếng Anh giao tiếp, IELTS, TOEIC, Luyện thi THPT'),
('Lập trình', 'Python, Java, C++, Web Development'),
('Hóa học', 'Hóa học THCS, THPT - Hóa vô cơ, Hữu cơ');

-- ========================================================
-- 5. LỚP HỌC (LopHoc)
-- ========================================================

-- Lớp Toán 10
INSERT INTO lophoc (mamon, tenlop, hocphi, mota, hinhthuc, sobuoidukien, trangthai, ngaybatdau, ngayketthuc)
SELECT 
    mamon,
    'Toán 10 - Nền tảng',
    2000000,
    'Lớp Toán lớp 10, tập trung vào các kiến thức nền tảng. Học trực tiếp tại nhà gia sư.',
    'Offline',
    20,
    'DangDay',
    '2025-01-10',
    '2025-06-30'
FROM monhoc WHERE tenmon = 'Toán học';

-- Lớp Toán 12
INSERT INTO lophoc (mamon, tenlop, hocphi, mota, hinhthuc, sobuoidukien, trangthai, ngaybatdau, ngayketthuc)
SELECT 
    mamon,
    'Toán 12 - Luyện thi THPT QG',
    3000000,
    'Ôn thi THPT Quốc gia, tập trung vào các dạng bài thi. Học online qua Zoom.',
    'Online',
    30,
    'DangDay',
    '2025-01-15',
    '2025-06-15'
FROM monhoc WHERE tenmon = 'Toán học';

-- Lớp IELTS
INSERT INTO lophoc (mamon, tenlop, hocphi, mota, hinhthuc, sobuoidukien, trangthai, ngaybatdau, ngayketthuc)
SELECT 
    mamon,
    'IELTS 6.5+ Intensive',
    5000000,
    'Luyện thi IELTS mục tiêu 6.5-7.5. Lớp nhỏ 4-6 học viên. Học online linh hoạt.',
    'Online',
    40,
    'DangTuyen',
    '2025-02-01',
    '2025-05-31'
FROM monhoc WHERE tenmon = 'Tiếng Anh';

-- Lớp Lập trình Python
INSERT INTO lophoc (mamon, tenlop, hocphi, mota, hinhthuc, sobuoidukien, trangthai, ngaybatdau, ngayketthuc)
SELECT 
    mamon,
    'Python cho người mới bắt đầu',
    4000000,
    'Học Python từ cơ bản đến nâng cao. Có project thực tế. Học trực tiếp tại trung tâm.',
    'Offline',
    25,
    'DangTuyen',
    '2025-02-10',
    '2025-06-10'
FROM monhoc WHERE tenmon = 'Lập trình';

-- Lớp Vật lý 11
INSERT INTO lophoc (mamon, tenlop, hocphi, mota, hinhthuc, sobuoidukien, trangthai, ngaybatdau, ngayketthuc)
SELECT 
    mamon,
    'Vật lý 11 - Chuyên sâu',
    2500000,
    'Vật lý lớp 11, tập trung vào Điện học và Dao động sóng. Học online qua Google Meet.',
    'Online',
    24,
    'DangDay',
    '2025-01-20',
    '2025-06-20'
FROM monhoc WHERE tenmon = 'Vật lý';

-- ========================================================
-- 6. HỢP ĐỒNG GIẢNG DẠY (HopDongGiangDay)
-- Gán gia sư cho các lớp đang dạy
-- ========================================================

-- Nguyễn Văn A dạy Toán 10
INSERT INTO hopdonggiangday (magiasu, malop, trangthai)
SELECT 
    gs.magiasu,
    lh.malop,
    'DangDay'
FROM giasu gs
CROSS JOIN LopHoc lh
WHERE gs.hoten = 'Nguyễn Văn A' 
AND lh.tenlop = 'Toán 10 - Nền tảng';

-- Nguyễn Văn A dạy Toán 12
INSERT INTO hopdonggiangday (magiasu, malop, trangthai)
SELECT 
    gs.magiasu,
    lh.malop,
    'DangDay'
FROM giasu gs
CROSS JOIN LopHoc lh
WHERE gs.hoten = 'Nguyễn Văn A' 
AND lh.tenlop = 'Toán 12 - Luyện thi THPT QG';

-- Trần Thị B dạy Vật lý 11
INSERT INTO hopdonggiangday (magiasu, malop, trangthai)
SELECT 
    gs.magiasu,
    lh.malop,
    'DangDay'
FROM giasu gs
CROSS JOIN LopHoc lh
WHERE gs.hoten = 'Trần Thị B' 
AND lh.tenlop = 'Vật lý 11 - Chuyên sâu';

-- ========================================================
-- 7. LỊCH HỌC (LichHoc)
-- ========================================================

-- Lịch Toán 10 (Offline)
INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, phonghoc)
SELECT malop, 3, '18:00', '20:00', 'Phòng 101 - 123 Nguyễn Huệ, Q1'
FROM lophoc WHERE tenlop = 'Toán 10 - Nền tảng';

INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, phonghoc)
SELECT malop, 5, '18:00', '20:00', 'Phòng 101 - 123 Nguyễn Huệ, Q1'
FROM lophoc WHERE tenlop = 'Toán 10 - Nền tảng';

INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, phonghoc)
SELECT malop, 7, '09:00', '11:00', 'Phòng 101 - 123 Nguyễn Huệ, Q1'
FROM lophoc WHERE tenlop = 'Toán 10 - Nền tảng';

-- Lịch Toán 12 (Online)
INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, linkhoconline)
SELECT malop, 2, '19:00', '21:00', 'https://zoom.us/j/123456789'
FROM lophoc WHERE tenlop = 'Toán 12 - Luyện thi THPT QG';

INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, linkhoconline)
SELECT malop, 4, '19:00', '21:00', 'https://zoom.us/j/123456789'
FROM lophoc WHERE tenlop = 'Toán 12 - Luyện thi THPT QG';

INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, linkhoconline)
SELECT malop, 6, '19:00', '21:00', 'https://zoom.us/j/123456789'
FROM lophoc WHERE tenlop = 'Toán 12 - Luyện thi THPT QG';

-- Lịch IELTS (Online)
INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, linkhoconline)
SELECT malop, 2, '18:30', '20:30', 'https://meet.google.com/abc-defg-hij'
FROM lophoc WHERE tenlop = 'IELTS 6.5+ Intensive';

INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, linkhoconline)
SELECT malop, 4, '18:30', '20:30', 'https://meet.google.com/abc-defg-hij'
FROM lophoc WHERE tenlop = 'IELTS 6.5+ Intensive';

INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, linkhoconline)
SELECT malop, 6, '18:30', '20:30', 'https://meet.google.com/abc-defg-hij'
FROM lophoc WHERE tenlop = 'IELTS 6.5+ Intensive';

INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, linkhoconline)
SELECT malop, 8, '14:00', '16:00', 'https://meet.google.com/abc-defg-hij'
FROM lophoc WHERE tenlop = 'IELTS 6.5+ Intensive';

-- Lịch Python (Offline)
INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, phonghoc)
SELECT malop, 3, '19:00', '21:00', 'Phòng Lab 201 - Trung tâm Tin học'
FROM lophoc WHERE tenlop = 'Python cho người mới bắt đầu';

INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, phonghoc)
SELECT malop, 6, '19:00', '21:00', 'Phòng Lab 201 - Trung tâm Tin học'
FROM lophoc WHERE tenlop = 'Python cho người mới bắt đầu';

INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, phonghoc)
SELECT malop, 8, '09:00', '11:00', 'Phòng Lab 201 - Trung tâm Tin học'
FROM lophoc WHERE tenlop = 'Python cho người mới bắt đầu';

-- Lịch Vật lý 11 (Online)
INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, linkhoconline)
SELECT malop, 3, '20:00', '22:00', 'https://zoom.us/j/987654321'
FROM lophoc WHERE tenlop = 'Vật lý 11 - Chuyên sâu';

INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, linkhoconline)
SELECT malop, 5, '20:00', '22:00', 'https://zoom.us/j/987654321'
FROM lophoc WHERE tenlop = 'Vật lý 11 - Chuyên sâu';

INSERT INTO lichhoc (malop, thu, giobatdau, gioketthuc, linkhoconline)
SELECT malop, 7, '15:00', '17:00', 'https://zoom.us/j/987654321'
FROM lophoc WHERE tenlop = 'Vật lý 11 - Chuyên sâu';

-- ========================================================
-- 8. ĐĂNG KÝ (DangKy)
-- ========================================================

-- Phạm Minh Đức đăng ký Toán 10 - Đã duyệt
INSERT INTO dangky (mahocvien, malop, yeucauthem, trangthai, nguoiduyet, ngayduyet)
SELECT 
    hv.mahocvien,
    lh.malop,
    'Con đang học lớp 10, cần bổ trợ thêm kiến thức nền tảng',
    'DaDuyet',
    tk.id,
    CURRENT_TIMESTAMP - INTERVAL '10 days'
FROM hocvien hv
CROSS JOIN LopHoc lh
CROSS JOIN TaiKhoan tk
WHERE hv.hoten = 'Phạm Minh Đức' 
AND lh.tenlop = 'Toán 10 - Nền tảng'
AND tk.email = 'nguyenvana@gmail.com';

-- Võ Thị Lan đăng ký Toán 12 - Đã duyệt
INSERT INTO dangky (mahocvien, malop, yeucauthem, trangthai, nguoiduyet, ngayduyet)
SELECT 
    hv.mahocvien,
    lh.malop,
    'Chuẩn bị thi THPT Quốc gia, muốn nâng cao điểm Toán',
    'DaDuyet',
    tk.id,
    CURRENT_TIMESTAMP - INTERVAL '8 days'
FROM hocvien hv
CROSS JOIN LopHoc lh
CROSS JOIN TaiKhoan tk
WHERE hv.hoten = 'Võ Thị Lan' 
AND lh.tenlop = 'Toán 12 - Luyện thi THPT QG'
AND tk.email = 'nguyenvana@gmail.com';

-- Hoàng Văn Nam đăng ký Toán 12 - Đã duyệt
INSERT INTO dangky (mahocvien, malop, yeucauthem, trangthai, nguoiduyet, ngayduyet)
SELECT 
    hv.mahocvien,
    lh.malop,
    'Muốn thi vào trường top. Cần ôn chuyên sâu',
    'DaDuyet',
    tk.id,
    CURRENT_TIMESTAMP - INTERVAL '7 days'
FROM hocvien hv
CROSS JOIN LopHoc lh
CROSS JOIN TaiKhoan tk
WHERE hv.hoten = 'Hoàng Văn Nam' 
AND lh.tenlop = 'Toán 12 - Luyện thi THPT QG'
AND tk.email = 'nguyenvana@gmail.com';

-- Lý Thị Mai đăng ký IELTS - Chờ duyệt
INSERT INTO dangky (mahocvien, malop, yeucauthem, trangthai)
SELECT 
    hv.mahocvien,
    lh.malop,
    'Đang học lớp 12, muốn thi IELTS để du học. Mục tiêu 7.0',
    'ChoDuyet'
FROM hocvien hv
CROSS JOIN LopHoc lh
WHERE hv.hoten = 'Lý Thị Mai' 
AND lh.tenlop = 'IELTS 6.5+ Intensive';

-- Đặng Minh Tuấn đăng ký Python - Chờ duyệt
INSERT INTO dangky (mahocvien, malop, yeucauthem, trangthai)
SELECT 
    hv.mahocvien,
    lh.malop,
    'Thích lập trình, muốn học Python để làm dự án cá nhân',
    'ChoDuyet'
FROM hocvien hv
CROSS JOIN LopHoc lh
WHERE hv.hoten = 'Đặng Minh Tuấn' 
AND lh.tenlop = 'Python cho người mới bắt đầu';

-- Phạm Minh Đức đăng ký Vật lý 11 - Từ chối
INSERT INTO dangky (mahocvien, malop, yeucauthem, trangthai, nguoiduyet, ngayduyet, lydotuchoi)
SELECT 
    hv.mahocvien,
    lh.malop,
    'Muốn học thêm Vật lý để bổ trợ',
    'TuChoi',
    tk.id,
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    'Lớp học dành cho học sinh lớp 11, em đang học lớp 10 chưa phù hợp với chương trình'
FROM hocvien hv
CROSS JOIN LopHoc lh
CROSS JOIN TaiKhoan tk
WHERE hv.hoten = 'Phạm Minh Đức' 
AND lh.tenlop = 'Vật lý 11 - Chuyên sâu'
AND tk.email = 'tranthib@gmail.com';

-- ========================================================
-- 9. ĐÁNH GIÁ (DanhGia)
-- ========================================================

-- Phạm Minh Đức đánh giá Nguyễn Văn A (Toán 10)
INSERT INTO danhgia (mahocvien, magiasu, malop, diem, nhanxet)
SELECT 
    hv.mahocvien,
    gs.magiasu,
    lh.malop,
    5.0,
    'Thầy dạy rất dễ hiểu, tận tâm. Con em tiến bộ rõ rệt sau 2 tháng học. Sẽ tiếp tục học với thầy!'
FROM hocvien hv
CROSS JOIN GiaSu gs
CROSS JOIN LopHoc lh
WHERE hv.hoten = 'Phạm Minh Đức' 
AND gs.hoten = 'Nguyễn Văn A'
AND lh.tenlop = 'Toán 10 - Nền tảng';

-- Võ Thị Lan đánh giá Nguyễn Văn A (Toán 12)
INSERT INTO danhgia (mahocvien, magiasu, malop, diem, nhanxet)
SELECT 
    hv.mahocvien,
    gs.magiasu,
    lh.malop,
    4.5,
    'Thầy giảng bài hay, có nhiều tips làm bài thi. Tuy nhiên lịch học hơi dày, nhiều bài tập. Nhưng nhìn chung rất hài lòng!'
FROM hocvien hv
CROSS JOIN GiaSu gs
CROSS JOIN LopHoc lh
WHERE hv.hoten = 'Võ Thị Lan' 
AND gs.hoten = 'Nguyễn Văn A'
AND lh.tenlop = 'Toán 12 - Luyện thi THPT QG';

-- Hoàng Văn Nam đánh giá Nguyễn Văn A (Toán 12)
INSERT INTO danhgia (mahocvien, magiasu, malop, diem, nhanxet)
SELECT 
    hv.mahocvien,
    gs.magiasu,
    lh.malop,
    5.0,
    'Thầy rất pro, giải bài nhanh và chính xác. Học với thầy tự tin hơn rất nhiều. Recommend!'
FROM hocvien hv
CROSS JOIN GiaSu gs
CROSS JOIN LopHoc lh
WHERE hv.hoten = 'Hoàng Văn Nam' 
AND gs.hoten = 'Nguyễn Văn A'
AND lh.tenlop = 'Toán 12 - Luyện thi THPT QG';

-- ========================================================
-- KẾT THÚC SEED DATA
-- ========================================================

SELECT 'Seed data inserted successfully!' as message;

-- Kiểm tra số lượng records
SELECT 'TaiKhoan' as table_name, COUNT(*) as count FROM taikhoan
UNION ALL SELECT 'GiaSu', COUNT(*) FROM giasu
UNION ALL SELECT 'HocVien', COUNT(*) FROM hocvien
UNION ALL SELECT 'MonHoc', COUNT(*) FROM monhoc
UNION ALL SELECT 'LopHoc', COUNT(*) FROM lophoc
UNION ALL SELECT 'HopDongGiangDay', COUNT(*) FROM HopDongGiangDay
UNION ALL SELECT 'LichHoc', COUNT(*) FROM LichHoc
UNION ALL SELECT 'DangKy', COUNT(*) FROM DangKy
UNION ALL SELECT 'DanhGia', COUNT(*) FROM DanhGia;




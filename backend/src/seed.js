/**
 * SEED DATABASE - COMPREHENSIVE DATA
 * Tạo dữ liệu mẫu đầy đủ cho production testing
 * 
 * Chạy: npm run seed
 */

import prisma from "./config/prisma.js";
import bcrypt from "bcryptjs";

const seed = async () => {
  console.log("🌱 Bắt đầu seed database với dữ liệu đầy đủ...\n");

  try {
    // ========== 1. Tạo môn học (10 môn) ==========
    console.log("📚 Tạo môn học...");
    const monHocData = [
      { tenMon: "Toán", moTa: "Môn Toán các cấp - Đại số, Hình học, Giải tích" },
      { tenMon: "Vật Lý", moTa: "Môn Vật lý - Cơ, Nhiệt, Điện, Quang, Hạt nhân" },
      { tenMon: "Hóa Học", moTa: "Môn Hóa học - Vô cơ, Hữu cơ, Phân tích" },
      { tenMon: "Tiếng Anh", moTa: "Ngoại ngữ Tiếng Anh - Giao tiếp, Ngữ pháp, Từ vựng" },
      { tenMon: "Ngữ Văn", moTa: "Môn Ngữ văn - Văn học, Làm văn, Đọc hiểu" },
      { tenMon: "Tin Học", moTa: "Lập trình, Tin học văn phòng, Công nghệ thông tin" },
      { tenMon: "Sinh Học", moTa: "Môn Sinh học - Di truyền, Tiến hóa, Sinh thái" },
      { tenMon: "Lịch Sử", moTa: "Môn Lịch sử Việt Nam và Thế giới" },
      { tenMon: "Địa Lý", moTa: "Môn Địa lý - Tự nhiên, Kinh tế, Xã hội" },
      { tenMon: "IELTS", moTa: "Luyện thi IELTS - Listening, Reading, Writing, Speaking" },
    ];

    const monHocs = [];
    for (const mh of monHocData) {
      const monHoc = await prisma.monHoc.upsert({
        where: { tenMon: mh.tenMon },
        update: {},
        create: mh,
      });
      monHocs.push(monHoc);
    }
    console.log(`   ✅ Đã tạo ${monHocs.length} môn học\n`);

    // ========== 2. Tạo Admin (2 tài khoản) ==========
    console.log("👤 Tạo tài khoản Admin...");
    const adminPassword = await bcrypt.hash("admin123", 12);
    
    const admin1 = await prisma.taiKhoan.upsert({
      where: { email: "admin@trungtamgiasu.vn" },
      update: {},
      create: {
        email: "admin@trungtamgiasu.vn",
        matKhau: adminPassword,
        role: "Admin",
        trangThai: "Active",
      },
    });
    
    const admin2 = await prisma.taiKhoan.upsert({
      where: { email: "admin2@trungtamgiasu.vn" },
      update: {},
      create: {
        email: "admin2@trungtamgiasu.vn",
        matKhau: adminPassword,
        role: "Admin",
        trangThai: "Active",
      },
    });
    console.log(`   ✅ Đã tạo 2 Admin\n`);

    // ========== 3. Tạo Gia sư (8 gia sư) ==========
    console.log("👨‍🏫 Tạo gia sư...");
    const giaSuData = [
      {
        email: "giasu1@gmail.com",
        hoTen: "Nguyễn Văn An",
        soDienThoai: "0901234567",
        namSinh: 1990,
        diaChi: "Quận 1, TP.HCM",
        chuyenMon: "Toán, Vật Lý",
        kinhNghiem: "5 năm",
        trinhDo: "Thạc sĩ Toán học, ĐH Khoa học Tự nhiên",
        gioiThieu: "Gia sư giàu kinh nghiệm, đã dạy hơn 100 học sinh đỗ đại học khối A. Phương pháp giảng dạy dễ hiểu, tận tâm với học sinh.",
      },
      {
        email: "giasu2@gmail.com",
        hoTen: "Trần Thị Bích",
        soDienThoai: "0902345678",
        namSinh: 1992,
        diaChi: "Quận 3, TP.HCM",
        chuyenMon: "Tiếng Anh, IELTS",
        kinhNghiem: "4 năm",
        trinhDo: "Cử nhân Ngôn ngữ Anh, IELTS 8.0",
        gioiThieu: "Chuyên luyện thi IELTS, đã giúp nhiều học viên đạt 7.0-8.0. Tập trung phát triển 4 kỹ năng toàn diện.",
      },
      {
        email: "giasu3@gmail.com",
        hoTen: "Lê Văn Cường",
        soDienThoai: "0903456789",
        namSinh: 1988,
        diaChi: "Quận 10, TP.HCM",
        chuyenMon: "Tin Học, Lập trình",
        kinhNghiem: "6 năm",
        trinhDo: "Kỹ sư CNTT, ĐH Bách Khoa",
        gioiThieu: "Dạy lập trình Python, JavaScript, Java. Kinh nghiệm làm việc tại các công ty công nghệ lớn.",
      },
      {
        email: "giasu4@gmail.com",
        hoTen: "Phạm Thị Dung",
        soDienThoai: "0904567890",
        namSinh: 1995,
        diaChi: "Quận 5, TP.HCM",
        chuyenMon: "Hóa Học",
        kinhNghiem: "3 năm",
        trinhDo: "Cử nhân Hóa học, ĐH Khoa học Tự nhiên",
        gioiThieu: "Chuyên dạy Hóa lớp 10-12, phương pháp giảng dạy sinh động, dễ nhớ. Nhiều học sinh đạt điểm 9-10.",
      },
      {
        email: "giasu5@gmail.com",
        hoTen: "Hoàng Văn Em",
        soDienThoai: "0905678901",
        namSinh: 1991,
        diaChi: "Quận 7, TP.HCM",
        chuyenMon: "Sinh Học",
        kinhNghiem: "4 năm",
        trinhDo: "Thạc sĩ Sinh học, ĐH Khoa học Tự nhiên",
        gioiThieu: "Giảng viên đại học kiêm gia sư, chuyên dạy Sinh học THPT và ôn thi đại học.",
      },
      {
        email: "giasu6@gmail.com",
        hoTen: "Võ Thị Phượng",
        soDienThoai: "0906789012",
        namSinh: 1993,
        diaChi: "Quận Bình Thạnh, TP.HCM",
        chuyenMon: "Ngữ Văn",
        kinhNghiem: "3 năm",
        trinhDo: "Cử nhân Ngữ văn, ĐH Sư phạm",
        gioiThieu: "Dạy làm văn, đọc hiểu văn học. Nhiều học sinh đạt điểm cao trong kỳ thi THPT.",
      },
      {
        email: "giasu7@gmail.com",
        hoTen: "Đặng Văn Giang",
        soDienThoai: "0907890123",
        namSinh: 1989,
        diaChi: "Quận 2, TP.HCM",
        chuyenMon: "Lịch Sử, Địa Lý",
        kinhNghiem: "5 năm",
        trinhDo: "Thạc sĩ Lịch sử, ĐH Khoa học Xã hội và Nhân văn",
        gioiThieu: "Giáo viên THPT kiêm gia sư, phương pháp giảng dạy dễ nhớ, tư duy logic.",
      },
      {
        email: "giasu8@gmail.com",
        hoTen: "Ngô Thị Hoa",
        soDienThoai: "0908901234",
        namSinh: 1994,
        diaChi: "Quận 4, TP.HCM",
        chuyenMon: "Tiếng Anh giao tiếp",
        kinhNghiem: "2 năm",
        trinhDo: "Cử nhân Ngôn ngữ Anh, IELTS 7.5",
        gioiThieu: "Chuyên dạy giao tiếp tiếng Anh, phát âm chuẩn Mỹ. Lớp học vui vẻ, hiệu quả.",
      },
    ];

    const giaSuPassword = await bcrypt.hash("123456", 12);
    const giaSus = [];
    
    for (const gs of giaSuData) {
      const taiKhoan = await prisma.taiKhoan.upsert({
        where: { email: gs.email },
        update: {},
        create: {
          email: gs.email,
          matKhau: giaSuPassword,
          role: "GiaSu",
          trangThai: "Active",
          giaSu: {
            create: {
              hoTen: gs.hoTen,
              soDienThoai: gs.soDienThoai,
              namSinh: gs.namSinh,
              diaChi: gs.diaChi,
              chuyenMon: gs.chuyenMon,
              kinhNghiem: gs.kinhNghiem,
              trinhDo: gs.trinhDo,
              gioiThieu: gs.gioiThieu,
            },
          },
        },
        include: { giaSu: true },
      });
      giaSus.push(taiKhoan.giaSu);
    }
    console.log(`   ✅ Đã tạo ${giaSus.length} gia sư\n`);

    // ========== 4. Tạo Học viên (10 học viên) ==========
    console.log("👨‍🎓 Tạo học viên...");
    const hocVienData = [
      { email: "hocvien1@gmail.com", hoTen: "Phạm Văn Khoa", namSinh: 2005, soDienThoai: "0911111111", diaChi: "Quận 1, TP.HCM" },
      { email: "hocvien2@gmail.com", hoTen: "Hoàng Thị Lan", namSinh: 2006, soDienThoai: "0922222222", diaChi: "Quận 3, TP.HCM" },
      { email: "hocvien3@gmail.com", hoTen: "Trương Văn Minh", namSinh: 2007, soDienThoai: "0933333333", diaChi: "Quận 5, TP.HCM" },
      { email: "hocvien4@gmail.com", hoTen: "Lý Thị Ngọc", namSinh: 2005, soDienThoai: "0944444444", diaChi: "Quận 7, TP.HCM" },
      { email: "hocvien5@gmail.com", hoTen: "Vũ Văn Ơn", namSinh: 2006, soDienThoai: "0955555555", diaChi: "Quận 10, TP.HCM" },
      { email: "hocvien6@gmail.com", hoTen: "Đỗ Thị Phương", namSinh: 2004, soDienThoai: "0966666666", diaChi: "Quận Bình Thạnh, TP.HCM" },
      { email: "hocvien7@gmail.com", hoTen: "Bùi Văn Quang", namSinh: 2005, soDienThoai: "0977777777", diaChi: "Quận 2, TP.HCM" },
      { email: "hocvien8@gmail.com", hoTen: "Phan Thị Rin", namSinh: 2007, soDienThoai: "0988888888", diaChi: "Quận 4, TP.HCM" },
      { email: "hocvien9@gmail.com", hoTen: "Cao Văn Sơn", namSinh: 2006, soDienThoai: "0999999999", diaChi: "Quận 6, TP.HCM" },
      { email: "hocvien10@gmail.com", hoTen: "Mai Thị Thu", namSinh: 2005, soDienThoai: "0910101010", diaChi: "Quận 8, TP.HCM" },
    ];

    const hocVienPassword = await bcrypt.hash("123456", 12);
    const hocViens = [];
    
    for (const hv of hocVienData) {
      const taiKhoan = await prisma.taiKhoan.upsert({
        where: { email: hv.email },
        update: {},
        create: {
          email: hv.email,
          matKhau: hocVienPassword,
          role: "HocVien",
          trangThai: "Active",
          hocVien: {
            create: {
              hoTen: hv.hoTen,
              namSinh: hv.namSinh,
              soDienThoai: hv.soDienThoai,
              diaChi: hv.diaChi,
            },
          },
        },
        include: { hocVien: true },
      });
      hocViens.push(taiKhoan.hocVien);
    }
    console.log(`   ✅ Đã tạo ${hocViens.length} học viên\n`);

    // ========== 5. Tạo Lớp học (15 lớp - các trạng thái khác nhau) ==========
    console.log("📖 Tạo lớp học...");
    const lopHocData = [
      // Lớp đang tuyển
      {
        tenLop: "Toán 10 - Nền tảng",
        maMon: "Toán",
        hocPhi: 400000,
        moTa: "Củng cố kiến thức Toán 10, phù hợp học sinh cần nâng cao nền tảng",
        hinhThuc: "Offline",
        soBuoiDuKien: 20,
        trangThai: "DangTuyen",
        ngayBatDau: new Date("2025-02-01"),
        ngayKetThuc: new Date("2025-05-31"),
      },
      {
        tenLop: "Toán 11 - Nâng cao",
        maMon: "Toán",
        hocPhi: 450000,
        moTa: "Lớp Toán 11 nâng cao, luyện tập chuyên sâu",
        hinhThuc: "Offline",
        soBuoiDuKien: 24,
        trangThai: "DangTuyen",
        ngayBatDau: new Date("2025-02-15"),
        ngayKetThuc: new Date("2025-06-15"),
      },
      {
        tenLop: "Toán 12 - Luyện thi THPT QG",
        maMon: "Toán",
        hocPhi: 500000,
        moTa: "Ôn thi THPT Quốc gia, tập trung đề thi thực tế",
        hinhThuc: "Offline",
        soBuoiDuKien: 30,
        trangThai: "DangDay",
        ngayBatDau: new Date("2025-01-15"),
        ngayKetThuc: new Date("2025-06-30"),
      },
      {
        tenLop: "Vật Lý 12 - Chuyên đề",
        maMon: "Vật Lý",
        hocPhi: 450000,
        moTa: "Chuyên đề Vật lý 12, giải bài tập nâng cao",
        hinhThuc: "Online",
        soBuoiDuKien: 25,
        trangThai: "DangDay",
        ngayBatDau: new Date("2025-01-20"),
        ngayKetThuc: new Date("2025-06-20"),
      },
      {
        tenLop: "Hóa Học 11 - Cơ bản",
        maMon: "Hóa Học",
        hocPhi: 380000,
        moTa: "Hóa học 11 cơ bản, phù hợp mọi đối tượng học sinh",
        hinhThuc: "Offline",
        soBuoiDuKien: 20,
        trangThai: "DangTuyen",
        ngayBatDau: new Date("2025-03-01"),
        ngayKetThuc: new Date("2025-06-30"),
      },
      {
        tenLop: "IELTS 6.5 - Cơ bản",
        maMon: "IELTS",
        hocPhi: 800000,
        moTa: "Luyện thi IELTS từ 5.0 lên 6.5, tập trung 4 kỹ năng",
        hinhThuc: "Online",
        soBuoiDuKien: 40,
        trangThai: "DangDay",
        ngayBatDau: new Date("2025-01-10"),
        ngayKetThuc: new Date("2025-04-30"),
      },
      {
        tenLop: "IELTS 7.5 - Nâng cao",
        maMon: "IELTS",
        hocPhi: 1000000,
        moTa: "Luyện thi IELTS 7.5+, dành cho học viên đã có nền",
        hinhThuc: "Online",
        soBuoiDuKien: 45,
        trangThai: "DangTuyen",
        ngayBatDau: new Date("2025-02-20"),
        ngayKetThuc: new Date("2025-06-20"),
      },
      {
        tenLop: "Tiếng Anh giao tiếp - Căn bản",
        maMon: "Tiếng Anh",
        hocPhi: 350000,
        moTa: "Tiếng Anh giao tiếp hàng ngày, phát âm chuẩn",
        hinhThuc: "Online",
        soBuoiDuKien: 20,
        trangThai: "DangDay",
        ngayBatDau: new Date("2025-01-05"),
        ngayKetThuc: new Date("2025-04-05"),
      },
      {
        tenLop: "Lập trình Python - Cơ bản",
        maMon: "Tin Học",
        hocPhi: 600000,
        moTa: "Học lập trình Python từ đầu, dành cho người mới",
        hinhThuc: "Online",
        soBuoiDuKien: 30,
        trangThai: "DangDay",
        ngayBatDau: new Date("2025-01-12"),
        ngayKetThuc: new Date("2025-04-12"),
      },
      {
        tenLop: "Lập trình Web - HTML, CSS, JS",
        maMon: "Tin Học",
        hocPhi: 700000,
        moTa: "Xây dựng website với HTML, CSS, JavaScript",
        hinhThuc: "Online",
        soBuoiDuKien: 35,
        trangThai: "DangTuyen",
        ngayBatDau: new Date("2025-03-01"),
        ngayKetThuc: new Date("2025-06-15"),
      },
      {
        tenLop: "Sinh Học 12 - Ôn thi",
        maMon: "Sinh Học",
        hocPhi: 420000,
        moTa: "Ôn thi THPT môn Sinh, lý thuyết và bài tập",
        hinhThuc: "Offline",
        soBuoiDuKien: 25,
        trangThai: "DangDay",
        ngayBatDau: new Date("2025-01-18"),
        ngayKetThuc: new Date("2025-06-25"),
      },
      {
        tenLop: "Ngữ Văn 12 - Làm văn nghị luận",
        maMon: "Ngữ Văn",
        hocPhi: 380000,
        moTa: "Dạy làm văn nghị luận xã hội, văn học",
        hinhThuc: "Offline",
        soBuoiDuKien: 20,
        trangThai: "DangTuyen",
        ngayBatDau: new Date("2025-02-10"),
        ngayKetThuc: new Date("2025-05-30"),
      },
      {
        tenLop: "Lịch Sử 11 - Thế giới hiện đại",
        maMon: "Lịch Sử",
        hocPhi: 350000,
        moTa: "Lịch sử thế giới hiện đại, phương pháp học hiệu quả",
        hinhThuc: "Online",
        soBuoiDuKien: 18,
        trangThai: "DangTuyen",
        ngayBatDau: new Date("2025-02-25"),
        ngayKetThuc: new Date("2025-05-25"),
      },
      {
        tenLop: "Địa Lý 12 - Địa lý Việt Nam",
        maMon: "Địa Lý",
        hocPhi: 360000,
        moTa: "Địa lý Việt Nam, tự nhiên và kinh tế",
        hinhThuc: "Offline",
        soBuoiDuKien: 20,
        trangThai: "DangTuyen",
        ngayBatDau: new Date("2025-03-05"),
        ngayKetThuc: new Date("2025-06-10"),
      },
      {
        tenLop: "Toán 9 - Ôn thi vào 10",
        maMon: "Toán",
        hocPhi: 480000,
        moTa: "Ôn thi vào lớp 10, đề thi các tỉnh",
        hinhThuc: "Offline",
        soBuoiDuKien: 28,
        trangThai: "HoanThanh",
        ngayBatDau: new Date("2024-11-01"),
        ngayKetThuc: new Date("2024-12-30"),
      },
    ];

    const lopHocs = [];
    for (const lh of lopHocData) {
      const monHoc = monHocs.find(m => m.tenMon === lh.maMon);
      if (!monHoc) continue;

      const lopHoc = await prisma.lopHoc.create({
        data: {
          maMon: monHoc.maMon,
          tenLop: lh.tenLop,
          hocPhi: lh.hocPhi,
          moTa: lh.moTa,
          hinhThuc: lh.hinhThuc,
          soBuoiDuKien: lh.soBuoiDuKien,
          trangThai: lh.trangThai,
          ngayBatDau: lh.ngayBatDau,
          ngayKetThuc: lh.ngayKetThuc,
        },
      });
      lopHocs.push(lopHoc);
    }
    console.log(`   ✅ Đã tạo ${lopHocs.length} lớp học\n`);

    // ========== 6. Gán gia sư cho lớp (HopDongGiangDay) ==========
    console.log("📝 Gán gia sư cho lớp...");
    const hopDongData = [
      { giaSu: 0, lopHoc: 2, trangThai: "DangDay" },  // Toán 12 - GS 1
      { giaSu: 0, lopHoc: 14, trangThai: "HoanThanh" }, // Toán 9 - GS 1
      { giaSu: 1, lopHoc: 5, trangThai: "DangDay" },  // IELTS 6.5 - GS 2
      { giaSu: 1, lopHoc: 7, trangThai: "DangDay" },  // Tiếng Anh giao tiếp - GS 2
      { giaSu: 2, lopHoc: 8, trangThai: "DangDay" },  // Python - GS 3
      { giaSu: 3, lopHoc: 3, trangThai: "DangDay" },  // Vật Lý 12 - GS 4
      { giaSu: 4, lopHoc: 10, trangThai: "DangDay" }, // Sinh 12 - GS 5
    ];

    for (const hd of hopDongData) {
      await prisma.hopDongGiangDay.create({
        data: {
          maGiaSu: giaSus[hd.giaSu].maGiaSu,
          maLop: lopHocs[hd.lopHoc].maLop,
          trangThai: hd.trangThai,
        },
      });
    }
    console.log(`   ✅ Đã tạo ${hopDongData.length} hợp đồng giảng dạy\n`);

    // ========== 7. Tạo Lịch học cho các lớp ==========
    console.log("📅 Tạo lịch học...");
    const lichHocData = [
      // Toán 12
      { lopHoc: 2, thu: 2, gioBatDau: "18:00", gioKetThuc: "20:00", phongHoc: "P101", linkHocOnline: null },
      { lopHoc: 2, thu: 4, gioBatDau: "18:00", gioKetThuc: "20:00", phongHoc: "P101", linkHocOnline: null },
      { lopHoc: 2, thu: 6, gioBatDau: "18:00", gioKetThuc: "20:00", phongHoc: "P101", linkHocOnline: null },
      // IELTS 6.5
      { lopHoc: 5, thu: 3, gioBatDau: "19:00", gioKetThuc: "21:00", phongHoc: null, linkHocOnline: "https://meet.google.com/abc-defg-hij" },
      { lopHoc: 5, thu: 5, gioBatDau: "19:00", gioKetThuc: "21:00", phongHoc: null, linkHocOnline: "https://meet.google.com/abc-defg-hij" },
      { lopHoc: 5, thu: 7, gioBatDau: "09:00", gioKetThuc: "11:00", phongHoc: null, linkHocOnline: "https://meet.google.com/abc-defg-hij" },
      // Python
      { lopHoc: 8, thu: 2, gioBatDau: "20:00", gioKetThuc: "22:00", phongHoc: null, linkHocOnline: "https://meet.google.com/xyz-uvw-rst" },
      { lopHoc: 8, thu: 6, gioBatDau: "20:00", gioKetThuc: "22:00", phongHoc: null, linkHocOnline: "https://meet.google.com/xyz-uvw-rst" },
    ];

    for (const lh of lichHocData) {
      await prisma.lichHoc.create({
        data: {
          maLop: lopHocs[lh.lopHoc].maLop,
          thu: lh.thu,
          gioBatDau: new Date(`1970-01-01T${lh.gioBatDau}:00`),
          gioKetThuc: new Date(`1970-01-01T${lh.gioKetThuc}:00`),
          phongHoc: lh.phongHoc,
          linkHocOnline: lh.linkHocOnline,
        },
      });
    }
    console.log(`   ✅ Đã tạo ${lichHocData.length} lịch học\n`);

    // ========== 8. Tạo Đăng ký (DangKy) - Các trạng thái khác nhau ==========
    console.log("✍️ Tạo đăng ký lớp học...");
    const dangKyData = [
      // Đã duyệt
      { hocVien: 0, lopHoc: 2, trangThai: "DaDuyet", nguoiDuyet: admin1.id, yeuCauThem: "Muốn học buổi tối" },
      { hocVien: 1, lopHoc: 5, trangThai: "DaDuyet", nguoiDuyet: admin1.id, yeuCauThem: null },
      { hocVien: 2, lopHoc: 8, trangThai: "DaDuyet", nguoiDuyet: admin2.id, yeuCauThem: "Cần học từ cơ bản" },
      // Chờ duyệt
      { hocVien: 3, lopHoc: 0, trangThai: "ChoDuyet", nguoiDuyet: null, yeuCauThem: "Cần ôn lại kiến thức lớp 9" },
      { hocVien: 4, lopHoc: 1, trangThai: "ChoDuyet", nguoiDuyet: null, yeuCauThem: null },
      { hocVien: 5, lopHoc: 6, trangThai: "ChoDuyet", nguoiDuyet: null, yeuCauThem: "Muốn đạt 7.5 IELTS" },
      // Từ chối
      { hocVien: 6, lopHoc: 2, trangThai: "TuChoi", nguoiDuyet: admin1.id, lyDoTuChoi: "Lớp đã đủ số lượng" },
    ];

    for (const dk of dangKyData) {
      const dataCreate = {
        maHocVien: hocViens[dk.hocVien].maHocVien,
        maLop: lopHocs[dk.lopHoc].maLop,
        trangThai: dk.trangThai,
        yeuCauThem: dk.yeuCauThem,
      };

      if (dk.nguoiDuyet) {
        dataCreate.nguoiDuyet = dk.nguoiDuyet;
        dataCreate.ngayDuyet = new Date();
      }

      if (dk.lyDoTuChoi) {
        dataCreate.lyDoTuChoi = dk.lyDoTuChoi;
      }

      await prisma.dangKy.create({ data: dataCreate });
    }
    console.log(`   ✅ Đã tạo ${dangKyData.length} đăng ký\n`);

    // ========== 9. Tạo Đánh giá (DanhGia) ==========
    console.log("⭐ Tạo đánh giá...");
    const danhGiaData = [
      { hocVien: 0, giaSu: 0, lopHoc: 14, diem: 5, nhanXet: "Thầy dạy rất tốt, dễ hiểu. Em đã thi đỗ vào lớp 10!" },
      { hocVien: 0, giaSu: 0, lopHoc: 2, diem: 4.5, nhanXet: "Thầy nhiệt tình, bài giảng chi tiết" },
      { hocVien: 1, giaSu: 1, lopHoc: 5, diem: 5, nhanXet: "Cô dạy IELTS xuất sắc, em đã đạt 7.0" },
      { hocVien: 2, giaSu: 2, lopHoc: 8, diem: 4, nhanXet: "Thầy giảng rõ ràng, code dễ hiểu" },
    ];

    for (const dg of danhGiaData) {
      await prisma.danhGia.create({
        data: {
          maHocVien: hocViens[dg.hocVien].maHocVien,
          maGiaSu: giaSus[dg.giaSu].maGiaSu,
          maLop: lopHocs[dg.lopHoc].maLop,
          diem: dg.diem,
          nhanXet: dg.nhanXet,
        },
      });
    }
    console.log(`   ✅ Đã tạo ${danhGiaData.length} đánh giá\n`);

    console.log("✨ Seed database hoàn tất!\n");
    console.log("📋 THÔNG TIN ĐĂNG NHẬP:");
    console.log("=".repeat(50));
    console.log("👤 ADMIN:");
    console.log("   - admin@trungtamgiasu.vn / admin123");
    console.log("   - admin2@trungtamgiasu.vn / admin123");
    console.log("\n👨‍🏫 GIA SƯ (8 tài khoản):");
    console.log("   - giasu1@gmail.com / 123456 (Toán, Vật Lý)");
    console.log("   - giasu2@gmail.com / 123456 (IELTS)");
    console.log("   - giasu3@gmail.com / 123456 (Lập trình)");
    console.log("   - ... giasu4-8@gmail.com / 123456");
    console.log("\n👨‍🎓 HỌC VIÊN (10 tài khoản):");
    console.log("   - hocvien1@gmail.com / 123456");
    console.log("   - hocvien2@gmail.com / 123456");
    console.log("   - ... hocvien3-10@gmail.com / 123456");
    console.log("\n📊 TỔNG QUAN DỮ LIỆU:");
    console.log("   - 10 môn học");
    console.log("   - 15 lớp học (DangTuyen, DangDay, HoanThanh)");
    console.log("   - 7 hợp đồng giảng dạy");
    console.log("   - 8 lịch học");
    console.log("   - 7 đăng ký (ChoDuyet, DaDuyet, TuChoi)");
    console.log("   - 4 đánh giá");
    console.log("=".repeat(50) + "\n");

  } catch (error) {
    console.error("❌ Lỗi khi seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

seed();

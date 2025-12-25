/**
 * SEED DATABASE
 * Tạo dữ liệu mẫu ban đầu
 * 
 * Chạy: npm run seed
 */

import prisma from "./config/prisma.js";
import bcrypt from "bcryptjs";

const seed = async () => {
  console.log("🌱 Bắt đầu seed database...\n");

  try {
    // ========== 1. Tạo môn học ==========
    console.log("📚 Tạo môn học...");
    const monHocData = [
      { tenMon: "Toán", moTa: "Môn Toán các cấp" },
      { tenMon: "Vật Lý", moTa: "Môn Vật lý" },
      { tenMon: "Hóa Học", moTa: "Môn Hóa học" },
      { tenMon: "Tiếng Anh", moTa: "Ngoại ngữ Tiếng Anh" },
      { tenMon: "Ngữ Văn", moTa: "Môn Ngữ văn" },
      { tenMon: "Tin Học", moTa: "Lập trình, tin học văn phòng" },
      { tenMon: "Sinh Học", moTa: "Môn Sinh học" },
      { tenMon: "Lịch Sử", moTa: "Môn Lịch sử" },
      { tenMon: "Địa Lý", moTa: "Môn Địa lý" },
      { tenMon: "IELTS", moTa: "Luyện thi IELTS" },
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

    // ========== 2. Tạo tài khoản Admin ==========
    console.log("👤 Tạo tài khoản Admin...");
    const adminPassword = await bcrypt.hash("admin123", 12);
    const admin = await prisma.taiKhoan.upsert({
      where: { email: "admin@trungtamgiasu.vn" },
      update: {},
      create: {
        email: "admin@trungtamgiasu.vn",
        matKhau: adminPassword,
        role: "Admin",
        trangThai: "Active",
      },
    });
    console.log(`   ✅ Admin: admin@trungtamgiasu.vn / admin123\n`);

    // ========== 3. Tạo gia sư mẫu ==========
    console.log("👨‍🏫 Tạo gia sư mẫu...");
    const giaSuData = [
      {
        email: "giasu1@gmail.com",
        hoTen: "Nguyễn Văn A",
        soDienThoai: "0901234567",
        chuyenMon: "Toán, Vật Lý",
        kinhNghiem: "5 năm",
        trinhDo: "Thạc sĩ Toán học",
        gioiThieu: "Gia sư giàu kinh nghiệm, đã dạy nhiều học sinh đỗ đại học",
      },
      {
        email: "giasu2@gmail.com",
        hoTen: "Trần Thị B",
        soDienThoai: "0902345678",
        chuyenMon: "Tiếng Anh, IELTS",
        kinhNghiem: "3 năm",
        trinhDo: "Cử nhân Ngôn ngữ Anh, IELTS 8.0",
        gioiThieu: "Chuyên luyện thi IELTS, giao tiếp tiếng Anh",
      },
      {
        email: "giasu3@gmail.com",
        hoTen: "Lê Văn C",
        soDienThoai: "0903456789",
        chuyenMon: "Tin Học, Lập trình",
        kinhNghiem: "4 năm",
        trinhDo: "Kỹ sư CNTT",
        gioiThieu: "Dạy lập trình Python, JavaScript, Web development",
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
    console.log(`   ✅ Đã tạo ${giaSus.length} gia sư (mật khẩu: 123456)\n`);

    // ========== 4. Tạo học viên mẫu ==========
    console.log("👨‍🎓 Tạo học viên mẫu...");
    const hocVienData = [
      {
        email: "hocvien1@gmail.com",
        hoTen: "Phạm Văn D",
        namSinh: 2005,
        soDienThoai: "0904567890",
        diaChi: "Quận 1, TP.HCM",
      },
      {
        email: "hocvien2@gmail.com",
        hoTen: "Hoàng Thị E",
        namSinh: 2006,
        soDienThoai: "0905678901",
        diaChi: "Quận 3, TP.HCM",
      },
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
    console.log(`   ✅ Đã tạo ${hocViens.length} học viên (mật khẩu: 123456)\n`);

    // ========== 5. Tạo lớp học mẫu ==========
    console.log("📖 Tạo lớp học mẫu...");
    const lopHocData = [
      {
        tenLop: "Luyện thi Toán 12 - Lấy gốc",
        hocPhi: 500000,
        moTa: "Dành cho học sinh lớp 12 muốn củng cố kiến thức Toán, lấy lại gốc để chuẩn bị thi THPTQG",
        hinhThuc: "Offline",
        soBuoiDuKien: 20,
        monHocTen: "Toán",
      },
      {
        tenLop: "IELTS 6.5 - Cơ bản",
        hocPhi: 800000,
        moTa: "Khóa luyện thi IELTS từ 5.0 lên 6.5, tập trung 4 kỹ năng",
        hinhThuc: "Online",
        soBuoiDuKien: 30,
        monHocTen: "IELTS",
      },
      {
        tenLop: "Lập trình Python cơ bản",
        hocPhi: 600000,
        moTa: "Học lập trình Python từ đầu, dành cho người mới bắt đầu",
        hinhThuc: "Online",
        soBuoiDuKien: 15,
        monHocTen: "Tin Học",
      },
    ];

    for (let i = 0; i < lopHocData.length; i++) {
      const lh = lopHocData[i];
      const monHoc = monHocs.find(m => m.tenMon === lh.monHocTen);
      
      if (!monHoc) continue;

      const lopHoc = await prisma.lopHoc.create({
        data: {
          maMon: monHoc.maMon,
          tenLop: lh.tenLop,
          hocPhi: lh.hocPhi,
          moTa: lh.moTa,
          hinhThuc: lh.hinhThuc,
          soBuoiDuKien: lh.soBuoiDuKien,
          trangThai: "DangTuyen",
        },
      });

      // Gán gia sư cho lớp
      if (giaSus[i]) {
        await prisma.hopDongGiangDay.create({
          data: {
            maGiaSu: giaSus[i].maGiaSu,
            maLop: lopHoc.maLop,
          },
        });
      }
    }
    console.log(`   ✅ Đã tạo ${lopHocData.length} lớp học\n`);

    console.log("✨ Seed database hoàn tất!\n");
    console.log("📋 Thông tin đăng nhập:");
    console.log("   Admin: admin@trungtamgiasu.vn / admin123");
    console.log("   Gia sư: giasu1@gmail.com / 123456");
    console.log("   Học viên: hocvien1@gmail.com / 123456\n");

  } catch (error) {
    console.error("❌ Lỗi khi seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

seed();

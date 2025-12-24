/**
 * FIX DỮ LIỆU TRÙNG LẶP - MÔN HỌC
 * 
 * Vấn đề:
 * - Có 2 môn "Toán Học" bị trùng:
 *   + "Toán  Học" (2 dấu cách) - e744ed9c-ee51-48fc-8e38-0ce8e410aeac - 2 lớp
 *   + "Toán Học" (1 dấu cách) - 3601457b-3a0b-401d-936b-2638c2f4940a - 5 lớp
 * 
 * Giải pháp:
 * 1. Chuyển tất cả lớp học từ "Toán  Học" (2 dấu cách) sang "Toán Học" (1 dấu cách)
 * 2. Xóa môn "Toán  Học" (2 dấu cách)
 * 3. Giữ lại môn "Toán Học" (1 dấu cách) với mô tả đầy đủ hơn
 * 
 * Chạy: node backend/fix-duplicate-subjects.js
 */

import prisma from "./src/config/prisma.js";

const fixDuplicateSubjects = async () => {
  console.log("🔧 Bắt đầu fix dữ liệu trùng lặp môn học...\n");

  try {
    // IDs của 2 môn trùng
    const oldSubjectId = "e744ed9c-ee51-48fc-8e38-0ce8e410aeac"; // "Toán  Học" (2 dấu cách)
    const keepSubjectId = "3601457b-3a0b-401d-936b-2638c2f4940a"; // "Toán Học" (1 dấu cách)

    // 1. Kiểm tra xem 2 môn có tồn tại không
    const oldSubject = await prisma.monHoc.findUnique({
      where: { maMon: oldSubjectId },
      include: {
        _count: {
          select: { lopHocs: true }
        }
      }
    });

    const keepSubject = await prisma.monHoc.findUnique({
      where: { maMon: keepSubjectId },
      include: {
        _count: {
          select: { lopHocs: true }
        }
      }
    });

    if (!oldSubject) {
      console.log("❌ Không tìm thấy môn 'Toán  Học' (2 dấu cách)");
      return;
    }

    if (!keepSubject) {
      console.log("❌ Không tìm thấy môn 'Toán Học' (1 dấu cách)");
      return;
    }

    console.log(`📊 Tìm thấy:`);
    console.log(`   - "${oldSubject.tenMon}" (ID: ${oldSubjectId}): ${oldSubject._count.lopHocs} lớp`);
    console.log(`   - "${keepSubject.tenMon}" (ID: ${keepSubjectId}): ${keepSubject._count.lopHocs} lớp\n`);

    // 2. Chuyển tất cả lớp học từ môn cũ sang môn mới
    if (oldSubject._count.lopHocs > 0) {
      console.log(`🔄 Chuyển ${oldSubject._count.lopHocs} lớp học từ "${oldSubject.tenMon}" sang "${keepSubject.tenMon}"...`);
      
      const updateResult = await prisma.lopHoc.updateMany({
        where: { maMon: oldSubjectId },
        data: { maMon: keepSubjectId }
      });

      console.log(`   ✅ Đã chuyển ${updateResult.count} lớp học\n`);
    }

    // 3. Xóa môn học cũ
    console.log(`🗑️ Xóa môn "${oldSubject.tenMon}" (2 dấu cách)...`);
    await prisma.monHoc.delete({
      where: { maMon: oldSubjectId }
    });
    console.log(`   ✅ Đã xóa\n`);

    // 4. Kiểm tra lại kết quả
    const finalSubject = await prisma.monHoc.findUnique({
      where: { maMon: keepSubjectId },
      include: {
        _count: {
          select: { lopHocs: true }
        }
      }
    });

    console.log(`✨ Hoàn tất! Kết quả:`);
    console.log(`   - "${finalSubject.tenMon}" (ID: ${keepSubjectId}): ${finalSubject._count.lopHocs} lớp`);
    console.log(`   - Tổng: ${oldSubject._count.lopHocs + keepSubject._count.lopHocs} lớp đã được gộp lại\n`);

    // 5. Kiểm tra xem còn môn nào trùng không
    console.log("🔍 Kiểm tra các môn học còn lại...");
    const allSubjects = await prisma.monHoc.findMany({
      orderBy: { tenMon: "asc" },
      include: {
        _count: {
          select: { lopHocs: true }
        }
      }
    });

    console.log(`\n📚 Danh sách ${allSubjects.length} môn học:`);
    allSubjects.forEach((sub) => {
      console.log(`   - ${sub.tenMon}: ${sub._count.lopHocs} lớp`);
    });

    console.log("\n✅ Fix hoàn tất!");

  } catch (error) {
    console.error("❌ Lỗi khi fix:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

fixDuplicateSubjects();

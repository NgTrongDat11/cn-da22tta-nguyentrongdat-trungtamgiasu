/**
 * TEST DATABASE SCHEMA - Using Prisma
 * Script này để kiểm tra column names thực tế và test Prisma client
 */

import prisma from './src/config/prisma.js';

async function checkDatabase() {
  try {
    console.log('🔍 KIỂM TRA DATABASE SCHEMA VÀ PRISMA CLIENT\n');
    console.log('='.repeat(80));

    // 1. Test connection
    console.log('\n1️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('   ✅ Connected to database successfully\n');

    // 2. Query với Prisma để xem có lỗi không
    console.log('2️⃣ Testing Prisma queries...\n');
    
    try {
      const taiKhoanCount = await prisma.taiKhoan.count();
      console.log(`   ✅ TaiKhoan count: ${taiKhoanCount}`);
      
      if (taiKhoanCount > 0) {
        const sampleTaiKhoan = await prisma.taiKhoan.findFirst();
        console.log('   📝 Sample TaiKhoan:', {
          id: sampleTaiKhoan.id,
          email: sampleTaiKhoan.email,
          role: sampleTaiKhoan.role,
          trangThai: sampleTaiKhoan.trangThai
        });
      }
    } catch (err) {
      console.log('   ❌ TaiKhoan query error:', err.message);
    }

    try {
      const giaSuCount = await prisma.giaSu.count();
      console.log(`\n   ✅ GiaSu count: ${giaSuCount}`);
      
      if (giaSuCount > 0) {
        const sampleGiaSu = await prisma.giaSu.findFirst();
        console.log('   📝 Sample GiaSu:', {
          maGiaSu: sampleGiaSu.maGiaSu,
          hoTen: sampleGiaSu.hoTen,
          taiKhoanId: sampleGiaSu.taiKhoanId
        });
      }
    } catch (err) {
      console.log('   ❌ GiaSu query error:', err.message);
    }

    try {
      const hocVienCount = await prisma.hocVien.count();
      console.log(`\n   ✅ HocVien count: ${hocVienCount}`);
    } catch (err) {
      console.log('   ❌ HocVien query error:', err.message);
    }

    try {
      const monHocCount = await prisma.monHoc.count();
      console.log(`   ✅ MonHoc count: ${monHocCount}`);
    } catch (err) {
      console.log('   ❌ MonHoc query error:', err.message);
    }

    try {
      const lopHocCount = await prisma.lopHoc.count();
      console.log(`   ✅ LopHoc count: ${lopHocCount}`);
    } catch (err) {
      console.log('   ❌ LopHoc query error:', err.message);
    }

    try {
      const dangKyCount = await prisma.dangKy.count();
      console.log(`   ✅ DangKy count: ${dangKyCount}`);
    } catch (err) {
      console.log('   ❌ DangKy query error:', err.message);
    }

    try {
      const danhGiaCount = await prisma.danhGia.count();
      console.log(`   ✅ DanhGia count: ${danhGiaCount}`);
    } catch (err) {
      console.log('   ❌ DanhGia query error:', err.message);
    }

    // 3. Test relationship queries
    console.log('\n\n3️⃣ Testing relationship queries...\n');
    
    try {
      const taiKhoanWithProfile = await prisma.taiKhoan.findFirst({
        where: { role: 'GiaSu' },
        include: {
          giaSu: true
        }
      });
      
      if (taiKhoanWithProfile) {
        console.log('   ✅ TaiKhoan -> GiaSu relationship works');
        console.log('   📝 Data:', {
          email: taiKhoanWithProfile.email,
          giaSu: taiKhoanWithProfile.giaSu ? {
            hoTen: taiKhoanWithProfile.giaSu.hoTen
          } : null
        });
      }
    } catch (err) {
      console.log('   ❌ TaiKhoan -> GiaSu relationship error:', err.message);
    }

    try {
      const lopHocWithDetails = await prisma.lopHoc.findFirst({
        include: {
          monHoc: true,
          dangKys: {
            take: 1
          }
        }
      });
      
      if (lopHocWithDetails) {
        console.log('\n   ✅ LopHoc relationships work');
        console.log('   📝 Data:', {
          tenLop: lopHocWithDetails.tenLop,
          monHoc: lopHocWithDetails.monHoc?.tenMon,
          soDangKy: lopHocWithDetails.dangKys.length
        });
      }
    } catch (err) {
      console.log('\n   ❌ LopHoc relationships error:', err.message);
    }

    // 4. Test raw query để xem actual column names
    console.log('\n\n4️⃣ Testing raw SQL to check actual column names...\n');
    
    try {
      const rawResult = await prisma.$queryRaw`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'TaiKhoan'
        ORDER BY ordinal_position
      `;
      console.log('   ✅ TaiKhoan table columns:', rawResult);
    } catch (err) {
      console.log('   ❌ Raw query error:', err.message);
      
      // Try with lowercase
      try {
        const rawResult2 = await prisma.$queryRaw`
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = 'taikhoan'
          ORDER BY ordinal_position
        `;
        console.log('   ✅ taikhoan (lowercase) table columns:', rawResult2);
      } catch (err2) {
        console.log('   ❌ Lowercase query also failed:', err2.message);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ DATABASE CHECK COMPLETED\n');

  } catch (error) {
    console.error('\n❌ CRITICAL ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

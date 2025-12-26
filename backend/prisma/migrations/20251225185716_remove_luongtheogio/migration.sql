/*
  Warnings:

  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tutor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tutor" DROP CONSTRAINT "Tutor_userId_fkey";

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "Tutor";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "taikhoan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(100) NOT NULL,
    "matkhau" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "trangthai" VARCHAR(20) DEFAULT 'Active',
    "ngaytao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ngaycapnhat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "taikhoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monhoc" (
    "mamon" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenmon" VARCHAR(100) NOT NULL,
    "mota" TEXT,

    CONSTRAINT "monhoc_pkey" PRIMARY KEY ("mamon")
);

-- CreateTable
CREATE TABLE "giasu" (
    "magiasu" UUID NOT NULL DEFAULT gen_random_uuid(),
    "taikhoanid" UUID NOT NULL,
    "hoten" VARCHAR(100) NOT NULL,
    "sodienthoai" VARCHAR(15),
    "hinhanh" VARCHAR(255),
    "chuyenmon" VARCHAR(255),
    "kinhnghiem" VARCHAR(50),
    "trinhdo" VARCHAR(100),
    "gioithieu" TEXT,
    "ngaytao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "diachi" VARCHAR(255),
    "namsinh" INTEGER,

    CONSTRAINT "giasu_pkey" PRIMARY KEY ("magiasu")
);

-- CreateTable
CREATE TABLE "hocvien" (
    "mahocvien" UUID NOT NULL DEFAULT gen_random_uuid(),
    "taikhoanid" UUID NOT NULL,
    "hoten" VARCHAR(100) NOT NULL,
    "namsinh" INTEGER,
    "sodienthoai" VARCHAR(15),
    "diachi" VARCHAR(255),
    "hinhanh" VARCHAR(255),
    "ngaytao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hocvien_pkey" PRIMARY KEY ("mahocvien")
);

-- CreateTable
CREATE TABLE "lophoc" (
    "malop" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mamon" UUID NOT NULL,
    "tenlop" VARCHAR(150) NOT NULL,
    "hocphi" DECIMAL(12,2) NOT NULL,
    "mota" TEXT,
    "hinhthuc" VARCHAR(20) DEFAULT 'Offline',
    "sobuoidukien" INTEGER,
    "trangthai" VARCHAR(20) DEFAULT 'DangTuyen',
    "ngaybatdau" DATE,
    "ngayketthuc" DATE,
    "ngaytao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lophoc_pkey" PRIMARY KEY ("malop")
);

-- CreateTable
CREATE TABLE "dangky" (
    "madangky" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mahocvien" UUID NOT NULL,
    "malop" UUID NOT NULL,
    "yeucauthem" TEXT,
    "ngaydangky" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "trangthai" VARCHAR(20) DEFAULT 'ChoDuyet',
    "nguoiduyet" UUID,
    "ngayduyet" TIMESTAMP(6),
    "lydotuchoi" TEXT,

    CONSTRAINT "dangky_pkey" PRIMARY KEY ("madangky")
);

-- CreateTable
CREATE TABLE "hopdonggiangday" (
    "mahopdong" UUID NOT NULL DEFAULT gen_random_uuid(),
    "magiasu" UUID NOT NULL,
    "malop" UUID NOT NULL,
    "ngaynhanlop" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "trangthai" VARCHAR(20) DEFAULT 'DangDay',

    CONSTRAINT "hopdonggiangday_pkey" PRIMARY KEY ("mahopdong")
);

-- CreateTable
CREATE TABLE "lichhoc" (
    "malich" UUID NOT NULL DEFAULT gen_random_uuid(),
    "malop" UUID NOT NULL,
    "thu" INTEGER,
    "giobatdau" TIME(6) NOT NULL,
    "gioketthuc" TIME(6) NOT NULL,
    "phonghoc" VARCHAR(50),
    "linkhoconline" VARCHAR(255),

    CONSTRAINT "lichhoc_pkey" PRIMARY KEY ("malich")
);

-- CreateTable
CREATE TABLE "danhgia" (
    "madanhgia" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mahocvien" UUID NOT NULL,
    "magiasu" UUID NOT NULL,
    "malop" UUID,
    "diem" DOUBLE PRECISION,
    "nhanxet" TEXT,
    "ngaydanhgia" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "danhgia_pkey" PRIMARY KEY ("madanhgia")
);

-- CreateIndex
CREATE UNIQUE INDEX "taikhoan_email_key" ON "taikhoan"("email");

-- CreateIndex
CREATE UNIQUE INDEX "monhoc_tenmon_key" ON "monhoc"("tenmon");

-- CreateIndex
CREATE UNIQUE INDEX "giasu_taikhoanid_key" ON "giasu"("taikhoanid");

-- CreateIndex
CREATE UNIQUE INDEX "hocvien_taikhoanid_key" ON "hocvien"("taikhoanid");

-- CreateIndex
CREATE UNIQUE INDEX "dangky_mahocvien_malop_key" ON "dangky"("mahocvien", "malop");

-- CreateIndex
CREATE UNIQUE INDEX "hopdonggiangday_magiasu_malop_key" ON "hopdonggiangday"("magiasu", "malop");

-- AddForeignKey
ALTER TABLE "giasu" ADD CONSTRAINT "giasu_taikhoanid_fkey" FOREIGN KEY ("taikhoanid") REFERENCES "taikhoan"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hocvien" ADD CONSTRAINT "hocvien_taikhoanid_fkey" FOREIGN KEY ("taikhoanid") REFERENCES "taikhoan"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lophoc" ADD CONSTRAINT "lophoc_mamon_fkey" FOREIGN KEY ("mamon") REFERENCES "monhoc"("mamon") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dangky" ADD CONSTRAINT "dangky_mahocvien_fkey" FOREIGN KEY ("mahocvien") REFERENCES "hocvien"("mahocvien") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dangky" ADD CONSTRAINT "dangky_malop_fkey" FOREIGN KEY ("malop") REFERENCES "lophoc"("malop") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dangky" ADD CONSTRAINT "dangky_nguoiduyet_fkey" FOREIGN KEY ("nguoiduyet") REFERENCES "taikhoan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hopdonggiangday" ADD CONSTRAINT "hopdonggiangday_magiasu_fkey" FOREIGN KEY ("magiasu") REFERENCES "giasu"("magiasu") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hopdonggiangday" ADD CONSTRAINT "hopdonggiangday_malop_fkey" FOREIGN KEY ("malop") REFERENCES "lophoc"("malop") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lichhoc" ADD CONSTRAINT "lichhoc_malop_fkey" FOREIGN KEY ("malop") REFERENCES "lophoc"("malop") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "danhgia" ADD CONSTRAINT "danhgia_magiasu_fkey" FOREIGN KEY ("magiasu") REFERENCES "giasu"("magiasu") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "danhgia" ADD CONSTRAINT "danhgia_mahocvien_fkey" FOREIGN KEY ("mahocvien") REFERENCES "hocvien"("mahocvien") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "danhgia" ADD CONSTRAINT "danhgia_malop_fkey" FOREIGN KEY ("malop") REFERENCES "lophoc"("malop") ON DELETE NO ACTION ON UPDATE NO ACTION;

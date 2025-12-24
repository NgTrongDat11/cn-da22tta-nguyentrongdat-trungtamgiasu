/**
 * DATABASE CONFIG - PostgreSQL + Prisma
 *
 * File này khởi tạo Prisma Client để query database
 * Prisma Client là công cụ để tương tác với PostgreSQL
 *
 * Cách sử dụng trong code:
 *
 * import prisma from './config/database.js'
 *
 * // Create user
 * const user = await prisma.user.create({
 *   data: { email: 'test@example.com', password: '...', fullName: 'Test' }
 * })
 *
 * // Find user
 * const user = await prisma.user.findUnique({
 *   where: { email: 'test@example.com' }
 * })
 *
 * // Update user
 * await prisma.user.update({
 *   where: { id: 1 },
 *   data: { fullName: 'New Name' }
 * })
 *
 * // Delete user
 * await prisma.user.delete({ where: { id: 1 } })
 *
 * // Query với relationships
 * const user = await prisma.user.findUnique({
 *   where: { id: 1 },
 *   include: {
 *     studentProfile: true,        // Include Student data
 *     bookingsAsStudent: true,     // Include Bookings
 *   }
 * })
 */

// Import PrismaClient từ @prisma/client package
import { PrismaClient } from "@prisma/client";

// Khởi tạo Prisma Client (singleton pattern)
// Chỉ tạo 1 instance để dùng chung khắp app
const prisma = new PrismaClient();

// Export để dùng trong files khác
export default prisma;

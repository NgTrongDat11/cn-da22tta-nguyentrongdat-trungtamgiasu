/**
 * Prisma Client Instance
 * Singleton pattern để tránh tạo nhiều connection
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export default prisma;

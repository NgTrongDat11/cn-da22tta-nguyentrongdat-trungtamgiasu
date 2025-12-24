/**
 * ENTRY POINT - Trung Tâm Gia Sư API
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./routes/auth.js";
import giaSuRoutes from "./routes/giaSu.js";
import hocVienRoutes from "./routes/hocVien.js";
import lopHocRoutes from "./routes/lopHoc.js";
import monHocRoutes from "./routes/monHoc.js";
import adminRoutes from "./routes/admin.js";

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js";

// Import config
import { initMinio } from "./config/minio.js";

// Khởi tạo Express app
const app = express();

// ========== MIDDLEWARE ==========

// CORS - cho phép frontend truy cập API
app.use(cors({
  origin: true, // Cho phép tất cả origins trong development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log requests (debug)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Parse JSON body
app.use(express.json());

// Parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// ========== ROUTES ==========

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK",
    message: "Trung Tâm Gia Sư API đang hoạt động",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/gia-su", giaSuRoutes);
app.use("/api/hoc-vien", hocVienRoutes);
app.use("/api/lop-hoc", lopHocRoutes);
app.use("/api/mon-hoc", monHocRoutes);
app.use("/api/admin", adminRoutes);

// API docs route
app.get("/api", (req, res) => {
  res.json({
    message: "Trung Tâm Gia Sư API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      giaSu: "/api/gia-su",
      hocVien: "/api/hoc-vien",
      lopHoc: "/api/lop-hoc",
      monHoc: "/api/mon-hoc",
      admin: "/api/admin",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Không tìm thấy route",
  });
});

// ========== ERROR HANDLER ==========
app.use(errorHandler);

// ========== START SERVER ==========

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialize MinIO
    await initMinio();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Server đang chạy tại port ${PORT}`);
      console.log(`📝 API: http://localhost:${PORT}/api`);
      console.log(`💚 Health: http://localhost:${PORT}/health`);
      console.log(`\n📚 Endpoints:`);
      console.log(`   - Auth:    http://localhost:${PORT}/api/auth`);
      console.log(`   - Gia sư:  http://localhost:${PORT}/api/gia-su`);
      console.log(`   - Học viên: http://localhost:${PORT}/api/hoc-vien`);
      console.log(`   - Lớp học: http://localhost:${PORT}/api/lop-hoc`);
      console.log(`   - Môn học: http://localhost:${PORT}/api/mon-hoc`);
      console.log(`   - Admin:   http://localhost:${PORT}/api/admin\n`);
    });
  } catch (error) {
    console.error("❌ Không thể khởi động server:", error);
    process.exit(1);
  }
};

startServer();

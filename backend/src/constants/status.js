/**
 * Constants cho các trạng thái trong hệ thống
 * Sử dụng thay vì hardcode strings để tránh lỗi typo
 */

// ========================================
// TRẠNG THÁI LỚP HỌC
// ========================================
export const TRANG_THAI_LOP = {
  DANG_TUYEN: 'DangTuyen',    // Đang tuyển gia sư/học viên
  DANG_DAY: 'DangDay',         // Đang dạy (có hợp đồng và học viên)
  KET_THUC: 'KetThuc',         // Đã kết thúc khóa học
  HUY: 'Huy'                   // Đã hủy (không diễn ra)
};

// ========================================
// TRẠNG THÁI ĐĂNG KÝ HỌC VIÊN
// ========================================
export const TRANG_THAI_DANG_KY = {
  CHO_DUYET: 'ChoDuyet',       // Chờ duyệt
  DA_DUYET: 'DaDuyet',         // Đã duyệt, được học
  TU_CHOI: 'TuChoi',           // Bị từ chối
  HUY: 'Huy'                   // Học viên tự hủy
};

// ========================================
// TRẠNG THÁI HỢP ĐỒNG GIẢNG DẠY
// ========================================
export const TRANG_THAI_HOP_DONG = {
  DANG_DAY: 'DangDay',         // Đang giảng dạy
  DA_KET_THUC: 'DaKetThuc',    // Đã kết thúc hợp đồng
  TAM_DUNG: 'TamDung'          // Tạm dừng
};

// ========================================
// TRẠNG THÁI TÀI KHOẢN
// ========================================
export const TRANG_THAI_TAI_KHOAN = {
  ACTIVE: 'Active',            // Hoạt động
  LOCKED: 'Locked',            // Bị khóa
  UNVERIFIED: 'Unverified'     // Chưa xác thực
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Kiểm tra trạng thái lớp học có hợp lệ không
 */
export const isValidTrangThaiLop = (status) => 
  Object.values(TRANG_THAI_LOP).includes(status);

/**
 * Kiểm tra trạng thái đăng ký có hợp lệ không
 */
export const isValidTrangThaiDangKy = (status) => 
  Object.values(TRANG_THAI_DANG_KY).includes(status);

/**
 * Kiểm tra trạng thái hợp đồng có hợp lệ không
 */
export const isValidTrangThaiHopDong = (status) => 
  Object.values(TRANG_THAI_HOP_DONG).includes(status);

/**
 * Kiểm tra trạng thái tài khoản có hợp lệ không
 */
export const isValidTrangThaiTaiKhoan = (status) => 
  Object.values(TRANG_THAI_TAI_KHOAN).includes(status);

// ========================================
// TRẠNG THÁI TÍNH DOANH THU
// Chỉ tính doanh thu từ các lớp đã thực sự diễn ra
// ========================================
export const TRANG_THAI_TINH_DOANH_THU = [
  TRANG_THAI_LOP.DANG_DAY,
  TRANG_THAI_LOP.KET_THUC
];

// ========================================
// LABELS HIỂN THỊ (Vietnamese)
// ========================================
export const TRANG_THAI_LOP_LABELS = {
  [TRANG_THAI_LOP.DANG_TUYEN]: 'Đang Tuyển',
  [TRANG_THAI_LOP.DANG_DAY]: 'Đang Dạy',
  [TRANG_THAI_LOP.KET_THUC]: 'Đã Kết Thúc',
  [TRANG_THAI_LOP.HUY]: 'Đã Hủy'
};

export const TRANG_THAI_DANG_KY_LABELS = {
  [TRANG_THAI_DANG_KY.CHO_DUYET]: 'Chờ Duyệt',
  [TRANG_THAI_DANG_KY.DA_DUYET]: 'Đã Duyệt',
  [TRANG_THAI_DANG_KY.TU_CHOI]: 'Từ Chối',
  [TRANG_THAI_DANG_KY.HUY]: 'Đã Hủy'
};

export const TRANG_THAI_HOP_DONG_LABELS = {
  [TRANG_THAI_HOP_DONG.DANG_DAY]: 'Đang Dạy',
  [TRANG_THAI_HOP_DONG.DA_KET_THUC]: 'Đã Kết Thúc',
  [TRANG_THAI_HOP_DONG.TAM_DUNG]: 'Tạm Dừng'
};

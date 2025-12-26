# =============================================================================
# TEST PHASE 2 - FRONTEND UI
# Hướng dẫn test UI sau khi refactor
# =============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HƯỚNG DẪN TEST PHASE 2 - FRONTEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🌐 Frontend URL: http://localhost:3000" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "TEST 1: ADMIN DASHBOARD" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor White
Write-Host ""
Write-Host "1. Mở trình duyệt: http://localhost:3000" -ForegroundColor Gray
Write-Host "2. Đăng nhập Admin:" -ForegroundColor Gray
Write-Host "   - Email: admin@gmail.com" -ForegroundColor DarkGray
Write-Host "   - Password: 123456" -ForegroundColor DarkGray
Write-Host ""
Write-Host "3. Kiểm tra Dashboard có hiển thị:" -ForegroundColor Gray
Write-Host "   ✓ Lớp Đã Kết Thúc (stat card mới)" -ForegroundColor Green
Write-Host "   ✓ Lớp Đã Hủy (stat card mới)" -ForegroundColor Green
Write-Host "   ✓ Tổng Doanh Thu (giá trị đã fix)" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "TEST 2: QUẢN LÝ LỚP HỌC" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor White
Write-Host ""
Write-Host "1. Click vào menu 'Quản Lý Lớp Học'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Kiểm tra Filter dropdown có options:" -ForegroundColor Gray
Write-Host "   ✓ Tất cả trạng thái" -ForegroundColor Green
Write-Host "   ✓ Đang Tuyển" -ForegroundColor Green
Write-Host "   ✓ Đang Dạy" -ForegroundColor Green
Write-Host "   ✓ Đã Kết Thúc (option mới)" -ForegroundColor Green
Write-Host "   ✓ Đã Hủy (option mới)" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "TEST 3: KẾT THÚC LỚP" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor White
Write-Host ""
Write-Host "1. Chọn filter 'Đang Dạy'" -ForegroundColor Gray
Write-Host "2. Tìm lớp có trạng thái 'DangDay'" -ForegroundColor Gray
Write-Host "3. Kiểm tra button '🏁 Kết Thúc' có hiển thị" -ForegroundColor Gray
Write-Host "4. Click button 'Kết Thúc'" -ForegroundColor Gray
Write-Host "5. Xác nhận dialog" -ForegroundColor Gray
Write-Host "6. Verify:" -ForegroundColor Gray
Write-Host "   ✓ Toast 'Đã kết thúc lớp học thành công!'" -ForegroundColor Green
Write-Host "   ✓ Lớp biến mất khỏi list 'Đang Dạy'" -ForegroundColor Green
Write-Host "   ✓ Chọn filter 'Đã Kết Thúc' → lớp xuất hiện" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "TEST 4: HỦY LỚP" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor White
Write-Host ""
Write-Host "1. Chọn filter 'Đang Tuyển'" -ForegroundColor Gray
Write-Host "2. Tìm lớp có trạng thái 'DangTuyen'" -ForegroundColor Gray
Write-Host "3. Kiểm tra button '❌ Hủy' có hiển thị" -ForegroundColor Gray
Write-Host "4. Click button 'Hủy'" -ForegroundColor Gray
Write-Host "5. Nhập lý do hủy (ví dụ: 'Không đủ học viên')" -ForegroundColor Gray
Write-Host "6. Verify:" -ForegroundColor Gray
Write-Host "   ✓ Toast 'Đã hủy lớp học!'" -ForegroundColor Green
Write-Host "   ✓ Lớp biến mất khỏi list 'Đang Tuyển'" -ForegroundColor Green
Write-Host "   ✓ Chọn filter 'Đã Hủy' → lớp xuất hiện" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "TEST 5: DASHBOARD CẬP NHẬT" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor White
Write-Host ""
Write-Host "1. Quay lại Dashboard" -ForegroundColor Gray
Write-Host "2. Verify stats đã cập nhật:" -ForegroundColor Gray
Write-Host "   ✓ 'Lớp Đang Tuyển' giảm (nếu hủy lớp)" -ForegroundColor Green
Write-Host "   ✓ 'Lớp Đang Dạy' giảm (nếu kết thúc lớp)" -ForegroundColor Green
Write-Host "   ✓ 'Lớp Đã Kết Thúc' tăng" -ForegroundColor Green
Write-Host "   ✓ 'Lớp Đã Hủy' tăng" -ForegroundColor Green
Write-Host "   ✓ 'Tổng Doanh Thu' không đổi (không tính lớp hủy)" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "TEST 6: EDGE CASES" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor White
Write-Host ""
Write-Host "1. Thử kết thúc lớp đã kết thúc → Should show error" -ForegroundColor Gray
Write-Host "2. Thử hủy lớp đang dạy → Should NOT have button" -ForegroundColor Gray
Write-Host "3. Thử hủy lớp không nhập lý do → Should show warning" -ForegroundColor Gray
Write-Host "4. Filter 'Đã Kết Thúc' → Badge màu secondary/gray" -ForegroundColor Gray
Write-Host "5. Filter 'Đã Hủy' → Badge màu danger/red" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CHECKLIST TỔNG HỢP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor White
Write-Host ""

$checklist = @(
    "[ ] Dashboard có 2 stat cards mới (Đã Kết Thúc, Đã Hủy)",
    "[ ] Filter dropdown có 2 options mới (Đã Kết Thúc, Đã Hủy)",
    "[ ] Lớp 'DangDay' có button 'Kết Thúc'",
    "[ ] Lớp 'DangTuyen' có button 'Hủy'",
    "[ ] Kết thúc lớp thành công → trạng thái chuyển sang KetThuc",
    "[ ] Hủy lớp thành công → trạng thái chuyển sang Huy",
    "[ ] Dashboard stats cập nhật realtime",
    "[ ] Badge colors đúng cho từng trạng thái",
    "[ ] Toast notifications hiển thị đúng",
    "[ ] Edge cases được handle đúng"
)

foreach ($item in $checklist) {
    Write-Host "  $item" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 TIP: Mở DevTools (F12) → Console để xem logs" -ForegroundColor Yellow
Write-Host "💡 TIP: Mở DevTools → Network → XHR để xem API calls" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Bắt đầu test tại: http://localhost:3000" -ForegroundColor Green
Write-Host ""

# Open browser
$confirm = Read-Host "Mở trình duyệt ngay? (y/n)"
if ($confirm -eq "y") {
    Start-Process "http://localhost:3000"
    Write-Host "✅ Đã mở trình duyệt" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  📋 Test thủ công theo hướng dẫn trên" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

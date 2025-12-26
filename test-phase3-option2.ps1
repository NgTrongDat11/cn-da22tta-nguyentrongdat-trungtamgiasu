# ===================================================
# PHASE 3 OPTION 2 - UI ENHANCEMENT TEST SCRIPT
# Manual++ Approach với Bulk Actions
# ===================================================

Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  PHASE 3 OPTION 2 - UI ENHANCEMENT TEST GUIDE      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ===================================================
# BACKEND API TESTS
# ===================================================

Write-Host "📋 BACKEND API TESTS" -ForegroundColor Yellow
Write-Host "=" * 60
Write-Host ""

Write-Host "1️⃣  TEST API LẤY LỚP SẮP HẾT HẠN" -ForegroundColor Green
Write-Host "   GET http://localhost:5000/api/admin/lop-hoc/sap-het-han?days=7" -ForegroundColor Gray
Write-Host ""
Write-Host "   Test trong Postman/Bruno:" -ForegroundColor White
Write-Host "   • Method: GET" -ForegroundColor Gray
Write-Host "   • URL: /api/admin/lop-hoc/sap-het-han?days=7" -ForegroundColor Gray
Write-Host "   • Headers: Authorization: Bearer <admin_token>" -ForegroundColor Gray
Write-Host ""
Write-Host "   Expected Response:" -ForegroundColor White
Write-Host "   {" -ForegroundColor Gray
Write-Host "     data: [" -ForegroundColor Gray
Write-Host "       {" -ForegroundColor Gray
Write-Host "         maLop, tenLop, tenMon, ngayKetThuc," -ForegroundColor Gray
Write-Host "         daysRemaining, giaSu, soHocVien, hocPhi" -ForegroundColor Gray
Write-Host "       }" -ForegroundColor Gray
Write-Host "     ]" -ForegroundColor Gray
Write-Host "   }" -ForegroundColor Gray
Write-Host ""

Write-Host "2️⃣  TEST API KẾT THÚC HÀNG LOẠT" -ForegroundColor Green
Write-Host "   PUT http://localhost:5000/api/lop-hoc/ket-thuc-hang-loat" -ForegroundColor Gray
Write-Host ""
Write-Host "   Test trong Postman/Bruno:" -ForegroundColor White
Write-Host "   • Method: PUT" -ForegroundColor Gray
Write-Host "   • URL: /api/lop-hoc/ket-thuc-hang-loat" -ForegroundColor Gray
Write-Host "   • Headers: Authorization: Bearer <admin_token>" -ForegroundColor Gray
Write-Host "   • Body (JSON):" -ForegroundColor Gray
Write-Host "     {" -ForegroundColor Gray
Write-Host "       `"maLopList`": [1, 2, 3]," -ForegroundColor Gray
Write-Host "       `"lyDoKetThuc`": `"Test bulk finish`"" -ForegroundColor Gray
Write-Host "     }" -ForegroundColor Gray
Write-Host ""
Write-Host "   Expected Response:" -ForegroundColor White
Write-Host "   { success: true, data: { count: 3 } }" -ForegroundColor Gray
Write-Host ""

# ===================================================
# FRONTEND UI TESTS
# ===================================================

Write-Host "🖥️  FRONTEND UI TESTS" -ForegroundColor Yellow
Write-Host "=" * 60
Write-Host ""

Write-Host "3️⃣  TEST DASHBOARD - LỚP CẦN XỬ LÝ" -ForegroundColor Green
Write-Host "   URL: http://localhost:3000/admin/dashboard" -ForegroundColor Gray
Write-Host ""
Write-Host "   ✅ Kiểm tra:" -ForegroundColor White
Write-Host "   [ ] Có stat card `"⚠️ Lớp Cần Xử Lý`"" -ForegroundColor Gray
Write-Host "   [ ] Màu orange/warning với animation pulse" -ForegroundColor Gray
Write-Host "   [ ] Hiển thị số lượng lớp sắp hết hạn (7 ngày)" -ForegroundColor Gray
Write-Host "   [ ] Có text nhỏ `"(Sắp hết hạn trong 7 ngày)`"" -ForegroundColor Gray
Write-Host ""

Write-Host "4️⃣  TEST ADMIN CLASSES - SECTION SẮP HẾT HẠN" -ForegroundColor Green
Write-Host "   URL: http://localhost:3000/admin/classes" -ForegroundColor Gray
Write-Host ""
Write-Host "   ✅ Kiểm tra:" -ForegroundColor White
Write-Host "   [ ] Có alert box màu vàng phía trên table" -ForegroundColor Gray
Write-Host "   [ ] Hiển thị danh sách lớp sắp hết hạn" -ForegroundColor Gray
Write-Host "   [ ] Mỗi lớp có:" -ForegroundColor Gray
Write-Host "       - Tên lớp, môn học, gia sư" -ForegroundColor Gray
Write-Host "       - Ngày kết thúc (dd/mm/yyyy)" -ForegroundColor Gray
Write-Host "       - Badge countdown (vd: `"2 ngày`")" -ForegroundColor Gray
Write-Host "       - Badge màu đỏ nếu còn ≤2 ngày" -ForegroundColor Gray
Write-Host "       - Button `"🏁 Kết Thúc Ngay`"" -ForegroundColor Gray
Write-Host ""

Write-Host "5️⃣  TEST SORT BY NGÀY KẾT THÚC" -ForegroundColor Green
Write-Host "   URL: http://localhost:3000/admin/classes" -ForegroundColor Gray
Write-Host ""
Write-Host "   ✅ Kiểm tra:" -ForegroundColor White
Write-Host "   [ ] Có dropdown sort mới bên cạnh filter trạng thái" -ForegroundColor Gray
Write-Host "   [ ] Options: `"Sắp xếp mặc định`", `"Gần hết hạn nhất`"" -ForegroundColor Gray
Write-Host "   [ ] Chọn `"Gần hết hạn nhất`":" -ForegroundColor Gray
Write-Host "       → Table sắp xếp lớp theo ngayKetThuc (gần nhất → xa nhất)" -ForegroundColor Gray
Write-Host ""

Write-Host "6️⃣  TEST BULK SELECTION & FINISH" -ForegroundColor Green
Write-Host "   URL: http://localhost:3000/admin/classes" -ForegroundColor Gray
Write-Host ""
Write-Host "   ✅ Kiểm tra:" -ForegroundColor White
Write-Host "   [ ] Cột checkbox đầu tiên trong table" -ForegroundColor Gray
Write-Host "   [ ] Header có checkbox `"Select All`"" -ForegroundColor Gray
Write-Host "   [ ] Click checkbox header → chọn tất cả lớp" -ForegroundColor Gray
Write-Host "   [ ] Click lại → bỏ chọn tất cả" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Chọn 2-3 lớp DangDay:" -ForegroundColor Gray
Write-Host "       → Hiện banner xanh phía trên table" -ForegroundColor Gray
Write-Host "       → Text: `"X lớp đã chọn`"" -ForegroundColor Gray
Write-Host "       → 2 buttons: `"Bỏ chọn`" và `"🏁 Kết Thúc Hàng Loạt`"" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Click `"Kết Thúc Hàng Loạt`":" -ForegroundColor Gray
Write-Host "       → Prompt nhập lý do" -ForegroundColor Gray
Write-Host "       → Nhập lý do → Click OK" -ForegroundColor Gray
Write-Host "       → Toast success: `"Đã kết thúc X lớp học`"" -ForegroundColor Gray
Write-Host "       → Table refresh" -ForegroundColor Gray
Write-Host "       → Stats update" -ForegroundColor Gray
Write-Host "       → Alert box update (giảm số lớp)" -ForegroundColor Gray
Write-Host ""

Write-Host "7️⃣  TEST FINISH NGAY TỪ ALERT BOX" -ForegroundColor Green
Write-Host "   URL: http://localhost:3000/admin/classes" -ForegroundColor Gray
Write-Host ""
Write-Host "   ✅ Kiểm tra:" -ForegroundColor White
Write-Host "   [ ] Trong alert box lớp sắp hết hạn" -ForegroundColor Gray
Write-Host "   [ ] Click button `"🏁 Kết Thúc Ngay`" trên 1 lớp" -ForegroundColor Gray
Write-Host "   [ ] Hiện confirm dialog" -ForegroundColor Gray
Write-Host "   [ ] Confirm → Lớp chuyển sang KetThuc" -ForegroundColor Gray
Write-Host "   [ ] Alert box update (bỏ lớp vừa kết thúc)" -ForegroundColor Gray
Write-Host "   [ ] Dashboard stats update" -ForegroundColor Gray
Write-Host ""

# ===================================================
# EDGE CASES
# ===================================================

Write-Host "⚠️  EDGE CASES TEST" -ForegroundColor Yellow
Write-Host "=" * 60
Write-Host ""

Write-Host "8️⃣  TEST VALIDATION" -ForegroundColor Green
Write-Host ""
Write-Host "   ✅ Kiểm tra:" -ForegroundColor White
Write-Host "   [ ] Bulk finish khi chưa chọn lớp nào" -ForegroundColor Gray
Write-Host "       → Toast warning: `"Vui lòng chọn ít nhất một lớp`"" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Bulk finish nhập lý do trống" -ForegroundColor Gray
Write-Host "       → Toast warning: `"Vui lòng nhập lý do`"" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Bulk finish lớp không phải DangDay" -ForegroundColor Gray
Write-Host "       → Error: `"Lớp XXX không đang dạy`"" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Alert box trống khi không có lớp sắp hết hạn" -ForegroundColor Gray
Write-Host "       → Alert box không hiển thị" -ForegroundColor Gray
Write-Host ""

# ===================================================
# PERFORMANCE & UX
# ===================================================

Write-Host "⚡ PERFORMANCE & UX TEST" -ForegroundColor Yellow
Write-Host "=" * 60
Write-Host ""

Write-Host "9️⃣  TEST REAL-TIME UPDATES" -ForegroundColor Green
Write-Host ""
Write-Host "   ✅ Kiểm tra:" -ForegroundColor White
Write-Host "   [ ] Kết thúc 1 lớp → Dashboard stats update ngay" -ForegroundColor Gray
Write-Host "   [ ] Bulk finish → Alert box update ngay" -ForegroundColor Gray
Write-Host "   [ ] Sort thay đổi → Table re-render smooth" -ForegroundColor Gray
Write-Host ""

Write-Host "🔟 TEST RESPONSIVE & ACCESSIBILITY" -ForegroundColor Green
Write-Host ""
Write-Host "   ✅ Kiểm tra:" -ForegroundColor White
Write-Host "   [ ] Alert box scroll ngang trên mobile" -ForegroundColor Gray
Write-Host "   [ ] Checkbox size đủ lớn để click" -ForegroundColor Gray
Write-Host "   [ ] Buttons không bị chồng lên nhau" -ForegroundColor Gray
Write-Host "   [ ] Countdown badge dễ đọc" -ForegroundColor Gray
Write-Host ""

# ===================================================
# MANUAL CHECKLIST
# ===================================================

Write-Host "📝 MANUAL TEST CHECKLIST" -ForegroundColor Yellow
Write-Host "=" * 60
Write-Host ""

$checklist = @(
    "✓ Backend API /sap-het-han hoạt động",
    "✓ Backend API /ket-thuc-hang-loat hoạt động",
    "✓ Dashboard có stat card Lớp Cần Xử Lý",
    "✓ Alert box hiển thị lớp sắp hết hạn",
    "✓ Countdown badge màu sắc đúng",
    "✓ Sort by ngày kết thúc hoạt động",
    "✓ Checkbox select all/individual work",
    "✓ Bulk selection banner hiển thị",
    "✓ Bulk finish hoạt động đúng",
    "✓ Finish ngay từ alert box work",
    "✓ Stats update realtime",
    "✓ Alert box update sau finish",
    "✓ Validations hoạt động",
    "✓ Error handling đầy đủ",
    "✓ Toast notifications rõ ràng"
)

foreach ($item in $checklist) {
    Write-Host "  [ ] $item" -ForegroundColor Gray
}

Write-Host ""

# ===================================================
# OPENING BROWSER
# ===================================================

Write-Host "🌐 OPENING BROWSER..." -ForegroundColor Yellow
Write-Host ""

Start-Sleep -Seconds 2

Start-Process "http://localhost:3000/admin/dashboard"
Start-Sleep -Milliseconds 500
Start-Process "http://localhost:3000/admin/classes"

Write-Host "✅ Browsers opened!" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Login as Admin" -ForegroundColor White
Write-Host "   2. Follow checklist above" -ForegroundColor White
Write-Host "   3. Report any issues" -ForegroundColor White
Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan

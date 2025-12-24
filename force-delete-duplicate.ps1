# FORCE DELETE MÔN TOÁN TRÙNG
# Xóa môn "Toán  Học" (2 dấu cách) bằng cách cập nhật tên thành một tên tạm 
# rồi xóa, hoặc check lại dữ liệu

Write-Host "🔧 KIỂM TRA VÀ XÓA MÔN TRÙNG" -ForegroundColor Cyan
Write-Host ""

$oldSubjectId = "e744ed9c-ee51-48fc-8e38-0ce8e410aeac"  # "Toán  Học" (2 dấu cách)
$keepSubjectId = "3601457b-3a0b-401d-936b-2638c2f4940a" # "Toán Học" (1 dấu cách)

# Đăng nhập
Write-Host "🔐 Đăng nhập admin..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method Post -ContentType "application/json" `
    -Body '{"email":"admin@trungtamgiasu.vn","matKhau":"123456"}'
$token = $loginResponse.data.token
$headers = @{Authorization = "Bearer $token"}
Write-Host "   ✅ Đăng nhập thành công`n" -ForegroundColor Green

# Lấy chi tiết môn cũ
Write-Host "🔍 Kiểm tra môn 'Toán  Học'..." -ForegroundColor Yellow
try {
    $oldSubjectDetail = Invoke-RestMethod -Uri "http://localhost:5000/api/mon-hoc/$oldSubjectId" -Method Get
    Write-Host "   ✅ Tìm thấy: $($oldSubjectDetail.data.tenMon)" -ForegroundColor Green
    Write-Host "      Mô tả: $($oldSubjectDetail.data.moTa)" -ForegroundColor Gray
    Write-Host "      Số lớp (theo count): $($oldSubjectDetail.data.soLopHoc)`n" -ForegroundColor Gray
    
    # Lấy chi tiết các lớp học
    if ($oldSubjectDetail.data.lopHocs -and $oldSubjectDetail.data.lopHocs.Count -gt 0) {
        Write-Host "   📚 Các lớp học:" -ForegroundColor Yellow
        $oldSubjectDetail.data.lopHocs | ForEach-Object {
            Write-Host "      - $($_.tenLop) (ID: $($_.maLop))" -ForegroundColor Gray
        }
        Write-Host ""
        
        # Chuyển từng lớp sang môn mới
        Write-Host "🔄 Chuyển các lớp sang môn 'Toán Học'..." -ForegroundColor Yellow
        foreach ($class in $oldSubjectDetail.data.lopHocs) {
            try {
                # Lấy thông tin đầy đủ của lớp
                $classDetail = Invoke-RestMethod -Uri "http://localhost:5000/api/lop-hoc/$($class.maLop)" -Method Get
                $classData = $classDetail.data
                
                # Update với đầy đủ thông tin
                $updateBody = @{
                    tenLop = $classData.tenLop
                    maMon = $keepSubjectId
                    hocPhi = [double]$classData.hocPhi
                    hinhThuc = $classData.hinhThuc
                    moTa = $classData.moTa
                } | ConvertTo-Json
                
                Invoke-RestMethod -Uri "http://localhost:5000/api/lop-hoc/$($class.maLop)" `
                    -Method Put -Headers $headers `
                    -ContentType "application/json" -Body $updateBody | Out-Null
                
                Write-Host "      ✅ Đã chuyển: $($class.tenLop)" -ForegroundColor Green
            } catch {
                Write-Host "      ❌ Lỗi: $_" -ForegroundColor Red
            }
        }
        Write-Host ""
    } else {
        Write-Host "   ℹ️ Không có lớp học nào (hoặc API không trả về)`n" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Không tìm thấy môn này`n" -ForegroundColor Red
}

# Thử đổi tên môn cũ trước khi xóa (để tránh conflict)
Write-Host "📝 Đổi tên môn 'Toán  Học' thành 'Toán Cũ (Xóa)'..." -ForegroundColor Yellow
try {
    $updateBody = @{
        tenMon = "Toán Cũ (Xóa)"
        moTa = "Môn trùng - cần xóa"
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "http://localhost:5000/api/mon-hoc/$oldSubjectId" `
        -Method Put -Headers $headers `
        -ContentType "application/json" -Body $updateBody | Out-Null
    Write-Host "   ✅ Đã đổi tên`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Lỗi: $_`n" -ForegroundColor Red
}

# Xóa
Write-Host "🗑️ Xóa môn..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/mon-hoc/$oldSubjectId" `
        -Method Delete -Headers $headers | Out-Null
    Write-Host "   ✅ Đã xóa thành công!`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Vẫn không thể xóa: $_" -ForegroundColor Red
    Write-Host "   ℹ️ Có thể cần xóa trực tiếp từ database`n" -ForegroundColor Yellow
}

# Kiểm tra lại
Write-Host "🔍 Kiểm tra lại danh sách môn học..." -ForegroundColor Yellow
$finalSubjects = Invoke-RestMethod -Uri "http://localhost:5000/api/mon-hoc/all" -Method Get
Write-Host ""
Write-Host "📚 Danh sách $($finalSubjects.data.Count) môn học:" -ForegroundColor Cyan
$finalSubjects.data | Sort-Object tenMon | ForEach-Object {
    $color = if ($_.tenMon -like "*Toán*") { "Yellow" } else { "White" }
    Write-Host "   - $($_.tenMon): $($_.soLopHoc) lớp" -ForegroundColor $color
}

Write-Host ""
Write-Host "✅ HOÀN TẤT!" -ForegroundColor Green

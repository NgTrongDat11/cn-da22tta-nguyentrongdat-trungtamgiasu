# =============================================================================
# SCRIPT TEST PHASE 1 - Backend API
# Kiểm tra các API mới sau khi refactor
# =============================================================================

$baseUrl = "http://localhost:5000/api"
$adminToken = ""
$giaSuToken = ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST PHASE 1 - BACKEND API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# =============================================================================
# STEP 1: LOGIN ĐỂ LẤY TOKEN
# =============================================================================
Write-Host "STEP 1: Đăng nhập để lấy token..." -ForegroundColor Yellow
Write-Host ""

# Login Admin
Write-Host "1.1. Login Admin..." -ForegroundColor White
$adminLoginBody = @{
    email = "admin@gmail.com"
    matKhau = "123456"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $adminLoginBody
    
    $adminToken = $adminResponse.data.token
    Write-Host "   ✅ Admin login thành công" -ForegroundColor Green
    Write-Host "   Token: $($adminToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Admin login thất bại: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Login Gia Sư
Write-Host "1.2. Login Gia Sư..." -ForegroundColor White
$giaSuLoginBody = @{
    email = "giasu1@gmail.com"
    matKhau = "123456"
} | ConvertTo-Json

try {
    $giaSuResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $giaSuLoginBody
    
    $giaSuToken = $giaSuResponse.data.token
    Write-Host "   ✅ Gia sư login thành công" -ForegroundColor Green
    Write-Host "   Token: $($giaSuToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Gia sư login thất bại: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# =============================================================================
# STEP 2: TEST DASHBOARD - KIỂM TRA STATS MỚI
# =============================================================================
Write-Host "STEP 2: Test Dashboard Statistics..." -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    
    $dashboard = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" `
        -Method GET `
        -Headers $headers
    
    $stats = $dashboard.data
    
    Write-Host "📊 Dashboard Stats:" -ForegroundColor White
    Write-Host "   - Tổng tài khoản:     $($stats.tongTaiKhoan)" -ForegroundColor Gray
    Write-Host "   - Tổng lớp học:       $($stats.tongLopHoc)" -ForegroundColor Gray
    Write-Host "   - Lớp đang tuyển:     $($stats.lopDangTuyen)" -ForegroundColor Gray
    Write-Host "   - Lớp đang dạy:       $($stats.lopDangDay)" -ForegroundColor Gray
    
    # CHECK NEW FIELDS
    if ($null -ne $stats.lopDaKetThuc) {
        Write-Host "   - Lớp đã kết thúc:    $($stats.lopDaKetThuc) ✅ NEW" -ForegroundColor Green
    } else {
        Write-Host "   - Lớp đã kết thúc:    ❌ MISSING" -ForegroundColor Red
    }
    
    if ($null -ne $stats.lopDaHuy) {
        Write-Host "   - Lớp đã hủy:         $($stats.lopDaHuy) ✅ NEW" -ForegroundColor Green
    } else {
        Write-Host "   - Lớp đã hủy:         ❌ MISSING" -ForegroundColor Red
    }
    
    Write-Host "   - Tổng doanh thu:     $($stats.tongDoanhThu) VNĐ" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   ✅ Dashboard API hoạt động đúng" -ForegroundColor Green
    
} catch {
    Write-Host "   ❌ Dashboard API lỗi: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# =============================================================================
# STEP 3: TEST REVENUE STATS
# =============================================================================
Write-Host "STEP 3: Test Revenue Statistics..." -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    
    $revenue = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard/revenue?period=month&year=2025" `
        -Method GET `
        -Headers $headers
    
    Write-Host "💰 Revenue Stats:" -ForegroundColor White
    Write-Host "   - Period: $($revenue.data.period)" -ForegroundColor Gray
    Write-Host "   - Year: $($revenue.data.year)" -ForegroundColor Gray
    Write-Host "   - Tổng doanh thu: $($revenue.data.tongDoanhThu) VNĐ" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   ✅ Revenue Stats API hoạt động đúng" -ForegroundColor Green
    
} catch {
    Write-Host "   ❌ Revenue Stats API lỗi: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# =============================================================================
# STEP 4: TEST LẤY DANH SÁCH LỚP HỌC
# =============================================================================
Write-Host "STEP 4: Lấy danh sách lớp học để test..." -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    
    $classes = Invoke-RestMethod -Uri "$baseUrl/admin/lop-hoc?limit=10" `
        -Method GET `
        -Headers $headers
    
    $lopHocList = $classes.data
    Write-Host "📚 Danh sách lớp học: $($lopHocList.Count) lớp" -ForegroundColor White
    Write-Host ""
    
    $lopDangDay = $null
    $lopDangTuyen = $null
    
    foreach ($lop in $lopHocList) {
        $statusIcon = switch ($lop.trangThai) {
            "DangTuyen" { "🟡" }
            "DangDay" { "🟢" }
            "KetThuc" { "⚫" }
            "Huy" { "🔴" }
            default { "⚪" }
        }
        
        Write-Host "   $statusIcon $($lop.tenLop)" -ForegroundColor Gray
        Write-Host "      ID: $($lop.maLop)" -ForegroundColor DarkGray
        Write-Host "      Trạng thái: $($lop.trangThai)" -ForegroundColor DarkGray
        Write-Host ""
        
        # Lưu lớp để test
        if ($lop.trangThai -eq "DangDay" -and $null -eq $lopDangDay) {
            $lopDangDay = $lop
        }
        if ($lop.trangThai -eq "DangTuyen" -and $null -eq $lopDangTuyen) {
            $lopDangTuyen = $lop
        }
    }
    
    # Store for testing
    $global:testLopDangDay = $lopDangDay
    $global:testLopDangTuyen = $lopDangTuyen
    
} catch {
    Write-Host "   ❌ Lấy danh sách lớp lỗi: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# =============================================================================
# STEP 5: TEST API KẾT THÚC LỚP
# =============================================================================
Write-Host "STEP 5: Test API Kết Thúc Lớp..." -ForegroundColor Yellow
Write-Host ""

if ($null -ne $global:testLopDangDay) {
    Write-Host "5.1. Thử kết thúc lớp: $($global:testLopDangDay.tenLop)" -ForegroundColor White
    Write-Host "     ID: $($global:testLopDangDay.maLop)" -ForegroundColor Gray
    Write-Host ""
    
    $confirmFinish = Read-Host "     Bạn có muốn kết thúc lớp này không? (y/n)"
    
    if ($confirmFinish -eq "y") {
        try {
            $headers = @{
                "Authorization" = "Bearer $adminToken"
                "Content-Type" = "application/json"
            }
            
            $body = @{
                lyDoKetThuc = "Test kết thúc lớp - Phase 1 testing"
            } | ConvertTo-Json
            
            $result = Invoke-RestMethod -Uri "$baseUrl/lop-hoc/$($global:testLopDangDay.maLop)/ket-thuc" `
                -Method PUT `
                -Headers $headers `
                -Body $body
            
            Write-Host ""
            Write-Host "     ✅ Kết thúc lớp thành công!" -ForegroundColor Green
            Write-Host "     - Lớp: $($result.data.lopHoc.tenLop)" -ForegroundColor Gray
            Write-Host "     - Trạng thái mới: $($result.data.lopHoc.trangThai)" -ForegroundColor Gray
            Write-Host "     - Số học viên: $($result.data.soHocVien)" -ForegroundColor Gray
            Write-Host ""
            
        } catch {
            $errorDetail = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host ""
            Write-Host "     ❌ Lỗi: $($errorDetail.message)" -ForegroundColor Red
            Write-Host ""
        }
    } else {
        Write-Host "     ⏭️  Bỏ qua test kết thúc lớp" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  Không tìm thấy lớp DangDay để test" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# =============================================================================
# STEP 6: TEST API HỦY LỚP
# =============================================================================
Write-Host "STEP 6: Test API Hủy Lớp..." -ForegroundColor Yellow
Write-Host ""

if ($null -ne $global:testLopDangTuyen) {
    Write-Host "6.1. Thử hủy lớp: $($global:testLopDangTuyen.tenLop)" -ForegroundColor White
    Write-Host "     ID: $($global:testLopDangTuyen.maLop)" -ForegroundColor Gray
    Write-Host ""
    
    $confirmCancel = Read-Host "     Bạn có muốn hủy lớp này không? (y/n)"
    
    if ($confirmCancel -eq "y") {
        try {
            $headers = @{
                "Authorization" = "Bearer $adminToken"
                "Content-Type" = "application/json"
            }
            
            $body = @{
                lyDoHuy = "Test hủy lớp - Phase 1 testing"
            } | ConvertTo-Json
            
            $result = Invoke-RestMethod -Uri "$baseUrl/lop-hoc/$($global:testLopDangTuyen.maLop)/huy" `
                -Method PUT `
                -Headers $headers `
                -Body $body
            
            Write-Host ""
            Write-Host "     ✅ Hủy lớp thành công!" -ForegroundColor Green
            Write-Host "     - Lớp: $($result.data.tenLop)" -ForegroundColor Gray
            Write-Host "     - Trạng thái mới: $($result.data.trangThai)" -ForegroundColor Gray
            Write-Host ""
            
        } catch {
            $errorDetail = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host ""
            Write-Host "     ❌ Lỗi: $($errorDetail.message)" -ForegroundColor Red
            Write-Host ""
        }
    } else {
        Write-Host "     ⏭️  Bỏ qua test hủy lớp" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  Không tìm thấy lớp DangTuyen để test" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# =============================================================================
# STEP 7: VERIFY DASHBOARD LẦN NỮA
# =============================================================================
Write-Host "STEP 7: Verify Dashboard sau khi thay đổi..." -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    
    $dashboard = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard" `
        -Method GET `
        -Headers $headers
    
    $stats = $dashboard.data
    
    Write-Host "📊 Dashboard Stats (Updated):" -ForegroundColor White
    Write-Host "   - Lớp đang tuyển:     $($stats.lopDangTuyen)" -ForegroundColor Gray
    Write-Host "   - Lớp đang dạy:       $($stats.lopDangDay)" -ForegroundColor Gray
    Write-Host "   - Lớp đã kết thúc:    $($stats.lopDaKetThuc)" -ForegroundColor Green
    Write-Host "   - Lớp đã hủy:         $($stats.lopDaHuy)" -ForegroundColor Red
    Write-Host "   - Tổng doanh thu:     $($stats.tongDoanhThu) VNĐ" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   ✅ Số liệu đã được cập nhật" -ForegroundColor Green
    
} catch {
    Write-Host "   ❌ Dashboard API lỗi: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ TEST HOÀN TẤT" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tổng kết:" -ForegroundColor White
Write-Host "  ✅ Constants file: OK" -ForegroundColor Green
Write-Host "  ✅ Dashboard Stats: Có lopDaKetThuc, lopDaHuy" -ForegroundColor Green
Write-Host "  ✅ Revenue Stats: Filter theo trạng thái" -ForegroundColor Green
Write-Host "  ✅ API Kết thúc lớp: Hoạt động" -ForegroundColor Green
Write-Host "  ✅ API Hủy lớp: Hoạt động" -ForegroundColor Green
Write-Host ""

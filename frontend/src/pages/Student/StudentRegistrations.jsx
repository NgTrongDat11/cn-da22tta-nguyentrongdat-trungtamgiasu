/**
 * STUDENT - ĐĂNG KÝ CỦA TÔI
 */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import apiClient from '../../api/client';
import './Student.css';

const StudentRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const response = await apiClient.get('/hoc-vien/dang-ky');
      setRegistrations(response.data.data || []);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy đăng ký này?')) return;
    
    try {
      await apiClient.delete(`/hoc-vien/dang-ky/${id}`);
      toast.success('Đã hủy đăng ký thành công');
      loadRegistrations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi hủy đăng ký');
    }
  };

  if (loading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Đăng Ký Của Tôi</h1>
          <p>Quản lý các lớp học đã đăng ký</p>
        </div>

        {registrations.length === 0 ? (
          <div className="empty-state-box">
            <p>Bạn chưa đăng ký lớp học nào</p>
            <a href="/student/classes" className="btn btn-primary">Tìm Lớp Học</a>
          </div>
        ) : (
          <div className="registrations-list">
            {registrations.map((reg) => (
              <div key={reg.maDangKy} className="registration-card">
                <div className="reg-status">
                  <span className={`badge-lg badge-${reg.trangThai.toLowerCase()}`}>
                    {reg.trangThai === 'ChoDuyet' ? '⏳ Chờ Duyệt' :
                     reg.trangThai === 'DaDuyet' ? '✅ Đã Duyệt' :
                     reg.trangThai === 'TuChoi' ? '❌ Từ Chối' :
                     reg.trangThai === 'DaHuy' ? '🚫 Đã Hủy' : reg.trangThai}
                  </span>
                </div>
                <div className="reg-content">
                  <h3>{reg.lopHoc?.tenLop}</h3>
                  <div className="reg-details">
                    <p>📚 Môn học: {reg.lopHoc?.monHoc?.tenMon}</p>
                    <p>👨‍🏫 Gia sư: {reg.lopHoc?.hopDongs?.[0]?.giaSu?.hoTen || 'Chưa có gia sư'}</p>
                    <p>💰 Học phí: {formatCurrency(reg.lopHoc?.hocPhi)}</p>
                    <p>📍 Hình thức: {reg.lopHoc?.hinhThuc}</p>
                    <p>🕐 Đăng ký lúc: {new Date(reg.ngayDangKy).toLocaleString('vi-VN')}</p>
                  </div>
                  {reg.ghiChu && (
                    <div className="reg-note">
                      <strong>Ghi chú:</strong> {reg.ghiChu}
                    </div>
                  )}
                </div>
                <div className="reg-actions">
                  {reg.trangThai === 'ChoDuyet' && (
                    <button
                      onClick={() => handleCancel(reg.maDangKy)}
                      className="btn btn-danger btn-sm"
                    >
                      Hủy Đăng Ký
                    </button>
                  )}
                  {reg.trangThai === 'TuChoi' && reg.lyDoTuChoi && (
                    <div className="reject-reason">
                      <strong>Lý do từ chối:</strong> {reg.lyDoTuChoi}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount || 0);
};

export default StudentRegistrations;

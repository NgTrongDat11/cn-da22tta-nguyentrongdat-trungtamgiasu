/**
 * TUTOR - QUẢN LÝ ĐĂNG KÝ LỚP HỌC
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { classAPI } from '../../api/services';
import './Tutor.css';

const TutorClassRegistrations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async (skipClassData = false) => {
    try {
      if (skipClassData) {
        // Only reload registrations
        const registrations = await classAPI.getClassRegistrations(id);
        setRegistrations(registrations || []);
      } else {
        // Load both class and registrations
        const [classData, registrations] = await Promise.all([
          classAPI.getClassDetail(id),
          classAPI.getClassRegistrations(id),
        ]);
        setClassData(classData);
        setRegistrations(registrations || []);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      toast.error('Không thể tải dữ liệu');
      navigate('/tutor/classes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (regId) => {
    if (!window.confirm('Bạn có chắc muốn duyệt đăng ký này?')) return;

    try {
      const result = await classAPI.approveRegistration(id, regId, {
        trangThai: 'DaDuyet',
      });
      
      console.log('✅ Approve result:', result);
      toast.success('Đã duyệt đăng ký');
      
      // Update class data with new soHocVien and isFull from API response
      if (result?.lopHoc) {
        console.log('📊 Updating classData:', result.lopHoc);
        setClassData(prev => ({
          ...prev,
          soHocVien: result.lopHoc.soHocVien,
          isFull: result.lopHoc.isFull,
          trangThai: result.lopHoc.trangThai || prev?.trangThai,
        }));
        // Reload only registrations list, keep updated classData
        loadData(true);
      } else {
        console.warn('⚠️ No lopHoc in result, reloading everything');
        // Fallback: reload everything if API doesn't return lopHoc
        loadData(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi duyệt đăng ký');
    }
  };

  const handleReject = async (regId) => {
    const lyDo = window.prompt('Nhập lý do từ chối:');
    if (!lyDo) return;

    try {
      const result = await classAPI.approveRegistration(id, regId, {
        trangThai: 'TuChoi',
        lyDoTuChoi: lyDo,
      });
      
      toast.success('Đã từ chối đăng ký');
      
      // Update class data if provided (reject might free up slot)
      if (result?.lopHoc) {
        setClassData(prev => ({
          ...prev,
          soHocVien: result.lopHoc.soHocVien,
          isFull: result.lopHoc.isFull,
          trangThai: result.lopHoc.trangThai || prev?.trangThai,
        }));
        loadData(true);
      } else {
        loadData(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi từ chối đăng ký');
    }
  };

  if (loading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-content">
        <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline mb-3">
          ← Quay lại
        </button>

        <div className="page-header">
          <div>
            <h1>Đơn Đăng Ký</h1>
            <p>{classData?.tenLop}</p>
            <p style={{fontSize: '0.9em', color: '#666', marginTop: '4px'}}>
              👥 Học viên: {classData?.soHocVien || 0}/1 (lớp 1-1)
              {classData?.isFull && <span style={{color: '#e74c3c', marginLeft: '8px'}}>✓ Đã đủ</span>}
              {classData?.trangThai && (
                <span style={{marginLeft: '12px'}}>• Trạng thái: {classData.trangThai}</span>
              )}
            </p>
          </div>
        </div>

        {registrations.length === 0 ? (
          <div className="empty-state-box">
            <p>Chưa có đơn đăng ký nào</p>
          </div>
        ) : (
          <div className="registrations-list">
            {registrations.map((reg) => (
              <div key={reg.maDangKy} className="registration-card">
                <div className="reg-header">
                  <div className="reg-student">
                    <h3>{reg.hocVien?.hoTen}</h3>
                    <p>📧 {reg.hocVien?.taiKhoan?.email}</p>
                    {reg.hocVien?.soDienThoai && (
                      <p>📞 {reg.hocVien.soDienThoai}</p>
                    )}
                  </div>
                  <span className={`badge-lg badge-${reg.trangThai.toLowerCase()}`}>
                    {reg.trangThai}
                  </span>
                </div>

                <div className="reg-content">
                  <p>🕐 Đăng ký lúc: {new Date(reg.ngayDangKy).toLocaleString('vi-VN')}</p>
                  {reg.ghiChu && (
                    <div className="reg-note">
                      <strong>Ghi chú từ học viên:</strong>
                      <p>{reg.ghiChu}</p>
                    </div>
                  )}
                </div>

                {reg.trangThai === 'ChoDuyet' && (
                  <div className="reg-actions">
                    <button
                      onClick={() => handleReject(reg.maDangKy)}
                      className="btn btn-danger"
                    >
                      ❌ Từ Chối
                    </button>
                    <button
                      onClick={() => handleApprove(reg.maDangKy)}
                      className="btn btn-primary"
                      disabled={classData?.isFull}
                      title={classData?.isFull ? 'Lớp 1-1 đã đủ học viên' : 'Duyệt đăng ký'}
                    >
                      ✅ Duyệt {classData?.isFull && '(Đã đủ)'}
                    </button>
                  </div>
                )}

                {reg.trangThai === 'TuChoi' && reg.lyDoTuChoi && (
                  <div className="reject-reason">
                    <strong>Lý do từ chối:</strong> {reg.lyDoTuChoi}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TutorClassRegistrations;

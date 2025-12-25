/**
 * STUDENT - CHI TIẾT LỚP HỌC
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import apiClient from '../../api/client';
import './Student.css';

const StudentClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [yeuCauThem, setYeuCauThem] = useState('');

  useEffect(() => {
    loadClassDetail();
  }, [id]);

  const loadClassDetail = async () => {
    try {
      const response = await apiClient.get(`/lop-hoc/${id}`);
      setClassData(response.data.data);
    } catch (err) {
      console.error('Failed to load class:', err);
      toast.error('Không tìm thấy lớp học');
      navigate('/student/classes');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isFull) {
      toast.error('Lớp 1-1 đã có học viên');
      return;
    }
    if (!isRecruiting) {
      toast.error('Lớp đã ngừng tuyển');
      return;
    }
    setSubmitting(true);

    try {
      await apiClient.post('/hoc-vien/dang-ky', {
        maLop: id,
        yeuCauThem,
      });
      alert('Đăng ký thành công! Vui lòng chờ gia sư duyệt.');
      navigate('/student/registrations');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi đăng ký');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;
  if (!classData) return <DashboardLayout><div>Không tìm thấy lớp học</div></DashboardLayout>;

  const isFull = classData.isFull || (classData.soHocVien ?? 0) >= 1;
  const isRecruiting = classData.trangThai === 'DangTuyen';

  return (
    <DashboardLayout>
      <div className="page-content">
        <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline mb-3">
          ← Quay lại
        </button>

        <div className="class-detail-card">
          <div className="class-detail-header">
            <h1>{classData.tenLop}</h1>
            <span className={`badge-lg badge-${classData.trangThai.toLowerCase()}`}>
              {classData.trangThai}
            </span>
          </div>

          <div className="class-detail-body">
            <div className="detail-section">
              <h3>Thông tin lớp học</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">📚 Môn học:</span>
                  <span className="detail-value">{classData.monHoc?.tenMon}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">💰 Học phí:</span>
                  <span className="detail-value">{formatCurrency(classData.hocPhi)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📍 Hình thức:</span>
                  <span className="detail-value">{classData.hinhThuc}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📝 Số buổi:</span>
                  <span className="detail-value">{classData.soBuoiDuKien} buổi</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">👥 Học viên:</span>
                  <span className="detail-value">{(classData.soHocVien || 0)}/1 (lớp 1-1)</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Thông tin gia sư</h3>
              <div className="tutor-info">
                {classData.giaSu?.hinhAnh && (
                  <img src={classData.giaSu.hinhAnh} alt="Avatar" className="tutor-avatar" />
                )}
                <div>
                  <h4>{classData.giaSu?.hoTen}</h4>
                  {classData.giaSu?.chuyenMon && <p>🎯 {classData.giaSu.chuyenMon}</p>}
                  {classData.giaSu?.trinhDo && <p>🎓 {classData.giaSu.trinhDo}</p>}
                  {classData.giaSu?.kinhNghiem && <p>💼 {classData.giaSu.kinhNghiem}</p>}
                  {classData.giaSu?.gioiThieu && <p className="tutor-intro">{classData.giaSu.gioiThieu}</p>}
                </div>
              </div>
            </div>

            {classData.moTa && (
              <div className="detail-section">
                <h3>Mô tả</h3>
                <p>{classData.moTa}</p>
              </div>
            )}
          </div>

          <div className="class-detail-footer">
            <form onSubmit={handleRegister} className="register-form">
              <div className="form-group">
                <label>Yêu cầu thêm (không bắt buộc)</label>
                <textarea
                  value={yeuCauThem}
                  onChange={(e) => setYeuCauThem(e.target.value)}
                  placeholder="Thêm yêu cầu hoặc ghi chú cho gia sư..."
                  className="form-textarea"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                disabled={submitting || classData.trangThai !== 'DangTuyen'}
                className="btn btn-primary btn-lg btn-block"
              >
                {submitting ? 'Đang đăng ký...' : classData.trangThai !== 'DangTuyen' ? 'Lớp đã đóng' : 'Đăng Ký Ngay'}
              </button>
            </form>
          </div>
        </div>
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

export default StudentClassDetail;

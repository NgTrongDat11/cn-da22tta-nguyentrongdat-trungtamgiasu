/**
 * TUTOR - TẠO LỚP HỌC MỚI
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { subjectAPI, classAPI } from '../../api/services';
import './Tutor.css';

const TutorCreateClass = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    maMon: '',
    tenLop: '',
    moTa: '',
    hocPhi: '',
    hinhThuc: '',
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const subjects = await subjectAPI.getAllSubjects();
      setSubjects(subjects || []);
    } catch (err) {
      console.error('Failed to load subjects:', err);
      toast.error('Không thể tải danh sách môn học');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        hocPhi: parseFloat(formData.hocPhi),
      };
      await classAPI.createClass(payload);
      toast.success('Tạo lớp học thành công!');
      navigate('/tutor/classes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi tạo lớp học');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-content">
        <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline mb-3">
          ← Quay lại
        </button>

        <div className="form-card">
          <div className="form-header">
            <h1>Tạo Lớp Học Mới</h1>
            <p>Điền thông tin để tạo lớp học của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="class-form">
            <div className="form-group">
              <label>Môn học *</label>
              <select
                value={formData.maMon}
                onChange={(e) => setFormData({ ...formData, maMon: e.target.value })}
                required
                className="form-select"
              >
                <option value="">Chọn môn học</option>
                {subjects.map((sub) => (
                  <option key={sub.maMon} value={sub.maMon}>
                    {sub.tenMon}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tên lớp *</label>
              <input
                type="text"
                value={formData.tenLop}
                onChange={(e) => setFormData({ ...formData, tenLop: e.target.value })}
                placeholder="VD: Toán 12 - Luyện thi THPT"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                value={formData.moTa}
                onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                placeholder="Mô tả về lớp học, nội dung, phương pháp giảng dạy..."
                rows="4"
                className="form-textarea"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Học phí (VNĐ) *</label>
                <input
                  type="number"
                  value={formData.hocPhi}
                  onChange={(e) => setFormData({ ...formData, hocPhi: e.target.value })}
                  placeholder="500000"
                  required
                  min="0"
                  step="1000"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Hình thức *</label>
                <select
                  value={formData.hinhThuc}
                  onChange={(e) => setFormData({ ...formData, hinhThuc: e.target.value })}
                  required
                  className="form-select"
                >
                  <option value="">Chọn hình thức</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-outline"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? 'Đang tạo...' : 'Tạo Lớp Học'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TutorCreateClass;

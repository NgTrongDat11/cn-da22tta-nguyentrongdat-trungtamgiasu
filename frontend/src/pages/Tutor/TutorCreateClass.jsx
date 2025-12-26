/**
 * TUTOR - TẠO LỚP HỌC MỚI
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { subjectAPI, classAPI } from '../../api/services';
import { getNextWeekdayDate, formatShortDate } from '../../utils/dateUtils';
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
    ngayBatDau: '',
    ngayKetThuc: '',
    soBuoiDuKien: '',
    lichHocs: [], // Thêm lịch học
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
        soBuoiDuKien: formData.soBuoiDuKien ? parseInt(formData.soBuoiDuKien) : null,
        ngayBatDau: formData.ngayBatDau || null,
        ngayKetThuc: formData.ngayKetThuc || null,
        // Chỉ gửi lichHocs hợp lệ (đầy đủ thu, gioBatDau, gioKetThuc)
        lichHocs: formData.lichHocs.filter(lich => 
          lich.thu && lich.gioBatDau && lich.gioKetThuc
        ),
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

            <div className="form-row">
              <div className="form-group">
                <label>Ngày bắt đầu</label>
                <input
                  type="date"
                  value={formData.ngayBatDau}
                  onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Ngày kết thúc</label>
                <input
                  type="date"
                  value={formData.ngayKetThuc}
                  onChange={(e) => setFormData({ ...formData, ngayKetThuc: e.target.value })}
                  className="form-input"
                  min={formData.ngayBatDau || ''}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Số buổi dự kiến</label>
              <input
                type="number"
                value={formData.soBuoiDuKien}
                onChange={(e) => setFormData({ ...formData, soBuoiDuKien: e.target.value })}
                placeholder="VD: 20 buổi"
                min="1"
                className="form-input"
              />
            </div>

            {/* Lịch Học Section */}
            <div className="form-group">
              <label>Lịch Học Hàng Tuần 📅</label>
              <div style={{backgroundColor: '#e3f2fd', padding: '12px', borderRadius: '6px', marginBottom: '15px', border: '1px solid #90caf9'}}>
                <p style={{fontSize: '0.9em', color: '#1976d2', margin: 0, lineHeight: '1.5'}}>
                  ℹ️ <strong>Lưu ý:</strong> Lịch học sẽ tự động lặp lại <strong>hàng tuần</strong> trong khoảng thời gian từ ngày bắt đầu đến ngày kết thúc. 
                  Ví dụ: Nếu chọn "Thứ 2, 8h-10h", lớp sẽ học vào <strong>mọi Thứ 2</strong> trong suốt khóa học.
                </p>
              </div>
              <div style={{ marginBottom: '10px' }}>
                {formData.lichHocs.map((lich, index) => (
                  <div key={index} style={{ 
                    border: '1px solid #ddd', 
                    padding: '15px', 
                    marginBottom: '10px', 
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <strong>🔄 Lịch học hàng tuần #{index + 1}</strong>
                        <p style={{fontSize: '11px', color: '#666', margin: '3px 0 0 0'}}>Lặp lại mỗi tuần trong suốt khóa học</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newLichHocs = formData.lichHocs.filter((_, i) => i !== index);
                          setFormData({...formData, lichHocs: newLichHocs});
                        }}
                        className="btn btn-sm"
                        style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#dc3545', color: 'white' }}
                      >
                        Xóa
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>
                          Thứ (hàng tuần) *
                        </label>
                        <select
                          value={lich.thu}
                          onChange={(e) => {
                            const newLichHocs = [...formData.lichHocs];
                            newLichHocs[index].thu = e.target.value;
                            setFormData({...formData, lichHocs: newLichHocs});
                          }}
                          className="form-select"
                        >
                          <option value="">-- Chọn thứ --</option>
                          <option value="2">Thứ 2 (hàng tuần)</option>
                          <option value="3">Thứ 3 (hàng tuần)</option>
                          <option value="4">Thứ 4 (hàng tuần)</option>
                          <option value="5">Thứ 5 (hàng tuần)</option>
                          <option value="6">Thứ 6 (hàng tuần)</option>
                          <option value="7">Thứ 7 (hàng tuần)</option>
                          <option value="8">Chủ nhật (hàng tuần)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>Giờ Bắt Đầu *</label>
                        <input
                          type="time"
                          value={lich.gioBatDau}
                          onChange={(e) => {
                            const newLichHocs = [...formData.lichHocs];
                            newLichHocs[index].gioBatDau = e.target.value;
                            setFormData({...formData, lichHocs: newLichHocs});
                          }}
                          className="form-input"
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>Giờ Kết Thúc *</label>
                        <input
                          type="time"
                          value={lich.gioKetThuc}
                          onChange={(e) => {
                            const newLichHocs = [...formData.lichHocs];
                            newLichHocs[index].gioKetThuc = e.target.value;
                            setFormData({...formData, lichHocs: newLichHocs});
                          }}
                          className="form-input"
                        />
                      </div>

                      {formData.hinhThuc === 'Offline' ? (
                        <div>
                          <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>Phòng Học</label>
                          <input
                            type="text"
                            value={lich.phongHoc || ''}
                            onChange={(e) => {
                              const newLichHocs = [...formData.lichHocs];
                              newLichHocs[index].phongHoc = e.target.value;
                              setFormData({...formData, lichHocs: newLichHocs});
                            }}
                            className="form-input"
                            placeholder="VD: Phòng 101, Tòa A"
                          />
                        </div>
                      ) : formData.hinhThuc === 'Online' ? (
                        <div>
                          <label style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>Link Học Online</label>
                          <input
                            type="url"
                            value={lich.linkHocOnline || ''}
                            onChange={(e) => {
                              const newLichHocs = [...formData.lichHocs];
                              newLichHocs[index].linkHocOnline = e.target.value;
                              setFormData({...formData, lichHocs: newLichHocs});
                            }}
                            className="form-input"
                            placeholder="https://meet.google.com/..."
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      lichHocs: [...formData.lichHocs, {
                        thu: '',
                        gioBatDau: '',
                        gioKetThuc: '',
                        phongHoc: '',
                        linkHocOnline: ''
                      }]
                    });
                  }}
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                >
                  + Thêm Lịch Học Hàng Tuần
                </button>
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

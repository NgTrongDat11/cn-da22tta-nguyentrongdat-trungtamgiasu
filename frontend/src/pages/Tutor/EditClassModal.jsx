/**
 * MODAL - CHỈNH SỬA LỚP HỌC & LỊCH HỌC
 */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { classAPI, subjectAPI } from '../../api/services';
import apiClient from '../../api/client';
import { getNextWeekdayDate, formatShortDate } from '../../utils/dateUtils';

const EditClassModal = ({ classId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'schedule'
  const [subjects, setSubjects] = useState([]);
  const [classData, setClassData] = useState({
    tenLop: '',
    maMon: '',
    moTa: '',
    hocPhi: '',
    hinhThuc: '',
    trangThai: '',
  });
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    loadData();
  }, [classId]);

  const loadData = async () => {
    try {
      const [cls, subs] = await Promise.all([
        classAPI.getClassDetail(classId),
        subjectAPI.getAllSubjects(),
      ]);
      
      setClassData({
        tenLop: cls.tenLop || '',
        maMon: cls.maMon || '',
        moTa: cls.moTa || '',
        hocPhi: cls.hocPhi || '',
        hinhThuc: cls.hinhThuc || '',
        trangThai: cls.trangThai || '',
      });
      
      setSubjects(subs || []);
      
      // Load schedules
      const formattedSchedules = (cls.lichHocs || []).map(lich => ({
        maLich: lich.maLich,
        thu: lich.thu?.toString() || '',
        gioBatDau: formatTimeForInput(lich.gioBatDau),
        gioKetThuc: formatTimeForInput(lich.gioKetThuc),
        phongHoc: lich.phongHoc || '',
        linkHocOnline: lich.linkHocOnline || '',
      }));
      setSchedules(formattedSchedules);
    } catch (err) {
      toast.error('Không thể tải dữ liệu lớp học');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeForInput = (timeStr) => {
    if (!timeStr) return '';
    try {
      const date = new Date(timeStr);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (err) {
      console.error('Invalid time value:', timeStr, err);
      return '';
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await classAPI.updateClass(classId, {
        ...classData,
        hocPhi: parseFloat(classData.hocPhi),
      });
      toast.success('Cập nhật thông tin thành công!');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put(`/lop-hoc/${classId}/lich-hoc`, {
        lichHocs: schedules.map(s => ({
          thu: parseInt(s.thu),
          gioBatDau: s.gioBatDau,
          gioKetThuc: s.gioKetThuc,
          phongHoc: s.phongHoc || null,
          linkHocOnline: s.linkHocOnline || null,
        })),
      });
      toast.success('Cập nhật lịch học thành công!');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi cập nhật lịch học');
    } finally {
      setSaving(false);
    }
  };

  const addSchedule = () => {
    setSchedules([
      ...schedules,
      { thu: '2', gioBatDau: '08:00', gioKetThuc: '10:00', phongHoc: '', linkHocOnline: '' },
    ]);
  };

  const removeSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const updateSchedule = (index, field, value) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
          <div className="loading">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Chỉnh Sửa Lớp Học</h2>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            📝 Thông Tin
          </button>
          <button
            className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            📅 Lịch Học
          </button>
        </div>

        {activeTab === 'info' ? (
          <form onSubmit={handleUpdateInfo} className="modal-body">
            <div className="form-group">
              <label>Tên lớp *</label>
              <input
                type="text"
                value={classData.tenLop}
                onChange={(e) => setClassData({ ...classData, tenLop: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Môn học *</label>
                <select
                  value={classData.maMon}
                  onChange={(e) => setClassData({ ...classData, maMon: e.target.value })}
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
                <label>Trạng thái *</label>
                <select
                  value={classData.trangThai}
                  onChange={(e) => setClassData({ ...classData, trangThai: e.target.value })}
                  required
                  className="form-select"
                >
                  <option value="DangTuyen">Đang Tuyển</option>
                  <option value="DangDay">Đang Dạy</option>
                  <option value="KetThuc">Kết Thúc</option>
                  <option value="Huy">Hủy</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Học phí (VNĐ) *</label>
                <input
                  type="number"
                  value={classData.hocPhi}
                  onChange={(e) => setClassData({ ...classData, hocPhi: e.target.value })}
                  required
                  min="0"
                  step="1000"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Hình thức *</label>
              <select
                value={classData.hinhThuc}
                onChange={(e) => setClassData({ ...classData, hinhThuc: e.target.value })}
                required
                className="form-select"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                value={classData.moTa}
                onChange={(e) => setClassData({ ...classData, moTa: e.target.value })}
                rows="4"
                className="form-textarea"
              />
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Hủy
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleUpdateSchedule} className="modal-body">
            <div style={{backgroundColor: '#e3f2fd', padding: '12px', borderRadius: '6px', marginBottom: '15px', border: '1px solid #90caf9'}}>
              <p style={{fontSize: '0.9em', color: '#1976d2', margin: 0, lineHeight: '1.5'}}>
                ℹ️ <strong>Lưu ý:</strong> Lịch học sẽ <strong>lặp lại hàng tuần</strong>. Ví dụ: "Thứ 2, 8h-10h" = Học vào mọi Thứ 2.
              </p>
            </div>
            <div className="schedules-list">
              {schedules.map((sch, index) => (
                <div key={index} className="schedule-edit-item">
                  <div className="schedule-edit-header">
                    <div>
                      <h4>🔄 Lịch học hàng tuần #{index + 1}</h4>
                      <p style={{fontSize: '11px', color: '#666', margin: '3px 0 0 0'}}>Lặp lại mỗi tuần</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSchedule(index)}
                      className="btn btn-sm btn-danger"
                    >
                      Xóa
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Thứ (hàng tuần) *</label>
                      <select
                        value={sch.thu}
                        onChange={(e) => updateSchedule(index, 'thu', e.target.value)}
                        required
                        className="form-select"
                      >
                        <option value="2">Thứ Hai (hàng tuần)</option>
                        <option value="3">Thứ Ba (hàng tuần)</option>
                        <option value="4">Thứ Tư (hàng tuần)</option>
                        <option value="5">Thứ Năm (hàng tuần)</option>
                        <option value="6">Thứ Sáu (hàng tuần)</option>
                        <option value="7">Thứ Bảy (hàng tuần)</option>
                        <option value="8">Chủ Nhật (hàng tuần)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Giờ bắt đầu *</label>
                      <input
                        type="time"
                        value={sch.gioBatDau}
                        onChange={(e) => updateSchedule(index, 'gioBatDau', e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Giờ kết thúc *</label>
                      <input
                        type="time"
                        value={sch.gioKetThuc}
                        onChange={(e) => updateSchedule(index, 'gioKetThuc', e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  {classData.hinhThuc !== 'Online' && (
                    <div className="form-group">
                      <label>Phòng học</label>
                      <input
                        type="text"
                        value={sch.phongHoc}
                        onChange={(e) => updateSchedule(index, 'phongHoc', e.target.value)}
                        placeholder="VD: Phòng A101"
                        className="form-input"
                      />
                    </div>
                  )}

                  {classData.hinhThuc !== 'Offline' && (
                    <div className="form-group">
                      <label>Link học online</label>
                      <input
                        type="url"
                        value={sch.linkHocOnline}
                        onChange={(e) => updateSchedule(index, 'linkHocOnline', e.target.value)}
                        placeholder="https://meet.google.com/..."
                        className="form-input"
                      />
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addSchedule}
                className="btn btn-outline btn-block"
              >
                ➕ Thêm Lịch Học Hàng Tuần
              </button>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Hủy
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? 'Đang lưu...' : 'Lưu Lịch Học'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditClassModal;

/**
 * TUTOR - HỔ SƠ CÁ NHÂN
 */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import apiClient from '../../api/client';
import { tutorAPI } from '../../api/services';
import './Tutor.css';

const TutorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await tutorAPI.getMyProfile();
      setProfile(profile);
      setFormData({
        hoTen: profile.hoTen,
        soDienThoai: profile.soDienThoai || '',
        diaChi: profile.diaChi || '',
        namSinh: profile.namSinh || '',
        trinhDo: profile.trinhDo || '',
        chuyenMon: profile.chuyenMon || '',
        kinhNghiem: profile.kinhNghiem || '',
        gioiThieu: profile.gioiThieu || '',
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
      toast.error('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        luongTheoGio: formData.luongTheoGio ? parseFloat(formData.luongTheoGio) : null,
      };
      await tutorAPI.updateProfile(payload);
      toast.success('Cập nhật hồ sơ thành công');
      setEditing(false);
      loadProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi cập nhật');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File quá lớn. Kích thước tối đa 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setUploadingAvatar(true);
    try {
      await apiClient.post('/gia-su/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Cập nhật ảnh đại diện thành công!');
      await loadProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể tải ảnh lên');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Hồ Sơ Gia Sư</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="btn btn-primary"
          >
            {editing ? 'Hủy' : 'Chỉnh Sửa'}
          </button>
        </div>

        <div className="profile-card">
          {!editing ? (
            <div className="profile-view">
              <div className="avatar-section">
                {profile.hinhAnh ? (
                  <img src={profile.hinhAnh} alt="Avatar" className="profile-avatar" />
                ) : (
                  <div className="profile-avatar-placeholder">👤</div>
                )}
                <label className="avatar-upload-btn">
                  {uploadingAvatar ? 'Đang tải...' : '📷 Đổi ảnh'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <div className="profile-info">
                <div className="info-item">
                  <span className="info-label">Họ tên:</span>
                  <span className="info-value">{profile.hoTen}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Số điện thoại:</span>
                  <span className="info-value">{profile.soDienThoai || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Địa chỉ:</span>
                  <span className="info-value">{profile.diaChi || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Năm sinh:</span>
                  <span className="info-value">{profile.namSinh || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Trình độ:</span>
                  <span className="info-value">{profile.trinhDo || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Chuyên môn:</span>
                  <span className="info-value">{profile.chuyenMon || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Kinh nghiệm:</span>
                  <span className="info-value">{profile.kinhNghiem || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Giới thiệu:</span>
                  <span className="info-value">{profile.gioiThieu || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Họ tên *</label>
                  <input
                    type="text"
                    value={formData.hoTen}
                    onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.soDienThoai}
                    onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  value={formData.diaChi}
                  onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Năm sinh</label>
                  <input
                    type="number"
                    value={formData.namSinh}
                    onChange={(e) => setFormData({ ...formData, namSinh: e.target.value })}
                    min="1950"
                    max="2010"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Trình độ</label>
                  <input
                    type="text"
                    value={formData.trinhDo}
                    onChange={(e) => setFormData({ ...formData, trinhDo: e.target.value })}
                    placeholder="VD: Cử nhân, Thạc sĩ..."
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Chuyên môn</label>
                <input
                  type="text"
                  value={formData.chuyenMon}
                  onChange={(e) => setFormData({ ...formData, chuyenMon: e.target.value })}
                  placeholder="VD: Toán, Lý, Hóa..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Kinh nghiệm</label>
                <textarea
                  value={formData.kinhNghiem}
                  onChange={(e) => setFormData({ ...formData, kinhNghiem: e.target.value })}
                  placeholder="Mô tả kinh nghiệm giảng dạy..."
                  rows="3"
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Giới thiệu</label>
                <textarea
                  value={formData.gioiThieu}
                  onChange={(e) => setFormData({ ...formData, gioiThieu: e.target.value })}
                  placeholder="Giới thiệu bản thân..."
                  rows="4"
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Lưu Thay Đổi
              </button>
            </form>
          )}
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

export default TutorProfile;

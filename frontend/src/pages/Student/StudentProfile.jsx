/**
 * STUDENT - HỔ SƠ CÁ NHÂN
 */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import apiClient from '../../api/client';
import { studentAPI } from '../../api/services';
import './Student.css';

const StudentProfile = () => {
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
      const profile = await studentAPI.getMyProfile();
      setProfile(profile);
      setFormData({
        hoTen: profile.hoTen,
        soDienThoai: profile.soDienThoai || '',
        diaChi: profile.diaChi || '',
        namSinh: profile.namSinh || '',
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
      await studentAPI.updateProfile(formData);
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

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File quá lớn. Kích thước tối đa 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setUploadingAvatar(true);
    try {
      await apiClient.post('/hoc-vien/avatar', formData, {
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
          <h1>Hồ Sơ Của Tôi</h1>
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
              <div className="profile-info">
                <div className="info-item">
                  <span className="info-label">Họ tên:</span>
                  <span className="info-value">{profile.hoTen}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profile.taiKhoan?.email}</span>
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
                  <span className="info-label">Ngày tham gia:</span>
                  <span className="info-value">
                    {new Date(profile.ngayTao).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="profile-form">
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
              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  value={formData.diaChi}
                  onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Năm sinh</label>
                <input
                  type="number"
                  value={formData.namSinh}
                  onChange={(e) => setFormData({ ...formData, namSinh: e.target.value })}
                  min="1950"
                  max="2015"
                  className="form-input"
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

export default StudentProfile;

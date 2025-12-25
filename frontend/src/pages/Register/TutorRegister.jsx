/**
 * TUTOR REGISTER PAGE
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/services';
import toast from 'react-hot-toast';
import '../Login/Login.css';

const TutorRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    matKhau: '',
    hoTen: '',
    soDienThoai: '',
    diaChi: '',
    namSinh: '',
    chuyenMon: '',
    kinhNghiem: '',
    trinhDo: '',
    gioiThieu: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, taiKhoan } = await authAPI.registerTutor(formData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(taiKhoan));
      toast.success('Đăng ký thành công! Chào mừng bạn đến với TutorViet 🎉');
      setTimeout(() => navigate('/tutor'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
      toast.error(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Đăng Ký Gia Sư</h1>
          <p className="auth-subtitle">Chia sẻ kiến thức của bạn</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ tên *</label>
              <input
                type="text"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
                required
                placeholder="Nguyễn Văn B"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu *</label>
              <input
                type="password"
                name="matKhau"
                value={formData.matKhau}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
                required
                placeholder="0123456789"
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleChange}
                placeholder="Hà Nội, TP.HCM,..."
              />
            </div>

            <div className="form-group">
              <label>Năm sinh</label>
              <input
                type="number"
                name="namSinh"
                value={formData.namSinh}
                onChange={handleChange}
                min="1950"
                max="2010"
                placeholder="1990"
              />
            </div>

            <div className="form-group">
              <label>Chuyên môn</label>
              <input
                type="text"
                name="chuyenMon"
                value={formData.chuyenMon}
                onChange={handleChange}
                placeholder="Toán, Lý, Hóa"
              />
            </div>

            <div className="form-group">
              <label>Trình độ</label>
              <input
                type="text"
                name="trinhDo"
                value={formData.trinhDo}
                onChange={handleChange}
                placeholder="Cử nhân, Thạc sĩ,..."
              />
            </div>

            <div className="form-group">
              <label>Kinh nghiệm</label>
              <textarea
                name="kinhNghiem"
                value={formData.kinhNghiem}
                onChange={handleChange}
                rows="3"
                placeholder="Mô tả kinh nghiệm giảng dạy"
              />
            </div>

            <div className="form-group">
              <label>Giới thiệu</label>
              <textarea
                name="gioiThieu"
                value={formData.gioiThieu}
                onChange={handleChange}
                rows="3"
                placeholder="Giới thiệu về bản thân"
              />
            </div>

            <button type="submit" className="btn btn-block" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
          </div>

          <Link to="/" className="back-link">← Về trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default TutorRegister;

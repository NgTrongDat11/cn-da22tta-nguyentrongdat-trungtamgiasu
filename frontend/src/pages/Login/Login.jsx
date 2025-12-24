/**
 * LOGIN PAGE
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError('');
    
    // Validate inputs
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    
    setLoading(true);

    try {
      const user = await login(email, password);
      // Only navigate on success
      const roleMap = {
        Admin: '/admin',
        GiaSu: '/tutor',
        HocVien: '/student',
      };
      navigate(roleMap[user.role] || '/');
    } catch (err) {
      // Handle error - don't navigate, keep form visible
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Email hoặc mật khẩu không đúng';
      setError(errorMessage);
    } finally {
      // Always turn off loading state
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Đăng Nhập</h1>
          <p className="auth-subtitle">Chào mừng bạn quay trở lại</p>

          {error && (
            <div className="error" role="alert">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Chưa có tài khoản?</p>
            <div className="auth-links">
              <Link to="/register/student">Đăng ký Học Viên</Link>
              <span>|</span>
              <Link to="/register/tutor">Đăng ký Gia Sư</Link>
            </div>
          </div>

          <Link to="/" className="back-link">← Về trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

/**
 * LANDING PAGE
 */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Landing.css';

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      const roleMap = {
        Admin: '/admin',
        GiaSu: '/tutor',
        HocVien: '/student',
      };
      navigate(roleMap[user?.role] || '/');
    } else {
      navigate('/register/student');
    }
  };

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="container">
          <div className="landing-logo">
            <img src="/logo.svg" alt="TutorViet" className="landing-logo-img" />
            <div className="landing-logo-text">
              <span className="landing-brand">TutorViet</span>
              <span className="landing-tagline">Kết nối tri thức</span>
            </div>
          </div>
          <div className="nav-links">
            {isAuthenticated ? (
              <Link to={`/${user?.role === 'Admin' ? 'admin' : user?.role === 'GiaSu' ? 'tutor' : 'student'}`} className="btn btn-primary">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn btn-outline">Đăng Nhập</Link>
            )}
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <h1>Nền Tảng Kết Nối Gia Sư & Học Viên Hàng Đầu</h1>
          <p>Tìm gia sư giỏi, học tập hiệu quả, an toàn và tin cậy tại TutorViet</p>
          <div className="hero-actions">
            <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
              Bắt Đầu Ngay
            </button>
            <Link to="/register/tutor" className="btn btn-outline btn-lg">
              Trở Thành Gia Sư
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Tại Sao Chọn Chúng Tôi?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Gia Sư Chất Lượng</h3>
              <p>Đội ngũ gia sư được xác minh và có kinh nghiệm</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📚</div>
              <h3>Đa Dạng Môn Học</h3>
              <p>Từ tiểu học đến đại học, đầy đủ các môn học</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🕐</div>
              <h3>Linh Hoạt Thời Gian</h3>
              <p>Sắp xếp lịch học phù hợp với bạn</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Giá Cả Hợp Lý</h3>
              <p>Chi phí hợp lý, chất lượng đảm bảo</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Sẵn Sàng Bắt Đầu?</h2>
          <p>Tham gia ngay hôm nay để tìm gia sư phù hợp</p>
          <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
            Đăng Ký Ngay
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2025 {import.meta.env.VITE_APP_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
